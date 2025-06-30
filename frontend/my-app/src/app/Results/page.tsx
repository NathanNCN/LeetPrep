'use client'
import Questions from "../components/Questions";
import Rating from "../components/Rating";
import { useRouter, useSearchParams } from "next/navigation";
import { FaHome, FaTrophy, FaChartBar } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function ResultsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [questions, setQuestions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    useEffect(() => {
        // Get questions and answers from URL parameters
        const questionsParam = searchParams.get('questions');
        const answersParam = searchParams.get('answers');
        
        if (questionsParam && answersParam) {
            try {
                const decodedQuestions = JSON.parse(decodeURIComponent(questionsParam));
                const decodedAnswers = JSON.parse(decodeURIComponent(answersParam));
                
                setQuestions(decodedQuestions);
                setAnswers(decodedAnswers);
                
                // Call API to get results
                fetchResults(decodedQuestions, decodedAnswers);
            } catch (err) {
                console.error('Error parsing URL parameters:', err);
                setError(true);
                setLoading(false);
            }
        } else {
            setError(true);
            setLoading(false);
        }
    }, [searchParams]);
    
    const fetchResults = async (questions: string[], answers: string[]) => {
        try {
            const requestBody = { questions, answers };
            console.log('Request body:', requestBody);
            
            const response = await fetch(`http://localhost:8081/getResults`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            
            const data = await response.json();
            console.log('Raw response:', data.results);
            
            if (data.results) {
                try {
                    // Clean the response more thoroughly
                    let cleanedResponse = data.results;
                    
                    // Remove code block markers if present
                    cleanedResponse = cleanedResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '');
                    
                    // Remove actual control characters (not escaped ones)
                    cleanedResponse = cleanedResponse.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
                    
                    console.log('Cleaned response:', cleanedResponse);
                    
                    // Try to parse the cleaned response
                    const parsed = JSON.parse(cleanedResponse);
                    setResults(parsed);
                } catch (parseError) {
                    console.error('JSON parsing error:', parseError);
                    console.error('Problematic JSON string around position 262:');
                    console.error('Context:', data.results.substring(240, 300));
                    
                    // Try alternative parsing approach - be more aggressive with cleaning
                    try {
                        const aggressiveClean = data.results
                            .replace(/^```json\n?/, '').replace(/\n?```$/, '') // Remove code blocks
                            .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ') // Replace control chars with spaces
                            .replace(/\s+/g, ' ') // Normalize whitespace
                            .replace(/,\s*}/g, '}') // Remove trailing commas
                            .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
                            .trim();
                        
                        console.log('Aggressively cleaned response:', aggressiveClean);
                        const parsed = JSON.parse(aggressiveClean);
                        setResults(parsed);
                    } catch (secondParseError) {
                        console.error('Second parsing attempt failed:', secondParseError);
                        console.error('Final cleaned string:', data.results.replace(/[\u0000-\u001F\u007F-\u009F]/g, '•'));
                        setError(true);
                    }
                }
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Error fetching results:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    
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

                {/* Loading State */}
                {loading && (
                    <div className="text-center my-12">
                        <div className="text-white text-xl">Analyzing your interview performance...</div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center my-12">
                        <div className="text-red-400 text-xl">Failed to load results. Please try again.</div>
                    </div>
                )}

                {/* Results Display */}
                {!loading && !error && results && (
                    <>
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
                                    <Rating heading="Overall Rating" rating={results[results.length - 1][0]} />
                                    <Rating heading="Technical Rating" rating={results[results.length - 1][1]} />
                                    <Rating heading="Behavioral Rating" rating={results[results.length - 1][2]} />
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
                                {results.slice(0, results.length - 2).map((result: string[], index: number) => (
                                    <Questions 
                                        key={index}
                                        title={result[0]}
                                        answer={result[1]}
                                        feedback={result[2]}
                                        score={parseInt(result[3])}
                                        resources={result[4]}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}