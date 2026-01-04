import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LetterBoardProps {
    word: string;
    unlockedIndices: Set<number>;
    userGuess: string;
    onLetterGuess: (letter: string) => void;
}

export default function LetterBoard({ word, unlockedIndices, userGuess, onLetterGuess }: LetterBoardProps) {
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
            <div className="flex gap-2 mb-8 flex-wrap justify-center">
                {letters.map((char, index) => {
                    const isUnlocked = unlockedIndices.has(index);
                    let displayChar = '';
                    let statusClass = 'border-gray-700 bg-gray-900/50 text-transparent'; // Default empty

                    if (isUnlocked) {
                        displayChar = char;
                        statusClass = 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]';
                    } else if (userGuessIndex < userGuess.length) {
                        displayChar = userGuess[userGuessIndex];
                        statusClass = 'border-blue-500 bg-blue-500/20 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]';
                        userGuessIndex++;
                    }

                    return (
                        <motion.div
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`w-12 h-14 sm:w-14 sm:h-16 border-2 rounded-xl flex items-center justify-center text-3xl font-black uppercase transition-all ${statusClass}`}
                        >
                            {displayChar}
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="w-full max-w-3xl flex flex-col items-center">
            {renderWord()}

            {/* Visual Keyboard Hint */}
            <div className="text-gray-500 text-sm mt-4">
                Digita sulla tastiera per completare la parola. Premi <span className="font-bold text-white">INVIO</span> per confermare.
            </div>
        </div>
    );
}
