/**
 * Browser Speech Recognition and Audio Synthesis Service
 * Provides seamless voice query and text-to-speech reading for low-literacy citizens.
 */

export const isSpeechRecognitionSupported = () => {
  return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
};

export const createSpeechRecognizer = (options = {}) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous = options.continuous || false;
  recognition.interimResults = options.interimResults !== undefined ? options.interimResults : true;
  recognition.lang = options.lang || 'hi-IN';

  return recognition;
};

export const speakText = (text, lang = 'hi-IN') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95; // Slightly slower for clear rural comprehension
  utterance.pitch = 1.0;

  // Try to pick an Indian voice if available
  const voices = window.speechSynthesis.getVoices();
  const indianVoice = voices.find((v) => v.lang.includes('hi') || v.lang.includes('IN'));
  if (indianVoice) {
    utterance.voice = indianVoice;
  }

  window.speechSynthesis.speak(utterance);
  return true;
};

export const stopSpeaking = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
