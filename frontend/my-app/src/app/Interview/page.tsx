'use client'
import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-dark.css";
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";

function InterviewPage() {
    const searchParams = useSearchParams();
    const [code, setCode] = useState(`# Write your solution here
def solution():
    pass`);
    
    const difficulty = searchParams.get('diff');
    const length = searchParams.get('length');
    const selectedLangs = searchParams.get('langs')?.split(',') || [];

    
    const router = useRouter()
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#0f0f0f] items-center p-6">
            <div className="w-full max-w-6xl">
                <div className="flex flex-row justify-between w-full">
                    <p className="text-gray-300 text-4xl text-left mb-4">0:00</p>
                    <button onClick={() => {router.push("/")}}className="text-[#00A8CC] text-2xl underline"> Home </button>
                </div>
                
                <div className="text-center mb-8">
                    <h1 className="text-6xl font-bold text-white">Interview</h1>
                </div>
                <div className="mb-8">
                    <h2 className="text-white text-2xl font-bold mb-4">Interview Settings:</h2>
                    <p className="text-gray-300 text-lg">Difficulty: {difficulty}</p>
                    <p className="text-gray-300 text-lg">Length: {length}</p>
                    <p className="text-gray-300 text-lg">Languages: {selectedLangs.join(', ')}</p>
                </div>

                {selectedLangs.length > 0 && (
                    <div className="bg-[#2a2a2a] rounded-lg p-6 border border-gray-600">
                        <h2 className="text-white text-2xl font-bold mb-4">Code Editor</h2>
                        <div className="border-2 border-[#00A8CC] rounded-lg overflow-hidden">
                            <Editor
                                value={code}
                                onValueChange={setCode}
                                highlight={(code) => highlight(code, languages.python, 'python')}
                                padding={16}
                                style={{
                                    fontFamily: '"Fira Code", "Consolas", monospace',
                                    fontSize: 14,
                                    backgroundColor: "#1e1e1e",
                                    color: "#d4d4d4",
                                    minHeight: 400,
                                    outline: "none"
                                }}
                                className="focus:outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InterviewPage; 