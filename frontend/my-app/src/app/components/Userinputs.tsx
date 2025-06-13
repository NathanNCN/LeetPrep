'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

    
    
    const handleSubmit = () => {
        if (checks.diff == "" || checks.length == "" || langs.length == 0){
            setError(true)
            setErrorMsg("Please finish the form before submitting")
        } else {
            const queryParams = new URLSearchParams({
                diff: checks.diff,
                length: checks.length,
                langs: langs.join(',')
            }).toString();
            
            router.push(`/Interview?${queryParams}`);
        }
    }

    useEffect(()=> {
        if (langs.length <= 0){
            setOpen(false)
        } else{
            setOpen(true)
        }
    }, [langs])



    return (
        <form className="flex flex-col justify-center items-center space-y-8 w-full mt-10">
            {error && <h1 className="text-red-500 text-left text-2xl font-bold ">{errorMsg}</h1>}
            <h1 className="text-[#00A8CC] text-left text-2xl font-bold underline">Difficulty of Interview</h1>
            <div className="space-x-4 w-full">
                <input 
                    type="radio"
                    name="diff"
                    className=""
                    value="easy"
                    onChange={(e) => updateChecks(e)}
                />
                <label htmlFor="radio" className="text-white">
                    Easy (Junior Level)
                </label>
                <input 
                    type="radio" 
                    name="diff"
                    className=""
                    value="med"
                    onChange={(e) => updateChecks(e)}

                />
                <label htmlFor="radio" className="text-white">
                    Medium (Mid-Senior Level)
                </label>
                <input 
                    type="radio" 
                    name="diff"
                    className=""
                    value="hard"
                    onChange={(e) => updateChecks(e)}

                />
                <label htmlFor="radio" className="text-white">
                    Hard (FAANG Level)
                </label>
            </div>
            <h1 className="text-[#00A8CC] text-left text-2xl font-bold underline">Length of Interview</h1>
            <div className="space-x-4 w-full">
                <input 
                    type="radio" 
                    name="length"
                    className=""
                    value="short"
                    onChange={(e) => updateChecks(e)}

                />
                <label htmlFor="radio" className="text-white">
                    Short (5 Questions)
                </label>
                <input 
                    type="radio" 
                    name="length"
                    className=""
                    value="med"
                    onChange={(e) => updateChecks(e)}

                />
                <label htmlFor="radio" className="text-white">
                    Medium (7 Questions)
                </label>
                <input 
                    type="radio" 
                    name="length"
                    className=""
                    value="long"
                    onChange={(e) => updateChecks(e)}
                />
                <label htmlFor="radio" className="text-white">
                    Long (10 Questions)
                </label>
            </div>
            
            <h1 className="text-[#00A8CC] text-left text-2xl font-bold underline">Select Languages (Max 3)</h1>
            <div className="flex flex-wrap gap-3 justify-center">
                {langs.map((text, index) => {
                    return (
                        <button 
                            key={index}
                            type="button"
                            onClick={() => removeLang(text)}
                            className="px-4 py-2 bg-gradient-to-r from-[#00A8CC] to-[#00C4E0] text-white font-semibold rounded-2xl hover:from-red-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-[#00A8CC]/50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                            <span className="capitalize">{text}</span>
                            <span className="text-xs opacity-75 hover:opacity-100">✕</span>
                        </button>
                    )
                })}
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
                {codingLangs.map((text)=> {
                    return <button 
                        type="button"
                        onClick={() => addLang(text)}
                        className="px-6 py-3 bg-[#1a1a1a] border-2 border-[#00A8CC] text-[#00A8CC] font-semibold rounded-2xl hover:bg-[#00A8CC] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#00A8CC]/50 transition-all duration-200 transform hover:scale-105"
                    >
                        {text}
                    </button>
                })}
                
            </div>
            
            {!open && <button 
                disabled={true}
                className="mb-16 py-3 px-8 bg-red-800 text-white font-semibold rounded-xl focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-[#262626] transition-all duration-200 transform hover:scale-105"
            >
                Finish form
            </button>}
            {open && <button 
                type="button"
                onClick={() => handleSubmit()}
                className=" mb-16 py-3 px-8 bg-[#00A8CC] text-white font-semibold rounded-xl focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-[#262626] transition-all duration-200 transform hover:scale-105"
            >
                Start interview
            </button>}
        </form>
    )
}

export default Userinputs;