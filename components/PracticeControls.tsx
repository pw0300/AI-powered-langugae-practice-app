
import React, { useState } from 'react';
import type { PracticeStatus } from '../types';

interface PracticeControlsProps {
  status: PracticeStatus;
  onRecord: () => void;
  onNextTurn: () => void;
  onRetry: () => void;
  onEnd?: () => void;
}

const MicrophoneIcon: React.FC<{ isListening: boolean }> = ({ isListening }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 ${isListening ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
        <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
        <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.75 6.75 0 1 1-13.5 0v-1.5a.75.75 0 0 1 .75-.75Z" />
    </svg>
);

const NextIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z" clipRule="evenodd" />
    </svg>
);

const RetryIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M11.828 2.25c-2.427 0-4.723.69-6.663 1.944-.33.22-.38.69-.08.97l.51.48c.24.23.6.28.89.09A7.48 7.48 0 0 1 12 4.5a7.5 7.5 0 0 1 7.5 7.5 1.5 1.5 0 0 1-1.5 1.5.75.75 0 0 0 0 1.5 3 3 0 0 0 3-3A9 9 0 0 0 12 3a9 9 0 0 0-1.29.112.75.75 0 0 0-.193.034L9.31 2.22a.75.75 0 0 0-1.042.103l-.404.564a.75.75 0 0 0 .103 1.042l1.24 1.258A9.034 9.034 0 0 0 3.68 7.252.75.75 0 0 0 4.16 8.5l.564-.404a.75.75 0 0 0 .103-1.042L3.62 5.845a7.502 7.502 0 0 1 8.208-3.595Z" clipRule="evenodd" />
    </svg>
);


export const PracticeControls: React.FC<PracticeControlsProps> = ({ status, onRecord, onNextTurn, onRetry, onEnd }) => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    
    const showRecordButton = ['ready', 'listening'].includes(status);
    const showNextButton = status === 'turn-complete';
    const showErrorButtons = status === 'error';
    const showPermissionDenied = status === 'permission-denied';
    const isProcessing = ['processing', 'evaluating', 'speaking', 'assessing-final'].includes(status);

    const handleAction = (action: () => void) => {
        if (isButtonDisabled) return;
        setIsButtonDisabled(true);
        action();
        // Re-enable after a short delay to prevent double-taps
        setTimeout(() => setIsButtonDisabled(false), 500);
    };

    const getProcessingText = () => {
        switch(status) {
            case 'evaluating': return 'Evaluating your response...';
            case 'speaking': return 'Getting AI response...';
            case 'assessing-final': return 'Generating final scorecard...';
            case 'processing': return 'Processing audio...';
            default: return 'Please wait...';
        }
    }
    
    return (
        <div className="w-full flex flex-col items-center justify-center h-24">
            {showRecordButton && (
                <button
                    onClick={() => handleAction(onRecord)}
                    disabled={isButtonDisabled}
                    className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 rounded-full transition-transform duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed disabled:scale-100"
                    aria-label={status === 'listening' ? 'Stop recording' : 'Start recording'}
                >
                    <MicrophoneIcon isListening={status === 'listening'} />
                </button>
            )}

            {showNextButton && (
                <button
                    onClick={() => handleAction(onNextTurn)}
                    disabled={isButtonDisabled}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-colors duration-200 animate-fade-in disabled:opacity-75 disabled:cursor-not-allowed"
                >
                    Continue <NextIcon />
                </button>
            )}
            
            {showErrorButtons && (
                 <div className="flex items-center gap-4 animate-fade-in">
                    {onEnd && (
                         <button
                            onClick={onEnd}
                            className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-5 sm:py-3 sm:px-6 rounded-full transition-colors duration-200"
                        >
                           End Practice
                        </button>
                    )}
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-5 sm:py-3 sm:px-6 rounded-full transition-colors duration-200"
                    >
                       Retry Session <RetryIcon />
                    </button>
                </div>
            )}
            
            {showPermissionDenied && (
                <div className="text-center animate-fade-in">
                    <p className="font-semibold text-rose-400">Microphone Access Denied</p>
                    <p className="text-sm text-slate-400 mt-1">Please allow microphone access in your browser to continue.</p>
                </div>
            )}
            
            {isProcessing && (
                <div className="text-center">
                    <div className="flex items-center justify-center" aria-label="Processing...">
                        <div className="w-4 h-4 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-4 h-4 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s] mx-2"></div>
                        <div className="w-4 h-4 bg-slate-400 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 italic">
                        {getProcessingText()}
                    </p>
                </div>
            )}
        </div>
    );
};
