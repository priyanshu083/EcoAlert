import React, { useEffect, useState } from "react";
import { FaDonate, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import uploadToCloudinary from "../utils/uploadHelper";

const Crowdfunding = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    description: "",
    goal: "",
    imageFile: null,
    imagePreview: "",
  });
  const [donationInputs, setDonationInputs] = useState({});

  const creatorId = localStorage.getItem("userId");
  const createdBy = localStorage.getItem("username");

  // Fetch approved campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/campaigns");
      setCampaigns(res.data);
    } catch (error) {
      console.error("Failed to load campaigns", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewCampaign({
      ...newCampaign,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  const handleCreateCampaign = async () => {
    const { title, description, goal, imageFile } = newCampaign;
  
    if (!title || !description || !goal || goal <= 0 || !imageFile) {
      toast.error("Please fill all fields correctly.");
      return;
    }
  
    try {
      // Upload to Cloudinary via your backend route
      const imageUrl = await uploadToCloudinary(imageFile);
  
      // Create campaign with image URL
      await axios.post("http://localhost:5000/api/campaigns", {
        title,
        description,
        goal,
        imageUrl,
        creatorId,
        createdBy,
      });
  
      toast.success("Campaign submitted for approval.");
      setNewCampaign({
        title: "",
        description: "",
        goal: "",
        imageFile: null,
        imagePreview: "",
      });
  
      fetchCampaigns(); // Refresh list
    } catch (err) {
      console.error("Error creating campaign:", err);
      toast.error("Failed to create campaign.");
    }
  };
  
  const handleDonate = async (campaignId) => {
    console.log("DONATION INPUTS:", donationInputs[campaignId]);
    const { name, amount } = donationInputs[campaignId] || {};
    const parsedAmount = parseFloat(amount);
  
    if (!name?.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Enter valid donor name and amount");
      return;
    }
  
    try {
      const res = await axios.put(
        `http://localhost:5000/api/campaigns/${campaignId}/donate`,
        { name, amount: parsedAmount }
      );
      setCampaigns((prev) =>
        prev.map((c) => (c._id === campaignId ? res.data : c))
      );
      setDonationInputs((prev) => ({
        ...prev,
        [campaignId]: { name: "", amount: "" },
      }));
      toast.success("Thanks for your contribution!");
    } catch (err) {
      console.error(err);
      toast.error("Donation failed.");
    }
  };  

  const handleDeleteCampaign = async (campaignId) => {
    try {
      const userId = localStorage.getItem("userId"); 
  
      await axios.delete(`http://localhost:5000/api/campaigns/${campaignId}`, {
        data: { userId },
      });
      setCampaigns(campaigns.filter((c) => c._id !== campaignId)); 
      // Refresh the campaigns list or update state
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete campaign.");
    }
  };
  
  return (
    <div className="min-h-screen p-6 bg-white max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
        🌍 Eco Crowdfunding
      </h1>

      {/* Create Campaign */}
      <div className="bg-gray-100 p-5 rounded-lg mb-8 shadow">
        <h2 className="text-2xl font-semibold mb-4">Start a Campaign</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Campaign Title"
            value={newCampaign.title}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, title: e.target.value })
            }
            className="w-full p-3 border rounded-md"
          />

          <textarea
            placeholder="Campaign Description"
            value={newCampaign.description}
            onChange={(e) =>
              setNewCampaign({ ...newCampaign, description: e.target.value })
            }
            className="w-full p-3 border rounded-md"
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Goal Amount (₹)
            </label>
            <input
              type="number"
              value={newCampaign.goal}
              min="1"
              placeholder="Enter amount"
              onChange={(e) =>
                setNewCampaign({ ...newCampaign, goal: e.target.value })
              }
              className="w-full p-3 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Campaign Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded-md"
            />
            {newCampaign.imagePreview && (
              <img
                src={newCampaign.imagePreview}
                alt="Preview"
                className="mt-2 w-full max-h-64 object-cover rounded"
              />
            )}
          </div>

          <button
            onClick={handleCreateCampaign}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Create Campaign
          </button>
        </div>
      </div>

      {/* Campaigns */}
      {campaigns.length === 0 ? (
        <p className="text-center text-gray-500">No campaigns yet. Start one today!</p>
      ) : (
        campaigns.map((campaign) => {
          const { id, title, description, goal, raised, donors, imageUrl } = campaign;
          const progress = Math.min((raised / goal) * 100, 100).toFixed(2);
          const isGoalMet = raised >= goal;

          return (
            <div key={id} className="bg-gray-50 border p-4 rounded-lg mb-8 shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-green-700">{title}</h3>
                  <p className="text-gray-600 mb-2">{description}</p>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Campaign"
                      className="w-full max-h-64 object-cover rounded mb-2"
                    />
                  )}
                  <p>
                    <strong>Raised:</strong> ₹{raised.toFixed(2)} / ₹{goal}
                  </p>
                  <div className="w-full bg-gray-300 h-2 rounded mt-1 mb-2">
                    <div
                      className={`h-2 rounded ${isGoalMet ? "bg-green-700" : "bg-green-500"}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2 mb-2">
                  <strong>By:</strong> {campaign.createdBy || "Unknown"}
                  </p>
                  {isGoalMet && (
                    <p className="text-green-700 font-semibold">
                      🎉 Goal Achieved! Thank you for your support.
                    </p>
                  )}
                </div>
                {campaign.creatorId === creatorId && (
  <button onClick={() => handleDeleteCampaign(campaign._id)} className="text-red-600 hover:text-red-800">
    <FaTrash />
  </button>
)}
              </div>
              {/* Donate Form */}
              {!isGoalMet && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
  type="text"
  placeholder="Your Name"
  value={donationInputs[campaign._id]?.name || ""}
  onChange={(e) =>
    setDonationInputs((prev) => ({
      ...prev,
      [campaign._id]: {
        ...prev[campaign._id],
        name: e.target.value,
      },
    }))
  }
  className="p-2 border rounded"
/>

<input
  type="number"
  placeholder="Amount (₹)"
  value={donationInputs[campaign._id]?.amount || ""}
  onChange={(e) =>
    setDonationInputs((prev) => ({
      ...prev,
      [campaign._id]: {
        ...prev[campaign._id],
        amount: e.target.value,
      },
    }))
  }
  className="p-2 border rounded"
/>
                  <button
                    onClick={() => handleDonate(campaign._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center"
                  >
                    <FaDonate className="mr-2" /> Donate
                  </button>
                </div>
              )}

              {/* Donors */}
              {donors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Supporters:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {donors.map((d, i) => (
                      <li key={i}>
                        {d.name} donated ₹{d.amount}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Crowdfunding;
