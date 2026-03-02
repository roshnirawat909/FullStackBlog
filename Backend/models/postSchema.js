
/*import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const postSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      "Technology",
      "Education & Career",
      "Health & Fitness",
      "Lifestyle",
      "Relationships",
      "Science",
      "Finance"
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;*/

/*
// models/postSchema.js
//const mongoose = require("mongoose");

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

const postSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: [
            "Technology",
            "Education & Career",
            "Health & Fitness",
            "Lifestyle",
            "Relationships",
            "Science",
            "Finance"
        ]
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [commentSchema] // Embedded documents
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);



 export default Post;

 */

 import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  category: String,
  author: String,
  image: String,
  likes: Number,
  comments: Array
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
