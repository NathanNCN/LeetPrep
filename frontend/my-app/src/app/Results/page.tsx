import { Suspense } from 'react';
import ResultsClient from '../components/ResultsClient';

function LoadingFallback() {
    return (
        <div className="flex flex-col items-center text-center min-h-screen px-8 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#0f0f0f] font-sans">
            <div className="w-full max-w-6xl mx-auto mt-16">
                <div className="text-center my-12">
                    <div className="text-white text-xl">Loading results...</div>
                </div>
            </div>
        </div>
    );
}

export default function ResultsPage() {
    return (
        // Suspense to handle the loading state if the results are not ready yet
        <Suspense fallback={<LoadingFallback />}>
            <ResultsClient />
        </Suspense>
    );
}