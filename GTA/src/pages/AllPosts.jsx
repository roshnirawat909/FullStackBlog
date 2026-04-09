// src/pages/AllPosts.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AISummaryPreview from "../components/AISummaryPreview";

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]); // Store all posts for client-side filtering
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchPosts = useCallback(async (search = "") => {
    try {
      setLoading(true);
      const url = search 
        ? `http://localhost:8080/posts?search=${encodeURIComponent(search)}`
        : "http://localhost:8080/posts";
      const res = await fetch(url);
      const data = await res.json();
      setPosts(data);
      setAllPosts(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Client-side search filtering for instant results
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // If search is empty, show all posts (already fetched)
      setPosts(allPosts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allPosts.filter(post => {
      const titleMatch = post.title?.toLowerCase().includes(query);
      const bodyMatch = post.body?.toLowerCase().includes(query);
      const authorMatch = post.author?.toLowerCase().includes(query);
      const tagsMatch = post.tags?.some(tag => tag.toLowerCase().includes(query));
      const categoryMatch = post.category?.toLowerCase().includes(query);
      
      return titleMatch || bodyMatch || authorMatch || tagsMatch || categoryMatch;
    });
    
    setPosts(filtered);
  }, [searchQuery, allPosts]);

  // Debounced server-side search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        fetchPosts(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchPosts]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">All Posts</h1>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search posts by title, content, author, or tags..."
                className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent sm:text-sm"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-400">
                Found {posts.length} {posts.length === 1 ? 'post' : 'posts'} matching "{searchQuery}"
              </p>
            )}
          </div>

          {/* AI Summary Previews */}
          {!loading && posts.length > 0 && (
            <AISummaryPreview 
              posts={posts} 
onSummaryGenerated={() => {}}
            />
          )}

          {loading ? (
            <div className="text-center">
              <p className="text-xl text-white">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center">
              <p className="text-xl text-white">
                {searchQuery ? `No posts found matching "${searchQuery}"` : "No posts found."}
              </p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="mt-4 text-yellow-500 hover:text-yellow-400 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.body}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.category && (
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                      )}
                      {post.tags && post.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      By {post.author}
                      {post.createdAt ? ` on ${new Date(post.createdAt).toLocaleDateString()}` : ""}
                    </p>
                    <button
                      onClick={() => navigate(`/posts/${post._id}`)}
                      className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

