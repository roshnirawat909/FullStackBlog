// src/route/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import MainContent from "../components/MainContent";
import AllPosts from "../pages/AllPosts";
import PostShow from "../pages/PostShow";
import LoginPage from "../pages/LoginPage";
import SignInPage from "../pages/SignInPage";
import LogoutPage from "../pages/LogoutPage";
import RegisterPage from "../pages/RegisterPage";
import CreatePost from "../pages/CreatePost";
import UserPosts from "../components/UserPosts";
import EditPost from "../pages/EditPost";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      <Route path="/posts" element={<AllPosts />} />
      <Route path="/posts/:id" element={<PostShow />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/my-posts/:author" element={<UserPosts />} />
      <Route path="/posts/:id/edit" element={<EditPost />} />
    </Routes>
  );
};

export default AppRoutes;
