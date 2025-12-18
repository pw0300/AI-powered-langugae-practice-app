
import React, { useState, useMemo } from 'react';
import type { Scenario, Scorecard, Achievement } from '../types';
import { ScenarioSelection } from './ScenarioSelection';
import { PracticeView } from './PracticeView';
import { AssessmentView } from './AssessmentView';
import { useGamificationContext } from '../contexts/GamificationContext';
import { AchievementToast } from './AchievementToast';
import { useUserPreferences } from '../contexts/UserContext';
import { scenarios } from '../data/scenarios';
import { LearningPathView } from './LearningPathView';
import { generateLearningPath } from '../utils/learningPathGenerator';
import { ProfileManager } from './ProfileManager';
import { personalizeScenario } from '../services/geminiService';
import { BottomNavBar } from './BottomNavBar';

type View = 'path' | 'practice' | 'assessment' | 'scenarios' | 'profile';

export const ConversationManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('path');
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [personalizedGoal, setPersonalizedGoal] = useState<string | null>(null);
  const [lastScorecard, setLastScorecard] = useState<Scorecard | null>(null);
  const [lastScenario, setLastScenario] = useState<Scenario | null>(null);
  const [didPass, setDidPass] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const [practiceSessionKey, setPracticeSessionKey] = useState(1);
  const [personalizingScenarioId, setPersonalizingScenarioId] = useState<string | null>(null);

  const { addXpAndCheckAchievements, completedScenarios } = useGamificationContext();
  const { goals, level, language } = useUserPreferences();

  const learningPath = useMemo(() => generateLearningPath(scenarios, goals), [goals]);
  const findNextScenario = () => {
    return learningPath.find(s => !completedScenarios.has(s.id));
  };
  
  const handleSelectScenario = (scenario: Scenario, pGoal: string | null = null) => {
    setActiveScenario(scenario);
    setPersonalizedGoal(pGoal);
    setCurrentView('practice');
    setPracticeSessionKey(k => k + 1); // Ensure new session is fresh
  };

  const handlePersonalizeAndSelect = async (scenario: Scenario) => {
    setPersonalizingScenarioId(scenario.id);
    const { scenario: personalized, personalizedGoal } = await personalizeScenario(scenario, goals, level, language!);
    setPersonalizingScenarioId(null);
    handleSelectScenario(personalized, personalizedGoal);
  };

  const handleEndPractice = () => {
    setActiveScenario(null);
    setLastScorecard(null);
    setLastScenario(null);
    setCurrentView('path');
  };
  
  const restartPractice = () => {
    setPracticeSessionKey(k => k + 1);
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
        handlePersonalizeAndSelect(nextScenario); 
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
              key={practiceSessionKey}
              scenario={activeScenario}
              personalizedGoal={personalizedGoal}
              onEndPractice={handleEndPractice}
              onPracticeComplete={handlePracticeComplete}
              onRestartPractice={restartPractice}
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
              onRetry={() => handlePersonalizeAndSelect(lastScenario)}
              onNext={handleGoToNext}
              onBack={handleEndPractice}
              nextScenarioTitle={findNextScenario()?.title}
            />
          );
        }
        return <p>Loading assessment...</p>;
      case 'scenarios':
          return <ScenarioSelection 
            onSelectScenario={handlePersonalizeAndSelect}
            personalizingScenarioId={personalizingScenarioId}
          />;
      case 'profile':
          return <ProfileManager 
            onSelectScenario={(scenarioId: string) => {
                const scenario = scenarios.find(s => s.id === scenarioId);
                if (scenario) {
                    handlePersonalizeAndSelect(scenario);
                }
            }}
          />;
      case 'path':
      default:
        return (
             <LearningPathView 
                path={learningPath} 
                completedScenarios={completedScenarios} 
                onSelectScenario={handlePersonalizeAndSelect}
                personalizingScenarioId={personalizingScenarioId}
            />
        );
    }
  };

  const showNavBar = ['path', 'scenarios', 'profile'].includes(currentView);

  return (
    <div className="w-full h-full flex flex-col">
      <main className="flex-grow overflow-y-auto p-4">
        {renderContent()}
      </main>
       {showNavBar && (
        <BottomNavBar 
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
        />
      )}
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
