import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserId } from "../redux/userSlice";
import LoginImg from "../images/LoginImg.png";
import Logo from "../images/My-Nakama-Logo.png";

const LoginForm = ({ toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleClick = () => {
    navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://my-nakama-backend.onrender.com/api/login", {
        email,
        password,
      });

      const { userId } = response.data;

      if (userId) {
        dispatch(setUserId(userId));
        setSuccessMessage("Login successful!");
        console.log("User ID in Journal:", userId);
        setErrorMessage("");
        navigate("/chat");
      } else {
        setErrorMessage("Login failed, userId not received");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Invalid email or password");
      setSuccessMessage("");
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
          <Link to="/signup" className="nav-link text-lg font-lora text-gray-800 hover:text-gray-900">Sign Up</Link>
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
          <div className="w-full max-w-md bg-citrine-white rounded-lg p-8">
            <h1 className="text-5xl font-playfair italic text-espresso mb-6">
              Login
            </h1>
            <p className="font-libre-baskerville mb-6">
              Welcome back, it's good to see you again
            </p>
            <form onSubmit={handleLogin}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border-b-2 bg-citrine-white border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            </form>
            {errorMessage && (
              <p className="mt-4 text-center text-red-500">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="mt-4 text-center text-green-500">
                {successMessage}
              </p>
            )}
            <p className="mt-4 text-center text-espresso">
              Don't have an account?{" "}
              <button
                onClick={handleSignup}
                className="text-blue-500 hover:underline"
              >
                Sign Up
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

export default LoginForm;
