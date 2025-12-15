import React, { useState } from 'react';
import type { Scenario, Scorecard } from '../types';
import { usePracticeSession } from '../hooks/usePracticeSession';
import { TranscriptDisplay } from './TranscriptDisplay';
import { PracticeControls } from './PracticeControls';
import { StatusIndicator } from './StatusIndicator';
import { FeedbackPanel } from './FeedbackPanel';
import { PracticeHeader } from './PracticeHeader';
import { CustomizePersonaModal } from './CustomizePersonaModal';
import { AssessmentLoadingView } from './AssessmentLoadingView';

interface PracticeViewProps {
  scenario: Scenario;
  personalizedGoal: string | null;
  onEndPractice: () => void;
  onPracticeComplete: (scorecard: Scorecard, scenario: Scenario, didPass: boolean) => void;
  onRestartPractice: () => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ 
    scenario: initialScenario, 
    personalizedGoal, 
    onEndPractice, 
    onPracticeComplete,
    onRestartPractice
}) => {
  const [scenario, setScenario] = useState(initialScenario);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);

  const {
    status,
    transcript,
    liveUserTranscription,
    turnFeedback,
    finalScorecard,
    currentTurn,
    toggleRecording,
    proceedToNextTurn,
    didPass,
  } = usePracticeSession(scenario);
  
  // When the final assessment is complete, call the parent handler
  if (status === 'scenario-complete' && finalScorecard) {
      onPracticeComplete(finalScorecard, scenario, didPass);
      return null; // The parent will now show the scorecard view
  }
  
  const handleCustomizePersona = (newPersona: string) => {
    setScenario(prev => ({ ...prev, persona: newPersona }));
    setIsPersonaModalOpen(false);
    // usePracticeSession hook will restart due to scenario dependency change
  };
  
  if (status === 'assessing-final' && !finalScorecard) {
    return <AssessmentLoadingView />;
  }

  return (
    <div className="flex flex-col h-screen w-screen max-w-3xl mx-auto p-2 sm:p-4 bg-slate-900">
      <PracticeHeader 
        title={scenario.title} 
        currentTurn={currentTurn} 
        totalTurns={scenario.maxTurns}
        onBack={onEndPractice}
        onCustomize={() => setIsPersonaModalOpen(true)}
        personalizedGoal={personalizedGoal}
      />

      <main className="flex-grow flex flex-col py-4 min-h-0">
        <TranscriptDisplay transcript={transcript} liveTranscription={liveUserTranscription} />
      </main>
      
      <footer className="flex-shrink-0 flex flex-col items-center">
        { (status !== 'turn-complete' && status !== 'error') && <StatusIndicator status={status} /> }
        {turnFeedback && status === 'turn-complete' && <FeedbackPanel feedback={turnFeedback} />}
        <PracticeControls 
          status={status} 
          onRecord={toggleRecording} 
          onNextTurn={proceedToNextTurn}
          onRetry={onRestartPractice}
          onEnd={onEndPractice}
        />
      </footer>
      
      <CustomizePersonaModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        onSubmit={handleCustomizePersona}
        currentPersona={scenario.persona}
      />
    </div>
  );
};