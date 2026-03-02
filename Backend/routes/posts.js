import express from "express";
import Post from "../models/postSchema.js";

const router = express.Router();

// GET /posts - Fetch all posts or filter by author
router.get("/", async (req, res) => {
  try {
    const { author } = req.query;
    console.log(`GET /posts request. Author filter: '${author}'`);
    // If author exists in query, filter by it; otherwise return all posts
    const filter = author ? { author } : {};
    const posts = await Post.find(filter);
    console.log(`Found ${posts.length} posts`);
    
    if (posts.length === 0) {
      const allPosts = await Post.countDocuments();
      console.log(`DEBUG: Total posts in DB: ${allPosts}`);
      if (allPosts > 0) {
        console.log("DEBUG: Posts exist but filter matched nothing. Check author spelling.");
        const sample = await Post.findOne();
        console.log("DEBUG: Sample post from DB:", sample);
      }
    }

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /posts - Create a new post (Standard for this route file)
router.post("/", async (req, res) => {
  try {
    console.log("Creating new post with data:", req.body);
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    console.log("Post saved successfully:", savedPost);
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /posts/:id - Fetch a single post (Required for Edit page)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /posts/:id - Update a post (Required for Edit page)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /posts/:id - Delete a post
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;