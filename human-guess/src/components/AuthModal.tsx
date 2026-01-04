'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleAuth() {
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Check your email to confirm your account!');
                onClose();
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onSuccess();
                onClose();
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card p-8 max-w-md w-full space-y-6"
                        >
                            <div className="text-center">
                                <h2 className="text-3xl font-bold gradient-text mb-2">
                                    {isSignUp ? 'Sign Up' : 'Sign In'}
                                </h2>
                                <p className="opacity-70 text-sm">
                                    {isSignUp
                                        ? 'Create an account to save your progress'
                                        : 'Welcome back! Sign in to continue'}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm opacity-70 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl glass-card border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm opacity-70 mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl glass-card border-0 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {error && (
                                    <div className="text-red-400 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleAuth}
                                    disabled={loading || !email || !password}
                                    className="btn-primary w-full"
                                >
                                    {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                                </button>

                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="w-full text-sm opacity-70 hover:opacity-100 transition-opacity"
                                >
                                    {isSignUp
                                        ? 'Already have an account? Sign in'
                                        : "Don't have an account? Sign up"}
                                </button>

                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-xs opacity-60 text-center">
                                        You can also continue as a guest, but your progress won&apos;t be saved across devices.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
