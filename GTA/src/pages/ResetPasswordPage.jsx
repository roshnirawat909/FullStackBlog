/*import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        alert("Password reset successful! Please login with your new password.");
        navigate("/login");
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-black px-4 pt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-6 py-8 sm:px-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          <label className="block text-gray-700 text-sm font-bold mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 mb-4 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
            required
          />

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm new password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="text-center mt-4 text-sm">
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

*/

import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        alert("Password reset successful! Please login.");
        navigate("/login");
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-black px-4 pt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-6 py-8 sm:px-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Reset Password
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white w-full py-2 rounded"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="text-center mt-4 text-sm">
            <Link to="/login" className="text-blue-500">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}