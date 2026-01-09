import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import uploadToCloudinary from "../utils/uploadHelper"; 

// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const PostForm = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("report"); // New: post type

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLocation(e.latlng);
      },
    });
    return location ? <Marker position={location} icon={customIcon} /> : null;
  }

  const handlePostSubmit = async () => {
    if (!text.trim()) {
      alert("Post content cannot be empty!");
      return;
    }
    if (type !== "education" && !location) {
      alert("Please select a location before submitting.");
      return;
    }    
    setLoading(true);
    let mediaUrl = "";

    if (media) {
      try {
        console.log("Uploading media:", media);
        mediaUrl = await uploadToCloudinary(media);
        console.log("Uploaded file URL:", mediaUrl);
      } catch (error) {
        console.error("Error uploading media:", error);
        setLoading(false);
        return;
      }
    }

    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    const avatar = localStorage.getItem("avatar");

    const postData = {
      text,
      author: username,
      userId,
      mediaUrl,
      location,
      likes: 0,
      type,
      avatar,
      status : "Pending",

      createdAt: new Date().toISOString(), // ⬅️ Date & Time
    };
    
    try {
      const response = await axios.post("http://localhost:5000/api/posts", postData);
      console.log("Post created:", response.data);
      navigate("/community");
    } catch (error) {
      console.error("Error creating post:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col px-6 py-6">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="self-start mb-4 flex items-center text-gray-600 hover:text-gray-800">
        <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl flex flex-col md:flex-row gap-6 mx-auto">
        {/* Left Section - Text & Media Upload */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Create a Post</h2>

          {/* Text Input */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border p-3 rounded-lg resize-none text-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
          />

          {/* Media Upload */}
          <div className="mt-3">
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md inline-block">
              Upload Media
              <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Media Preview */}
          {preview && media && (
            <div className="mt-3">
              {media.type.startsWith("image") ? (
              <img src={preview} alt="Preview" className="rounded-lg w-full max-w-[200px] max-h-[180px] object-cover shadow-md" />
              ) : (
              <video controls className="rounded-lg w-full max-w-[200px] max-h-[180px] shadow-md">
              <source src={preview} type={media.type} />
              </video>
              )}
           </div>
          )}


          {/* Post Type Selector */}
          <div className="mt-4">
            <label className="block font-medium mb-1 text-gray-700">Post Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="report">Report</option>
              <option value="education">Educational</option>
            </select>
          </div>

          {/* Post Button */}
          <button
            onClick={handlePostSubmit}
            className="bg-green-500 text-white px-5 py-2 mt-4 rounded-md w-full text-base font-semibold hover:bg-green-600 transition duration-200 ease-in-out shadow-md"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>

        {/* Right Section - Map */}
        {type !== "education" && (
  <div className="flex-1">
    <button onClick={getCurrentLocation} className="bg-blue-500 text-white px-3 py-2 rounded-md mb-3 w-full hover:bg-blue-600">
      Use Current Location
    </button>

    <MapContainer center={[20, 78]} zoom={5} style={{ height: "280px", width: "100%" }} className="rounded-lg shadow-md">
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <LocationMarker />
    </MapContainer>
  </div>
)}
      </div>
    </div>
  );
};

export default PostForm;
