import React, { useState } from 'react';
import Button from './Button';

const PostCard = ({ post, loggedInUser, navigate, onDeleteClick, onUpdate }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    
    // Get user ID from localStorage
    const userId = localStorage.getItem("userId");
    
    // Check if user has liked/saved this post
    const isLiked = post.likedBy && post.likedBy.some(id => id === userId || id.toString() === userId);
    const isSaved = post.savedBy && post.savedBy.some(id => id === userId || id.toString() === userId);
    
    const handleLike = async () => {
        if (!userId) {
            alert("Please login to like posts");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/posts/${post._id}/like`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userId })
            });
            if (response.ok) {
                const data = await response.json();
                onUpdate(data.post);
            }
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };
    
    const handleSave = async () => {
        if (!userId) {
            alert("Please login to save posts");
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/posts/${post._id}/save`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userId })
            });
            if (response.ok) {
                const data = await response.json();
                onUpdate(data.post);
            }
        } catch (error) {
            console.error("Error saving post:", error);
        }
    };

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        try {
            const response = await fetch(`http://localhost:8080/posts/${post._id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: commentText, author: loggedInUser || "Guest" })
            });
            if (response.ok) {
                const updatedPost = await response.json();
                onUpdate(updatedPost);
                setCommentText("");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleReply = async (commentId) => {
         if (!replyText.trim()) return;
         try {
            const response = await fetch(`http://localhost:8080/posts/${post._id}/comments/${commentId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: replyText, author: loggedInUser || "Guest" })
            });
            if (response.ok) {
                const updatedPost = await response.json();
                onUpdate(updatedPost);
                setReplyText("");
                setReplyingTo(null);
            }
         } catch (error) {
             console.error("Error replying:", error);
         }
    };

    const handleDeleteComment = async (commentId) => {
        if(!window.confirm("Delete this comment?")) return;
        try {
            const response = await fetch(`http://localhost:8080/posts/${post._id}/comments/${commentId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                const updatedPost = await response.json();
                onUpdate(updatedPost);
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:8080/posts/${post._id}/comments/${commentId}/like`, {
                method: "PUT"
            });
            if (response.ok) {
                const updatedPost = await response.json();
                onUpdate(updatedPost);
            }
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };

    const handleEditComment = (comment) => {
        setEditingCommentId(comment._id);
        setEditText(comment.text);
    };

    const handleSaveEdit = async (commentId) => {
        if (!editText.trim()) return;
        try {
            const response = await fetch(`http://localhost:8080/posts/${post._id}/comments/${commentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: editText })
            });
            if (response.ok) {
                const updatedPost = await response.json();
                onUpdate(updatedPost);
                setEditingCommentId(null);
                setEditText("");
            }
        } catch (error) {
            console.error("Error editing comment:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditText("");
    };

    const sortedComments = [...(post.comments || [])].sort((a, b) => {
        if (sortBy === "likes") return (b.likes || 0) - (a.likes || 0);
        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return (
      <div className="post-card flex flex-col bg-white p-4 rounded-lg shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          {post.image && <img src={post.image} alt={post.title} className="w-full h-48 sm:h-64 object-cover rounded-lg bg-gray-100 mb-4" />}
          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
          <p className="text-gray-700 mb-4 grow">{post.body}</p>
          <small className="block text-gray-500 mb-2">Category: {post.category} {post.author !== "Guest" && `| By: ${post.author}`}</small>
          
          {/* Tags Display */}
          {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {tag}
                      </span>
                  ))}
              </div>
          )}
          
          {/* Like and Save Buttons */}
          <div className="flex items-center gap-4 mb-4">
              <button 
                  onClick={handleLike}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                      isLiked 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
              >
                  <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
                  <span className="text-sm font-medium">{post.likes || 0}</span>
              </button>
              <button 
                  onClick={handleSave}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
                      isSaved 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                  }`}
              >
                  <span className="text-lg">{isSaved ? '🔖' : '📑'}</span>
                  <span className="text-sm font-medium">{isSaved ? 'Saved' : 'Save'}</span>
              </button>
          </div>
          
          {loggedInUser === post.author && (
            <div className="flex gap-2 mb-4">
                <Button
                    onClick={() => navigate(`/posts/${post._id}/edit`)}
                    style={{ backgroundColor: "#3b82f6", color: "white" }}
                >
                    Edit
                </Button>
                <Button
                    onClick={onDeleteClick}
                    style={{ backgroundColor: "#ef4444", color: "white" }}
                >
                    Delete
                </Button>
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t pt-4 mt-auto">
              <div className="flex justify-between items-center mb-3">
                  <button 
                      onClick={() => setShowComments(!showComments)} 
                      className="text-blue-600 hover:underline text-sm font-semibold"
                  >
                      {showComments ? "Hide Comments" : `Show Comments (${post.comments?.length || 0})`}
                  </button>
                  {showComments && (
                      <select 
                          value={sortBy} 
                          onChange={(e) => setSortBy(e.target.value)}
                          className="text-xs border rounded p-1 bg-gray-50 focus:outline-none focus:border-blue-500"
                      >
                          <option value="newest">Newest</option>
                          <option value="oldest">Oldest</option>
                          <option value="likes">Top Liked</option>
                      </select>
                  )}
              </div>
              
              {showComments && (
                  <div className="space-y-4">
                      {/* Add Comment */}
                      <div className="flex gap-2">
                          <input 
                              type="text" 
                              value={commentText} 
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Write a comment..."
                              className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                          />
                          <Button onClick={handleAddComment} style={{ backgroundColor: "#3b82f6", color: "white", padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Post</Button>
                      </div>

                      {/* List Comments */}
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {sortedComments.map(comment => (
                          <div key={comment._id} className="bg-gray-50 p-3 rounded-lg text-sm">
                              {editingCommentId === comment._id ? (
                                  <div className="mb-2">
                                      <input 
                                          type="text" 
                                          value={editText} 
                                          onChange={(e) => setEditText(e.target.value)}
                                          className="w-full border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:border-blue-500"
                                      />
                                      <div className="flex gap-2">
                                          <Button onClick={() => handleSaveEdit(comment._id)} style={{ backgroundColor: "#10b981", color: "white", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>Save</Button>
                                          <Button onClick={handleCancelEdit} style={{ backgroundColor: "#6b7280", color: "white", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>Cancel</Button>
                                      </div>
                                  </div>
                              ) : (
                                  <div className="flex justify-between items-start">
                                      <div>
                                          <span className="font-bold text-gray-900 mr-2">{comment.author}</span>
                                          <span className="text-gray-500 text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                          <p className="text-gray-800 mt-1">{comment.text}</p>
                                      </div>
                                      {loggedInUser === comment.author && (
                                          <div className="flex gap-2">
                                              <button onClick={() => handleEditComment(comment)} className="text-blue-500 hover:text-blue-700 text-xs font-medium">Edit</button>
                                              <button onClick={() => handleDeleteComment(comment._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
                                          </div>
                                      )}
                                  </div>
                              )}
                              
                              <div className="flex gap-4 mt-2 text-xs text-gray-500 font-medium">
                                  <button onClick={() => handleLikeComment(comment._id)} className="hover:text-blue-600 flex items-center gap-1">
                                      <span>👍</span> {comment.likes || 0}
                                  </button>
                                  <button onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)} className="hover:text-blue-600">
                                      Reply
                                  </button>
                              </div>

                              {/* Reply Input */}
                              {replyingTo === comment._id && (
                                  <div className="flex gap-2 mt-3">
                                      <input 
                                          type="text" 
                                          value={replyText} 
                                          onChange={(e) => setReplyText(e.target.value)}
                                          placeholder={`Reply to ${comment.author}...`}
                                          className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                                      />
                                      <Button onClick={() => handleReply(comment._id)} style={{ backgroundColor: "#3b82f6", color: "white", padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}>Reply</Button>
                                  </div>
                              )}

                              {/* Replies List */}
                              {comment.replies?.length > 0 && (
                                  <div className="ml-4 mt-3 pl-3 border-l-2 border-gray-200 space-y-2">
                                      {comment.replies.map(reply => (
                                          <div key={reply._id} className="bg-white p-2 rounded shadow-sm">
                                              <div className="flex justify-between">
                                                  <span className="font-bold text-xs text-gray-900">{reply.author}</span>
                                                  <span className="text-gray-400 text-xs">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                              </div>
                                              <p className="text-gray-700 mt-1">{reply.text}</p>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      ))}
                      </div>
                  </div>
              )}
          </div>
      </div>
    );
};

export default PostCard;