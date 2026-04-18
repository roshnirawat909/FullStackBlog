

// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routers
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Post from "./models/postSchema.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config();

// Create Express app
const app = express();

// CORS settings so React (localhost:3000) can call this API
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // React frontend URLs
    credentials: true,
  })
);

// Parse JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Connect to MongoDB
// const MONGO_URL = process.env.MONGOATLAS_URL;
// mongoose
//   .connect(MONGO_URL)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));
mongoose.connect(process.env.MONGOATLAS_URL, {
  dbName: "BloggifyHub"
});



// API routes
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});


// Mount routes
app.use("/auth", authRoutes); // for login/register
app.use("/posts", postRoutes); // for posts API

// Serve static uploads
app.use('/uploads', express.static('public/uploads'));

// --- Comment Routes ---

// Add a comment
app.post("/posts/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    
    post.comments.push(req.body); // { text, author }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reply to a comment
app.post("/posts/:id/comments/:commentId/reply", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    
    comment.replies.push(req.body); // { text, author }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like a comment
app.put("/posts/:id/comments/:commentId/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    
    comment.likes = (comment.likes || 0) + 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a comment
app.delete("/posts/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    
    post.comments.pull({ _id: req.params.commentId });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit a comment
app.put("/posts/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    
    if (req.body.text) {
        comment.text = req.body.text;
    }
    
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Route
app.post("/ai/generate", async (req, res) => {
  try {
    const { prompt, type } = req.body;
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let systemInstruction = "";
    if (type === 'title') {
      systemInstruction = "Generate a catchy, engaging, and SEO-friendly blog post title based on this topic: ";
    } else if (type === 'body') {
      systemInstruction = "Write a comprehensive, engaging blog post body (using Markdown formatting where appropriate) about: ";
    } else if (type === 'category') {
      const categories = ["Technology", "Education & Career", "Health & Fitness", "Lifestyle", "Relationships", "Science", "Finance"];
      systemInstruction = `From the following list of categories, pick the single best one for a blog post about the following topic. Only return the category name, nothing else. Categories: ${categories.join(", ")}. Topic: `;
    } else {
      systemInstruction = "Assist with the following blog request: ";
    }

    const result = await model.generateContent(systemInstruction + prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ text });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// Basic test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
export default app;
//module.exports = app; 