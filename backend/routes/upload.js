const express = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinaryConfig");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" }, 
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }
        res.json({ secure_url: result.secure_url }); // ✅ consistent with frontend expectations
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
