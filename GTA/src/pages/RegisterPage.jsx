import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const clientId = "YOUR_GOOGLE_CLIENT_ID";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.fullName);
        localStorage.setItem("userId", data.user.id);
        alert("Google registration successful!");
        navigate("/posts");
      } else {
        alert(data.message || "Google registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleGoogleError = () => {
    alert("Google registration was unsuccessful. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-black px-4 pt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-6 py-8 sm:px-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
              text="signup_with"
            />
          </div>

          <div className="relative flex py-2 items-center">
            <div className="grow border-t border-gray-300"></div>
            <span className="shrink-0 mx-4 text-gray-500 text-sm">OR</span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 mb-4 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 mb-4 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 mb-6 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition-colors"
          >
            Register
          </button>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Login
            </Link>
          </p>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
}

