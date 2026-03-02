
/*import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import ejsMate from 'ejs-mate';
import methodOverride from 'method-override';
import Post from './models/postSchema.js';
import { data as initData } from './init/data.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(methodOverride('_method'));

// Database
const MONGO_URL = "mongodb://127.0.0.1:27017/BloggifyHub";

async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("DB ERROR:", err));


// EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));


// Test post
app.get("/testpost", async (req, res) => {

 const sampleListing =[
  {
    "category": "Technology",
    "title": "Why AI will replace repetitive jobs?",
    "body": "AI automates pattern-based and repetitive workflows such as data entry, ticket sorting, and rule-based decisions...",
    "author": "Aarav Sharma",
    "image": "https://images.unsplash.com/photo-1535223289827-42f1e9919769",
    "likes": 540,
    "comments": [
      { "author": "Priya", "text": "True, creative jobs will stay." },
      { "author": "Sam", "text": "Automation helps productivity." }
    ]
  },
  {
    "category": "Technology",
    "title": "Is MERN stack still worth learning in 2025?",
    "body": "MERN remains powerful because React dominates UI, Node.js handles scalable servers, and MongoDB works great with JSON data...",
    "author": "Rohan Patel",
    "image": "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "likes": 320,
    "comments": [
      { "author": "Dev", "text": "Especially with Next.js!" }
    ]
  },

  {
    "category": "Education & Career",
    "title": "How to choose a career after 12th?",
    "body": "Evaluate your interests, strengths, and industry demand. Explore aptitude tests, internships, and counseling...",
    "author": "Anjali Verma",
    "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    "likes": 680,
    "comments": [
      { "author": "Nikhil", "text": "Very helpful guide!" }
    ]
  },
  {
    "category": "Education & Career",
    "title": "Is data analytics a good career?",
    "body": "Absolutely. Data analytics drives decision-making in healthcare, retail, finance, and government...",
    "author": "Ritu Chauhan",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    "likes": 410,
    "comments": []
  },

  {
    "category": "Health & Fitness",
    "title": "Is intermittent fasting safe?",
    "body": "IF helps with metabolism and weight control, but people with medical issues should consult doctors...",
    "author": "Dr. Kunal",
    "image": "https://images.unsplash.com/photo-1518611012118-f0c5d2e3d31a",
    "likes": 290,
    "comments": [
      { "author": "Sneha", "text": "I lost weight with IF." }
    ]
  },
  {
    "category": "Health & Fitness",
    "title": "Best home workouts without equipment",
    "body": "Push-ups, planks, squats, lunges, burpees, and mountain climbers are enough for a full-body workout...",
    "author": "Ramesh",
    "image": "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",
    "likes": 150,
    "comments": []
  },

  {
    "category": "Lifestyle",
    "title": "How to stay productive every day?",
    "body": "Use time-blocking, remove distractions, avoid multitasking, and focus for 90-minute cycles...",
    "author": "Maya Singh",
    "image": "https://images.unsplash.com/photo-1506784365847-bbad939e9335",
    "likes": 530,
    "comments": [
      { "author": "Rutuja", "text": "Time-blocking is magic!" }
    ]
  },
  {
    "category": "Lifestyle",
    "title": "How to improve communication skills?",
    "body": "Practice speaking daily, listen actively, read books, and participate in group discussions...",
    "author": "Kabir",
    "image": "https://images.unsplash.com/photo-1551847677-dc82d764e1fa",
    "likes": 300,
    "comments": []
  },

  {
    "category": "Relationships",
    "title": "What makes a relationship successful?",
    "body": "Trust, communication, emotional availability, and growth mindset strengthen relationships...",
    "author": "Nisha",
    "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    "likes": 750,
    "comments": [
      { "author": "Omkar", "text": "So true!" },
      { "author": "Sai", "text": "Communication matters most." }
    ]
  },

  {
    "category": "Science",
    "title": "Why is the universe expanding?",
    "body": "Space itself is stretching due to the Big Bang expansion. Galaxies move apart as space expands...",
    "author": "Neel",
    "image": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
    "likes": 390,
    "comments": []
  },

  {
    "category": "Finance",
    "title": "How to start investing with low money?",
    "body": "Start with SIP, index funds, or fractional stocks. Consistency matters more than amount...",
    "author": "Aditya",
    "image": "https://images.unsplash.com/photo-1569025690938-a00729c9e1d5",
    "likes": 450,
    "comments": [
      { "author": "Manish", "text": "Very useful!" }
    ]
  }
]


  await sampleListing.save();
  res.send("Test post created successfully!");
});


// All posts page
app.get("/posts", async (req, res) => {
  const allPosts = await Post.find({});
  res.render("allpost", { allPosts });  // FIXED
});


// New post form
app.get("/posts/new", (req, res) => {
  res.render("new");  // FIXED
});


// Show edit form
app.get("/posts/:id/edit", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("edit", { post });
});

// Update post
app.put("/posts/:id", async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/posts");
});
// Create new post
app.post("/posts", async (req, res) => {
  try {
    console.log("Form data received:", req.body);
    const newPost = new Post(req.body);
    await newPost.save();
    res.redirect("/posts");
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).send("Error creating post");
  }
});
// Show single post
app.get("posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.render("show", { post });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading post");
  }
});



// Home page
app.get("/home", (req, res) => {
  res.render("home");  // FIXED
});


// Root
app.get("/", (req, res) => {
  res.send("Hi, I am root route.");
});


// Server
app.listen(3000, () => {
  console.log("Server is running on PORT 3000");
});
*/

/*

// server.js
//const express = require('express');
import express from 'express';
//const mongoose = require('mongoose');
import mongoose from 'mongoose';
//const dotenv = require('dotenv');
import dotenv from 'dotenv';
//const path = require('path');
import methodOverride from 'method-override';
//const path = require('path');
import path from 'path';
//const methodOverride = require('method-override');
// const bodyParser = require('body-parser'); // Deprecated, Express handles it now


import { fileURLToPath } from "url";


// Import Routers
//const authRoutes = require('./routes/auth'); 
import authRoutes from './routes/auth.js';
//const postRoutes = require('./routes/posts');
import postRoutes from './routes/posts.js';


// --- Configuration ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

// --- DB Connection ---
async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connection established.");
}
main().catch(err => console.error("DB Connection Error:", err));

// --- Middleware ---

app.set("view engine", "ejs");

// recreate __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));

// Serving static files (images, css, etc.) from the public folder
app.use(express.static(path.join(__dirname, "public")));
// Parses application/x-www-form-urlencoded data (for EJS forms)
app.use(express.urlencoded({ extended: true })); 
// Parses JSON data (for React fetch requests)
app.use(express.json()); 
// Enables PUT and DELETE methods for forms
app.use(methodOverride('_method')); 

// --- Router Mounting ---

// 1. Authentication API for React Frontend
// React sends requests to /auth/register and /auth/login
app.use("/auth", authRoutes);

// 2. Blog Post Routes for EJS Frontend
// EJS links and forms target /posts
app.use("/posts", postRoutes);


// --- React Frontend Handling ---
// All GET requests not handled by the routers above will serve the main React application.
// In a real setup, this is usually handled by a proxy or by letting your front-end server (like Vite) handle the root route.
// For EJS, we'll keep the root route simple:
app.get("/", (req, res) => {
    res.send("Welcome to BloggifyHub! Visit /posts for EJS content or use the React app.");
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

*/

/*
// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import methodOverride from "method-override";
import { fileURLToPath } from "url";

// Routers
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";

// Load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

// ⚠ CORS (allow requests from your React frontend)
app.use(cors({
  origin: "http://localhost:3000", // change if React runs on another port
  credentials: true
}));

// JSON & URL Encoded Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Connect to MongoDB
async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("Connected to MongoDB");
}

main().catch(err => console.error("DB Connection Error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

// Default root
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

*/

// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routers
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";

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

// Connect to MongoDB
const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mount routes
app.use("/auth", authRoutes); // for login/register
app.use("/posts", postRoutes); // for posts API

// Basic test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

