import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Logo from "../images/My-Nakama-Logo.png";
import ProfileIllustration from "../images/profile-page-illustration.png";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userId);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    age: "",
    gender: "",
    location: "",
    concerns: "",
    treatment_history: "",
    emergency_contact: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log("isEditing state:", isEditing); // Check state here
    const fetchProfile = async () => {
      if (userId) {
        try {
          const response = await axios.get(`https://my-nakama-backend.onrender.com/api/profile/${userId}`);
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, [userId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    console.log("Edit button clicked"); // Check if this logs
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`https://my-nakama-backend.onrender.com/api/profile/${userId}`, formData);
      alert("Profile updated successfully");
      setIsEditing(false); // Set isEditing to false to disable editing mode
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Profile update failed. Please try again.");
    }
  };

  const handleChat = () => navigate("/chat");
  const handleJournal = () => navigate("/journal");
  const handleBlogs = () => navigate("/blogs");

  return (
    <div className="h-screen bg-citrine-white overflow-hidden">
      <header className="flex items-center justify-between w-full p-4 bg-citrine-white shadow-md">
        <div className="flex items-center pl-8">
          <img src={Logo} alt="Logo" className="h-12 mr-2" />
          <h1 className="text-2xl font-playfair font-bold text-gray-800">My Nakama</h1>
        </div>
        <nav className="flex items-center space-x-8 pr-16">
          <button onClick={handleChat} className="nav-link text-lg font-lora text-gray-800 hover:text-gray-900">
            Chat
          </button>
          <button onClick={handleJournal} className="nav-link text-lg font-lora text-gray-800 hover:text-gray-900">
            Journal
          </button>
          <button onClick={handleBlogs} className="nav-link text-lg font-lora text-gray-800 hover:text-gray-900">
            Blogs
          </button>
        </nav>
      </header>
      <div className="flex h-screen bg-citrine-white">
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full p-4 overflow-y-scroll h-3/4 scrollbar-hide">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-5xl font-playfair italic text-espresso">Profile</h1>
              <button
                type="button"
                onClick={handleEdit}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Edit Profile
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-espresso font-lora font-bold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-espresso font-lora font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  disabled={!isEditing}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="age" className="block text-espresso font-lora font-bold mb-2">
                  Age
                </label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-espresso font-lora font-bold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="concerns" className="block text-espresso font-lora font-bold mb-2">
                  Mental Health Concerns (Optional)
                </label>
                <textarea
                  id="concerns"
                  name="concerns"
                  value={formData.concerns}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  disabled={!isEditing}
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="treatment_history" className="block text-espresso font-lora font-bold mb-2">
                  Treatment History (Optional)
                </label>
                <textarea
                  id="treatment_history"
                  name="treatment_history"
                  value={formData.treatment_history}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  disabled={!isEditing}
                ></textarea>
              </div>
              <div className="mb-6">
                <label htmlFor="emergency_contact" className="block text-espresso font-lora font-bold mb-2">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  id="emergency_contact"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  disabled={!isEditing}
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isEditing}
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center p-8">
          <img
            src={ProfileIllustration}
            alt="Profile illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
