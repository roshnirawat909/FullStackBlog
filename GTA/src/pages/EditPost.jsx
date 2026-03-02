import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        image: '',
        category: '',
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:8080/posts/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        title: data.title,
                        body: data.body,
                        image: data.image || '',
                        category: data.category || '',
                    });
                } else {
                    console.error("Failed to fetch post");
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };
        fetchPost();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const author = localStorage.getItem("username") || "Guest";
                navigate(`/my-posts/${author}`);
            } else {
                console.error("Failed to update post");
            }
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    return (
        <>
        <Navbar />
        <div className="max-w-2xl mx-auto pt-24 px-4">
            <h1 className="text-3xl font-bold mb-6 text-white">Edit Post</h1>
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
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full p-3 rounded-md border border-gray-300"
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
                <Button type="submit">Update Post</Button>
            </form>
        </div>
        </>
    );
};

export default EditPost;