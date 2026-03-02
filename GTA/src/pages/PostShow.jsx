import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PostShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <p className="text-sm text-gray-600">By {post.author}{post.createdAt ? ` on ${new Date(post.createdAt).toLocaleDateString()}` : ""}</p>
          <div className="mt-6">
            <button onClick={() => navigate(-1)} className="bg-gray-200 px-4 py-2 rounded">Back</button>
          </div>
        </div>
      </div>
    </>
  );
}
