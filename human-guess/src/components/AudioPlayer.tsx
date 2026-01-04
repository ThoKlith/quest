import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
    audioUrl: string;
    maxDuration: number;
    onUnlock: () => void;
    canUnlock: boolean;
}

export default function AudioPlayer({ audioUrl, maxDuration, onUnlock, canUnlock }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = audioUrl;
        }
    }, [audioUrl]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            const current = audio.currentTime;
            if (current >= maxDuration) {
                audio.pause();
                audio.currentTime = 0;
                setIsPlaying(false);
                setProgress(0);
            } else {
                setProgress((current / maxDuration) * 100);
            }
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setProgress(0);
        });

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
        };
    }, [maxDuration]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto p-8 glass">
            <audio ref={audioRef} />

            <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-800"
                    />
                    <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={553}
                        initial={{ strokeDashoffset: 553 }}
                        animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
                        className="text-blue-500"
                    />
                </svg>

                <button
                    onClick={togglePlay}
                    className="z-10 bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-full shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95"
                >
                    {isPlaying ? <Pause size={48} /> : <Play size={48} fill="currentColor" />}
                </button>
            </div>

            <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                    Durata Sbloccata: {maxDuration}s
                </span>

                <AnimatePresence>
                    {canUnlock && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            onClick={onUnlock}
                            className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <Unlock size={16} />
                            SBLOCCA PIÙ AUDIO (-50 pt)
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
