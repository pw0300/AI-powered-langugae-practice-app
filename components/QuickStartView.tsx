import React, { useState } from 'react';
import type { Scenario, Scorecard } from '../types';
import { usePracticeSession } from '../hooks/usePracticeSession';
import { TranscriptDisplay } from './TranscriptDisplay';
import { PracticeControls } from './PracticeControls';
import { StatusIndicator } from './StatusIndicator';
import { ScorecardView } from './ScorecardView';

interface QuickStartViewProps {
  onComplete: () => void;
}

const quickStartScenario: Scenario = {
  id: 'quick-start-1',
  title: 'Quick Start: A Simple Introduction',
  description: 'Practice introducing yourself in a casual setting.',
  persona: 'You are meeting someone for the first time at a casual social event. You are friendly and curious. Your goal is to have a brief, pleasant chat.',
  initialTurn: "Hi there! I don't think we've met before. My name's Alex. What's your name?",
  maxTurns: 3,
  completionGoal: 'To have a friendly and brief exchange.',
  assessmentCriteria: ["Clarity", "Friendliness", "Confidence"],
  difficulty: 'easy',
  tags: [],
};

const QuickStartPractice: React.FC<{ onComplete: () => void; onRetry: () => void; }> = ({ onComplete, onRetry }) => {
  const {
    status,
    transcript,
    liveUserTranscription,
    finalScorecard,
    toggleRecording,
    proceedToNextTurn,
  } = usePracticeSession(quickStartScenario);

  if (status === 'scenario-complete' && finalScorecard) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-900 animate-fade-in">
            <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Great Job!</h1>
                <p className="text-lg text-slate-400 mt-1">That's a quick look at how feedback works.</p>
            </div>
            <ScorecardView scorecard={finalScorecard} />
            <button
                onClick={onComplete}
                className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200"
            >
                Continue
            </button>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen max-w-3xl mx-auto p-4 bg-slate-900">
      <header className="flex-shrink-0 w-full py-4 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Let's Warm Up!</h1>
        <p className="text-slate-400">Here's a quick practice to get you started.</p>
      </header>
      <main className="flex-grow flex flex-col py-4 min-h-0">
        <TranscriptDisplay transcript={transcript} liveTranscription={liveUserTranscription} />
      </main>
      <footer className="flex-shrink-0 flex flex-col items-center">
        <StatusIndicator status={status} />
        <PracticeControls
          status={status}
          onRecord={toggleRecording}
          onNextTurn={proceedToNextTurn}
          onRetry={onRetry}
        />
      </footer>
    </div>
  );
};


export const QuickStartView: React.FC<QuickStartViewProps> = ({ onComplete }) => {
  const [sessionKey, setSessionKey] = useState(1);
  const handleRetry = () => setSessionKey(key => key + 1);

  return <QuickStartPractice key={sessionKey} onComplete={onComplete} onRetry={handleRetry} />;
}