import { useState, useRef, useCallback } from 'react';
import { getInputAudioContext } from '../utils/audioContextManager';

interface UseAudioProcessorOptions {
  onAudioProcess: (data: Float32Array) => void;
}

export const useAudioProcessor = ({ onAudioProcess }: UseAudioProcessorOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    if (isRecording) return;
    setError(null);
    try {
      // CRITICAL FIX: Get the input context which is set to 16kHz
      const audioContext = getInputAudioContext();

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const source = audioContext.createMediaStreamSource(stream);
      mediaStreamSourceRef.current = source;

      // Buffer size, input channels, output channels
      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = scriptProcessor;

      scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
        onAudioProcess(new Float32Array(inputData));
      };
      
      source.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Microphone access denied. Please allow microphone access in your browser settings.");
      setIsRecording(false);
    }
  }, [isRecording, onAudioProcess]);

  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.onaudioprocess = null;
        scriptProcessorRef.current?.disconnect();
        scriptProcessorRef.current = null;
    }
    
    mediaStreamSourceRef.current?.disconnect();
    mediaStreamSourceRef.current = null;
    
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    
    setIsRecording(false);
  }, [isRecording]);

  return { isRecording, startRecording, stopRecording, error };
};
