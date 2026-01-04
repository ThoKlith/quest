import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle } from 'lucide-react';

interface HistoryProps {
    guesses: string[];
}

export default function History({ guesses }: HistoryProps) {
    return (
        <div className="w-full max-w-md mx-auto mt-12 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center mb-2">
                Tentativi ({guesses.length})
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
                <AnimatePresence mode="popLayout">
                    {guesses.map((guess, index) => (
                        <motion.div
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-sm line-through decoration-red-500/50"
                        >
                            <XCircle size={14} />
                            {guess}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
