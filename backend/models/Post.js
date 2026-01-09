const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: { type: String, default: "Anonymous", trim: true },
  text: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema(
  {
    text: { type: String, trim: true, default: "" },
    author: { type: String, required: true, trim: true },
    userId: { type: String, required: true, trim: true },
    mediaUrl: { type: String, default: "" },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    likes: { type: Number, default: 0, min: 0 },
    likedBy: [{ type: String }],
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },    
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dc4nz6gac/image/upload/v1744552956/defaultavatar_opodyh.jpg" 
    },
    type: {
      type: String,
      enum: ["report", "education"],
      default: "report",
    },
    comments: [commentSchema] 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
