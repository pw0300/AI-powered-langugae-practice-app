import React from 'react';
import type { Scenario } from '../types';
import { useGamificationContext } from '../contexts/GamificationContext';
import { GamificationHeader } from './GamificationHeader';

interface LearningPathViewProps {
  path: Scenario[];
  completedScenarios: Set<string>;
  onSelectScenario: (scenario: Scenario) => void;
  personalizingScenarioId: string | null;
}

const CheckIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const LockIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const PlayIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const LearningPathView: React.FC<LearningPathViewProps> = ({ path, completedScenarios, onSelectScenario, personalizingScenarioId }) => {
    const { level } = useGamificationContext();

    const findNextScenarioIndex = () => {
        return path.findIndex(s => !completedScenarios.has(s.id));
    };
    const nextScenarioIndex = findNextScenarioIndex();

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
       <div className="text-center my-4 sm:my-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Your Learning Path</h1>
            <p className="text-slate-400">
                We've organized these scenarios to help you progress, prioritizing ones that match your goals.
            </p>
        </div>

      <GamificationHeader />

      <div className="relative pl-5">
        {/* The vertical line */}
        <div className="absolute left-10 top-0 h-full w-0.5 bg-slate-700" />
        
        <div className="space-y-8">
          {path.map((scenario, index) => {
            const isCompleted = completedScenarios.has(scenario.id);
            const isNext = index === nextScenarioIndex;
            const isLocked = scenario.unlockLevel ? level < scenario.unlockLevel : false;
            const isPersonalizing = personalizingScenarioId === scenario.id;

            let icon, statusColor, buttonClasses;

            if (isLocked) {
                icon = <LockIcon />;
                statusColor = 'border-slate-600';
                buttonClasses = 'bg-slate-800/50 border-slate-700 cursor-not-allowed';
            } else if (isCompleted) {
                icon = <CheckIcon />;
                statusColor = 'border-emerald-500 bg-emerald-500';
                buttonClasses = 'bg-slate-800 border-slate-700 opacity-60';
            } else if (isNext) {
                icon = <PlayIcon />;
                statusColor = 'border-indigo-500 bg-indigo-500';
                buttonClasses = 'bg-slate-800 border-slate-700 hover:bg-slate-700/80 hover:border-indigo-500';
            } else { // Future, unlocked scenarios
                icon = <div className="w-3 h-3 bg-slate-500 rounded-full" />;
                statusColor = 'border-slate-600';
                buttonClasses = 'bg-slate-800 border-slate-700 hover:bg-slate-700/80 hover:border-indigo-500';
            }

            return (
              <div key={scenario.id} className="flex items-center gap-4">
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border-2 ${statusColor}`}>
                  {icon}
                </div>
                <button
                  onClick={() => onSelectScenario(scenario)}
                  disabled={isLocked || isPersonalizing}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-all duration-200 ${buttonClasses} disabled:cursor-wait`}
                >
                    {isPersonalizing ? (
                        <div className="flex items-center gap-3">
                            <SpinnerIcon />
                            <span>Personalizing...</span>
                        </div>
                    ) : (
                        <div>
                            <h2 className="font-semibold text-slate-100">{scenario.title}</h2>
                            <p className="text-sm text-slate-400 mt-1">{scenario.description}</p>
                        </div>
                    )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};