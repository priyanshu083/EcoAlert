import axios from "axios";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("http://localhost:5000/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.secure_url; 
  } catch (error) {
    console.error("Backend Cloudinary upload failed:", error);
    throw error;
  }
};


export default uploadToCloudinary;
