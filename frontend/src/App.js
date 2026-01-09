import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "animate.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import AuthPage from "./components/AuthPage";
import PollutionMap from "./components/PollutionMap";
import Community from "./components/Community";
import Crowdfunding from "./components/Crowdfunding";
import PostForm from "./components/PostForm";
import AuthorityNavbar from "./components/AuthorityNavbar";
import AuthorityMap from "./components/AuthorityMap";
import AuthorityCrowdfunding from "./components/AuthorityCrowdfunding";

const ProtectedRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/auth" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" />;

  return element;
};

const App = () => {
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const syncRole = () => {
      setRole(localStorage.getItem("role"));
    };

    syncRole();

    window.addEventListener("storage", syncRole);
    window.addEventListener("focus", syncRole);

    return () => {
      window.removeEventListener("storage", syncRole);
      window.removeEventListener("focus", syncRole);
    };
  }, []);

  return (
    <Router>
      {role === "authority" ? <AuthorityNavbar /> : <Navbar />}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* ✅ Protected Routes (User) */}
          <Route path="/map" element={<ProtectedRoute element={<PollutionMap />} requiredRole="user" />} />
          <Route path="/community" element={<ProtectedRoute element={<Community />} requiredRoles={["user", "authority"]} />} />
          <Route path="/crowdfunding" element={<ProtectedRoute element={<Crowdfunding />} requiredRole="user" />} />
          <Route path="/post" element={<ProtectedRoute element={<PostForm />} requiredRole="user" />} />
          <Route path="/user-dashboard" element={<ProtectedRoute element={<LandingPage />} requiredRole="user" />} />

          <Route path="/authority/map" element={<ProtectedRoute element={<AuthorityMap />} requiredRole="authority" />} />
          <Route path="/authority/crowdfunding" element={<ProtectedRoute element={<AuthorityCrowdfunding />} requiredRole="authority" />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
