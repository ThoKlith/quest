import React from 'react';
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
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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

            {/* Letter Buttons */}
            <div className="grid grid-cols-7 gap-2 px-4">
                {alphabet.map((letter) => {
                    const isRevealed = revealedLetters.has(letter);
                    const isWrong = wrongLetters.has(letter);
                    const isUsed = isRevealed || isWrong;

                    return (
                        <motion.button
                            key={letter}
                            onClick={() => !isUsed && !disabled && onLetterGuess(letter)}
                            disabled={isUsed || disabled}
                            whileHover={!isUsed && !disabled ? { scale: 1.1 } : {}}
                            whileTap={!isUsed && !disabled ? { scale: 0.95 } : {}}
                            className={`
                aspect-square rounded-lg font-bold text-sm sm:text-base transition-all
                ${isRevealed ? 'bg-green-500/20 border-green-500 text-green-400 cursor-not-allowed' : ''}
                ${isWrong ? 'bg-red-500/20 border-red-500 text-red-400 line-through cursor-not-allowed' : ''}
                ${!isUsed && !disabled ? 'bg-white/5 border-gray-700 text-white hover:bg-white/10 hover:border-blue-500' : ''}
                ${disabled && !isUsed ? 'opacity-50 cursor-not-allowed' : ''}
                border-2
              `}
                        >
                            {letter}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
