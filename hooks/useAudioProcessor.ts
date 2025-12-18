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
  const gainNodeRef = useRef<GainNode | null>(null);

  const startRecording = useCallback(async () => {
    if (isRecording) return;
    setError(null);
    try {
      const audioContext = getInputAudioContext();

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const source = audioContext.createMediaStreamSource(stream);
      mediaStreamSourceRef.current = source;

      // Create a GainNode to mute the audio output to prevent feedback loops
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 0;
      gainNodeRef.current = gainNode;

      // Buffer size, input channels, output channels
      // 4096 provides a good balance between latency and performance overhead
      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = scriptProcessor;

      scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
        // Create a copy of the data to avoid detachment issues
        onAudioProcess(new Float32Array(inputData));
      };
      
      // Connect the graph: Source -> ScriptProcessor -> Gain(Mute) -> Destination
      // We must connect to destination to ensure the browser fires 'onaudioprocess'
      source.connect(scriptProcessor);
      scriptProcessor.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
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
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }

    if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
    }
    
    if (mediaStreamSourceRef.current) {
        mediaStreamSourceRef.current.disconnect();
        mediaStreamSourceRef.current = null;
    }
    
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
    }
    
    setIsRecording(false);
  }, [isRecording]);

  return { isRecording, startRecording, stopRecording, error };
};