import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import PostCard from './PostCard';
import Button from './Button';

const AllPosts = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]); // Store all posts for filtering
    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const isLoggedIn = !!localStorage.getItem("token");
    const loggedInUser = isLoggedIn ? localStorage.getItem("username") : null;

    const categories = [
        "Technology",
        "Education & Career",
        "Health & Fitness",
        "Lifestyle",
        "Relationships",
        "Science",
        "Finance",
        "Web Development",
        "AI",
        "Programming",
        "Career Tips"
    ];

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/posts');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setPosts(data);
                    setAllPosts(data);
                    // Extract unique tags from all posts
                    const tags = [...new Set(data.flatMap(post => post.tags || []))];
                    setAvailableTags(tags);
                } else {
                    console.error("API response is not an array:", data);
                    setPosts([]);
                    setAllPosts([]);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    // Filter posts when category or tags change
    useEffect(() => {
        let filtered = [...allPosts];
        
        if (selectedCategory) {
            filtered = filtered.filter(post => post.category === selectedCategory);
        }
        
        if (selectedTags.length > 0) {
            filtered = filtered.filter(post => 
                post.tags && post.tags.some(tag => selectedTags.includes(tag))
            );
        }
        
        setPosts(filtered);
    }, [selectedCategory, selectedTags, allPosts]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category === selectedCategory ? '' : category);
    };

    const handleTagClick = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedTags([]);
    };

    const handlePostUpdate = (updatedPost) => {
        setPosts((prevPosts) => prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
        setAllPosts((prevPosts) => prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
    };

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
                setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postToDelete));
                setAllPosts((prevPosts) => prevPosts.filter((post) => post._id !== postToDelete));
                setShowModal(false);
                setPostToDelete(null);
            } else {
                console.error("Failed to delete post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const hasActiveFilters = selectedCategory || selectedTags.length > 0;

    return (
        <>
            <Navbar />
            <div className="all-posts-container pt-24 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">All Posts</h1>
                
                {/* Filter Section */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                            selectedCategory === cat
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {availableTags.length > 0 && (
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Tags</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagClick(tag)}
                                            className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                                selectedTags.includes(tag)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {hasActiveFilters && (
                            <div className="w-full sm:w-auto">
                                <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                                <Button 
                                    onClick={clearFilters}
                                    style={{ backgroundColor: "#6b7280", color: "white" }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    {hasActiveFilters && (
                        <div className="mt-3 text-sm text-gray-600">
                            Showing {posts.length} of {allPosts.length} posts
                            {selectedCategory && <span className="ml-2">| Category: <strong>{selectedCategory}</strong></span>}
                            {selectedTags.length > 0 && <span className="ml-2">| Tags: <strong>{selectedTags.join(', ')}</strong></span>}
                        </div>
                    )}
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
                                onDeleteClick={() => handleDeleteClick(post._id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        {hasActiveFilters ? 'No posts match your filters.' : 'No posts found.'}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">Confirm Delete</h3>
                        <p className="mb-6 text-gray-600">Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="flex justify-end gap-4">
                            <Button onClick={() => setShowModal(false)} style={{ backgroundColor: "#e5e7eb", color: "black" }}>Cancel</Button>
                            <Button onClick={confirmDelete} style={{ backgroundColor: "#ef4444", color: "white" }}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllPosts;
