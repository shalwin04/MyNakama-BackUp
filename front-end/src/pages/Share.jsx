import React from "react";
import SendIcon from "../images/SendIcon"; // Replace with the correct path to your SendIcon component
import Welcome from "./Welcome";
import MentalHealth from "../gifs/Mentalhealth.gif";


const Share = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-yellow-100 to-orange-200 p-6">
      <div>
        <img src={MentalHealth} alt="Mental Health" className="w-1
        /2 md:w-1/3" />
      </div>
      <Welcome />
      <h1 className="text-6xl font-lora font-thin text-orange-700 mb-4 mt-20">
        How are you feeling today ?
      </h1>
      <div className="relative w-full max-w-2xl mt-16 mb-8">
        <div className="flex border border-gray-400 rounded-full overflow-hidden">
          <input
            type="text"
            className="flex-1 px-4 py-4 bg-white placeholder-gray-500 text-gray-900 focus:outline-none"
            placeholder="Wanna share with us!!"
          />
          <button className="bg-orange-500 text-white px-4 py-2 flex items-center">
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Share;
