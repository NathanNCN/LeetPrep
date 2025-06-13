import Userinputs from "./components/Userinputs";
import { useState } from "react";

export default function Home() {


  return (
    <div className="flex flex-col items-center text-center  min-h-screen px-8">
      <div className="flex flex-row text-center justify-center mt-10">
        <h1 className="text-gray-100 font-mono text-8xl">Leet</h1>
        <h1 className="text-orange-400 font-mono text-8xl">Prep</h1>
      </div>
      <div className="max-w-4xl mx-auto mt-8">
        <p className="text-gray-200 font-mono text-2xl">
          LeetPrep bridges the gap between you and interviews by offering
          an interactive platform. Powered by AI, it delivers
          personalized coding, technical, and behavioral questions tailored to your preferred 
          languages and difficulty level. Whether you're aiming for junior roles or FAANG-level 
          challenges. After each session, LeetPrep provides smart feedback and targeted resources 
          to help you improve where it matters most. 
        </p>
      </div>
      <Userinputs />
    </div>
  );
}
