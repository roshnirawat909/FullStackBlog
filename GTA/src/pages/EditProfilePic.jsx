import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const EditProfilePic = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPic, setCurrentPic] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const token = localStorage.getItem('token');

  const fetchCurrentPic = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8080/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentPic(data.profilePicture);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCurrentPic();
  }, [token, navigate, fetchCurrentPic]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size < 5 * 1024 * 1024) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert('Please select an image less than 5MB');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const res = await fetch('http://localhost:8080/auth/upload-profile-pic', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        alert('Profile picture updated!');
        navigate('/profile');
      } else {
        const error = await res.json();
        alert(error.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error');
    } finally {
      setLoading(false);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center bg-linear-to-r from-white to-gray-300 bg-clip-text ">
            Edit Profile Picture
          </h1>

          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-white/20 overflow-hidden flex items-center justify-center bg-linear-to-r from-gray-700 to-gray-600 text-4xl font-bold text-white">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-full" />
              ) : currentPic ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${currentPic}`}
                  alt="Current"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                '👤'
              )}
            </div>
            <p className="text-gray-400">Click to change your profile picture</p>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="profile-pic"
            ref={fileInputRef}
          />
          <button
            onClick={handleClickUpload}
            className="w-full block bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-4 px-8 rounded-2xl text-xl text-center cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 mb-6"
          >
            {file ? 'Change Picture' : 'Choose Picture'}
          </button>

          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="flex-1 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfilePic;
