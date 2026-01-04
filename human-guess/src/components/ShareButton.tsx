'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateShareText, copyToClipboard } from '@/lib/share';

interface ShareButtonProps {
    dayNumber: number;
    score: number;
    guessValue: number;
    actualValue: number;
}

export default function ShareButton({
    dayNumber,
    score,
    guessValue,
    actualValue
}: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareText = generateShareText(dayNumber, score, guessValue, actualValue);
        const success = await copyToClipboard(shareText);

        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.button
            onClick={handleShare}
            className="btn-primary w-full relative overflow-hidden"
            whileTap={{ scale: 0.98 }}
        >
            <motion.span
                animate={{ opacity: copied ? 0 : 1 }}
                className="flex items-center justify-center gap-2"
            >
                <span>Share Results</span>
                <span>📤</span>
            </motion.span>

            <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: copied ? 1 : 0,
                    y: copied ? 0 : 20
                }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <span className="flex items-center gap-2">
                    <span>Copied!</span>
                    <span>✓</span>
                </span>
            </motion.span>
        </motion.button>
    );
}
