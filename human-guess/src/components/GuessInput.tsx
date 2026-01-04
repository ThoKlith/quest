import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuessInputProps {
    dictionary: string[];
    onGuess: (guess: string) => void;
    disabled?: boolean;
}

export default function GuessInput({ dictionary, onGuess, disabled }: GuessInputProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (query.length > 1) {
            const filtered = dictionary
                .filter(word => word.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [query, dictionary]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (query.trim()) {
            onGuess(query.trim());
            setQuery('');
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (word: string) => {
        onGuess(word);
        setQuery('');
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full max-w-md mx-auto mt-8">
            <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cosa senti?"
                    disabled={disabled}
                    className="w-full input-field pl-12 pr-12 text-lg"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                )}
            </form>

            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full mt-2 glass overflow-hidden border border-gray-800"
                    >
                        {suggestions.map((word, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(word)}
                                className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-gray-800 last:border-none"
                            >
                                {word}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
