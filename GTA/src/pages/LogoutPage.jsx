// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    // Clear token from localStorage
    localStorage.removeItem("token");

    // Optionally clear other user data
    localStorage.removeItem("username");

    // Redirect to home or login
    navigate("/login");
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 pt-20">
      <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Logging out...</h2>
        <p className="text-gray-600">Please wait while we end your session.</p>
      </div>
    </div>
    </>
  );
}