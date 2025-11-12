import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  Scenario,
  PracticeStatus,
  TranscriptLine,
  TurnFeedback,
  Scorecard,
  PracticeErrorInfo,
} from '../types';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import { useGamificationContext } from '../contexts/GamificationContext';
import { useAudioProcessor } from './useAudioProcessor';
import { speak } from '../utils/speech';
import { connectToGemini, createPcmBlob, getTurnFeedback, getFinalAssessment, getLocalizedInitialTurn, generateCoachResponse } from '../services/geminiService';
import { closeAudioContexts } from '../utils/audioContextManager';

// Define a threshold for passing the scenario
const PASSING_THRESHOLD = 70;

export const usePracticeSession = (scenario: Scenario) => {
  const { language, level, speechRate } = useUserPreferences();
  const { addXpAndCheckAchievements } = useGamificationContext();

  const [status, setStatus] = useState<PracticeStatus>('initializing');
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [liveUserTranscription, setLiveUserTranscription] = useState('');
  const [turnFeedback, setTurnFeedback] = useState<TurnFeedback | null>(null);
  const [finalScorecard, setFinalScorecard] = useState<Scorecard | null>(null);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [didPass, setDidPass] = useState(false);
  const [errorInfo, setErrorInfo] = useState<PracticeErrorInfo | null>(null);

  const sessionRef = useRef<any>(null); // To hold the Gemini Live session
  const fullTranscriptionRef = useRef(''); // To accumulate transcription chunks

  const appendToTranscript = (line: TranscriptLine) => {
    setTranscript(prev => [...prev, line]);
  };
  
  const handleAudioProcess = useCallback((data: Float32Array) => {
    if (sessionRef.current) {
        const pcmBlob = createPcmBlob(data);
        sessionRef.current.sendRealtimeInput({ media: pcmBlob });
    }
  }, []);

  const { isRecording, startRecording, stopRecording, error: audioError } = useAudioProcessor({ onAudioProcess: handleAudioProcess });
  
  useEffect(() => {
    if (audioError) {
      setStatus('permission-denied');
      setErrorInfo({
        type: 'audio',
        message:
          'We could not access your microphone. The browser may be blocking it or another application might be using it.',
        troubleshooting: [
          'Check the browser address bar for a microphone permission prompt and allow access.',
          'Ensure no other application is using your microphone.',
          'If the issue persists, use the text warm-up option instead of the microphone.',
        ],
      });
    }
  }, [audioError]);

  const endSession = useCallback(async () => {
    speak('', speechRate); // Stop any ongoing speech
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    stopRecording();
    // CRITICAL: Close audio contexts to prevent zombie state
    closeAudioContexts();
  }, [stopRecording, speechRate]);

  const processUserTurn = useCallback(
    async (manualResponse?: string) => {
      setStatus('processing');

      const responseSource = manualResponse ?? fullTranscriptionRef.current;
      const userResponseText = responseSource.trim();
      fullTranscriptionRef.current = '';
      setLiveUserTranscription('');
      if (!userResponseText) {
        setStatus('speaking');
        // Handle case where user doesn't say anything
        const coachText = "I didn't catch that. Could you please say it again?";
        appendToTranscript({ speaker: 'coach', text: coachText });
        speak(coachText, speechRate, () => {
          setStatus('ready');
        });
        return;
      }
    
      const newHistory: TranscriptLine[] = [...transcript, { speaker: 'user', text: userResponseText }];
      appendToTranscript({ speaker: 'user', text: userResponseText });

      setStatus('evaluating');
      const feedback = await getTurnFeedback(scenario, newHistory, language!);
      setTurnFeedback(feedback);

      if (currentTurn >= scenario.maxTurns) {
        setStatus('assessing-final');
        const scorecard = await getFinalAssessment(scenario, newHistory, language!);
        if (scorecard) {
          setFinalScorecard(scorecard);
          const pass = scorecard.overallScore >= PASSING_THRESHOLD;
          setDidPass(pass);
          if (pass) {
            addXpAndCheckAchievements(scorecard, scenario);
          }
          setStatus('scenario-complete');
        } else {
          setErrorInfo({
            type: 'unknown',
            message: 'We were unable to finish evaluating your warm-up. Please try again.',
          });
          setStatus('error');
        }
      } else {
        setStatus('speaking');
        const coachText = await generateCoachResponse(scenario, newHistory, language!, level);
        appendToTranscript({ speaker: 'coach', text: coachText });
        speak(coachText, speechRate, () => {
          setStatus('turn-complete');
        });
      }
    },
    [
      currentTurn,
      transcript,
      language,
      level,
      scenario,
      addXpAndCheckAchievements,
      speechRate,
    ],
  );

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
      // Add a small delay to ensure final transcription chunks are received before processing.
      setTimeout(() => {
        processUserTurn();
      }, 500);
    } else {
      fullTranscriptionRef.current = '';
      setLiveUserTranscription('');
      setTurnFeedback(null);
      startRecording();
      setStatus('listening');
    }
  }, [isRecording, startRecording, stopRecording, processUserTurn]);

  const proceedToNextTurn = useCallback(() => {
    setCurrentTurn(prev => prev + 1);
    setStatus('ready');
    setTurnFeedback(null);
    fullTranscriptionRef.current = '';
  }, []);

  useEffect(() => {
    // This effect runs once when the component mounts or scenario changes.
    // It sets up the Gemini Live session and starts the conversation.
    let isMounted = true;

    async function setupSession() {
      setStatus('initializing');
      setTranscript([]); // Reset transcript for new scenario
      setTurnFeedback(null);
      setFinalScorecard(null);
      setCurrentTurn(1);
      setDidPass(false);
      setErrorInfo(null);
      fullTranscriptionRef.current = '';
      setLiveUserTranscription('');

      const sessionCallbacks = {
        onopen: () => console.log('Gemini Live session opened.'),
        onmessage: (message: any) => {
          if (!isMounted) return;
          if (message.serverContent?.inputTranscription) {
            const text = message.serverContent.inputTranscription.text;
            fullTranscriptionRef.current += text;
            setLiveUserTranscription(fullTranscriptionRef.current);
          }
        },
        onerror: (e: ErrorEvent) => {
          if (!isMounted) return;
          console.error('Gemini Live session error:', e);
          setStatus('error');
          setErrorInfo({
            type: 'session',
            message: 'We lost our connection to the speech coach mid-practice.',
            troubleshooting: [
              'Check your internet connection and try again.',
              'If the issue continues, continue to personalization and revisit the warm-up later.',
            ],
          });
          endSession();
        },
        onclose: (e: CloseEvent) => {
          console.log('Gemini Live session closed.');
        },
      };

      try {
        const session = await connectToGemini(scenario.persona, language!, level, sessionCallbacks);
        if (!isMounted) {
          session.close();
          return;
        }
        sessionRef.current = session;

        const initialTurnText = await getLocalizedInitialTurn(scenario, language!);
        if (!isMounted) return;
        appendToTranscript({ speaker: 'coach', text: initialTurnText });

        setStatus('speaking');
        speak(initialTurnText, speechRate, () => {
          if (isMounted) {
            setStatus('ready');
          }
        });
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to connect to Gemini Live:", err);
        setStatus('error');
        const isOffline = typeof navigator !== 'undefined' && navigator?.onLine === false;
        setErrorInfo({
          type: isOffline ? 'network' : 'unknown',
          message: isOffline
            ? 'It looks like you are offline, so we cannot start the warm-up just yet.'
            : 'We could not reach the speech coach service to start your warm-up.',
          troubleshooting: isOffline
            ? [
                'Reconnect to the internet and try again.',
                'If you prefer, skip ahead to personalize your practice while offline.',
              ]
            : [
                'Check your network connection and try again.',
                'If this keeps happening, continue to personalization and revisit the warm-up later.',
              ],
        });
      }
    }

    setupSession();

    // Cleanup function: This is CRITICAL.
    return () => {
      isMounted = false;
      endSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]); // Rerun effect if scenario changes

  const submitTextResponse = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }

      setTurnFeedback(null);
      await processUserTurn(trimmed);
    },
    [processUserTurn],
  );

  return {
    status,
    transcript,
    liveUserTranscription,
    turnFeedback,
    finalScorecard,
    currentTurn,
    toggleRecording,
    proceedToNextTurn,
    didPass,
    submitTextResponse,
    errorInfo,
  };
};
