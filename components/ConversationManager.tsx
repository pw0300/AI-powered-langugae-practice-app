import React, { useState, useMemo } from 'react';
import type { Scenario, Scorecard, Achievement } from '../types';
import { ScenarioSelection } from './ScenarioSelection';
import { PracticeView } from './PracticeView';
import { AssessmentView } from './AssessmentView';
import { useGamificationContext } from '../contexts/GamificationContext';
import { AchievementToast } from './AchievementToast';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { scenarios } from '../data/scenarios';
import { LearningPathView } from './LearningPathView';
import { generateLearningPath } from '../utils/learningPathGenerator';
import { ProfileManager } from './ProfileManager';

type View = 'path' | 'practice' | 'assessment' | 'scenarios' | 'profile';

export const ConversationManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('path');
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [personalizedGoal, setPersonalizedGoal] = useState<string | null>(null);
  const [lastScorecard, setLastScorecard] = useState<Scorecard | null>(null);
  const [lastScenario, setLastScenario] = useState<Scenario | null>(null);
  const [didPass, setDidPass] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  const { addXpAndCheckAchievements, completedScenarios } = useGamificationContext();
  const { goals } = useUserPreferences();

  const learningPath = useMemo(() => generateLearningPath(scenarios, goals), [goals]);
  const findNextScenario = () => {
    return learningPath.find(s => !completedScenarios.has(s.id));
  };
  
  const handleSelectScenario = (scenario: Scenario, pGoal: string | null = null) => {
    setActiveScenario(scenario);
    setPersonalizedGoal(pGoal);
    setCurrentView('practice');
  };

  const handleEndPractice = () => {
    setActiveScenario(null);
    setLastScorecard(null);
    setLastScenario(null);
    setCurrentView('path');
  };

  const handlePracticeComplete = (scorecard: Scorecard, scenario: Scenario, passed: boolean) => {
    setLastScorecard(scorecard);
    setLastScenario(scenario);
    setDidPass(passed);
    setActiveScenario(null);
    setCurrentView('assessment');
    if (passed) {
        const unlocked = addXpAndCheckAchievements(scorecard, scenario);
        setNewlyUnlocked(unlocked);
    }
  };
  
  const handleGoToNext = () => {
    const nextScenario = findNextScenario();
    if(nextScenario) {
        // Find if personalization is applicable. Since we are on a path, let's not re-personalize.
        handleSelectScenario(nextScenario, null); 
    } else {
        setCurrentView('path'); // Or a "path complete" view
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'practice':
        if (activeScenario) {
          return (
            <PracticeView
              scenario={activeScenario}
              personalizedGoal={personalizedGoal}
              onEndPractice={handleEndPractice}
              onPracticeComplete={handlePracticeComplete}
            />
          );
        }
        return null;
      case 'assessment':
        if (lastScorecard && lastScenario) {
          return (
            <AssessmentView
              scorecard={lastScorecard}
              scenario={lastScenario}
              didPass={didPass}
              onRetry={() => handleSelectScenario(lastScenario, personalizedGoal)}
              onNext={handleGoToNext}
              onBack={handleEndPractice}
              nextScenarioTitle={findNextScenario()?.title}
            />
          );
        }
        return <p>Loading assessment...</p>;
      case 'scenarios':
          return <ScenarioSelection onSelectScenario={handleSelectScenario} />;
      case 'profile':
          return <ProfileManager 
            onBack={() => setCurrentView('path')}
            onSelectScenario={(scenarioId: string) => {
                const scenario = scenarios.find(s => s.id === scenarioId);
                if (scenario) {
                    // A proper implementation might trigger personalization here.
                    // For now, select it without a personalized goal.
                    handleSelectScenario(scenario, null);
                }
            }}
          />;
      case 'path':
      default:
        return (
             <div className="w-full max-w-4xl mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Your Practice Plan</h1>
                    <div>
                        <button onClick={() => setCurrentView('scenarios')} className="text-indigo-400 hover:text-indigo-300 mr-4">All Scenarios</button>
                        <button onClick={() => setCurrentView('profile')} className="text-indigo-400 hover:text-indigo-300">My Progress</button>
                    </div>
                </div>
                <LearningPathView 
                    path={learningPath} 
                    completedScenarios={completedScenarios} 
                    onSelectScenario={(scenario) => handleSelectScenario(scenario, null)} // Let's not personalize from the path view for simplicity. Personalization happens in ScenarioSelection view.
                />
            </div>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {renderContent()}
      {newlyUnlocked.map((ach) => (
        <AchievementToast
          key={ach.id}
          achievement={ach}
          onClose={() => setNewlyUnlocked(prev => prev.filter(a => a.id !== ach.id))}
        />
      ))}
    </div>
  );
};
