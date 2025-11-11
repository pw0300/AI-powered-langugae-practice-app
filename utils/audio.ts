import { getOutputAudioContext } from './audioContextManager';

/**
 * Decodes a base64 string into a Uint8Array.
 */
export const decodeBase64 = (base64: string): Uint8Array => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Encodes a Uint8Array into a base64 string.
 */
export const encode = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

/**
 * Decodes raw PCM audio data into an AudioBuffer.
 * This is for raw audio streams, not for file formats like WAV or MP3.
 */
export async function decodePcmAudioData(
  data: Uint8Array,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const ctx = getOutputAudioContext();
  
  // The raw data is 16-bit PCM, so 2 bytes per sample.
  const frameCount = data.byteLength / (2 * numChannels);
  const audioBuffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  const pcmData = new Int16Array(data.buffer);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // De-interleave and normalize to [-1.0, 1.0]
      channelData[i] = pcmData[i * numChannels + channel] / 32768.0;
    }
  }
  return audioBuffer;
}


/**
 * Plays an AudioBuffer and calls a callback when finished.
 * @returns The AudioBufferSourceNode for external control (e.g., stopping).
 */
export const playAudioBuffer = (audioBuffer: AudioBuffer, onEnded?: () => void): AudioBufferSourceNode => {
    const ctx = getOutputAudioContext();
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    
    if (onEnded) {
        source.onended = onEnded;
    }
    
    source.start();
    return source;
};
