import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './Button';
import AIAssistant from './AIAssistant';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [image, setImage] = useState('');
    const navigate = useNavigate();

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

    const suggestedTags = [
        "javascript", "react", "nodejs", "python", "css", "html",
        "webdev", "beginners", "tutorial", "ai", "machinelearning",
        "career", "job", "productivity", "health", "fitness"
    ];

    const handleAddTag = (tag) => {
        const trimmedTag = tag.trim().toLowerCase();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddTag(tagInput);
        }
    };

    const handleContentGenerated = (content, type) => {
        if (type === 'title') {
            setTitle(content);
        } else if (type === 'body') {
            setBody(content);
        } else if (type === 'category') {
            if (categories.includes(content)) {
                setCategory(content);
            } else {
                console.warn(`AI suggested an invalid category: ${content}`);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const author = localStorage.getItem('username') || 'Guest';

        const newPost = {
            title,
            body,
            category,
            tags,
            author,
            image,
            likes: 0,
            comments: []
        };

        try {
            const response = await fetch('http://localhost:8080/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            });

            if (response.ok) {
                navigate('/posts'); // Redirect to all posts page after creation
            } else {
                console.error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Create a New Post</h1>
                
                <AIAssistant onContentGenerated={handleContentGenerated} />

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="" disabled>Select a category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="tags"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagInputKeyDown}
                                placeholder="Type a tag and press Enter"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Selected Tags */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1.5 inline-flex text-indigo-500 hover:text-indigo-700 focus:outline-none"
                                        >
                                            <span className="sr-only">Remove</span>
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        {/* Suggested Tags */}
                        <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-2">Suggested tags:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedTags.filter(st => !tags.includes(st)).map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleAddTag(tag)}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        + {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body</label>
                        <textarea
                            id="body"
                            rows="10"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                        <input
                            type="text"
                            id="image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit">Create Post</Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreatePost;