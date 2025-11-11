import React, { useState } from 'react';
import { GoalSelectionView } from './GoalSelectionView';
import { LevelSelectionView } from './LevelSelectionView';
import { OnboardingSummaryView } from './OnboardingSummaryView';

interface OnboardingManagerProps {
  onComplete: (goals: string[], level: string) => void;
}

export const OnboardingManager: React.FC<OnboardingManagerProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'goals' | 'level' | 'summary'>('goals');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const handleGoalsSelected = (goals: string[]) => {
    setSelectedGoals(goals);
    setStep('level');
  };

  const handleLevelSelected = (level: string) => {
    setSelectedLevel(level);
    setStep('summary');
  };

  const handleComplete = () => {
    onComplete(selectedGoals, selectedLevel);
  };

  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
      {step === 'goals' && (
        <GoalSelectionView onContinue={handleGoalsSelected} />
      )}
      {step === 'level' && (
        <LevelSelectionView 
            onContinue={handleLevelSelected}
            onBack={() => setStep('goals')}
        />
      )}
      {step === 'summary' && (
        <OnboardingSummaryView 
          goals={selectedGoals} 
          level={selectedLevel}
          onConfirm={handleComplete}
          onBack={() => setStep('level')}
        />
      )}
    </main>
  );
};
