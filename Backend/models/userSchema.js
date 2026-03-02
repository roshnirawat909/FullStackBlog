/*

// models/userSchema.js
//const mongoose = require("mongoose");
import mongoose from "mongoose";
//const Schema = mongoose.Schema;
import { Schema } from "mongoose";

 const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });



const User = mongoose.model("User", userSchema);

export default User;  
*/

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);
export default User;
