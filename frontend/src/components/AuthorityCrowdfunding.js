import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const AuthorityCrowdfunding = () => {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);

  useEffect(() => {
    fetchPendingCampaigns();
  }, []);

  const fetchPendingCampaigns = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/campaigns/pending");
      setPendingCampaigns(res.data);
    } catch (err) {
      console.error("Error fetching pending campaigns:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/campaigns/${id}/approve`);
      setPendingCampaigns(pendingCampaigns.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error approving campaign:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/campaigns/${id}`);
      setPendingCampaigns(pendingCampaigns.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error rejecting campaign:", err);
    }
  };

  return (
    <div className="px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingCampaigns.length === 0 && (
          <p className="text-gray-500">No pending requests right now.</p>
        )}
        {pendingCampaigns.map((campaign) => {
          const progressPercent = Math.min((campaign.raised / campaign.goal) * 100, 100).toFixed(0);
  
          return (
            <div key={campaign._id} className="bg-white shadow rounded overflow-hidden">
              {campaign.imageUrl && (
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  style={{ width: "100%", height: "240px", objectFit: "cover", borderRadius: "6px" }}
                />
              )}
  
              <div className="p-4">
                <h3 className="text-lg font-semibold">{campaign.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{campaign.description}</p>
  
                <p className="text-gray-500 text-sm mt-2 mb-2">
                  <strong>Submitted by:</strong> {campaign.createdBy || "Unknown"}
                </p>
  
                <div className="mt-4">
                  <p className="text-sm font-medium">Progress</p>
                  <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-green-500 h-4"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ₹{campaign.raised} of ₹{campaign.goal}
                  </p>
                </div>
  
                <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                  <span>{moment(campaign.createdAt).fromNow()}</span>
                </div>
  
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleApprove(campaign._id)}
                    className="bg-green-100 text-green-700 px-4 py-1 rounded hover:bg-green-200"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleReject(campaign._id)}
                    className="bg-red-100 text-red-700 px-4 py-1 rounded hover:bg-red-200"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
};

export default AuthorityCrowdfunding;
