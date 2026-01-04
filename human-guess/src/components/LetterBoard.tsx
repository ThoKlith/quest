import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface LetterBoardProps {
    word: string;
    revealedLetters: Set<string>;
    wrongLetters: Set<string>;
    onLetterGuess: (letter: string) => void;
    disabled?: boolean;
}

export default function LetterBoard({
    word,
    revealedLetters,
    wrongLetters,
    onLetterGuess,
    disabled
}: LetterBoardProps) {

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (disabled) return;

            const key = event.key.toUpperCase();
            if (/^[A-Z]$/.test(key)) {
                onLetterGuess(key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [disabled, onLetterGuess]);

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col gap-6">
            {/* Word Display */}
            <div className="flex justify-center gap-2 flex-wrap px-4">
                {word.toUpperCase().split('').map((letter, index) => (
                    <motion.div
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="w-10 h-14 sm:w-12 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl font-black border-b-4 border-blue-500"
                    >
                        {revealedLetters.has(letter.toUpperCase()) ? (
                            <span className="text-white">{letter.toUpperCase()}</span>
                        ) : (
                            <span className="text-gray-800">_</span>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Visual Feedback for Wrong Letters (Optional but helpful) */}
            {wrongLetters.size > 0 && (
                <div className="flex justify-center gap-2 flex-wrap px-4 mt-4">
                    {Array.from(wrongLetters).map((letter, index) => (
                        <span key={index} className="text-red-500 font-bold text-lg line-through opacity-50">
                            {letter}
                        </span>
                    ))}
                </div>
            )}

            <div className="text-center text-gray-500 text-sm mt-4">
                Digita sulla tastiera per indovinare
            </div>
        </div>
    );
}
