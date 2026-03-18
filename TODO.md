# TODO: Like / Bookmark System ❤️

## Plan Overview
Users can like blog posts and save posts for later reading.

## ✅ Completed Steps

### Step 1: Update Backend Post Schema
- [x] Add likedBy array to track who liked each post
- [x] Add savedBy array to track who saved each post
- [x] Compute likeCount dynamically from likedBy array length

### Step 2: Update Backend User Schema
- [x] Add likedPosts array to track user's liked posts
- [x] Add savedPosts array to track user's saved/bookmarked posts

### Step 3: Update Backend Post Routes
- [x] Add PUT `/posts/:id/like` - Toggle like on a post
- [x] Add PUT `/posts/:id/save` - Toggle bookmark/save on a post

### Step 4: Update PostCard Component (Frontend)
- [x] Add heart icon button for Like
- [x] Add bookmark icon button for Save/Bookmark
- [x] Show like count
- [x] Toggle visual state (filled/outlined) based on user's action

### Step 5: Update PostShow Page (Frontend)
- [x] Add Like and Bookmark buttons

### Step 6: Create SavedPosts Page
- [x] Create new page to view saved/bookmarked posts
- [x] Add route in routes.jsx

### Step 7: Update Navbar
- [x] Add link to Saved Posts page

### Step 8: Update TODO.md
- [x] Document all completed steps

## Files Modified
1. Backend/models/postSchema.js - Added likedBy and savedBy arrays
2. Backend/models/userSchema.js - Added likedPosts and savedPosts arrays
3. Backend/routes/posts.js - Added like and save toggle routes
4. GTA/src/components/PostCard.jsx - Added like and bookmark buttons
5. GTA/src/pages/PostShow.jsx - Added like and bookmark buttons
6. GTA/src/pages/SavedPosts.jsx - New file for saved posts
7. GTA/src/route/routes.jsx - Added saved-posts route
8. GTA/src/components/Navbar.jsx - Added saved posts link
9. TODO.md - Updated with completed steps

## Features Added
- Like posts with heart icon
- Bookmark/Save posts for later
- Visual indication of liked/saved state
- Saved posts page to view all bookmarked posts
- Like count display

