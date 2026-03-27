import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { CATEGORIES } from '../constants/categories';


const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = !!localStorage.getItem("token");
  const loggedInUser = isLoggedIn ? localStorage.getItem("username") : null;
  const decodedCategory = decodeURIComponent(category);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        const categoryPosts = data.filter(post => post.category === decodedCategory);
        setPosts(categoryPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [decodedCategory]);

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post => post._id === updatedPost._id ? updatedPost : post));
  };

  const handleDeleteClick = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      // Delete logic here if needed
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading {decodedCategory} posts...</div>
      </div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <button
            onClick={() => navigate('/categories')}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-4"
          >
            ← Back to Categories
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {decodedCategory} 
            <span className="text-2xl md:text-3xl block text-gray-600 mt-2">
              ({posts.length} posts)
            </span>
          </h1>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post._id || post.title}
                post={post}
                loggedInUser={loggedInUser}
                navigate={navigate}
                onUpdate={handlePostUpdate}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-600 mb-4">No posts yet</h2>
            <p className="text-gray-500 mb-8">Be the first to write about {decodedCategory}</p>
            <a href="/create" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
              Create First {decodedCategory} Post
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;

