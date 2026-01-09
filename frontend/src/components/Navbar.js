import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu } from "@headlessui/react";
import axios from "axios";
import uploadToCloudinary from "../utils/uploadHelper"; 

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState(username);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const syncAuthState = () => {
      const token = localStorage.getItem("token");
      const storedUsername = localStorage.getItem("username");
      setIsAuthenticated(!!token);
      if (storedUsername) setUsername(storedUsername);
    };    

    syncAuthState();

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
    };
  }, []);

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-green-600 text-white p-4 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">EcoAlert</h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-10 text-md font-semibold">
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/community">Community</Link>
          </li>
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/crowdfunding">Crowdfunding</Link>
          </li>
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/map">Map</Link>
          </li>
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
        {isAuthenticated && (
  <Menu as="div" className="relative">
    <Menu.Button className="flex items-center gap-2 bg-white text-green-700 px-3 py-1 rounded-full">
      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
        {username?.charAt(0).toUpperCase()}
      </div>
      <span className="hidden sm:inline text-sm font-medium">{username}</span>
    </Menu.Button>
    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      <div className="px-2 py-2">
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? "bg-green-100" : ""
              } w-full text-left px-4 py-2 text-sm text-green-700`}
              onClick={() => setShowProfileModal(true)}
            >
              Edit Profile
            </button>
          )}
        </Menu.Item>
      </div>
    </Menu.Items>
  </Menu>
)}

  {isAuthenticated ? (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600"
    >
      Logout
    </button>
  ) : (
    <button
      onClick={handleLogin}
      className="bg-white text-green-600 px-4 py-2 rounded-full font-bold hover:bg-green-200"
    >
      Login
    </button>
  )}
</div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden bg-green-700 p-4 text-center space-y-4">
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/community">Community</Link>
          </li>
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/crowdfunding">Crowdfunding</Link>
          </li>
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/map">Map</Link>
          </li>
          <li>
          {isAuthenticated && (
  <div className="flex justify-center items-center gap-2 bg-white text-green-700 px-3 py-2 rounded-full">
    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
      {username?.charAt(0).toUpperCase()}
    </div>
    <span className="text-sm font-medium">{username}</span>
  </div>
)}
          </li>
        </ul>
      )}

{showProfileModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        onClick={() => setShowProfileModal(false)}
      >
        &times;
      </button>
      <h2 className="text-xl font-semibold mb-4 text-green-700">Edit Profile</h2>

      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();        
        
          try {
            let avatarUrl = avatarPreview; 
            if (avatarFile) {
              avatarUrl = await uploadToCloudinary(avatarFile);
              console.log("Cloudinary URL returned:", avatarUrl); 
            }            
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
        
            const response = await axios.put(
              `http://localhost:5000/api/users/${userId}`,
              {
                username: newUsername.trim(),
                avatar: avatarUrl,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
        
            // Update UI and localStorage
            setUsername(newUsername.trim());
            localStorage.setItem("username", newUsername.trim());
            localStorage.setItem("avatar", avatarUrl);
        
            toast.success("Profile updated successfully");
            setShowProfileModal(false);
          } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Failed to update profile");
          }
        }}                  
      >
        <div className="flex justify-center">
          <label htmlFor="avatarUpload" className="cursor-pointer relative">
            <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                newUsername?.charAt(0).toUpperCase()
              )}
            </div>
            <input
  type="file"
  accept="image/*"
  id="avatarUpload"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }}
/>
            <span className="absolute bottom-0 right-0 bg-white text-green-700 text-xs px-1 rounded-full border">
              ✎
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            className="mt-1 text-black block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  </div>
)}
    </nav>
  );
};

export default Navbar;
