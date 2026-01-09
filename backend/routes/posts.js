const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");

const router = express.Router();

router.use(express.json());
router.use("/uploads", express.static("uploads"));

router.get("/", async (req, res) => {
  try {
    const { type } = req.query; 
    const query = type ? { type } : {};

    const posts = await Post.find(query).sort({ createdAt: -1 }); 
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Error fetching post" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      text = "",
      author,
      userId, 
      location = {},
      type = "report",
      mediaUrl = "",
      verified = false,
    } = req.body;

    const newPost = new Post({
      text,
      author: author || "Anonymous",
      userId, 
      mediaUrl,
      location,
      likes: 0,
      type,
      status : "Pending",
      verified,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Error creating post" });
  }
});

router.put("/:id/like", async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (!post.likedBy) post.likedBy = [];

    const alreadyLiked = post.likedBy.includes(userId);

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(id => id !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();

    res.json({ message: "Like status updated", likes: post.likes, likedBy: post.likedBy });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Server error while toggling like" });
  }
});

router.post("/:id/comment", async (req, res) => {
  try {
    const { text, author } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({
      text,
      author: author || "Anonymous",
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Error adding comment" });
  }
});

router.put("/:postId/comments/:commentId", async (req, res) => {
  try {
    const { author, text } = req.body;
    if (!text) return res.status(400).json({ error: "Updated comment text is required" });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.author !== author) {
      return res.status(403).json({ error: "You are not allowed to edit this comment" });
    }

    comment.text = text;
    comment.timestamp = new Date();

    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Error editing comment:", err);
    res.status(500).json({ error: "Error editing comment" });
  }
});


// PUT (Update a post - for editing text or type)
router.put("/:id", async (req, res) => {
  try {
    const { text, type, mediaUrl } = req.body; // Add mediaUrl here
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (text !== undefined) post.text = text;
    if (type !== undefined) post.type = type;
    if (mediaUrl !== undefined) post.mediaUrl = mediaUrl; // ✅ Add this line

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Error updating post" });
  }
});

// DELETE a post (Authority moderation)
router.delete("/:id", async (req, res) => {
  try {
    const { author, isAuthority = false } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.author !== author && !isAuthority) {
      return res.status(403).json({ error: "Not allowed to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Error deleting post" });
  }
});

router.delete("/:postId/comments/:commentId", async (req, res) => {
  try {
    const { author, isAuthority = false } = req.body;

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (comment.author !== author && !isAuthority) {
      return res.status(403).json({ error: "Not allowed to delete this comment" });
    }

    comment.remove();
    await post.save();
    res.json({ message: "Comment deleted successfully", post });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Error deleting comment" });
  }
});

router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

module.exports = router;
