import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PostShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user info
  const userId = localStorage.getItem("userId");
  const isLoggedIn = !!localStorage.getItem("token");
  
  // Check if user has liked/saved this post
  const isLiked = post?.likedBy && post.likedBy.some(uid => uid === userId || uid.toString() === userId);
  const isSaved = post?.savedBy && post.savedBy.some(uid => uid === userId || uid.toString() === userId);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:8080/posts/${id}`);
        if (!res.ok) throw new Error("Failed to load post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!userId) {
      alert("Please login to like posts");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/posts/${id}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId })
      });
      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      alert("Please login to save posts");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/posts/${id}/save`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId })
      });
      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">Loading post...</div>
      </div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-red-400">{error}</div>
      </div>
    </>
  );

  if (!post) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded p-6 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          {post.image && (
            <img src={post.image} alt={post.title} className="w-full h-64 md:h-96 object-contain mb-4 rounded bg-gray-100" />
          )}
          <p className="text-gray-800 mb-4">{post.body}</p>
          <p className="text-sm text-gray-600 mb-4">By {post.author}{post.createdAt ? ` on ${new Date(post.createdAt).toLocaleDateString()}` : ""}</p>
          
          {/* Like and Save Buttons */}
          {isLoggedIn && (
            <div className="flex items-center gap-4 mb-6 pb-4 border-b">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-1 px-4 py-2 rounded-full transition-colors ${
                    isLiked 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
                <span className="font-medium">{post.likes || 0} Likes</span>
              </button>
              <button 
                onClick={handleSave}
                className={`flex items-center gap-1 px-4 py-2 rounded-full transition-colors ${
                    isSaved 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                }`}
              >
                <span className="text-xl">{isSaved ? '🔖' : '📑'}</span>
                <span className="font-medium">{isSaved ? 'Saved' : 'Save for Later'}</span>
              </button>
            </div>
          )}
          
          <div className="mt-6">
            <button onClick={() => navigate(-1)} className="bg-gray-200 px-4 py-2 rounded">Back</button>
          </div>
        </div>
      </div>
    </>
  );
}

