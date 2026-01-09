const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const path = require("path");
const fs = require("fs");

// POST /api/campaigns - submit campaign for approval
router.post("/", async (req, res) => {
  try {
    const { title, description, goal, imageUrl, creatorId, createdBy } = req.body;

    const newCampaign = new Campaign({
      title,
      description,
      goal,
      imageUrl, 
      creatorId,
      createdBy,
      approved: false,
    });

    await newCampaign.save();
    res.status(201).json({ message: "Campaign submitted for approval." });
  } catch (err) {
    console.error("Error creating campaign:", err);
    res.status(500).json({ error: "Failed to create campaign." });
  }
});


// GET /api/campaigns - fetch only approved campaigns
router.get("/", async (req, res) => {
  try {
    const approvedCampaigns = await Campaign.find({ approved: true });
    res.json(approvedCampaigns);
  } catch (err) {
    res.status(500).json({ error: "Failed to load campaigns." });
  }
});

// PUT /api/campaigns/:id/donate - donate to campaign
router.put("/:id/donate", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount } = req.body;

    const campaign = await Campaign.findById(id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    campaign.raised += parseFloat(amount);
    campaign.donors.push({ name, amount: parseFloat(amount) });

    await campaign.save();
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: "Failed to process donation." });
  }
});

// GET /api/campaigns/pending
router.get("/pending", async (req, res) => {
  try {
    const pendingCampaigns = await Campaign.find({ approved: false });
    res.json(pendingCampaigns);
  } catch (err) {
    console.error("Error fetching pending campaigns:", err);
    res.status(500).json({ error: "Failed to fetch pending campaigns" });
  }
});

// PUT /api/campaigns/:id/approve
router.put("/:id/approve", async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    res.json({ message: "Campaign approved", campaign });
  } catch (err) {
    res.status(500).json({ error: "Approval failed" });
  }
});

// DELETE a campaign (for rejection)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId; // get from query params

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

if (userId && campaign.creatorId !== userId) {
  return res.status(403).json({ message: 'Unauthorized: Only the creator can delete this campaign' });
}

    await Campaign.findByIdAndDelete(id);
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ message: 'Server error while deleting campaign' });
  }
});

module.exports = router;
