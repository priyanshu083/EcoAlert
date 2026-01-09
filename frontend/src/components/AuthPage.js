import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaUser, FaShieldAlt } from "react-icons/fa";  

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user"); 
  const [passwordError, setPasswordError] = useState(""); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    console.log("Signup data:", {
      username,
      password,
      role,
      name: formData.get("name"),
      email: formData.get("email")
    });    
  
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    } else {
      setPasswordError("");
    }
  
    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    console.log("Sending login/signup request with:", { username, password });
  
    try {
      const requestData = isLogin
        ? { username, password }
        : {
            username,
            password,
            role,
            name: formData.get("name"),
            email: formData.get("email")
          };
  
      const response = await axios.post(
        isLogin
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/signup",
        requestData
      );
  
      if (isLogin) {
        const { token, role: userRole } = response.data;
  
        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("username", username);
        localStorage.setItem("userId", response.data.user._id);
  
        toast.success("Login successful");
  
        if (userRole === "user") {
          navigate("/");
        } else {
          navigate("/authority-dashboard");
        }
  
        window.dispatchEvent(new Event("storage"));
      } else {
        toast.success("Signup successful. Please login.");
        setIsLogin(true); 
      }
  
    }  catch (error) {
      console.error("Auth failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-white text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-black">
        
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold text-center mb-6">
            {isLogin ? "Login to EcoAlert" : "Sign Up for EcoAlert"}
          </h2>

          <div className="flex justify-between mb-6">
            <div 
              className={`flex flex-col items-center justify-center w-1/2 p-4 border rounded-lg cursor-pointer transition-all ${
                role === "user" ? "bg-green-100 border-green-500 shadow-md" : "border-gray-300"
              } hover:shadow-lg`}
              onClick={() => setRole("user")}
            >
              <FaUser className="text-3xl text-green-600 mb-2" />
              <p className="text-sm font-semibold">Citizen</p>
            </div>

            <div 
              className={`flex flex-col items-center justify-center w-1/2 p-4 border rounded-lg cursor-pointer transition-all ${
                role === "authority" ? "bg-green-100 border-green-500 shadow-md" : "border-gray-300"
              } hover:shadow-lg`}
              onClick={() => setRole("authority")}
            >
              <FaShieldAlt className="text-3xl text-blue-600 mb-2" />
              <p className="text-sm font-semibold">Authority</p>
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="w-full p-2 mt-2 border rounded-md" 
                  required 
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="w-full p-2 mt-2 border rounded-md" 
                  required 
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              className="w-full p-2 mt-2 border rounded-md" 
              required 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="w-full p-2 mt-2 border rounded-md" 
              required 
            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>} {/* Display error message */}
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                className="w-full p-2 mt-2 border rounded-md" 
                required 
              />
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-2 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p className="text-center mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-green-600 font-semibold hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
