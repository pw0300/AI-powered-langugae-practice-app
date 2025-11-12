import React, { useState, useEffect } from 'react';

const messages = [
    "Analyzing your conversation...",
    "Evaluating key moments...",
    "Compiling your strengths...",
    "Identifying areas for growth...",
    "Finalizing your scores...",
    "Just a moment more..."
];

export const AssessmentLoadingView: React.FC = () => {
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
            <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-white mt-6">Generating Your Scorecard</h2>
            <p className="text-slate-300 mt-2 transition-opacity duration-500">{message}</p>
        </div>
    );
};
