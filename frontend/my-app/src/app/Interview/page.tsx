'use client'
import { useState, useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-dark.css";
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";
import { FaHome, FaClock, FaMicrophone } from "react-icons/fa";

function InterviewPage() {
    const searchParams = useSearchParams();
    const [code, setCode] = useState(`# Write your solution here`);
    
    const difficulty = searchParams.get('diff');
    const length = searchParams.get('length');
    const selectedLangs = searchParams.get('langs')?.split(',') || [];


    const [questions, setQuestions] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const [codeQuestion, setCodeQuestion] = useState<boolean>(false);
    const [isListening, setIsListening] = useState<boolean>(false);
    const [transcript, setTranscript] = useState<string>("");
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
   
    const recognitionRef = useRef<any>(null);
    
    // Initialize recognition only once
    if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "en-US";
        recognitionRef.current.continuous = true;
        
        recognitionRef.current.onresult = (event: any) => {
            const result = event.results[0][0].transcript;
            setTranscript(result);
            setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognitionRef.current.onend = () => {
            setIsListening(false);
        };
    }
    
    const [answer, setAnswer] = useState<string[]>([]);

    const handleSpeech = () => {
        if (!isListening) {
            recognitionRef.current.start();
            setIsListening(true);
            setTranscript("");
        } else {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    // Send the Interivew parameters to API
    useEffect(() => {
        const fetchQuestions = async () => {
            if (questions.length === 0) {
                try {
                    setLoading(true);
                    const response = await fetch(`http://localhost:8081/getInterview`, {
                        method: 'POST',
                        body: JSON.stringify({length: length, level: difficulty, language: selectedLangs}),
                    }); 
                    const data = await response.json();

                    if (data.results) {
                        const parsed = JSON.parse(data.results);
                        setQuestions(parsed);
                        console.log(parsed);
                    } else {
                        setError(true);
                    }
                } catch (err) {
                    console.error('Error fetching questions:', err);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchQuestions();
    }, []);
    
    // Timer 
    const [time, setTime] = useState("0:00");

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(time => {
                const [minutes, seconds] = time.split(':').map(Number);
                if (seconds < 9){
                    return `${minutes}:0${seconds + 1}`;
                }else if (seconds === 59) {
                    return `${minutes + 1}:00`;
                }
                return `${minutes}:${seconds + 1}`;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);



    const router = useRouter()

    

    const addAnswer = () => {
        if (codeQuestion) {
            setAnswer(answer => [...answer, code]);
        } else{
            setAnswer(answer => [...answer, transcript]);
        }
        
        // Reset states for next question
        setTranscript("");
        setCode("# Write your solution here");
        setIsListening(false);
        
        // Stop any ongoing recognition to ensure clean state
        try {
            recognitionRef.current.stop();
        } catch {
            // Recognition might not be running, that's okay
            console.log('Recognition cleanup - no active session to stop');
        }
    }


   

   const handleNextQuestion = () => {
        
        addAnswer();

        const nextQuestionIndex = currentQuestion + 1;
        const nextQuestionType = questions[nextQuestionIndex][0];
        
        if (nextQuestionType === "code") {
            setCodeQuestion(true);
        } else {
            setCodeQuestion(false);
        }
        
        setCurrentQuestion(nextQuestionIndex);

    }

    const handeSubmit = async () =>{
       
        // Collect the final answer directly instead of using addAnswer()
        const finalAnswers = [...answer];
        
        // Add the current answer for the last question
        if (codeQuestion) {
            finalAnswers.push(code);
        } else {
            finalAnswers.push(transcript);
        }
        
        // Extract just the question strings from the 2D array
        const questionStrings = questions.map(question => question[1]);
        
        // Navigate to Results page with data as URL parameters
        const questionsParam = encodeURIComponent(JSON.stringify(questionStrings));
        const answersParam = encodeURIComponent(JSON.stringify(finalAnswers));
        
        router.push(`/Results?questions=${questionsParam}&answers=${answersParam}`);
    }
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#0f0f0f] items-center p-6 font-sans">
            <div className="w-full max-w-4xl mx-auto mt-10">
                {/* Header: Timer & Home */}
                <div className="flex flex-row justify-between items-center w-full mb-4">
                    <div className="flex items-center gap-2 text-gray-300 text-2xl bg-white/5 backdrop-blur-md px-4 py-2 rounded-full shadow-md">
                        <div className="text-[#00A8CC]">
                            <FaClock size={20} />
                        </div>
                        <span>{time}</span>
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
                            {true && <div className="flex flex-col md:flex-row gap-4 text-gray-300 text-lg">
                                <span><span className="font-semibold text-white">Difficulty:</span> {difficulty}</span>
                                <span><span className="font-semibold text-white">Length:</span> {length}</span>
                                <span><span className="font-semibold text-white">Languages:</span> {selectedLangs.join(', ')}</span>
                            </div>}
                        
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center my-12">
                        <div className="text-white text-xl">Loading questions...</div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center my-12">
                        <div className="text-red-400 text-xl">Failed to load questions. Please try again.</div>
                    </div>
                )}

                {/* Question Display */}
                {!loading && !error && questions.length > 0 && questions[currentQuestion] && (
                    <div className="flex flex-col md:flex-row gap-4 text-gray-300 text-lg">
                        <p><span className="font-semibold text-white">Interviewer:</span> {questions[currentQuestion][1]}</p>
                    </div>
                )}

                {/* Transcript Display */}
                {transcript && (
                    <div className="flex flex-col md:flex-row gap-4 text-gray-300 text-lg">
                        <p><span className="font-semibold text-white">You:</span> {transcript}</p>
                    </div>
                )}

                {/* Microphone Button */}
                {!codeQuestion && 
                    <div className="flex justify-center my-12">
                    <button 
                        disabled={transcript.length > 0}
                        onClick={handleSpeech}
                        className={`w-24 h-24 rounded-full shadow-2xl transition-all focus:outline-none flex items-center justify-center text-white ${
                            transcript.length > 0 
                                ? 'bg-gradient-to-r from-gray-500 to-gray-700 cursor-not-allowed'
                                : isListening 
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 animate-pulse hover:scale-110' 
                                    : 'bg-gradient-to-r from-red-500 to-red-700 hover:scale-110'
                        }`}
                        title={
                            transcript.length > 0 
                                ? 'Answer recorded - proceed to next question'
                                : isListening 
                                    ? 'Listening... speak now'
                                    : 'Click to start recording your answer'
                        }
                    >
                        <FaMicrophone size={32} />
                    </button>
                </div>
                }
                
                {/* Code Editor Card */}
                {codeQuestion && (
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
                                        minHeight: 250,
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
                    {currentQuestion === questions.length - 1 && <button
                        onClick={()=>handeSubmit()}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-16 py-5 rounded-xl font-bold text-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A8CC]"
                    >
                        Get Results
                    </button>}
                    {currentQuestion < questions.length - 1 && <button
                        onClick={() => handleNextQuestion()}
                        className="bg-gradient-to-r from-[#00A8CC] to-[#007EA7] text-white px-16 py-5 rounded-xl font-bold text-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A8CC]"
                    >
                        Next Question
                    </button>}
                </div>
            </div>
        </div>
    )
}

export default InterviewPage; 