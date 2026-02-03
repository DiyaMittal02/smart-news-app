import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechState {
    isSupported: boolean;
    isPlaying: boolean;
    isPaused: boolean;
}

export function useSpeech() {
    const [state, setState] = useState<SpeechState>({
        isSupported: false,
        isPlaying: false,
        isPaused: false,
    });

    const utteranceQueue = useRef<string[]>([]);
    const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);
    const isActuallyPlaying = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setState(s => ({ ...s, isSupported: true }));
        }
    }, []);

    const speakChunk = useCallback((lang: string) => {
        if (utteranceQueue.current.length === 0) {
            setState(s => ({ ...s, isPlaying: false }));
            isActuallyPlaying.current = false;
            return;
        }

        const chunk = utteranceQueue.current.shift();
        if (!chunk) return;

        const u = new SpeechSynthesisUtterance(chunk);

        // Language Mapping
        const langMap: Record<string, string> = {
            'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN',
            'kn': 'kn-IN', 'ml': 'ml-IN', 'bn': 'bn-IN', 'gu': 'gu-IN',
            'mr': 'mr-IN', 'pa': 'pa-IN'
        };
        u.lang = langMap[lang] || lang;
        u.rate = 1.0;

        // Voice Selection Logic (Optional but good)
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang === u.lang) || voices.find(v => v.lang.startsWith(lang));
        if (preferredVoice) u.voice = preferredVoice;

        u.onend = () => {
            if (isActuallyPlaying.current) {
                speakChunk(lang);
            }
        };

        u.onerror = () => {
            if (isActuallyPlaying.current) {
                speakChunk(lang);
            }
        };

        currentUtterance.current = u;
        window.speechSynthesis.speak(u);
    }, []);

    const speak = useCallback((text: string, lang: string = 'en') => {
        if (!text) return;

        // Stop previous
        window.speechSynthesis.cancel();
        utteranceQueue.current = [];
        isActuallyPlaying.current = true;
        setState(s => ({ ...s, isPlaying: true }));

        // Split text into chunks (approx 150 chars, respecting punctuation)
        // Simple regex split by sentences to avoid browser timeouts
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        utteranceQueue.current = Array.from(sentences);

        speakChunk(lang);
    }, [speakChunk]);

    const stop = useCallback(() => {
        isActuallyPlaying.current = false;
        utteranceQueue.current = [];
        window.speechSynthesis.cancel();
        setState(s => ({ ...s, isPlaying: false, isPaused: false }));
    }, []);

    return {
        ...state,
        speak,
        stop
    };
}
