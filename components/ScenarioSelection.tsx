
import React, { useState, useMemo } from 'react';
import type { Scenario } from '../types';
import { scenarios } from '../data/scenarios';
import { RequestScenarioModal } from './RequestScenarioModal';
import { GamificationHeader } from './GamificationHeader';
import { useUserPreferences } from '../contexts/UserContext';
import { useGamificationContext } from '../contexts/GamificationContext';

interface ScenarioSelectionProps {
  onSelectScenario: (scenario: Scenario) => void;
  personalizingScenarioId: string | null;
}

const BackIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const LockIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
    </svg>
);


const DifficultyBadge: React.FC<{ difficulty: 'easy' | 'medium' | 'hard' | 'super hard' }> = ({ difficulty }) => {
    const colors = {
        easy: 'bg-emerald-600/50 text-emerald-300',
        medium: 'bg-amber-600/50 text-amber-300',
        hard: 'bg-rose-600/50 text-rose-300',
        'super hard': 'bg-violet-600/50 text-violet-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${colors[difficulty]}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
    );
};

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const ScenarioCard: React.FC<{ scenario: Scenario, onSelect: () => void, isPersonalizing: boolean, isLocked: boolean, unlockLevel?: number }> = ({ scenario, onSelect, isPersonalizing, isLocked, unlockLevel }) => (
    <div className="relative">
        <button
            onClick={onSelect}
            disabled={isPersonalizing || isLocked}
            className="w-full text-left p-4 sm:p-6 bg-slate-800/70 rounded-lg border border-slate-700 hover:bg-slate-700/80 hover:border-indigo-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-wait disabled:hover:bg-slate-800/70 disabled:hover:border-slate-700"
        >
            {isPersonalizing ? (
                <div className="flex items-center justify-center h-full py-4">
                    <SpinnerIcon />
                    <span className="ml-3 text-slate-300">Personalizing scenario...</span>
                </div>
            ) : (
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h2 className="text-base sm:text-lg font-semibold text-slate-100">{scenario.title}</h2>
                        <p className="text-sm text-slate-400 mt-1">{scenario.description}</p>
                    </div>
                    <DifficultyBadge difficulty={scenario.difficulty} />
                </div>
            )}
        </button>
         {isLocked && (
            <div className="absolute inset-0 bg-slate-900/80 rounded-lg flex flex-col items-center justify-center text-center p-4">
                <LockIcon className="w-8 h-8 text-amber-400 mb-2" />
                <p className="text-sm font-semibold text-slate-200">Locked</p>
                <p className="text-xs text-slate-400">Reach Level {unlockLevel} to unlock</p>
            </div>
        )}
    </div>
);

export const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({ onSelectScenario, personalizingScenarioId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { goals, level: userLevelName } = useUserPreferences();
  const gamification = useGamificationContext();

  const availableScenarios = useMemo(() => {
    switch(userLevelName) {
        case 'Beginner':
            return scenarios.filter(s => s.difficulty === 'easy');
        case 'Intermediate':
            return scenarios.filter(s => s.difficulty === 'easy' || s.difficulty === 'medium');
        case 'Advanced':
            return scenarios.filter(s => ['medium', 'hard', 'super hard'].includes(s.difficulty));
        default:
            return scenarios;
    }
  }, [userLevelName]);

  const { recommended, other } = useMemo(() => {
    if (goals.length === 0) {
      return { recommended: [], other: availableScenarios };
    }
    const recommendedSet = new Set<Scenario>();
    const otherSet = new Set<Scenario>(availableScenarios);

    availableScenarios.forEach(scenario => {
      if (scenario.tags.some(tag => goals.includes(tag))) {
        recommendedSet.add(scenario);
        otherSet.delete(scenario);
      }
    });
    
    return { recommended: Array.from(recommendedSet), other: Array.from(otherSet) };
  }, [goals, availableScenarios]);
  
  const handleRequestSubmit = (data: any) => {
    console.log("New scenario request:", data);
    // In a real app, you'd send this to a server.
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto animate-fade-in">
        <div className="text-center my-4 sm:my-6">
            <h1 className="text-2xl sm:text-3xl font-bold">All Scenarios</h1>
        </div>

        <GamificationHeader />
        
        {recommended.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Recommended for You</h2>
            <div className="space-y-4">
              {recommended.map((scenario) => {
                const isLocked = scenario.unlockLevel ? gamification.level < scenario.unlockLevel : false;
                return (
                  <ScenarioCard 
                      key={scenario.id} 
                      scenario={scenario} 
                      onSelect={() => onSelectScenario(scenario)}
                      isPersonalizing={personalizingScenarioId === scenario.id}
                      isLocked={isLocked}
                      unlockLevel={scenario.unlockLevel}
                  />
                )
              })}
            </div>
          </div>
        )}

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">
              {recommended.length > 0 ? "More Scenarios" : `Practice Scenarios for ${userLevelName} Level`}
          </h2>
          <div className="space-y-4">
            {other.map((scenario) => {
               const isLocked = scenario.unlockLevel ? gamification.level < scenario.unlockLevel : false;
               return (
                <ScenarioCard 
                  key={scenario.id} 
                  scenario={scenario} 
                  onSelect={() => onSelectScenario(scenario)} 
                  isPersonalizing={personalizingScenarioId === scenario.id}
                  isLocked={isLocked}
                  unlockLevel={scenario.unlockLevel}
                />
               )
            })}
          </div>
        </div>
        
        <div className="text-center mt-12">
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full text-center p-4 bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-600 hover:border-indigo-500 hover:bg-slate-800/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-400 hover:text-white"
            >
                Don't see what you're looking for? <span className="font-semibold text-indigo-400">Request a new scenario.</span>
            </button>
        </div>
      </div>
      <RequestScenarioModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleRequestSubmit} 
      />
    </>
  );
};
