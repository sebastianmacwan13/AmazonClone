import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Forgot_password = ({ API_BASE_URL, showGlobalMessage }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showGlobalMessage("Please enter your email address.", "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      showGlobalMessage(data.message || "Check your email for reset instructions.", "info");
    } catch (err) {
      console.error("Forgot password error:", err);
      showGlobalMessage("Failed to send reset email. Try again later.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="forgotEmail"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Enter your email address
            </label>
            <input
              type="email"
              id="forgotEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="your@email.com"
            />
          </div>

         <button
  type="submit"
  disabled={submitting}
  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
>
  {submitting ? 'Sending...' : 'Send Reset Link'}
</button>

        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          We’ll email you a link to reset your password.
        </p>
      </div>
    </main>
  );
};

export default Forgot_password;
