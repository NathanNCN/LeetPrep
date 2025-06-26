'use client'

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

interface RatingProps {
    heading: string;
    rating: number;
}

export default function Rating(props: RatingProps) {
    const [ratingColor, setRatingColor] = useState("text-red-400");
    const [bgColor, setBgColor] = useState("bg-red-500/20");
    const [borderColor, setBorderColor] = useState("border-red-500/50");
    
    useEffect(() => {
        if (props.rating >= 8) {
            setRatingColor("text-green-400");
            setBgColor("bg-green-500/20");
            setBorderColor("border-green-500/50");
        } else if (props.rating >= 5) {
            setRatingColor("text-yellow-400");
            setBgColor("bg-yellow-500/20");
            setBorderColor("border-yellow-500/50");
        } else {
            setRatingColor("text-red-400");
            setBgColor("bg-red-500/20");
            setBorderColor("border-red-500/50");
        }
    }, [props.rating]);
    
    return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-gray-700 hover:shadow-lg transition-all duration-300">
            <h3 className="text-white text-xl font-bold mb-4 text-center">{props.heading}</h3>
            <div className={`${bgColor} ${borderColor} rounded-lg p-4 border text-center`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className={ratingColor}>
                        <FaStar size={24} />
                    </div>
                    <span className={`${ratingColor} text-3xl font-bold`}>{props.rating}/10</span>
                    <div className={ratingColor}>
                        <FaStar size={24} />
                    </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                            props.rating >= 8 ? 'bg-green-400' : 
                            props.rating >= 5 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${(props.rating / 10) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}