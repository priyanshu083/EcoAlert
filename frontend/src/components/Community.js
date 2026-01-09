import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaComment, FaPlus, FaTrash, FaCheck, FaMapMarkerAlt, FaPaperPlane, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { format } from "timeago.js";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [commentVisibility, setCommentVisibility] = useState({});
  const [mapVisibility, setMapVisibility] = useState({});
  const [filter, setFilter] = useState("all");
  const [newComments, setNewComments] = useState({});
  const [editingComment, setEditingComment] = useState({});
  const [editedCommentText, setEditedCommentText] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [editedPostText, setEditedPostText] = useState({});
  const [imageExpanded, setImageExpanded] = useState({});
  const [editedPostImage, setEditedPostImage] = useState("");

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("username");

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const updatePostStatus = async (postId, status) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${postId}/status`, { status });
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, status: res.data.status } : p))
      );
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };
  
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts${filter !== "all" ? `?type=${filter}` : ""}`);
      setPosts(res.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  };

  const handleDelete = async (postId) => {
    if (!postId) return;
  
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        data: {
          author: userName, 
          isAuthority: role === "authority"
        }
      });
  
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  
  const handleEditPost = (post) => {
    setEditedPostText(typeof post.text === "object" ? post.text.content : post.text);
    setIsEditing(true);
    setEditingPostId(post._id);
    setPostText(post.text || "");
    setImage(post.image || null);
  };

  const handleSavePost = async () => {
    if (!editedPostText.trim()) return;
  
    try {
      await axios.put(`http://localhost:5000/api/posts/${editingPostId}`, {
        text: editedPostText,
        mediaUrl: editedPostImage || null,
        userId,
      });
  
      setIsEditing(false);
      setEditingPostId(null);
      setEditedPostText("");
      setEditedPostImage(null);
      fetchPosts(); 
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };
  
  const handleCancelPostEdit = () => {
    setIsEditing(false);
    setEditingPostId(null);
    setPostText("");
    setImage(null);
  };

  const handleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post._id === postId) {
          const hasLiked = post.likedBy?.includes(userId);
          const updatedLikedBy = hasLiked
            ? post.likedBy.filter((id) => id !== userId)
            : [...(post.likedBy || []), userId];

          return {
            ...post,
            likedBy: updatedLikedBy,
            likes: hasLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );

    try {
      await axios.put(`http://localhost:5000/api/posts/${postId}/like`, { userId });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`, {
        data: { userId },
      });
      fetchPosts();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = (postId, commentIndex, text) => {
    setEditingComment({ postId, commentIndex });
    setEditedCommentText((prev) => ({ ...prev, [`${postId}-${commentIndex}`]: text }));
  };

  const handleSaveComment = async (postId, commentIndex, commentId) => {
    const newText = editedCommentText[`${postId}-${commentIndex}`];
    try {
      await axios.put(`http://localhost:5000/api/posts/${postId}/comment/${commentId}`, {
        text: newText,
        userId,
      });
      setEditingComment({});
      fetchPosts();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment({});
  };

  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  const handleSendComment = async (postId) => {
    const text = newComments[postId]?.trim();
    if (!text) return;

    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
        text,
        userId,
        author: userName,
      });
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleEditImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setEditedPostImage(base64);
    }
  };
  
  const customMarkerIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4 mt-2 relative z-10">
      {role === "authority" && (
        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${filter === "all" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("report")}
            className={`px-3 py-1 rounded ${filter === "report" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            Reports
          </button>
          <button
            onClick={() => setFilter("education")}
            className={`px-3 py-1 rounded ${filter === "education" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            Educational
          </button>
        </div>
      )}
  
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet. Be the first to share something! 🌍</p>
      ) : (
        posts.map((post) => {
          console.log(post.category); 
          const isEditingPost = editingPostId === post._id;
          const showFullImage = imageExpanded[post._id];
          console.log("Avatar for post", post._id, ":", post.userId?.avatar);
  
          return (
            <div key={post._id} className="border-b pb-4">
              {/* Profile */}
              <div className="flex items-center space-x-3">
              <img
  src={post.avatar || "https://ui-avatars.com/api/?name=User"}
  alt="Profile"
  className="w-10 h-10 rounded-full object-cover"
/>

                <div>
                <p className="font-semibold">{post.userId?.username || post.author}</p>
                  <p className="text-xs text-gray-500">
                    {post.createdAt ? format(post.createdAt) : "Just now"}
                  </p>
                </div>
                {post.type === 'report' && post.status && post.userId?.toString() === userId?.toString() && (
  <span
    className={`
      inline-block px-3 py-1 rounded-full text-sm font-semibold
      ${post.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
      ${post.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : ''}
      ${post.status === 'Resolved' ? 'bg-green-100 text-green-800' : ''}
    `}
  >
    {post.status === 'Pending' && '🟡 Pending'}
    {post.status === 'In Progress' && '🔵 In Progress'}
    {post.status === 'Resolved' && '✅ Resolved'}
  </span>
)}
              </div>
  
              {/* Post Content */}
              {isEditingPost ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    className="w-full border rounded p-2"
                    rows="2"
                    value={editedPostText}
                    onChange={(e) => setEditedPostText(e.target.value)}
                  />
  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="mt-2"
                  />
  
                  {editedPostImage && (
                    <img
                      src={editedPostImage}
                      alt="Preview"
                      className="w-full max-h-64 object-cover rounded-lg"
                    />
                  )}
  
                  <div className="flex gap-2 text-sm mt-1">
                    <button onClick={handleSavePost} className="text-green-600 hover:underline">
                      Save
                    </button>
                    <button onClick={handleCancelPostEdit} className="text-red-600 hover:underline">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-gray-800 text-lg">
                    {typeof post.text === "object" ? post.text.content : post.text}
                  </p>
  
                  {post.mediaUrl && (
                    <img
                      src={post.mediaUrl}
                      alt="Post"
                      className={`w-full rounded-lg mt-2 cursor-pointer ${showFullImage ? "max-h-screen" : "max-h-64 object-cover"}`}
                      onClick={() =>
                        setImageExpanded((prev) => ({
                          ...prev,
                          [post._id]: !prev[post._id],
                        }))
                      }
                    />
                  )}
                </>
              )}

        {post.video && (
          <video controls className="w-full rounded-lg mt-2">
            <source src={post.video} type="video/mp4" />
          </video>
        )}

        {/* Map */}
        {mapVisibility[post._id] && post.location?.lat && post.location?.lng && (
          <div className="h-32 sm:h-40 mt-2 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
            <MapContainer
              center={[post.location.lat, post.location.lng]}
              zoom={13}
              scrollWheelZoom={false}
              className="w-full h-full z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[post.location.lat, post.location.lng]} icon={customMarkerIcon}>
                <Popup>Posted from here!</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Action Icons */}
        <div className="flex justify-between items-center mt-2">
          {/* Left side: Like, Comment, Location, (optional Authority check) */}
          <div className="flex items-center space-x-3">
            <button onClick={() => handleLike(post._id)} className="flex items-center space-x-1 hover:text-red-500">
              {post.likedBy?.includes(userId) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              <span>{post.likes ?? 0}</span>
            </button>

            <button
              onClick={() => setCommentVisibility((prev) => ({ ...prev, [post._id]: !prev[post._id] }))}
              className="flex items-center space-x-1 hover:text-blue-500"
            >
              <FaComment />
              <span>{post.comments?.length || 0}</span>
            </button>

            {post.type !== "education" && (
  <button
    onClick={() => setMapVisibility((prev) => ({ ...prev, [post._id]: !prev[post._id] }))}
    className="flex items-center space-x-1 hover:text-purple-600"
    title="View Location"
  >
    <FaMapMarkerAlt />
  </button>
)}

{role === 'authority' && post.type === 'report' && (
  <div className="flex gap-3 mt-3">
    {post.status === 'Pending' && (
      <button
        onClick={() => updatePostStatus(post._id, 'In Progress')}
        className="px-4 py-1 rounded-full bg-blue-100 text-blue-800 font-medium shadow-sm hover:bg-blue-200 transition-all duration-200"
      >
        Take Action
      </button>
    )}
    {post.status === 'In Progress' && (
      <button
        onClick={() => updatePostStatus(post._id, 'Resolved')}
        className="px-4 py-1 rounded-full bg-green-100 text-green-800 font-medium shadow-sm hover:bg-green-200 transition-all duration-200"
      >
        ✅ Mark as Resolved
      </button>
    )}
  </div>
)}
          </div>

          {/* Right side: Edit/Delete */}
          <div className="flex items-center gap-3">
  {role !== "authority" && post.userId?.toString() === userId?.toString() && (
    <button
      onClick={() => handleEditPost(post)}
      className="text-blue-600 hover:scale-110 transition"
      title="Edit"
    >
      <FaEdit />
    </button>
  )}
  {(role === "authority" || post.userId?.toString() === userId?.toString()) && (
    <button
      onClick={() => handleDelete(post._id)}
      className="text-red-600 hover:scale-110 transition"
      title="Delete"
    >
      <FaTrash />
    </button>
  )}
</div>
        </div>

        {/* Comments */}
        {commentVisibility[post._id] && (
          <div className="mt-2 border-t pt-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newComments[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border rounded px-2 py-1"
              />
              <button
                onClick={() => handleSendComment(post._id)}
                className="text-green-600 hover:scale-110"
                title="Send Comment"
              >
                <FaPaperPlane />
              </button>
            </div>

            {post.comments?.map((comment, idx) => {
              const isEditing = editingComment.postId === post._id && editingComment.commentIndex === idx;
              const isOwner = comment.userId?.toString() === userId?.toString();
              return (
                <div key={idx} className="mt-1 text-sm text-gray-700 border-t pt-1 flex justify-between items-start">
                  <div className="w-full">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={editedCommentText[`${post._id}-${idx}`] || ""}
                          onChange={(e) =>
                            setEditedCommentText((prev) => ({
                              ...prev,
                              [`${post._id}-${idx}`]: e.target.value,
                            }))
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                        <div className="flex gap-2 mt-1 text-xs">
                          <button
                            onClick={() => handleSaveComment(post._id, idx, comment._id)}
                            className="text-green-600 hover:underline"
                          >
                            Save
                          </button>
                          <button onClick={handleCancelEdit} className="text-red-600 hover:underline">
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>
                          <span className="font-medium">{comment.author || "User"}:</span> {comment.text}
                        </p>
                        {isOwner && !isEditing && (
                          <div className="flex gap-2 text-xs ml-auto">
                            <button
                              onClick={() => handleEditComment(post._id, idx, comment.text)}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(post._id, comment._id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  })
)}

      {/* Floating Button */}
      {role === "user" && (
        <Link to="/post">
          <button className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition z-50">
            <FaPlus size={24} />
          </button>
        </Link>
      )}
    </div>
  );
}  

export default Community;
