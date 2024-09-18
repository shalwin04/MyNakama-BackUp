import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MyAccount from "./MyAccount";
import Logo from "../images/My-Nakama-Logo.png";

const Blogs = () => {
  // const navigate = useNavigate();
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get("https://my-nakama-backend.onrender.com/api/blogs");
        setContent(response.data);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="h-screen bg-gradient-to-r from-purple-200 via-pink-300 to-red-200 flex flex-col overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center bg-gradient-to-r from-purple-200 via-pink-300 to-red-200 justify-between w-full p-2 shadow-md">
        <div className="flex items-center pl-8">
          <img src={Logo} alt="Logo" className="h-12 mr-2" />
          <h1 className="text-2xl font-playfair font-bold text-gray-800">
            My Nakama
          </h1>
        </div>
        <div className="flex items-center space-x-8 pr-16">
          <nav className="flex items-center space-x-8">
            <Link
              to="/chat"
              className="nav-link text-lg font-lora text-gray-800 hover:text-gray-900"
            >
              Chat
            </Link>
            <Link
              to="/journal"
              className="nav-link text-lg font-lora text-gray-800 hover:text-gray-800"
            >
              Journal
            </Link>
          </nav>
          <MyAccount />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto pt-20 scrollbar-hide p-8">
        <h2 className="text-5xl font-playfair text-espresso italic mt-8 mb-10">Blogs</h2>
        <div className="relative font-libre-baskerville tracking-wider italic text-2xl mb-6 pl-8">
  <span className="absolute -left-4 top-1 text-7xl text-black-400">“</span><br/>
  Your story is unique, and so is your journey to wellness.<br/> Every story matters.
</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 mb-10 gap-10">
          {content.map((item) => (
            <div
              key={item.url}
              className="bg-white card glass rounded-lg shadow-lg overflow-hidden"
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              </a>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
                <span className="text-blue-500">{item.type === 'video' ? 'Video' : 'Article'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
