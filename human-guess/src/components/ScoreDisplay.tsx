import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface ScoreDisplayProps {
    score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
    const spring = useSpring(score, { stiffness: 100, damping: 30 });
    const displayScore = useTransform(spring, (current) => Math.round(current));

    return (
        <div className="fixed top-6 left-6 z-30">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass px-6 py-3 flex flex-col items-end"
            >
                <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Punteggio Attuale</span>
                <motion.span
                    key={score}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`text-4xl font-black tabular-nums ${score > 700 ? 'text-green-400' : score > 300 ? 'text-yellow-400' : 'text-red-400'
                        }`}
                >
                    {score}
                </motion.span>
            </motion.div>
        </div>
    );
}
