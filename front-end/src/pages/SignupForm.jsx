import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginImg from "../images/LoginImg.png";
import Logo from "../images/My-Nakama-Logo.png";
import axios from "axios";
// import SignupSuccess from "./SignupSuccess";

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    location: "",
    concerns: "",
    treatmentHistory: "",
    emergencyContact: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("https://my-nakama-backend.onrender.com/api/signup", {
        formData,
      });
      navigate("/signupsuccess");
      // alert("Sign up successful. Check your mail for confirmation link");
      // navigate("/login");
      // Handle successful sign up (e.g., redirect to login page)
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.error("Error signing up:", error);
      alert("Sign up failed. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-citrine-white overflow-hidden">
      <header className="flex items-center justify-between w-full p-4 bg-citrine-white shadow-md">
        <div className="flex items-center pl-8">
          <img
            src={Logo}
            alt="Logo"
            className="h-12 mr-2"
            onClick={handleClick}
          />
          <h1 className="text-2xl font-playfair font-bold text-gray-800">
            My Nakama
          </h1>
        </div>
        <nav className="flex items-center space-x-8 pr-16">
          <Link to="/login" className="nav-link text-lg font-lora text-gray-800 hover:text-gray-900">Login</Link>
          <Link
            to="/blogs"
            className="nav-link text-lg font-lora text-gray-600 hover:text-gray-800"
          >
            Blogs
          </Link>
        </nav>
      </header>
      <div className="flex h-screen bg-citrine-white">
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full p-4 overflow-y-scroll h-3/4 scrollbar-hide">
            <h1 className="text-5xl font-playfair italic text-espresso mb-6">
              Sign Up
            </h1>
            <p className="font-libre-baskerville mb-6">
              Join us, it's quick and easy
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-espresso font-lora font-bold mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-espresso font-lora font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-espresso font-lora font-bold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirm-password"
                  className="block text-espresso font-lora font-bold mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="age"
                  className="block text-espresso font-lora font-bold mb-2"
                >
                  Age
                </label>
                <input
                  type="text"
                  id="age"
                  placeholder="Age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-espresso font-lora font-bold mb-2">
                  Gender
                </label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    className="mr-2"
                    required
                  />
                  <label htmlFor="male" className="mr-4">
                    Male
                  </label>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    className="mr-2"
                    required
                  />
                  <label htmlFor="female" className="mr-4">
                    Female
                  </label>
                  <input
                    type="radio"
                    id="other"
                    name="gender"
                    value="other"
                    checked={formData.gender === "other"}
                    onChange={handleChange}
                    className="mr-2"
                    required
                  />
                  <label htmlFor="other">Other</label>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="location"
                  className="block text-espresso font-lora font-bold mb-2"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  placeholder="Location (Country/City)"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="concerns"
                  className="block text-espresso font-lora font-bold mb-2"
                >
                  Mental Health Concerns
                </label>
                <textarea
                  id="concerns"
                  placeholder="Specify 'none' if there's not any"
                  name="concerns"
                  value={formData.concerns}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="treatment-history"
                  className="block text-espresso font-lora font-bold mb-2"
                >
                  Treatment History
                </label>
                <textarea
                  id="treatment-history"
                  placeholder="Specify 'none' if there's not any"
                  name="treatmentHistory"
                  value={formData.treatmentHistory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="emergency-contact"
                  className="block text-espresso font-lora font-bold mb-2"
                >
                  Emergency Contact
                </label>
                <input
                  type="email"
                  id="emergency-contact"
                  placeholder="Emergency Contact (email)"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </form>
            <p className="mt-4 text-center text-espresso">
              Already have an account?{" "}
              <button
                onClick={handleLogin}
                className="text-blue-500 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center p-8">
            <img
              src={LoginImg}
              alt="Login illustration"
              className="w-full max-w-md"
            />
          </div>
      </div>
    </div>
  );
};

export default SignupForm;
