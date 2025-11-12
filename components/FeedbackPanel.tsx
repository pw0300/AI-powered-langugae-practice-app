import React from 'react';
import type { TurnFeedback } from '../types';

interface FeedbackPanelProps {
  feedback: TurnFeedback;
}

const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = () => {
        if (score >= 80) return 'bg-emerald-600';
        if (score >= 50) return 'bg-amber-600';
        return 'bg-rose-600';
    };
    return (
        <div className={`text-sm font-bold text-white px-3 py-1 rounded-full ${getScoreColor()}`}>
            Score: {score}%
        </div>
    );
};

const ProTipIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a14.994 14.994 0 0 1-4.5 0M9.75 15.75A3 3 0 0 1 12 12.75a3 3 0 0 1 2.25 3M16.5 7.5a3 3 0 0 0-3-3M9.75 7.5a3 3 0 0 1 3-3m-3 3a3 3 0 0 0-3 3" />
    </svg>
);

const SampleReplyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.32 1.011l-4.242 4.102a.563.563 0 0 0-.162.524l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.162-.524l-4.242-4.102a.562.562 0 0 1 .32-1.011l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
);


export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="mt-2 max-w-xl w-full p-4 border border-slate-600 bg-slate-700/50 rounded-lg shadow-md animate-fade-in">
        <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-base sm:text-md text-slate-200">Instant Feedback</h4>
            <ScoreBadge score={feedback.score} />
        </div>
        <div className="space-y-3">
            <div className="flex items-start gap-3">
                <ProTipIcon className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                    <h5 className="font-semibold text-sm text-slate-200">Pro Tip</h5>
                    <p className="text-sm text-slate-300">{feedback.tip}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <SampleReplyIcon className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                 <div>
                    <h5 className="font-semibold text-sm text-slate-200">Sample Reply</h5>
                    <p className="text-sm text-slate-300 italic">"{feedback.sampleReply}"</p>
                </div>
            </div>
        </div>
    </div>
  );
};