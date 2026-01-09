// models/Campaign.js

const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  goal: Number,
  raised: {
    type: Number,
    default: 0,
  },
  imageUrl: String,
  approved: {
    type: Boolean,
    default: false,
  },
  donors: [
    {
      name: String,
      amount: Number,
    },
  ],
  creatorId: { type: String },
  createdBy: {type : String},
}, { timestamps: true });

module.exports = mongoose.model("Campaign", campaignSchema);
