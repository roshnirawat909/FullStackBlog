import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import AISummaryPreview from '../components/AISummaryPreview';

const SavedPosts = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const userId = localStorage.getItem("userId");
    const isLoggedIn = !!localStorage.getItem("token");
    const loggedInUser = isLoggedIn ? localStorage.getItem("username") : null;

    useEffect(() => {
        const fetchSavedPosts = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            
            try {
                const response = await fetch(`http://localhost:8080/posts/user/saved/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch saved posts');
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedPosts();
    }, [userId]);

    const handlePostUpdate = (updatedPost) => {
        setPosts((prevPosts) => prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
    };

    const handleDeleteClick = (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            deletePost(postId);
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:8080/posts/${postId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
            } else {
                console.error("Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    if (!isLoggedIn) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-black pt-20 px-4">
                    <div className="max-w-6xl mx-auto text-center">
                        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">Saved Posts</h1>
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <p className="text-gray-600 mb-4">Please login to view your saved posts.</p>
                            <button 
                                onClick={() => navigate('/login')}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-black pt-20 px-4">
                    <div className="max-w-6xl mx-auto text-center text-white">
                        Loading saved posts...
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-black pt-20 px-4">
                    <div className="max-w-6xl mx-auto text-center text-red-400">
                        Error: {error}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="all-posts-container pt-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-black">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">Saved Posts</h1>

                {/* AI Summary Previews */}
                {posts.length > 0 && (
                  <AISummaryPreview 
                    posts={posts}
                    onSummaryGenerated={() => {}}
                  />
                )}

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <PostCard
                                key={post._id || post.title}
                                post={post}
                                loggedInUser={loggedInUser}
                                navigate={navigate}
                                onUpdate={handlePostUpdate}
                                onDeleteClick={() => handleDeleteClick(post._id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <p className="text-gray-600 mb-4">You haven't saved any posts yet.</p>
                        <button 
                            onClick={() => navigate('/posts')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse Posts
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default SavedPosts;

