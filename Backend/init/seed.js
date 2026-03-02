// seed.js
import mongoose from "mongoose";
import { data } from "./data.js";
import Post from "../models/postSchema.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: join(__dirname, "../.env") });
}

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/BloggifyHub";

// Connect to DB
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
  await initDB();
}

// Seed function
const initDB = async () => {
  try {
    await Post.deleteMany({});
    const res = await Post.insertMany(data);
    console.log(`Data initialized! Inserted ${res.length} posts.`);
    
    const count = await Post.countDocuments();
    console.log(`Total posts in DB: ${count}`);
  } catch (err) {
    console.log("SEED ERROR:", err);
  } finally {
    mongoose.connection.close();
  }
};

main().catch((err) => console.log("DB Error:", err));