import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, navigate, isLoggedIn]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-black to-gray-900">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="shrink-0">
                {user.profilePicture ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${user.profilePicture}`}
                    alt="Profile"
                    className="w-24 h-24 object-cover rounded-full ring-4 ring-white/20"
                  />
                ) : (
                  <div className="w-24 h-24 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-black uppercase">
                    {user.fullName ? user.fullName.charAt(0) : '?'}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-gray-200 bg-clip-text text-transparent mb-2">
                  {user.fullName}
                </h1>
                <p className="text-xl text-gray-300 mb-4">{user.email}</p>
                <div className="text-sm text-gray-400">
                  <p>ID: <span className="font-mono bg-black/50 px-2 py-1 rounded">{user.id}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Account Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/saved-posts')}
                  className="w-full bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Saved Posts
                </button>
                <button
                  onClick={() => navigate('/create')}
                  className="w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Create Post
                </button>
                <button
                  onClick={() => navigate('/edit-profile-pic')}
                  className="w-full bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Edit Profile Picture
                </button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Statistics</h2>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{user.likedPosts}</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">Likes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{user.savedPosts}</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">Saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

