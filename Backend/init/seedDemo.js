import mongoose from "mongoose";
import { demoPosts } from "./demoPosts.js";
import Post from "../models/postSchema.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: join(__dirname, "../.env") });
}

const MONGO_URL = process.env.MONGOATLAS_URL;

// Connect to DB
async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to DB");
  await initDB();
}

// Seed function - clears existing posts and inserts demo data
const initDB = async () => {
  try {
    console.log("🧹 Clearing existing posts...");
    await Post.deleteMany({});
    
    console.log(`🌱 Seeding ${demoPosts.length} demo posts...`);
    const res = await Post.insertMany(demoPosts);
    console.log(`✅ Demo data seeded! Inserted ${res.length} posts.`);
    
    const count = await Post.countDocuments();
    console.log(`📊 Total posts in DB: ${count}`);
    
    // Log first post as sample
    const sample = await Post.findOne();
    console.log("📝 Sample post:", {
      title: sample.title,
      author: sample.author,
      category: sample.category
    });
  } catch (err) {
    console.error("❌ SEED ERROR:", err);
  } finally {
    mongoose.connection.close();
    console.log("🔌 DB connection closed");
  }
};

main().catch((err) => console.error("💥 DB Connection Error:", err));

