import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LetterBoardProps {
    word: string;
    unlockedIndices: Set<number>;
    userGuess: string;
    onLetterGuess: (letter: string) => void;
    isShaking?: boolean;
}

export default function LetterBoard({ word, unlockedIndices, userGuess, onLetterGuess, isShaking }: LetterBoardProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Allow letters, Backspace, and Enter
            if (/^[a-zA-Z]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') {
                onLetterGuess(e.key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onLetterGuess]);

    const renderWord = () => {
        const letters = word.split('');
        let userGuessIndex = 0;

        return (
            <motion.div
                className="flex gap-3 mb-8 flex-wrap justify-center max-w-4xl px-4"
                animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                {letters.map((char, index) => {
                    const isUnlocked = unlockedIndices.has(index);
                    let displayChar = '';
                    // Base style for all slots
                    let containerStyle = "relative flex items-center justify-center w-12 h-16 sm:w-14 sm:h-20 rounded-xl border-2 transition-all duration-300 backdrop-blur-md";
                    let textStyle = "text-3xl sm:text-4xl font-black uppercase z-10";

                    if (isUnlocked) {
                        // Unlocked (Permanent) - Gold/Neon style
                        displayChar = char;
                        containerStyle += " border-yellow-400/50 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.2)]";
                        textStyle += " text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]";
                    } else if (userGuessIndex < userGuess.length) {
                        // User Typed - Bright White/Blue style
                        displayChar = userGuess[userGuessIndex];
                        containerStyle += " border-blue-400/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]";
                        textStyle += " text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]";
                        userGuessIndex++;
                    } else {
                        // Empty Slot - Glass style
                        containerStyle += " border-white/10 bg-white/5";
                    }

                    return (
                        <motion.div
                            key={index}
                            layout
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={containerStyle}
                        >
                            <span className={textStyle}>{displayChar}</span>
                            {/* Glossy reflection effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        </motion.div>
                    );
                })}
            </motion.div>
        );
    };

    return (
        <div className="w-full flex flex-col items-center">
            {renderWord()}

            {/* Visual Keyboard Hint */}
            <div className="text-gray-500 text-xs sm:text-sm mt-4 font-medium tracking-wide uppercase opacity-70">
                Digita per completare • <span className="text-blue-400 font-bold">INVIO</span> per confermare
            </div>
        </div>
    );
}
