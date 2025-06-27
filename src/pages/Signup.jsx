import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const Signup = ({ API_BASE_URL, showGlobalMessage, setCurrentUser, updateNavCartCount }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!username || username.length < 3 || !email || !password || password.length < 6) {
      showGlobalMessage(
        "Please fill in all fields correctly: username (min 3 chars), valid email, password (min 6 chars).",
        "error"
      );
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setCurrentUser(data.user);
        await updateNavCartCount();
        showGlobalMessage(`Welcome, ${data.user.username}! You are now logged in.`, "success");
        navigate("/");
      } else if (res.status === 409) {
        // 👇 Redirect to login if user already exists
        showGlobalMessage("User already exists. Redirecting to login...", "info");
        setTimeout(() => navigate("/login"), 1500); // wait 1.5s before redirecting
      } else {
        showGlobalMessage(data.message || "Signup failed. Try a different email or username.", "error");
      }
    } catch (err) {
      console.error("Signup network error:", err);
      showGlobalMessage("Network error. Please try again later.", "error");
    }
  };


  return (
    <main className="flex flex-col items-center justify-center min-h-screen  px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Sign Up</h2>

        <form noValidate onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            {/* <label htmlFor="signupUsername" className="block text-sm text-black"> */}
            <label htmlFor="signupUsername" className="block text-sm text-gray-800 dark:text-gray-200">

              Username
            </label>
            <input
              type="text"
              id="signupUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              placeholder="Enter username"
              className={`mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${validated && (!username || username.length < 3)
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                }`}
            />
            {validated && (!username || username.length < 3) && (
              <p className="text-sm text-red-500 mt-1">Username must be at least 3 characters.</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            {/* <label htmlFor="signupEmail" className="block text-sm  text-black"> */}
            <label htmlFor="signupUsername" className="block text-sm text-gray-800 dark:text-gray-200">

              Email address
            </label>
            <input
              type="email"
              id="signupEmail"
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
            {/* <label htmlFor="signupPassword" className="block text-sm text-black"> */}
            <label htmlFor="signupUsername" className="block text-sm text-gray-800 dark:text-gray-200">

              Password
            </label>
            <input
              type="password"
              id="signupPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Create a password"
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
            Sign Up
          </button>
        </form>

        {/* Redirect Link */}
        {/* <p className="mt-4 text-center text-sm text-black"> */}
        <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">

          Already have an account?{" "}
          <NavLink to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Login here
          </NavLink>
        </p>
      </div>
    </main>
  );
};

export default Signup;
