require("dotenv").config();
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing! Check your .env file or path.");
} else {
  console.log("✅ JWT_SECRET loaded.");
}

// Import necessary modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto"); // For generating secure tokens
const jwt = require("jsonwebtoken");


// Database connection pool (assuming db.cjs exports a pg.Pool instance)
const db = require("./config/db.cjs"); // Using 'db' for the pool

// Configure Multer for file uploads (if used in contact form)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize Express app
const app = express();

// --- Middleware Configuration ---

const allowedOrigins = [
  'https://amazon-clone-frontend-seven-puce.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

// Serve static files from the 'public' directory (for frontend build)
app.use(express.json());


// --- Nodemailer Transporter Configuration ---
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });
// --- Nodemailer Transporter Configuration ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Must be app password if 2FA enabled
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Centralized sendMail helper
const sendMail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${mailOptions.to}`);
  } catch (err) {
    console.error(`Failed to send email to ${mailOptions.to}:`, err);
    throw err;
  }
};



// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Route Imports ---
// Import your product routes
const productsRouter = require("./routes/products.cjs");
// Import your cart routes
const cartRoutes = require('./routes/carts.cjs'); // Make sure cart.cjs exists and exports a router
const { verifyToken } = require("./middlewares/auth.cjs");

// --- Route Mounting ---
// Mount the products router under the /api/products path.
// Any routes defined in productsRouter (e.g., '/', '/:id') will be prefixed with /api/products
app.use("/api/products", productsRouter);
// Mount the cart router under the /api/cart path.
// Any routes defined in cartRoutes (e.g., '/', '/add', '/remove/:cartItemId') will be prefixed with /api/cart
app.use('/api/cart', cartRoutes);


// ==========================
// User Authentication & Profile Routes (Defined Directly in server.cjs)
// ==========================
//29/09/2025 confirmation mail
// Signup Route
// app.post("/api/signup", async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password)
//     return res.status(400).json({ message: "All fields are required" });

//   try {
//     const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
//     if (existingUser.rows.length > 0) {
//       return res.status(409).json({ message: "User already exists. Please login." });
//     }

//     // Hash password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await db.query(
//       "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
//       [username, email, hashedPassword]
//     );

//     const newUserResult = await db.query(
//       "SELECT id, username, email FROM users WHERE email = $1",
//       [email]
//     );
//     const newUser = newUserResult.rows[0];

//     // ---------------------------
//     // ✉️ Send verification email
//     // ---------------------------
//     const mailOptions = {
//       from: process.env.MAIL_USER,
//       to: email,
//       subject: "Welcome to Amazon Clone - Account Created 🎉",
//       html: `
//         <h2>Hello ${username},</h2>
//         <p>Your account has been created successfully!</p>
//         <p><b>Username:</b> ${username}</p>
//         <p><b>Email:</b> ${email}</p>
//         <p><b>Password:</b> ${password}</p>
//         <br>
//         <p>You can now <a href="${process.env.FRONTEND_URL}/login">login here</a>.</p>
//         <br>
//         <p>If this wasn’t you, please ignore this email.</p>
//         <p>– Amazon Clone Team</p>
//       `
//     };

//     await transporter.sendMail(mailOptions);


//     res.status(201).json({
//       message: "Signup successful. Verification email sent.",
//       user: newUser
//     });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ message: "Signup failed" });
//   }
// });

app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "User already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
      [username, email, hashedPassword]
    );

    const newUserResult = await db.query(
      "SELECT id, username, email FROM users WHERE email = $1",
      [email]
    );
    const newUser = newUserResult.rows[0];

    // ✅ Send welcome email (without password)
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Welcome to Amazon Clone 🎉",
      html: `
        <h2>Hello ${username},</h2>
        <p>Your account has been created successfully!</p>
        <p>You can now <a href="${process.env.FRONTEND_URL}/login">login here</a>.</p>
        <p>If this wasn’t you, please ignore this email.</p>
        <p>– Amazon Clone Team</p>
      `
    };

    await sendMail(mailOptions);

    res.status(201).json({
      message: "Signup successful. Verification email sent.",
      user: newUser
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
});


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // ✅ Fetch the user by email only
    const query = `
      SELECT id, username, email, password, role 
      FROM users 
      WHERE email = $1
    `;
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // ✅ Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Send safe user object (no password)
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Forgot Password Route (Request to send reset link)
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("Forgot password request received for email:", email);

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      console.log("User not found for forgot password request:", email);
      return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 3600000; // 1 hour in milliseconds
    console.log("Generated reset token:", resetToken, "Expires:", new Date(resetExpires));

    await db.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3",
      [resetToken, resetExpires, user.id]
    );
    console.log("Updated user with reset token in DB for user ID:", user.id);

    // Ensure process.env.FRONTEND_URL is correctly set in your .env file
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}`;
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    console.log("Reset URL generated:", resetUrl);

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: user.email,
      subject: "Password Reset Request for Amazon Clone",
      html: `
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
    };

    await transporter.sendMail(mailOptions);


    console.log("Password reset email sent to:", user.email);

    res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error in catch block:", err);
    res.status(500).json({ message: "Failed to send password reset email." });
  }
});

// Reset Password Route (Verify token and set new password)
app.post("/api/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  console.log("Reset password request received for token (first few chars):", token ? token.substring(0, 10) + "..." : "N/A");

  if (!token || !newPassword) {
    console.warn("Reset password: Missing token or new password.");
    return res.status(400).json({ message: "Token and new password are required." });
  }

  try {
    const currentTime = Date.now();
    console.log("Current timestamp for expiry check:", currentTime);

    const result = await db.query(
      "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2",
      [token, currentTime]
    );
    const user = result.rows[0];

    if (!user) {
      console.warn("Reset password: Token not found or expired for token:", token);
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    console.log("User found for reset password:", user.email);

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    console.log("New password hashed.");

    // Update password and clear reset token fields
    await db.query(
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
      [hashedNewPassword, user.id]
    );

    console.log("Password successfully reset and token cleared for user:", user.email);
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset password error in catch block:", err);
    res.status(500).json({ message: "Failed to reset password." });
  }
});

// Fetch user profile
app.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, username, email, role, profileurl FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
});

// Update avatar
app.put("/api/user/update-avatar", verifyToken, async (req, res) => {
  const { profileUrl } = req.body;
  const id = req.user.id;

  if (!profileUrl) {
    return res.status(400).json({ message: "Missing avatar URL." });
  }

  try {
    await db.query("UPDATE users SET profileurl = $1 WHERE id = $2", [profileUrl, id]);
    res.status(200).json({ message: "Avatar updated successfully." });
  } catch (err) {
    console.error("Avatar update error:", err);
    res.status(500).json({ message: "Failed to update avatar." });
  }
});


// Update username
app.put("/api/user/update-username", async (req, res) => {
  const { id, newUsername } = req.body;

  if (!id || !newUsername || newUsername.length < 3) {
    return res.status(400).json({ message: "Invalid input. Username must be at least 3 characters." });
  }

  try {
    // Optional: check if username already exists
    const existing = await db.query("SELECT id FROM users WHERE username = $1 AND id != $2", [newUsername, id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Username already taken." });
    }

    await db.query("UPDATE users SET username = $1 WHERE id = $2", [newUsername, id]);

    res.status(200).json({ message: "Username updated successfully." });
  } catch (err) {
    console.error("Username update error:", err);
    res.status(500).json({ message: "Failed to update username." });
  }
});


// Update Email Route
app.put("/api/user/update-email", async (req, res) => {
  const { id, newEmail } = req.body;

  if (!id || !newEmail)
    return res.status(400).json({ message: "User ID and new email required." });

  try {
    await db.query("UPDATE users SET email = $1 WHERE id = $2", [newEmail, id]);
    res.json({ message: "Email updated successfully." });
  } catch (err) {
    console.error("Update email error:", err);
    res.status(500).json({ message: "Failed to update email." });
  }
});

// Update Password Route
app.put("/api/user/update-password", async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;

  if (!id || !oldPassword || !newPassword)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found." });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Old password is incorrect." });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashedNewPassword, id]);

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ message: "Failed to update password." });
  }
});

// Contact Form Route
app.post("/api/send_mail", upload.single("attachment"), async (req, res) => {
  const { name, email, subject, message } = req.body;
  const file = req.file;

  if (!name || !email || !subject || !message)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const mailOptions = {
      from: `"${name}" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      subject: subject,
      html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong><br>${message}</p>
            `,
      attachments: file
        ? [{ filename: file.originalname, content: file.buffer }]
        : [],
    };

    await transporter.sendMail(mailOptions);


    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Logout Route
app.post("/api/logout", verifyToken, (req, res) => {
  try {
    // For JWT, you can't invalidate the token on server unless you use a blacklist.
    // But you can still respond OK so frontend clears its storage.
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
});

// Payment Success Route
app.post("/api/payment-success", async (req, res) => {
  const { email, username, amount } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ message: "Email and amount are required." });
  }

  try {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Payment Successful - Amazon Clone",
      html: `
        <h2>Hi ${username || "User"},</h2>
        <p>Thank you for your purchase! 🎉</p>
        <p><b>Amount Paid:</b> ₹${amount.toFixed(2)}</p>
        <p>Date: ${new Date().toLocaleString()}</p>
        <br/>
        <p>Your order is being processed. You can track it from your profile/orders page.</p>
        <br/>
        <p>– Amazon Clone Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Payment success email sent." });
  } catch (err) {
    console.error("Payment email error:", err);
    res.status(500).json({ message: "Failed to send payment email." });
  }
});


// health check 
app.get('/', (req, res) => {
  res.status(200).send('Backend is healthy!');
});
// proxy check code 

app.get('/api/test', (req, res) => {
  res.json({ message: 'API proxy working!' })
});

// --- Global Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err.stack); // Log the stack trace
  res.status(500).send('Something broke on the server!'); // Send a generic error response
});


// ==========================
// Start Server
// ==========================
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`✅ Server running on http://localhost:${PORT}`);
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => { // <-- Add '0.0.0.0' here
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`); // Update console log for clarity
});