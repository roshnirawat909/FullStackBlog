import express from "express";
import Post from "../models/postSchema.js";
import User from "../models/userSchema.js";

const router = express.Router();

// GET /posts - Fetch all posts or filter by author, category, tags, or search query
router.get("/", async (req, res) => {
  try {
    const { author, category, tags, search } = req.query;
    console.log(`GET /posts request. Author: '${author}', Category: '${category}', Tags: '${tags}', Search: '${search}'`);
    
    // Build filter object based on query parameters
    const filter = {};
    
    if (author) {
      filter.author = author;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (tags) {
      // Tags can be a comma-separated string or array
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }
    
    // Add search functionality - search in title, body, author, and tags
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { body: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const posts = await Post.find(filter);
    console.log(`Found ${posts.length} posts`);
    
    if (posts.length === 0) {
      const allPosts = await Post.countDocuments();
      console.log(`DEBUG: Total posts in DB: ${allPosts}`);
      if (allPosts > 0) {
        console.log("DEBUG: Posts exist but filter matched nothing. Check filter criteria.");
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

// PUT /posts/:id/like - Toggle like on a post
router.put("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const likedByIds = post.likedBy.map(id => id.toString());
    const userLikedIndex = likedByIds.indexOf(userId);
    
    let isLiked;
    
    if (userLikedIndex === -1) {
      // User hasn't liked the post - add like
      post.likedBy.push(userId);
      user.likedPosts.push(id);
      isLiked = true;
    } else {
      // User already liked the post - remove like
      post.likedBy.splice(userLikedIndex, 1);
      const userLikedPostIndex = user.likedPosts.indexOf(id);
      if (userLikedPostIndex > -1) {
        user.likedPosts.splice(userLikedPostIndex, 1);
      }
      isLiked = false;
    }
    
    post.likes = post.likedBy.length;
    
    await post.save();
    await user.save();
    
    res.json({ 
      post: post,
      isLiked: isLiked,
      likeCount: post.likes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /posts/:id/save - Toggle bookmark/save on a post
router.put("/:id/save", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const savedByIds = post.savedBy.map(id => id.toString());
    const userSavedIndex = savedByIds.indexOf(userId);
    
    let isSaved;
    
    if (userSavedIndex === -1) {
      // User hasn't saved the post - add to saved
      post.savedBy.push(userId);
      user.savedPosts.push(id);
      isSaved = true;
    } else {
      // User already saved the post - remove from saved
      post.savedBy.splice(userSavedIndex, 1);
      const userSavedPostIndex = user.savedPosts.indexOf(id);
      if (userSavedPostIndex > -1) {
        user.savedPosts.splice(userSavedPostIndex, 1);
      }
      isSaved = false;
    }
    
    await post.save();
    await user.save();
    
    res.json({ 
      post: post,
      isSaved: isSaved
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /posts/user/saved/:userId - Get all saved posts for a user
router.get("/user/saved/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).populate("savedPosts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user.savedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;