import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from './Button';
import Navbar from './Navbar';

const UserPosts = () => {
  const { author } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const isLoggedIn = !!localStorage.getItem("token");
    const loggedInUser = isLoggedIn ? (localStorage.getItem("username") ) : null;

    console.log("UserPosts component mounted. Author param:", author);

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
                console.log("Fetching URL:", url);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched data:", data);
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

    return (
        <>
        <Navbar />
        <div className="user-posts-container pt-24 px-4 sm:px-6 lg:px-8 ">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">{loggedInUser === author ? "My Posts" : `Posts by ${author}`}</h1>
            {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div key={post._id || post.title} className="post-card flex flex-col bg-white p-4 rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            {post.image && <img src={post.image} alt={post.title} className="w-full h-48 sm:h-64 object-cover rounded-lg bg-gray-100 mb-4" />}
                            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                            <p className="text-gray-700 mb-4 grow">{post.body}</p>
                            <small className="block text-gray-500 mb-4">Category: {post.category} {post.author !== "Guest" && `| By: ${post.author}`}</small>
                            <div className="flex gap-2 mt-auto">
                                <Button
                                    onClick={() => navigate(`/posts/${post._id}/edit`)}
                                    style={{ backgroundColor: "#3b82f6", color: "white" }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => handleDeleteClick(post._id)}
                                    style={{ backgroundColor: "#ef4444", color: "white" }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: "center", marginTop: "50px", color: "#555" }}>
                    <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>No Posts Found</h2>
                    <p style={{ fontSize: "1.2rem" }}>{loggedInUser === author ? "You haven't posted anything yet." : `It looks like ${author} hasn't posted anything yet.`}</p>
                    <Button
                        onClick={() => navigate(-1)}
                        style={{ marginTop: "20px" }}
                    >
                        Go Back
                    </Button>
                </div>
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