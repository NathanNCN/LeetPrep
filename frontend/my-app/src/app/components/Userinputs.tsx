'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlay, FaTimes, FaCheck } from "react-icons/fa";

function Userinputs() {
    const codingLangs = ["Python", "JavaScript", "Java", "C++", "C#", "Go", "Rust", "TypeScript"]
    const router = useRouter();

    const [langs, setLang] = useState<string[]>([])
    const [checks, setChecks] = useState({"diff": "", "length":""})

    const [open, setOpen] = useState(false)
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const removeLang = (langToRemove: string) => {
        setLang(langs.filter(lang => lang !== langToRemove))
    }
    const addLang = (name: string) => {
        if (!langs.includes(name)){
            setLang([...langs, name])
        }
    }

    const updateChecks = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setChecks({...checks, [e.target.name]: e.target.value})
    }

    const handleSubmit = async () => {
        if (checks.diff === "" || checks.length === "" || langs.length === 0) {
            setError(true);
            setErrorMsg("Please finish the form before submitting");
            return;
        }

        const queryParams = new URLSearchParams({
            diff: checks.diff,
            length: checks.length,
            langs: langs.join(','),
        }).toString();
        
        router.push(`/Interview?${queryParams}`);
    };

    useEffect(()=> {
        if (langs.length <= 0){
            setOpen(false)
        } else{
            setOpen(true)
        }
    }, [langs])

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-2xl">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                        <h1 className="text-red-400 text-xl font-bold flex items-center gap-2">
                            <FaTimes size={20} />
                            {errorMsg}
                        </h1>
                    </div>
                )}

                {/* Difficulty Section */}
                <div className="mb-8">
                    <h2 className="text-[#00A8CC] text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-[#00A8CC] rounded-full" />
                        Difficulty of Interview
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { value: "easy", label: "Easy (Junior Level)", color: "from-green-500 to-green-600" },
                            { value: "med", label: "Medium (Mid-Senior Level)", color: "from-yellow-500 to-yellow-600" },
                            { value: "hard", label: "Hard (FAANG Level)", color: "from-red-500 to-red-600" }
                        ].map((option) => (
                            <label key={option.value} className="relative cursor-pointer">
                                <input 
                                    type="radio"
                                    name="diff"
                                    value={option.value}
                                    onChange={updateChecks}
                                    className="sr-only"
                                />
                                <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    checks.diff === option.value 
                                        ? `bg-gradient-to-r ${option.color} border-transparent text-white shadow-lg` 
                                        : 'bg-white/5 border-gray-600 text-gray-300 hover:border-[#00A8CC]'
                                }`}>
                                    <div className="text-center font-semibold">{option.label}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Length Section */}
                <div className="mb-8">
                    <h2 className="text-[#00A8CC] text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-[#00A8CC] rounded-full" />
                        Length of Interview
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { value: "short", label: "Short (5 Questions)", color: "from-blue-500 to-blue-600" },
                            { value: "med", label: "Medium (7 Questions)", color: "from-purple-500 to-purple-600" },
                            { value: "long", label: "Long (10 Questions)", color: "from-indigo-500 to-indigo-600" }
                        ].map((option) => (
                            <label key={option.value} className="relative cursor-pointer">
                                <input 
                                    type="radio"
                                    name="length"
                                    value={option.value}
                                    onChange={updateChecks}
                                    className="sr-only"
                                />
                                <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                    checks.length === option.value 
                                        ? `bg-gradient-to-r ${option.color} border-transparent text-white shadow-lg` 
                                        : 'bg-white/5 border-gray-600 text-gray-300 hover:border-[#00A8CC]'
                                }`}>
                                    <div className="text-center font-semibold">{option.label}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Languages Section */}
                <div className="mb-8">
                    <h2 className="text-[#00A8CC] text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-[#00A8CC] rounded-full" />
                        Select Languages (Max 3)
                    </h2>
                    
                    {/* Selected Languages */}
                    {langs.length > 0 && (
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-3">
                                {langs.map((text, index) => (
                                    <button 
                                        key={index}
                                        type="button"
                                        onClick={() => removeLang(text)}
                                        className="px-4 py-2 bg-gradient-to-r from-[#00A8CC] to-[#00C4E0] text-white font-semibold rounded-xl hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-[#00A8CC]/50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                                    >
                                        <span className="capitalize">{text}</span>
                                        <FaTimes size={12} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Language Options */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {codingLangs.map((text) => (
                            <button 
                                key={text}
                                type="button"
                                onClick={() => addLang(text)}
                                disabled={langs.includes(text) || langs.length >= 3}
                                className={`p-3 rounded-xl border-2 font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00A8CC]/50 ${
                                    langs.includes(text)
                                        ? 'bg-[#00A8CC] border-[#00A8CC] text-white cursor-not-allowed'
                                        : langs.length >= 3
                                        ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                                        : 'bg-white/5 border-[#00A8CC] text-[#00A8CC] hover:bg-[#00A8CC] hover:text-white'
                                }`}
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    {!open ? (
                        <button 
                            disabled={true}
                            className="px-8 py-4 bg-gray-700 text-gray-400 font-semibold rounded-xl cursor-not-allowed flex items-center gap-2"
                        >
                            <FaTimes size={20} />
                            Complete Form
                        </button>
                    ) : (
                        <button 
                            type="button"
                            onClick={handleSubmit}
                            className="px-8 py-4 bg-gradient-to-r from-[#00A8CC] to-[#007EA7] text-white font-bold rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00A8CC] flex items-center gap-2"
                        >
                            <FaPlay size={20} />
                            Start Interview
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}   

export default Userinputs;