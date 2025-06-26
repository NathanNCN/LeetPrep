import Userinputs from "./components/Userinputs";
import { useState } from "react";
import { FaRocket, FaCode, FaBrain } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center min-h-screen px-8 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#0f0f0f] font-sans">
      {/* Hero Section */}
      <div className="w-full max-w-6xl mx-auto mt-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-4">
            <span className="text-white">Leet</span>
            <span className="text-[#00A8CC]">Prep</span>
          </h1>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-lg">
            <p className="text-gray-200 text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto">
              LeetPrep bridges the gap between you and interviews by offering
              an interactive platform. Powered by AI, it delivers
              personalized coding, technical, and behavioral questions tailored to your preferred 
              languages and difficulty level. Whether you're aiming for junior roles or FAANG-level 
              challenges. After each session, LeetPrep provides smart feedback and targeted resources 
              to help you improve where it matters most.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-[#00A8CC] text-4xl mb-4 flex justify-center">
              <FaRocket size={40} />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">AI-Powered</h3>
            <p className="text-gray-300">Personalized questions based on your skills and preferences</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-[#00A8CC] text-4xl mb-4 flex justify-center">
              <FaCode size={40} />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Multi-Language</h3>
            <p className="text-gray-300">Support for Python, JavaScript, Java, C++, and more</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-[#00A8CC] text-4xl mb-4 flex justify-center">
              <FaBrain size={40} />
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Smart Feedback</h3>
            <p className="text-gray-300">Detailed analysis and improvement suggestions</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-4xl mx-auto">
        <Userinputs />
      </div>
    </div>
  );
}
