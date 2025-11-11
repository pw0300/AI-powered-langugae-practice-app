import React from 'react';

interface OnboardingPromptViewProps {
    onContinue: () => void;
}

export const OnboardingPromptView: React.FC<OnboardingPromptViewProps> = ({ onContinue }) => {
    return (
        <div className="w-full max-w-2xl mx-auto p-4 text-center animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">You're a natural!</h1>
            <p className="text-lg text-slate-400 mb-8">
                Now, let's personalize your experience. Tell us your goals, and we'll create a custom learning path to help you master your communication skills.
            </p>
            <button
                onClick={onContinue}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200"
            >
                Personalize My Path
            </button>
        </div>
    );
};