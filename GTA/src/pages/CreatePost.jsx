import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import AIAssistant from '../components/AIAssistant';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    image: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAIContent = (text, type) => {
    setFormData((prev) => {
      if (type === 'title') {
        return { ...prev, title: text };
      }
      return { ...prev, body: prev.body ? prev.body + "\n\n" + text : text };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.image) {
      try {
        new URL(formData.image);
      } catch (error) {
        
        console.error("Invalid image URL:", error);

        alert("Please enter a valid Image URL (must start with http:// or https://)");
        return;
      }
    }

    setLoading(true);
    
    const isLoggedIn = localStorage.getItem("token") ? true : false;
    // 1. Get the current username (must match what Navbar uses)
    const author = isLoggedIn ? (localStorage.getItem("username") || "Guest") : "Guest";

    // 2. Add author to the data sent to backend
    const newPost = { ...formData, author };

    try {
      const response = await fetch("http://localhost:8080/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        // Redirect to the user's posts page to see the new post immediately
        navigate(`/my-posts/${author}`);
      } else {
        console.error("Failed to create post");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto pt-24 px-4 ">
      <h1 className="text-3xl font-bold mb-6 text-white">Create New Post</h1>
      <AIAssistant onContentGenerated={handleAIContent} />
      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div>
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-gray-300"
          />
        </div>
        <div>
          <input
            type="url"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-gray-300"
          />
        </div>
        <div>
          <input
            type="text"
            name="category"
            placeholder="Post Category (e.g. Technology, Poetry)"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 rounded-md border border-gray-300 mb-4"
            required
          />
        </div>
        <div>
          <textarea
            name="body"
            placeholder="Write your post content here..."
            value={formData.body}
            onChange={handleChange}
            required
            rows="6"
            className="w-full p-3 rounded-md border border-gray-300"
          ></textarea>
        </div>
        <Button type="submit" disabled={loading} className={loading ? "opacity-70 cursor-not-allowed" : ""}>
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Publishing...</span>
            </div>
          ) : (
            "Publish Post"
          )}
        </Button>
      </form>
    </div>
    </>
  );
};

export default CreatePost;