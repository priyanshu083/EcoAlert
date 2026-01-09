const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { 
    type: String, 
    enum: ["user", "authority"], 
    default: "user" 
  },
  avatar: {
    type: String,
    default: "https://res.cloudinary.com/dc4nz6gac/image/upload/v1744552956/defaultavatar_opodyh.jpg" 
  }
});

userSchema.pre("save", async function (next) {
  this.role = this.role.toLowerCase();

  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

module.exports = mongoose.model("User", userSchema);
