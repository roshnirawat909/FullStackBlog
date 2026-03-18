 import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  text: String,
  author: String,
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  text: String,
  author: String,
  likes: { type: Number, default: 0 },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  category: String,
  tags: [String],
  author: String,
  image: String,
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
