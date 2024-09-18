import React, { useState, useEffect, useRef } from "react";
import MyAccount from "./MyAccount";
import axios from "axios";
import SendIcon from "../images/SendIcon";
import Logo from "../images/My-Nakama-Logo.png"; // Your logo image
import ListenerImg from "../images/ChatListener.png"; // Listener image
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChatInterface = () => {
  const userId = useSelector((state) => state.user.userId);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading state
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const generateRandomShapes = (numShapes) => {
    const shapes = [];
    for (let i = 0; i < numShapes; i++) {
      const width = Math.random() * 100 + 50; // Random width between 50px and 150px
      const height = Math.random() * 100 + 50; // Random height between 50px and 150px
      const top = Math.random() * 100; // Random top position between 0% and 100%
      const left = Math.random() * 100; // Random left position between 0% and 100%
      const background = `linear-gradient(${Math.random() * 360}deg, hsl(${Math.random() * 360}, 70%, 80%), hsl(${Math.random() * 360}, 70%, 80%))`;

      shapes.push({ width, height, top, left, background });
    }
    return shapes;
  };

  const shapes = generateRandomShapes(10);

//   const generateRandomCircles = (numCircles) => {
//   const circles = [];
//   for (let i = 0; i < numCircles; i++) {
//     const size = Math.random() * 100 + 50; // Random size between 50px and 150px
//     const top = Math.random() * 100; // Random top position between 0% and 100%
//     const left = Math.random() * 100; // Random left position between 0% and 100%
//     // const color = `hsl(${Math.random() * 360}, 70%, 80%)`; // Random color

//     circles.push({ size, top, left });
//   }
//   return circles;
// };

// const circles = generateRandomCircles(20);

  const sendMessage = async () => {
    if (!message.trim()) return;

    console.log("User ID", userId);

    const userMessage = { text: message, isUser: true };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    setLoading(true); // Set loading state while waiting for response

    try {
      const response = await axios.post("https://my-nakama-backend.onrender.com/api/converse", {
        message,
      });

      const therapistMessage = { text: response.data.result, isUser: false };
      setChatMessages((prevMessages) => [...prevMessages, therapistMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setLoading(false); // Reset loading state
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    // Focus on input field when component mounts or chatMessages update
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatMessages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-purple-200 via-pink-300 to-red-200 items-center relative overflow-hidden">
      {/* Header with Logo and Account Menu */}
      {/* {circles.map((circle, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-sun-overdose opacity-50"
          style={{
            width: circle.size,
            height: circle.size,
            top: `${circle.top}%`,
            left: `${circle.left}%`,
            // backgroundColor: circle.color,
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      ))} */}

      {shapes.map((shape, index) => (
        <div
          key={index}
          className="absolute opacity-50"
          style={{
            width: shape.width,
            height: shape.height,
            top: `${shape.top}%`,
            left: `${shape.left}%`,
            background: shape.background,
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      ))}

      <header className="flex items-center justify-between w-full p-2 shadow-md">
        {/* Logo */}
        <div className="flex items-center pl-8">
          <img src={Logo} alt="My-Nakama Logo" className="h-12 mr-2" />
          <h1 className="text-2xl font-playfair font-bold text-gray-800">
            My Nakama
          </h1>
        </div>
        {/* My Account Menu */}
        <div className="flex items-center space-x-8 pr-16">
          <nav className="flex items-center space-x-8">
            <Link
              to="/journal"
              className="nav-link text-lg font-lora text-gray-600 hover:text-gray-800"
            >
              Journal
            </Link>
            <Link
              to="/blogs"
              className="nav-link text-lg font-lora text-gray-600 hover:text-gray-800"
            >
              Blogs
            </Link>
          </nav>
          <MyAccount />
        </div>
      </header>

      {/* <div className="flex w-full flex justify-center">
        <div className="object-cover top-0 w-64 h-32 bg-blue-600 rounded-b-full"></div>
      </div> */}
      
      {/* Listener Image */}
      <div className="flex justify-center">
         <img src={ListenerImg} alt="Listener" className="object-cover w-1/4" /> 
         {/* <h1 className="object-cover font-playfair italic text-3xl mt-9">Hey, You're heard!!</h1> */}
        {/* <div className="absolute top-0 bg-radial-bluered left-1/2 transform -translate-x-1/2 w-64 h-32 bg-blue-600 rounded-b-full"></div> */}
      </div>

      {/* Chat Window */}
      <div className="w-full max-w-md flex flex-col overflow-hidden mb-20">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 scrollbar-hide"
          style={{ maxHeight: "calc(100vh - 240px)" }}
        >
          {/* Chat Messages */}
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`chat ${
                message.isUser ? "chat-end" : "chat-start"
              } mb-4`}
            >
              <div
                className={`chat-bubble ${
                  message.isUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center">
              <div className="loading loading-ring loading-xs bg-blue-500"></div>
              <div className="loading loading-ring loading-sm bg-blue-500"></div>
              <div className="loading loading-ring loading-md bg-blue-500"></div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="w-full fixed bottom-0">
        <div className="max-w-md mx-auto p-4 flex justify-center">
          <div className="flex relative w-full">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-3 bg-white placeholder-gray-500 text-gray-900 focus:outline-none border border-gray-300 rounded-l-full rounded-r-none"
              placeholder="Type your message here..."
            />
            <button
              className="bg-blue-500 text-white px-4 py-3 flex items-center border border-gray-300 rounded-l-none rounded-r-full"
              onClick={sendMessage}
            >
              <SendIcon className="w-4 h-4 mr-2" />
              Send
            </button>
          </div>
        </div>
      </div>
      {/* <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#f2e03f] to-[ #e24125] opacity-200"
        />
      </div> */}
    </div>
  );
};

export default ChatInterface;
