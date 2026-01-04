import React from 'react';
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface UnlockLetterButtonProps {
    onUnlock: () => void;
    disabled?: boolean;
}

export default function UnlockLetterButton({ onUnlock, disabled }: UnlockLetterButtonProps) {
    return (
        <motion.button
            onClick={onUnlock}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            className={`
        flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm
        transition-all border-2
        ${disabled
                    ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                    : 'bg-yellow-500/10 border-yellow-500 text-yellow-400 hover:bg-yellow-500/20'
                }
      `}
        >
            <Lightbulb size={20} />
            SBLOCCA LETTERA (-100 pt)
        </motion.button>
    );
}
