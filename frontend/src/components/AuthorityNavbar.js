import { useState } from "react";
import { FaBars, FaTimes, FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthorityNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authorityToken");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/");
    window.dispatchEvent(new Event("storage")); // Sync navbars
  };

  return (
    <nav className="bg-green-600 text-white p-4 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaShieldAlt size={24} className="text-white" />
          <h1 className="text-xl font-bold">EcoAlert</h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-md font-semibold">
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/authority/map">Map</Link>
          </li>
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/community">Manage Community</Link>
          </li>
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/authority/crowdfunding">Crowdfunding Requests</Link>
          </li>
        </ul>

        {/* Logout Button */}
        <div className="hidden md:flex">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden bg-green-700 p-4 text-center space-y-4 text-base">
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/authority/map">Map</Link>
          </li>
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/community">Community</Link>
          </li>
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/authority/reports">Manage Reports</Link>
          </li>
          <li className="hover:text-green-300 cursor-pointer">
            <Link to="/authority/crowdfunding">Crowdfunding</Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default AuthorityNavbar;
