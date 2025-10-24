require("dotenv").config();

// ✅ Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET in .env file");
  process.exit(1);
}
if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY not found. Emails may fail in production.");
}

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { Resend } = require("resend");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const db = require("./config/db.cjs");
const { verifyToken } = require("./middlewares/auth.cjs");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// ================================
// 🧩 Middleware Setup
// ================================
app.use(express.json());
app.use(bodyParser.json());

// CORS setup
const allowedOrigins = [
  "https://amazon-clone-frontend-seven-puce.vercel.app",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Multer (for contact form attachments)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================================
// 📬 Email Configuration
// ================================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    console.log(`📤 Sending email using: ${isProduction ? "Resend" : "Gmail"}`);

    if (isProduction) {
      await resend.emails.send({
        from: `Amazon Clone <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
      });
    } else {
      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        html,
      });
    }

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

// ================================
// 📦 Routes Import
// ================================
const productsRouter = require("./routes/products.cjs");
const cartRoutes = require("./routes/carts.cjs");

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRoutes);

// ================================
// 👤 AUTHENTICATION & USERS
// ================================

// 🔹 Signup Route
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return res.status(409).json({ message: "User already exists. Please login." });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    const newUser = (
      await db.query("SELECT id, username, email FROM users WHERE email = $1", [email])
    ).rows[0];

    // Send welcome email
    await sendEmail({
      to: email,
      subject: "Welcome to Amazon Clone 🎉",
      html: `
        <h2>Hello ${username},</h2>
        <p>Your account has been created successfully!</p>
        <p><b>Username:</b> ${username}</p>
        <p><b>Email:</b> ${email}</p>
        <br/>
        <p>You can now <a href="${process.env.FRONTEND_URL}/login">login here</a>.</p>
        <p>– Amazon Clone Team</p>
      `,
    });

    res.status(201).json({ message: "Signup successful.", user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed." });
  }
});

// 🔹 Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found." });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed." });
  }
});

// 🔹 Forgot Password
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required." });

  try {
    const userRes = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userRes.rows[0];
    if (!user)
      return res.status(200).json({ message: "If account exists, a reset email is sent." });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 3600000;

    await db.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3",
      [token, expires, user.id]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Click below to reset your password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link expires in 1 hour.</p>
      `,
    });

    res.json({ message: "Password reset email sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Failed to send reset email." });
  }
});

// 🔹 Reset Password
app.post("/api/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ message: "Token and new password required." });

  try {
    const now = Date.now();
    const userRes = await db.query(
      "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2",
      [token, now]
    );
    const user = userRes.rows[0];
    if (!user)
      return res.status(400).json({ message: "Token invalid or expired." });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query(
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
      [hashed, user.id]
    );

    res.json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Failed to reset password." });
  }
});

// 🔹 Profile Fetch
app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const user = (
      await db.query(
        "SELECT id, username, email, role, profileurl FROM users WHERE id = $1",
        [req.user.id]
      )
    ).rows[0];
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
});

// ================================
// 💳 Payment Success Email
// ================================
app.post("/api/payment-success", async (req, res) => {
  const { email, username, amount } = req.body;
  if (!email || !amount)
    return res.status(400).json({ message: "Email and amount are required." });

  try {
    await sendEmail({
      to: email,
      subject: "Payment Successful - Amazon Clone",
      html: `
        <h2>Hi ${username || "User"},</h2>
        <p>Thank you for your purchase! 🎉</p>
        <p><b>Amount Paid:</b> ₹${amount.toFixed(2)}</p>
        <p><b>Date:</b> ${new Date().toLocaleString()}</p>
        <p>Your order is being processed. Track it in your profile.</p>
      `,
    });

    res.json({ message: "Payment success email sent." });
  } catch (err) {
    console.error("Payment email error:", err);
    res.status(500).json({ message: "Failed to send payment email." });
  }
});

// ================================
// 📞 Contact Form Email
// ================================
app.post("/api/send_mail", upload.single("attachment"), async (req, res) => {
  const { name, email, subject, message } = req.body;
  const file = req.file;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ message: "All fields required." });

  try {
    await sendEmail({
      to: process.env.MAIL_RECEIVER,
      subject,
      html: `
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b><br>${message}</p>
      `,
      attachments: file
        ? [{ filename: file.originalname, content: file.buffer }]
        : [],
    });

    res.json({ message: "Message sent successfully." });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Failed to send message." });
  }
});

// ================================
// 🩺 Health Check + Error Handler
// ================================
app.get("/", (req, res) => res.send("✅ Backend is healthy!"));
app.get("/api/test", (req, res) => res.json({ message: "API proxy working!" }));

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ================================
// 🚀 Start Server
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`)
);
