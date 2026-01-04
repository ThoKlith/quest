'use client';

import { motion } from 'framer-motion';

interface StreakCounterProps {
    streak: number;
    longestStreak?: number;
}

export default function StreakCounter({ streak, longestStreak }: StreakCounterProps) {
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="glass-card px-4 py-2 inline-flex items-center gap-2"
        >
            <motion.span
                animate={{
                    scale: streak > 0 ? [1, 1.2, 1] : 1,
                }}
                transition={{
                    duration: 0.5,
                    repeat: streak > 2 ? Infinity : 0,
                    repeatDelay: 2
                }}
                className="text-2xl"
            >
                🔥
            </motion.span>

            <div className="flex flex-col">
                <span className="text-xl font-bold">{streak}</span>
                {longestStreak !== undefined && longestStreak > streak && (
                    <span className="text-xs opacity-60">Best: {longestStreak}</span>
                )}
            </div>
        </motion.div>
    );
}
