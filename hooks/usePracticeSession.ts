
import { useState, useEffect, useRef, useCallback } from 'react';
import type { Scenario, TranscriptLine, TurnFeedback, Scorecard, PracticeStatus } from '../types';
import { useUserPreferences } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import {
  connectToGemini,
  createPcmBlob,
  getTurnFeedback,
  getFinalAssessment,
  getLocalizedInitialTurn,
  generateCoachResponse,
} from '../services/geminiService';
import { useAudioProcessor } from './useAudioProcessor';
import { speak } from '../utils/speech';
import { closeAudioContexts } from '../utils/audioContextManager';

// Define a constant for the pass threshold
const PASS_THRESHOLD = 70;

export const usePracticeSession = (scenario: Scenario) => {
  const [status, setStatus] = useState<PracticeStatus>('initializing');
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [liveUserTranscription, setLiveUserTranscription] = useState('');
  const [currentTurn, setCurrentTurn] = useState(1);
  const [turnFeedback, setTurnFeedback] = useState<TurnFeedback | null>(null);
  const [finalScorecard, setFinalScorecard] = useState<Scorecard | null>(null);
  const [didPass, setDidPass] = useState(false);

  const { language, level, speechRate } = useUserPreferences();
  const { showToast } = useToast();
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const fullTranscriptionRef = useRef('');

  const cleanup = useCallback(() => {
    console.log('Cleaning up practice session...');
    sessionPromiseRef.current?.then(session => session.close()).catch(e => console.warn("Error closing session", e));
    closeAudioContexts();
    sessionPromiseRef.current = null;
  }, []);
  
  const { startRecording, stopRecording, error: audioError } = useAudioProcessor({
    onAudioProcess: useCallback((data: Float32Array) => {
      // Only send data if the session is active and we are in listening state
      if (sessionPromiseRef.current) {
        const pcmBlob = createPcmBlob(data);
        sessionPromiseRef.current.then((session) => {
          try {
             session.sendRealtimeInput({ media: pcmBlob });
          } catch (e) {
              console.warn("Failed to send realtime input:", e);
          }
        });
      }
    }, []),
  });

  // Handle Audio Permissions
  useEffect(() => {
    if (audioError) {
      setStatus('permission-denied');
      showToast(audioError, 'error');
    }
  }, [audioError, showToast]);

  useEffect(() => {
    // This effect runs once when the component mounts with a scenario.
    // It sets up the Gemini session and the initial turn.
    setStatus('initializing');
    setTranscript([]);
    setLiveUserTranscription('');
    setCurrentTurn(1);
    setTurnFeedback(null);
    setFinalScorecard(null);
    setDidPass(false);
    fullTranscriptionRef.current = '';

    let isMounted = true;

    const startSession = async () => {
      try {
        // Setup Gemini Live connection
        sessionPromiseRef.current = connectToGemini(scenario.persona, language!, level, {
          onopen: () => {
            if (!isMounted) return;
            console.log('Gemini session opened.');
          },
          onmessage: (message: any) => {
            if (!isMounted) return;
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              fullTranscriptionRef.current += text;
              setLiveUserTranscription(fullTranscriptionRef.current);
            } else if (message.serverContent?.turnComplete) {
              // We manually control turn completion, so this is just for logging.
              console.log('Server detected turn complete.');
            }
          },
          onerror: (e: ErrorEvent) => {
            if (!isMounted) return;
            console.error('Gemini session error:', e);
            // Don't kill the session immediately on minor errors, but log them
            // showToast("Connection unstable...", 'info');
          },
          onclose: (e: CloseEvent) => {
            if (!isMounted) return;
            console.log('Gemini session closed.');
          },
        });
        
        // Wait for the session to be established before proceeding
        await sessionPromiseRef.current;

        // Get and speak the initial turn
        const initialTurnText = await getLocalizedInitialTurn(scenario, language!);
        if (!isMounted) return;

        setTranscript([{ speaker: 'coach', text: initialTurnText }]);
        
        speak(initialTurnText, speechRate, () => {
          if (isMounted) {
            setStatus('ready');
          }
        });
      } catch (err) {
        console.error('Failed to start session:', err);
        if (isMounted) {
          setStatus('error');
          showToast("Failed to start session. Please check your connection.", 'error');
        }
      }
    };

    startSession();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [scenario, language, level, speechRate, cleanup, showToast]); // Rerun if scenario changes

  const processUserTurn = useCallback(async (userText: string) => {
    if (!userText || !userText.trim()) {
      showToast("I didn't catch that. Please try speaking again.", 'info');
      setStatus('ready');
      return;
    }
    
    const newTranscript = [...transcript, { speaker: 'user' as const, text: userText }];
    setTranscript(newTranscript);

    setStatus('evaluating');
    const feedback = await getTurnFeedback(scenario, newTranscript, language!);
    if (feedback) {
      setTurnFeedback(feedback);
      setStatus('turn-complete');
    } else {
      console.error("Failed to get turn feedback.");
      setStatus('error');
      showToast("Unable to evaluate response. Please try again.", 'error');
    }
  }, [transcript, scenario, language, showToast]);

  const toggleRecording = useCallback(async () => {
    if (status === 'ready') {
      fullTranscriptionRef.current = '';
      setLiveUserTranscription('');
      await startRecording();
      setStatus('listening');
    } else if (status === 'listening') {
      stopRecording();
      setStatus('processing');
      // Give a moment for final transcription to arrive from the socket
      // This simple delay is a robust way to handle network latency for the final packet.
      // We also add a check to ensure we don't process empty input if the user clicked too fast.
      setTimeout(() => {
        const text = fullTranscriptionRef.current;
        if (text && text.trim().length > 0) {
            processUserTurn(text);
        } else {
            showToast("No speech detected. Please try again.", "info");
            setStatus('ready');
        }
      }, 1500); 
    }
  }, [status, startRecording, stopRecording, processUserTurn, showToast]);
  
  const startFinalAssessment = useCallback(async () => {
    setStatus('assessing-final');
    const scorecard = await getFinalAssessment(scenario, transcript, language!);
    if (scorecard) {
      setFinalScorecard(scorecard);
      const passed = scorecard.overallScore >= PASS_THRESHOLD;
      setDidPass(passed);
      setStatus('scenario-complete');
    } else {
      console.error("Failed to get final assessment.");
      setStatus('error');
      showToast("Failed to generate final report. Please try again.", 'error');
    }
  }, [scenario, transcript, language, showToast]);
  
  const proceedToNextTurn = useCallback(async () => {
    setTurnFeedback(null);
    const nextTurn = currentTurn + 1;
    
    if (nextTurn > scenario.maxTurns) {
        startFinalAssessment();
        return;
    }
    
    setCurrentTurn(nextTurn);
    setStatus('speaking');
    
    const coachResponseText = await generateCoachResponse(scenario, transcript, language!, level);
    setTranscript(prev => [...prev, { speaker: 'coach', text: coachResponseText }]);

    // Only set ready after TTS is effectively queued
    speak(coachResponseText, speechRate, () => {
      setStatus('ready');
    });
  }, [currentTurn, scenario, transcript, language, level, speechRate, startFinalAssessment]);
  

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
  };
};
