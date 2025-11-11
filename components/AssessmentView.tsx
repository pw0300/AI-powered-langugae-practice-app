import React from 'react';
import type { Scenario, Scorecard } from '../types';
import { ScorecardView } from './ScorecardView';

interface AssessmentViewProps {
  scorecard: Scorecard;
  scenario: Scenario;
  didPass: boolean;
  onRetry: () => void;
  onNext: () => void;
  onBack: () => void;
  nextScenarioTitle?: string;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({ 
    scorecard, scenario, didPass, onRetry, onNext, onBack, nextScenarioTitle 
}) => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-900 animate-fade-in">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-white">Scenario Complete!</h1>
                <p className="text-lg text-slate-400 mt-1">Here's your performance scorecard for "{scenario.title}".</p>
            </div>
            
            <ScorecardView scorecard={scorecard} />
            
            <div className="flex items-center gap-4 mt-8">
                {didPass ? (
                    <button
                        onClick={onNext}
                        disabled={!nextScenarioTitle}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {nextScenarioTitle ? `Next Challenge: ${nextScenarioTitle}` : 'Path Complete!'}
                    </button>
                ) : (
                    <button
                        onClick={onRetry}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200"
                    >
                        Try Again
                    </button>
                )}
                 <button
                    onClick={onBack}
                    className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-200"
                >
                    Back
                </button>
            </div>
        </div>
    )
};
