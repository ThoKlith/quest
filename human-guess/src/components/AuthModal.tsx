import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, X, Chrome } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: typeof window !== 'undefined' ? window.location.origin : ''
            }
        });
        if (error) alert(error.message);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm glass p-8 border border-gray-800 text-center"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <LogIn className="text-blue-500" size={32} />
                        </div>

                        <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">Salva i tuoi punti</h2>
                        <p className="text-gray-400 text-sm mb-8">
                            Accedi per comparire nella Hall of Fame e sfidare i tuoi amici ogni giorno.
                        </p>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full bg-white text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all transform active:scale-95"
                        >
                            <Chrome size={20} />
                            CONTINUA CON GOOGLE
                        </button>

                        <button
                            onClick={onClose}
                            className="mt-6 text-sm text-gray-500 hover:text-white font-medium"
                        >
                            Continua come ospite
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
