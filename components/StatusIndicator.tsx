import React from 'react';
import type { PracticeStatus } from '../types';

interface StatusIndicatorProps {
  status: PracticeStatus;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusText = () => {
    switch (status) {
      case 'ready':
        return 'Ready to start. Press the microphone when you want to speak.';
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing your response...';
      case 'evaluating':
        return 'Evaluating your response...';
      case 'speaking':
        return 'AI Coach is speaking...';
      case 'turn-complete':
        return "Turn complete. Review your feedback and press 'Continue'.";
      case 'assessing-final':
        return 'Generating your performance scorecard...';
      case 'scenario-complete':
        return "Congratulations! You've completed the scenario.";
      case 'error':
        return 'An error occurred. Please try again.';
      default:
        return 'Preparing your session...';
    }
  };

  return (
    <div className="text-center py-2 px-4 bg-slate-800 rounded-lg mb-4 h-10 flex items-center justify-center">
      <p className="text-slate-300 italic">{getStatusText()}</p>
    </div>
  );
};