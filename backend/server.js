require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const postsRoutes = require("./routes/posts");
const uploadRoutes = require("./routes/upload");
const authRoutes = require("./routes/auth");
const campaignsRoute = require("./routes/campaigns"); 
const userRoutes = require("./routes/user");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Validate environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ ERROR: Missing environment variables. Check your .env file.");
  process.exit(1); // Stop the server if env variables are missing
}

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout for server selection
    family: 4, // Force IPv4 (fixes some connectivity issues)
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Stop the server if MongoDB connection fails
  });

// ✅ Routes
app.use("/api/auth", authRoutes);      // ✅ Added authentication routes
app.use("/api/posts", postsRoutes);
app.use("/api/upload", uploadRoutes);  
app.use("/api/campaigns", campaignsRoute);
app.use("/api/users", userRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
