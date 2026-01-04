'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LetterBoardProps {
    word: string;
    unlockedIndices: Set<number>;
    userGuess: string;
    onInputChange: (value: string) => void;
    onSubmit: () => void;
    isShaking?: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function LetterBoard({
    word,
    unlockedIndices,
    userGuess,
    onInputChange,
    onSubmit,
    isShaking,
    inputRef
}: LetterBoardProps) {

    // Focus input on mount and click
    useEffect(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSubmit();
        }
    };

    const renderWord = () => {
        const letters = word.split('');
        let userGuessIndex = 0;

        return (
            <motion.div
                className="flex gap-1 sm:gap-2 my-8 flex-nowrap justify-center items-center w-full max-w-4xl px-2 cursor-text"
                onClick={handleContainerClick}
                animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                {letters.map((char, index) => {
                    const isUnlocked = unlockedIndices.has(index);
                    let displayChar = '';

                    // Base styles - Dynamic sizing
                    let containerStyle = "relative flex items-center justify-center flex-1 aspect-[3/4] max-w-[3.5rem] min-w-[1.5rem] rounded-lg sm:rounded-xl border-2 transition-all duration-300 backdrop-blur-md overflow-hidden";
                    // Dynamic text size based on container
                    let textStyle = "text-xl sm:text-3xl md:text-4xl font-black uppercase z-10 select-none";

                    if (isUnlocked) {
                        // UNLOCKED (Permanent) - "Jewel" Style
                        displayChar = char;
                        containerStyle += " border-yellow-500 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 shadow-[0_0_15px_rgba(234,179,8,0.4)]";
                        textStyle += " text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]";
                    } else if (userGuessIndex < userGuess.length) {
                        // USER TYPED - "Neon" Style
                        displayChar = userGuess[userGuessIndex];
                        containerStyle += " border-blue-400 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.3)]";
                        textStyle += " text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]";
                        userGuessIndex++;
                    } else {
                        // EMPTY - "Glass" Style
                        containerStyle += " border-white/10 bg-white/5 shadow-inner";
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

                            {/* Shine/Reflection Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />

                            {/* Active Indicator for next empty slot */}
                            {!isUnlocked && userGuessIndex === userGuess.length && index === letters.findIndex((_, i) => !unlockedIndices.has(i) && i >= index) && (
                                <motion.div
                                    layoutId="cursor"
                                    className="absolute bottom-1 sm:bottom-2 w-1/2 h-0.5 sm:h-1 bg-blue-400/50 rounded-full"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </motion.div>
        );
    };

    // Calculate max length for the hidden input
    const maxLength = word.length - unlockedIndices.size;

    return (
        <div className="w-full flex flex-col items-center relative">
            {/* Hidden Input for Mobile/Desktop Typing */}
            <input
                ref={inputRef}
                type="text"
                value={userGuess}
                onChange={(e) => onInputChange(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                onKeyDown={handleKeyDown}
                maxLength={maxLength}
                className="absolute opacity-0 w-full h-full cursor-default -z-10"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck="false"
            />

            {renderWord()}

            {/* Visual Keyboard Hint */}
            <div className="text-gray-500 text-xs sm:text-sm mt-4 font-medium tracking-wide uppercase opacity-70">
                Digita per completare • <span className="text-blue-400 font-bold">INVIO</span> per confermare
            </div>
        </div>
    );
}
