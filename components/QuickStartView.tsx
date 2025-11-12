import React, { useMemo, useState } from 'react';
import type { Scenario } from '../types';
import { usePracticeSession } from '../hooks/usePracticeSession';
import { TranscriptDisplay } from './TranscriptDisplay';
import { PracticeControls } from './PracticeControls';
import { StatusIndicator } from './StatusIndicator';
import { ScorecardView } from './ScorecardView';

interface QuickStartViewProps {
  onComplete: () => void;
}

const INTENTIONAL_TRANSITION_DELAY_MS = 1200;

const quickStartScenario: Scenario = {
  id: 'quick-start-1',
  title: 'Quick Start: A Simple Introduction',
  description: 'Practice introducing yourself in a casual setting.',
  persona: 'You are meeting someone for the first time at a casual social event. You are friendly and curious. Your goal is to have a brief, pleasant chat.',
  initialTurn: "Hi there! I don't think we've met before. My name's Alex. What's your name?",
  maxTurns: 3,
  completionGoal: 'To have a friendly and brief exchange.',
  assessmentCriteria: ['Clarity', 'Friendliness', 'Confidence'],
  difficulty: 'easy',
  tags: [],
};

type InputMode = 'voice' | 'text';

interface QuickStartPracticeProps {
  onComplete: () => void;
  onRetry: () => void;
  inputMode: InputMode;
  onInputModeChange: (mode: InputMode) => void;
  onStartTextMode: () => void;
}

const QuickStartPractice: React.FC<QuickStartPracticeProps> = ({
  onComplete,
  onRetry,
  inputMode,
  onInputModeChange,
  onStartTextMode,
}) => {
  const {
    status,
    transcript,
    liveUserTranscription,
    turnFeedback,
    finalScorecard,
    currentTurn,
    toggleRecording,
    proceedToNextTurn,
    submitTextResponse,
    didPass,
    errorInfo,
  } = usePracticeSession(quickStartScenario);

  const [textResponse, setTextResponse] = useState('');
  const [isSubmittingText, setIsSubmittingText] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const totalTurns = quickStartScenario.maxTurns;
  const completedTurns = useMemo(() => {
    const baseCompleted = Math.max(0, currentTurn - 1);
    const statusRepresentsCompleted = ['evaluating', 'speaking', 'turn-complete', 'assessing-final', 'scenario-complete'].includes(status);
    return statusRepresentsCompleted ? Math.min(currentTurn, totalTurns) : Math.min(baseCompleted, totalTurns);
  }, [currentTurn, status, totalTurns]);

  const progressPercent = (completedTurns / totalTurns) * 100;
  const upcomingTurn = Math.min(status === 'turn-complete' ? currentTurn + 1 : currentTurn, totalTurns);
  const showTextComposer = inputMode === 'text' && !['error', 'permission-denied', 'scenario-complete'].includes(status);
  const canSubmitText = status === 'ready';

  const handleCompleteAfterDelay = () => {
    if (isCompleting) return;
    setIsCompleting(true);
    setTimeout(() => {
      onComplete();
    }, INTENTIONAL_TRANSITION_DELAY_MS);
  };

  const handleTextSubmit: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();
    if (!textResponse.trim() || !canSubmitText) {
      return;
    }

    setIsSubmittingText(true);
    try {
      await submitTextResponse(textResponse);
      setTextResponse('');
    } finally {
      setIsSubmittingText(false);
    }
  };

  if (status === 'scenario-complete' && finalScorecard) {
    const passedTitle = didPass ? 'You nailed the warm-up!' : "You're off to a solid start";
    const passedSubtitle = didPass
      ? 'Awesome work! Keep this momentum as we tailor your practice plan.'
      : 'Great effort—here are targeted suggestions to focus your personalized practice.';

    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-900 animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">{passedTitle}</h1>
          <p className="text-lg text-slate-400 mt-1">{passedSubtitle}</p>
        </div>
        <ScorecardView scorecard={finalScorecard} />
        <button
          onClick={handleCompleteAfterDelay}
          disabled={isCompleting}
          className="mt-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-700/70 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-colors duration-200"
        >
          {isCompleting ? 'Preparing your personalized plan…' : 'Personalize my practice'}
        </button>
      </div>
    );
  }

  if (status === 'error' || status === 'permission-denied') {
    const isPermissionIssue = status === 'permission-denied';
    const detailMessage = errorInfo?.message
      ?? (isPermissionIssue
        ? 'We need access to your microphone to run the guided warm-up.'
        : "Something interrupted the warm-up. Let's get you unstuck.");
    const troubleshooting = errorInfo?.troubleshooting
      ?? (isPermissionIssue
        ? [
            'Confirm microphone permissions in your browser settings.',
            'If you cannot grant access, try the text-based warm-up instead.',
          ]
        : [
            'Check your internet connection and try again.',
            'If the problem continues, continue to personalization and revisit the warm-up later.',
          ]);

    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-900 text-center animate-fade-in">
        <div className="max-w-xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">
              {isPermissionIssue ? 'Microphone access is blocked' : "We couldn't finish the warm-up"}
            </h1>
            <p className="text-lg text-slate-300">{detailMessage}</p>
          </div>
          {troubleshooting.length > 0 && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 text-left">
              <p className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Try these next</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
                {troubleshooting.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                onInputModeChange('voice');
                onRetry();
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200"
            >
              Try again
            </button>
            {isPermissionIssue && (
              <button
                onClick={onStartTextMode}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200"
              >
                Practice with text instead
              </button>
            )}
            <button
              onClick={handleCompleteAfterDelay}
              disabled={isCompleting}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-700/70 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-colors duration-200"
            >
              {isCompleting ? 'Preparing your personalized plan…' : 'Continue to personalize'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen max-w-3xl mx-auto p-4 bg-slate-900">
      <header className="flex-shrink-0 w-full py-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Let's Warm Up!</h1>
          <p className="text-slate-400">Here's a quick practice to get you started.</p>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400">
            <span>Turn {Math.min(upcomingTurn, totalTurns)} of {totalTurns}</span>
            <span>{completedTurns} completed</span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-800/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>
      <main className="flex-grow flex flex-col gap-4 py-4 min-h-0">
        <TranscriptDisplay transcript={transcript} liveTranscription={inputMode === 'voice' ? liveUserTranscription : undefined} />
        {turnFeedback && (
          <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-emerald-300 uppercase tracking-wide">Turn feedback</h2>
              <span className="text-sm font-bold text-white">{turnFeedback.score}%</span>
            </div>
            <p className="text-sm text-slate-200">{turnFeedback.tip}</p>
            <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Sample reply</p>
              <p className="text-sm text-slate-200 mt-1">{turnFeedback.sampleReply}</p>
            </div>
          </section>
        )}
        {showTextComposer && (
          <form onSubmit={handleTextSubmit} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3 animate-fade-in">
            <label htmlFor="quick-start-text-reply" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Type your response
            </label>
            <textarea
              id="quick-start-text-reply"
              value={textResponse}
              onChange={event => setTextResponse(event.target.value)}
              className="w-full min-h-[6rem] rounded-lg bg-slate-900/60 border border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 text-sm text-slate-200 p-3"
              placeholder="Write what you would say out loud..."
              disabled={!canSubmitText || isSubmittingText}
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-slate-400">
                {canSubmitText ? 'Send your reply to hear what the coach says next.' : 'Hang tight while we process the conversation.'}
              </p>
              <button
                type="submit"
                disabled={!canSubmitText || isSubmittingText}
                className="self-end bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-700/70 disabled:cursor-not-allowed text-white font-semibold text-sm py-2 px-4 rounded-full transition-colors duration-200"
              >
                {isSubmittingText ? 'Sending…' : 'Send response'}
              </button>
            </div>
          </form>
        )}
      </main>
      <footer className="flex-shrink-0 flex flex-col items-center gap-4">
        <StatusIndicator status={status} />
        <PracticeControls
          status={status}
          onRecord={toggleRecording}
          onNextTurn={proceedToNextTurn}
          onRetry={onRetry}
          inputMode={inputMode}
          onChangeInputMode={onInputModeChange}
        />
      </footer>
    </div>
  );
};

export const QuickStartView: React.FC<QuickStartViewProps> = ({ onComplete }) => {
  const [sessionKey, setSessionKey] = useState(1);
  const [inputMode, setInputMode] = useState<InputMode>('voice');

  const handleRetry = () => setSessionKey(key => key + 1);
  const handleStartTextMode = () => {
    setInputMode('text');
    setSessionKey(key => key + 1);
  };

  return (
    <QuickStartPractice
      key={sessionKey}
      onComplete={onComplete}
      onRetry={handleRetry}
      inputMode={inputMode}
      onInputModeChange={mode => setInputMode(mode)}
      onStartTextMode={handleStartTextMode}
    />
  );
};
