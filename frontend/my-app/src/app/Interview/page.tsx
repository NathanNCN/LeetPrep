'use client'
import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-dark.css";
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";
import { FaHome, FaClock } from "react-icons/fa";

function InterviewPage() {
    const searchParams = useSearchParams();
    const [code, setCode] = useState(`# Write your solution here
def solution():
    pass`);
    
    const difficulty = searchParams.get('diff');
    const length = searchParams.get('length');
    const selectedLangs = searchParams.get('langs')?.split(',') || [];


    const [questions, setQuestions] = useState<string[]>([]);

    // Send the Interivew parameters to API
    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await fetch(`http://localhost:8080/getInterview`, {
                method: 'POST',
                body: JSON.stringify({length: length, level: difficulty, language: selectedLangs}),
            }); 
            const data = await response.json();
            setQuestions(data);
            console.log(data);
        };
        fetchQuestions();
    }, []);
    

    
    const router = useRouter()

    const getResults = () => {
        router.push("/Results")
    }


    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#0f0f0f] items-center p-6 font-sans">
            <div className="w-full max-w-4xl mx-auto mt-10">
                {/* Header: Timer & Home */}
                <div className="flex flex-row justify-between items-center w-full mb-8">
                    <div className="flex items-center gap-2 text-gray-300 text-2xl bg-white/5 backdrop-blur-md px-4 py-2 rounded-full shadow-md">
                        <div className="text-[#00A8CC]">
                            <FaClock size={20} />
                        </div>
                        <span>0:00</span>
                    </div>
                    <button onClick={() => {router.push("/")}} className="flex items-center gap-2 text-[#00A8CC] text-xl font-semibold bg-white/5 backdrop-blur-md px-4 py-2 rounded-full shadow-md hover:bg-[#00A8CC]/10 transition">
                        <FaHome size={20} /> Home
                    </button>
                </div>

                {/* Interview Title */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight">Interview</h1>
                </div>

                {/* Settings Card */}
                <div className="mb-10">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-lg flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex-1">
                            <h2 className="text-white text-2xl font-bold mb-2 flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-[#00A8CC] rounded-full mr-2" />Interview Settings
                            </h2>
                            <div className="flex flex-col md:flex-row gap-4 text-gray-300 text-lg">
                                <span><span className="font-semibold text-white">Difficulty:</span> {difficulty}</span>
                                <span><span className="font-semibold text-white">Length:</span> {length}</span>
                                <span><span className="font-semibold text-white">Languages:</span> {selectedLangs.join(', ')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code Editor Card */}
                {selectedLangs.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-0 border border-gray-700 shadow-2xl overflow-hidden">
                        {/* Editor Header */}
                        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-[#232526] to-[#1a1a1a] border-b border-gray-700">
                            <h2 className="text-white text-xl font-bold">Code Editor</h2>
                            <span className="text-[#00A8CC] text-sm font-mono">Python</span>
                        </div>
                        <div className="p-6">
                            <div className="border-2 border-[#00A8CC] rounded-lg overflow-hidden shadow-inner">
                                <Editor
                                    value={code}
                                    onValueChange={setCode}
                                    highlight={(code) => highlight(code, languages.python, 'python')}
                                    padding={16}
                                    style={{
                                        fontFamily: '"Fira Code", "Consolas", monospace',
                                        fontSize: 15,
                                        backgroundColor: "#1e1e1e",
                                        color: "#d4d4d4",
                                        minHeight: 400,
                                        outline: "none"
                                    }}
                                    className="focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Get Results Button */}
                <div className="flex justify-center mt-12">
                    <button
                        onClick={getResults}
                        className="bg-gradient-to-r from-[#00A8CC] to-[#007EA7] text-white px-16 py-5 rounded-xl font-bold text-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A8CC]"
                    >
                        Get Results
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InterviewPage; 