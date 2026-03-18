import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from './Button';
import Navbar from './Navbar';
import PostCard from './PostCard';

const UserPosts = () => {
  const { author } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const isLoggedIn = !!localStorage.getItem("token");
    const loggedInUser = isLoggedIn ? (localStorage.getItem("username") ) : null;

    const handleDeleteClick = (postId) => {
        setPostToDelete(postId);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`http://localhost:8080/posts/${postToDelete}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Remove the deleted post from the local state
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postToDelete));
                setShowModal(false);
                setPostToDelete(null);
            } else {
                console.error("Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Adjust the URL to match your backend API endpoint
                const url = `http://localhost:8080/posts?author=${encodeURIComponent(author)}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    console.error("API response is not an array:", data);
                    setPosts([]);
                }
            } catch (error) {
                console.error("Error fetching user posts:", error);
            }
        };

        if (author) {
            fetchPosts();
        }
    }, [author]);

    const handlePostUpdate = (updatedPost) => {
        setPosts((prevPosts) => prevPosts.map((post) => post._id === updatedPost._id ? updatedPost : post));
    };

    return (
        <>
        <Navbar />
        <div className="user-posts-container pt-24 px-4 sm:px-6 lg:px-8 ">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">{loggedInUser === author ? "My Posts" : `Posts by ${author}`}</h1>
            {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <PostCard 
                            key={post._id || post.title}
                            post={post}
                            loggedInUser={loggedInUser}
                            navigate={navigate}
                            onDeleteClick={() => handleDeleteClick(post._id)}
                            onUpdate={handlePostUpdate}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-10">No posts found.</div>
            )}
            
            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Confirm Delete</h3>
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="flex justify-end gap-4">
                            <Button onClick={() => setShowModal(false)} style={{ backgroundColor: "#e5e7eb", color: "black" }}>
                                Cancel
                            </Button>
                            <Button onClick={confirmDelete} style={{ backgroundColor: "#ef4444", color: "white" }}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
        
    );
};

export default UserPosts;