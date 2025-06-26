'use client'
import Questions from "../components/Questions";
import Rating from "../components/Rating";
import { useRouter } from "next/navigation";
import { FaHome, FaTrophy, FaChartBar } from "react-icons/fa";

export default function ResultsPage() {
    const router = useRouter();
    const home = () => {
        router.push("/");
    }
    
    return (
        <div className="flex flex-col items-center text-center min-h-screen px-8 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#0f0f0f] font-sans">
            <div className="w-full max-w-6xl mx-auto mt-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
                        <span className="text-white">Final</span>
                        <span className="text-[#00A8CC]">Results</span>
                    </h1>
                    <button 
                        onClick={home} 
                        className="flex items-center gap-2 mx-auto bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-gray-700 text-[#00A8CC] font-semibold hover:bg-[#00A8CC]/10 transition-all duration-200 shadow-lg"
                    >
                        <FaHome size={20} />
                        Back to Home
                    </button>
                </div>

                {/* Ratings Section */}
                <div className="mb-12">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-2xl">
                        <h2 className="text-white text-3xl font-bold mb-8 flex items-center justify-center gap-3">
                            <div className="text-[#00A8CC]">
                                <FaChartBar size={30} />
                            </div>
                            Performance Summary
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <Rating heading="Overall Rating" rating={6} />
                            <Rating heading="Technical Rating" rating={9} />
                            <Rating heading="Behavioral Rating" rating={2} />
                        </div>
                    </div>
                </div>

                {/* Questions & Feedback Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-2xl">
                    <h2 className="text-white text-3xl font-bold mb-8 flex items-center justify-center gap-3">
                        <div className="text-[#00A8CC]">
                            <FaTrophy size={30} />
                        </div>
                        Questions & Feedback
                    </h2>
                    <div className="space-y-4">
                        <Questions title="What make you want to join us?"/>
                        <Questions title="How would you describe your personality?"/>
                        <Questions title="Two-sum question"/>
                        <Questions title="How to reverse a linked list?"/>
                        <Questions title="When would you use a linked list vs an array?"/>
                    </div>
                </div>
            </div>
        </div>
    )
}