'use client';
import React, { useState, useRef } from 'react';
import { FaChevronDown, FaChevronUp, FaClock, FaStar, FaExternalLinkAlt } from "react-icons/fa";

interface AccordionProps {
  title: string;
}

function Question(props: any) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300">
      <button 
        className="w-full flex justify-between items-center p-6 text-left text-white font-semibold focus:outline-none hover:bg-white/5 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{props.title}</span>
        <div className="text-[#00A8CC] transform transition-transform duration-300">
          {isOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 text-left text-gray-300 space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border border-gray-600">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <div className="text-[#00A8CC]">
                <FaStar size={16} />
              </div>
              Answer
            </h4>
            <p className="text-gray-300">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 border border-gray-600">
            <h4 className="text-white font-semibold mb-2">Feedback</h4>
            <p className="text-gray-300">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-gray-600">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <div className="text-[#00A8CC]">
                  <FaStar size={16} />
                </div>
                Score
              </h4>
              <p className="text-[#00A8CC] font-bold text-xl">10/10</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-gray-600">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <div className="text-[#00A8CC]">
                  <FaClock size={16} />
                </div>
                Time
              </h4>
              <p className="text-gray-300">10 seconds</p>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 border border-gray-600">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <div className="text-[#00A8CC]">
                <FaExternalLinkAlt size={16} />
              </div>
              Resources
            </h4>
            <a 
              href="https://www.google.com" 
              className="text-[#00A8CC] hover:text-[#00C4E0] underline transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More About This Topic
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Question;