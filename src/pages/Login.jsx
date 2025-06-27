import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const Login = ({ API_BASE_URL, setCurrentUser, showGlobalMessage, updateNavCartCount }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    // Future enhancement: Redirect if already logged in
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!email || !password || password.length < 6) {
      showGlobalMessage("Please enter valid email and a password of at least 6 characters.", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setCurrentUser(data.user);
        showGlobalMessage(`Welcome back, ${data.user.username}!`, "success");
        await updateNavCartCount();
        navigate("/");
      } else {
        showGlobalMessage(data.message || "Invalid credentials", "error");
        setTimeout(() => {
          
          navigate("/signup");
        }, 2000);
      }
    } catch (err) {
      console.error("Login network error:", err);
      showGlobalMessage("Login failed. Check your network or try again later.", "error");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Login</h2>

        <form noValidate onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email address
            </label>
            <input
              type="email"
              id="loginEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${validated && !email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
            />
            {validated && !email && (
              <p className="text-sm text-red-500 mt-1">Please enter a valid email.</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              id="loginPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Enter your password"
              className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${validated && (!password || password.length < 6)
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
            />
            {validated && (!password || password.length < 6) && (
              <p className="text-sm text-red-500 mt-1">Password must be at least 6 characters.</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Extra Links */}
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <NavLink to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign up here
          </NavLink>
        </p>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          <NavLink to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
            Forgot password?
          </NavLink>
        </p>
      </div>
    </main>
  );
};

export default Login;
