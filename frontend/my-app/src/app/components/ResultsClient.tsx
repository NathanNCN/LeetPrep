'use client'
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaHome, FaTrophy, FaChartBar } from "react-icons/fa";
import Questions from "./Questions";
import Rating from "./Rating";


// Const for the backend url for production and development
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

export default function ResultsClient() {

    // useRouter to navigate to the home page later
    const router = useRouter();

    // useSearchParams to get the questions and answers from the url
    const searchParams = useSearchParams();
    
    // State to store the results and errors
    const [results, setResults] = useState<[string, string, string, string, string][] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    useEffect(() => {
        // Get questions and answers from URL parameters
        const questionsParam = searchParams.get('questions');
        const answersParam = searchParams.get('answers');
        
        // check to see if there are questions and answers in the url params tod decode them
        if (questionsParam && answersParam) {

            // try to decode the questions and answers
            try {

                // decode the questions and answers, then turn them into json objects
                const decodedQuestions = JSON.parse(decodeURIComponent(questionsParam));
                const decodedAnswers = JSON.parse(decodeURIComponent(answersParam));
                
                // Check to see if the decoded questions and answers are arrays
                if (!Array.isArray(decodedQuestions) || !Array.isArray(decodedAnswers)) {
                    throw new Error('Invalid data format');
                }

    
                
                // Call API to get results based on the decoded questions and answers
                fetchResults(decodedQuestions, decodedAnswers);
            
            // if there is an error, set the error state to true and set the loading state to falsed
            } catch (err) {
                console.error('Error parsing URL parameters:', err);
                setError(true);
                setLoading(false);
            }
        // if there are no questions and answers, set the error state to true and set the loading state to false
        } else {
            setError(true);
            setLoading(false);
        }
    }, [searchParams]);
    

    // Function to analyze the questions and answers
    const fetchResults = async (questions: string[], answers: string[]) => {

        // try to fetch the results
        try {
            const requestBody = { questions, answers };
            console.log('Request body:', requestBody);
            
            // Validate the data before sending
            if (!questions.every(q => typeof q === 'string') || !answers.every(a => typeof a === 'string')) {
                throw new Error('Invalid data types in questions or answers');
            }
            
            const response = await fetch(`${BACKEND_URL}/getResults`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
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
                    
                    
                    // Try to parse the cleaned response
                    const parsed = JSON.parse(cleanedResponse);
                    setResults(parsed);
                // if there is an error, set the error state to true and set the loading state to false
                } catch (parseError) {
                    console.error('JSON parsing error:', parseError);
                    console.error('Problematic JSON string around position 262:');
                    console.error('Context:', data.results.substring(240, 300));
                    
        
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
    
    // Function to navigate to the home page
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
                                    <Rating heading="Overall Rating" rating={parseFloat(results[results.length - 1][0])} />
                                    <Rating heading="Technical Rating" rating={parseFloat(results[results.length - 1][1])} />
                                    <Rating heading="Behavioral Rating" rating={parseFloat(results[results.length - 1][2])} />
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
    );
} 