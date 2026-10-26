// src/utils/textToSpeech.js

export const isSpeechSupported = () => {
    return (
        "speechSynthesis" in window &&
        "SpeechSynthesisUtterance" in window
    );
};

export const speakText = (text, options = {}) => {
    if (!isSpeechSupported()) {
        return;
    }

    if (!text || !text.trim()) {
        return;
    }

    // Stop any currently running speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Speech settings
    utterance.lang = options.lang || "en-IN";
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume ?? 1;

    // Try to find a suitable voice
    const voices = window.speechSynthesis.getVoices();

    const languagePrefix = utterance.lang
        .toLowerCase()
        .split("-")[0];

    const matchingVoice = voices.find((voice) =>
        voice.lang
            .toLowerCase()
            .startsWith(languagePrefix)
    );

    if (matchingVoice) {
        utterance.voice = matchingVoice;
    }

    // Events
    utterance.onend = () => {
        if (options.onEnd) {
            options.onEnd();
        }
    };

    utterance.onerror = (event) => {
        console.error("Text-to-Speech error:", event);

        if (options.onError) {
            options.onError(event);
        }
    };

    window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
    if (isSpeechSupported()) {
        window.speechSynthesis.cancel();
    }
};

export const pauseSpeech = () => {
    if (isSpeechSupported()) {
        window.speechSynthesis.pause();
    }
};

export const resumeSpeech = () => {
    if (isSpeechSupported()) {
        window.speechSynthesis.resume();
    }
};