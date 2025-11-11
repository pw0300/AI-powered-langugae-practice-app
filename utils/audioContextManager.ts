let inputAudioContext: AudioContext | null = null;
let outputAudioContext: AudioContext | null = null;

/**
 * Gets a singleton AudioContext for microphone input.
 * CRITICAL: Gemini Live API requires a 16000Hz sample rate for input.
 */
export const getInputAudioContext = (): AudioContext => {
  if (!inputAudioContext || inputAudioContext.state === 'closed') {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    inputAudioContext = new AudioContext({ sampleRate: 16000 });
    console.log('Created new Input AudioContext at 16kHz.');
  }
  if (inputAudioContext.state === 'suspended') {
    inputAudioContext.resume();
  }
  return inputAudioContext;
};

/**
 * Gets a singleton AudioContext for audio playback.
 * Gemini TTS API often outputs at a 24000Hz sample rate.
 */
export const getOutputAudioContext = (): AudioContext => {
  if (!outputAudioContext || outputAudioContext.state === 'closed') {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    outputAudioContext = new AudioContext({ sampleRate: 24000 });
    console.log('Created new Output AudioContext at 24kHz.');
  }
  if (outputAudioContext.state === 'suspended') {
    outputAudioContext.resume();
  }
  return outputAudioContext;
};

/**
 * Closes and releases all audio contexts.
 * This is CRITICAL to call between sessions to prevent a "zombie" audio state.
 */
export const closeAudioContexts = () => {
  if (inputAudioContext) {
    inputAudioContext.close().then(() => {
      inputAudioContext = null;
      console.log('Input AudioContext closed.');
    });
  }
  if (outputAudioContext) {
    outputAudioContext.close().then(() => {
      outputAudioContext = null;
      console.log('Output AudioContext closed.');
    });
  }
};
