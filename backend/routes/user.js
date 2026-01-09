const express = require("express");
const router = express.Router();
const User = require("../models/User"); // adjust path if needed

// Update user profile
router.put("/:id", async (req, res) => {
  const { username, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, avatar },
      { new: true } // return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Profile update failed:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
