import React from 'react';

interface OnboardingPromptViewProps {
    onContinue: () => void;
}

export const OnboardingPromptView: React.FC<OnboardingPromptViewProps> = ({ onContinue }) => {
    return (
        <div className="w-full max-w-2xl mx-auto p-4 text-center animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">You're a natural!</h1>
            <p className="text-base sm:text-lg text-slate-400 mb-8">
                Now, let's personalize your experience. Tell us your goals, and we'll create a custom learning path to help you master your communication skills.
            </p>
            <button
                onClick={onContinue}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 shadow-lg shadow-blue-500/30 transform hover:scale-105"
            >
                Personalize My Path
            </button>
        </div>
    );
};