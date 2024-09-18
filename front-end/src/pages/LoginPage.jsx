import React, { useState } from "react";
import LoginImg from "../images/LoginImg.png";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Logo from "../images/My-Nakama-Logo.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="h-screen bg-citrine-white">
      <header className="flex items-center justify-between w-full p-4 bg-citrine-white shadow-md">
        <div className="flex items-center pl-8">
          <img
            src={Logo}
            alt="Logo"
            className="h-12 mr-2"
            onClick={handleClick}
          />
          <h1 className="text-2xl font-playfair font-bold text-gray-800">
            My-Nakama
          </h1>
        </div>
        <nav className="flex items-center space-x-8 pr-16">
          <a
            href="/blogs"
            className="nav-link text-lg font-lora text-gray-600 hover:text-gray-800"
          >
            Blogs
          </a>
        </nav>
      </header>

      <div className="flex h-screen bg-citrine-white">
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-citrine-white rounded-lg p-8">
            {isLogin ? (
              <LoginForm toggleForm={toggleForm} />
            ) : (
              <SignupForm toggleForm={toggleForm} />
            )}
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

export default LoginPage;
