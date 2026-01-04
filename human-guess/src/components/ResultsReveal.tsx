'use client';

import { motion } from 'framer-motion';
import { getAccuracyRating } from '@/lib/game-logic';
import ShareButton from './ShareButton';

interface ResultsRevealProps {
    guessValue: number;
    actualValue: number;
    score: number;
    dayNumber: number;
    globalAverage?: number;
}

export default function ResultsReveal({
    guessValue,
    actualValue,
    score,
    dayNumber,
    globalAverage
}: ResultsRevealProps) {
    const accuracy = getAccuracyRating(score);
    const difference = Math.abs(guessValue - actualValue);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="space-y-6"
        >
            {/* Score display */}
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="text-8xl"
                >
                    {accuracy.emoji}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className={`text-4xl font-bold ${accuracy.color}`}>
                        {accuracy.text}
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-6xl font-bold gradient-text"
                >
                    {score}/100
                </motion.div>
            </div>

            {/* Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6 space-y-4"
            >
                <div className="flex justify-between items-center">
                    <span className="opacity-70">Your guess:</span>
                    <span className="text-2xl font-bold">{guessValue}%</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="opacity-70">Actual value:</span>
                    <span className="text-2xl font-bold text-purple-400">{actualValue}%</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="opacity-70">Difference:</span>
                    <span className="text-2xl font-bold">±{difference}%</span>
                </div>

                {globalAverage !== undefined && (
                    <div className="pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center">
                            <span className="opacity-70">Global average:</span>
                            <span className="text-xl font-semibold">{globalAverage}%</span>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Share button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <ShareButton
                    dayNumber={dayNumber}
                    score={score}
                    guessValue={guessValue}
                    actualValue={actualValue}
                />
            </motion.div>

            {/* Come back message */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center opacity-60 text-sm"
            >
                Come back tomorrow for a new question! 🎯
            </motion.p>
        </motion.div>
    );
}
