// src/pages/AllPosts.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:8080/posts");
        const data = await res.json();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      {/** bg-gray-100 */}
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/**text-gray-900*/}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">All Posts</h1>

          {loading ? (
            <div className="text-center">
              <p className="text-xl text-white">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center">
              <p className="text-xl text-white">No posts found.</p>
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
                    <p className="text-gray-600 mb-4">{post.body}</p>
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
