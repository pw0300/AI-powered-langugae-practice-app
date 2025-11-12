import React, { useRef, useEffect } from 'react';
import type { TranscriptLine } from '../types';

interface TranscriptDisplayProps {
  transcript: TranscriptLine[];
  liveTranscription?: string;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript, liveTranscription }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, liveTranscription]);

  return (
    <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-800/50 rounded-lg h-full">
      {transcript.map((line, index) => (
        <div
          key={index}
          className={`flex items-end gap-2 animate-fade-in ${
            line.speaker === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[85%] sm:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${
              line.speaker === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none'
                : 'bg-slate-600 text-slate-200 rounded-bl-none'
            }`}
          >
            <p className="text-sm">{line.text}</p>
          </div>
        </div>
      ))}
      {liveTranscription && (
        <div
          className={`flex items-end gap-2 justify-end animate-fade-in`}
        >
          <div
            className={`max-w-[85%] sm:max-w-md lg:max-w-lg px-4 py-2 rounded-xl bg-indigo-600/70 text-white/90 rounded-br-none`}
          >
            <p className="text-sm italic">{liveTranscription}</p>
          </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};