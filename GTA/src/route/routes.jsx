// src/route/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import MainContent from "../components/MainContent";
import AllPosts from "../pages/AllPosts";
import PostShow from "../pages/PostShow";
import LoginPage from "../pages/LoginPage";

import LogoutPage from "../pages/LogoutPage";
import RegisterPage from "../pages/RegisterPage";
import CreatePost from "../pages/CreatePost";
import UserPosts from "../components/UserPosts";
import EditPost from "../pages/EditPost";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePic from "../pages/EditProfilePic";

import SavedPosts from "../pages/SavedPosts";
import Categories from "../pages/Categories";
import CategoryPage from "../pages/CategoryPage";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      <Route path="/posts" element={<AllPosts />} />
      <Route path="/posts/:id" element={<PostShow />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/edit-profile-pic" element={<EditProfilePic />} />
      <Route path="/my-posts/:author" element={<UserPosts />} />
      <Route path="/posts/:id/edit" element={<EditPost />} />

      <Route path="/saved-posts" element={<SavedPosts />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/category/:category" element={<CategoryPage />} />

    </Routes>
  );
};

export default AppRoutes;

