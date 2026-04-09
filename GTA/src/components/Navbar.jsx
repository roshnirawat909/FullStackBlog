// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


import { CATEGORIES } from '../constants/categories';


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in (you can add auth logic here)
   const isLoggedIn = localStorage.getItem("token") ? true : false;
   // Only use the stored username if the user is actually logged in
   const username = isLoggedIn ? (localStorage.getItem("username") || "Guest") : "Guest";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUser = async () => {
        try {
          const res = await fetch('http://localhost:8080/auth/me', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            localStorage.setItem('avatar', data.profilePicture || '');
          }
        } catch (err) {
          console.error('User fetch error:', err);
        }
      };
      fetchUser();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/logout");
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const isActive = (path) => {
    return location.pathname === path ? "text-yellow-400" : "text-white";
  };


  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white font-bold text-2xl sm:text-3xl hover:text-yellow-400 transition"
          >
            BLOGIFYHUB
          </button>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-yellow-400 focus:outline-none"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
<button
              onClick={() => navigate("/posts")}
              className={`px-3 py-2 text-3xl font-medium ${isActive(
                "/posts"
              )} hover:text-yellow-400 transition`}
            >
              All Post
            </button>
            {/* Desktop Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="px-3 py-2 text-3xl font-medium text-white hover:text-yellow-400 transition flex items-center gap-1"
              >
                Categories
                <svg className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-black/95 backdrop-blur-sm border border-gray-800 rounded-lg shadow-xl z-50 py-2">

{CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        navigate(`/category/${encodeURIComponent(cat)}`);
                        setIsCategoryOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-xl hover:bg-gray-800 hover:text-yellow-400 transition text-white first:rounded-t-lg last:rounded-b-lg"
                    >
                      {cat}
                    </button>
                  ))}

                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/create")}
              className={`px-3 py-2 text-3xl font-medium ${isActive(
                "/create"
              )} hover:text-yellow-400 transition`}
            >
              Create
            </button>
            <button
              onClick={() => navigate(`/my-posts/${username}`)}
              className={`px-3 py-2 text-3xl font-medium ${isActive(
                `/my-posts/${username}`
              )} hover:text-yellow-400 transition`}
            >
              My Posts
            </button>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => navigate("/saved-posts")}
                  className={`px-3 py-2 text-3xl font-medium ${isActive("/saved-posts")} hover:text-yellow-400 transition`}
                >
                  Saved
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-xl font-medium text-white hover:text-yellow-400 transition rounded-md"
                    title="Profile"
                  >
{user?.profilePicture ? (
                    <img src={`http://localhost:8080${user.profilePicture}`} alt="Profile" className="w-8 h-8 object-cover rounded-full ring-1 ring-white/20" />
                  ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                    <span>{username}</span>
                    <svg className={`w-4 h-4 ml-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-black/95 backdrop-blur-sm border border-gray-800 rounded-lg shadow-xl z-50 py-2">
                      <button
                        onClick={handleProfile}
                        className="block w-full text-left px-4 py-3 text-white hover:bg-gray-800 hover:text-yellow-400 transition first:rounded-t-lg"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => { navigate("/saved-posts"); setIsProfileOpen(false); }}
                        className="block w-full text-left px-4 py-3 text-white hover:bg-gray-800 hover:text-yellow-400 transition"
                      >
                        Saved Posts
                      </button>
                      <button
                        onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                        className="block w-full text-left px-4 py-3 text-white hover:bg-gray-800 hover:text-yellow-400 transition rounded-b-lg"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => navigate("/register")}
                  className={`px-3 py-2 text-3xl font-medium ${isActive("/register")} hover:text-yellow-400 transition`}
                >
                  Register
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className={`px-3 py-2 text-3xl font-medium ${isActive("/login")} hover:text-yellow-400 transition`}
                >
                  Login
                </button>

              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 absolute top-16 left-0 w-full p-4 flex flex-col gap-4 shadow-lg border-t border-gray-800">
            <button
              onClick={() => { navigate("/posts"); setIsMenuOpen(false); }}
              className={`px-3 py-2 text-xl font-medium text-left ${isActive("/posts")} hover:text-yellow-400 transition`}
            >
              All Post
            </button>
            <button
              onClick={() => { navigate("/create"); setIsMenuOpen(false); }}
              className={`px-3 py-2 text-xl font-medium text-left ${isActive("/create")} hover:text-yellow-400 transition`}
            >
              Create
            </button>
            <button
              onClick={() => { navigate(`/my-posts/${username}`); setIsMenuOpen(false); }}
              className={`px-3 py-2 text-xl font-medium text-left ${isActive(`/my-posts/${username}`)} hover:text-yellow-400 transition`}
            >
              My Posts
            </button>
            {isLoggedIn && (
              <button
                onClick={() => { navigate("/saved-posts"); setIsMenuOpen(false); }}
                className={`px-3 py-2 text-xl font-medium text-left ${isActive("/saved-posts")} hover:text-yellow-400 transition`}
              >
                Saved
              </button>
            )}
            {/* Mobile Categories Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="px-3 py-2 text-xl font-medium text-left text-white hover:text-yellow-400 transition flex items-center justify-between w-full"
              >
                Categories
                <svg className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isCategoryOpen && (
                <div className="pl-6 space-y-1 border-l border-gray-700">
{CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        navigate(`/category/${encodeURIComponent(cat)}`);
                        setIsMenuOpen(false);
                        setIsCategoryOpen(false);
                      }}
                      className="block w-full text-left py-2 text-lg hover:text-yellow-400 transition text-white"
                    >
                      {cat}
                    </button>
                  ))}

                </div>
              )}
            </div>
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => { navigate("/register"); setIsMenuOpen(false); }}
                  className={`px-3 py-2 text-xl font-medium text-left ${isActive("/register")} hover:text-yellow-400 transition`}
                >
                  Register
                </button>
                <button
                  onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                  className={`px-3 py-2 text-xl font-medium text-left ${isActive("/login")} hover:text-yellow-400 transition`}
                >
                  Login
                </button>

              </>
            )}
            {isLoggedIn && (
              <div className="space-y-1 pt-2 border-t border-gray-700">
                <div className="flex items-center gap-3 p-3 hover:bg-gray-800 hover:text-yellow-400 transition rounded cursor-pointer" onClick={() => { handleProfile(); setIsMenuOpen(false); }}>
                  <svg className="w-8 h-8 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="font-medium text-white">{username}</p>
                    <p className="text-sm opacity-75">View Profile</p>
                  </div>
                </div>
                <button
                  onClick={() => { navigate("/saved-posts"); setIsMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-gray-800 hover:text-yellow-400 transition rounded"
                >
                  Saved Posts
                </button>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-white hover:bg-gray-800 hover:text-yellow-400 transition rounded font-semibold "
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
