'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase, UserStats, Guess } from '@/lib/supabase';
import Link from 'next/link';

export default function StatsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [recentGuesses, setRecentGuesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push('/');
            return;
        }

        setUser(user);
        await loadStats(user.id);
        await loadRecentGuesses(user.id);
        setLoading(false);
    }

    async function loadStats(userId: string) {
        const { data } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (data) setStats(data);
    }

    async function loadRecentGuesses(userId: string) {
        const { data } = await supabase
            .from('guesses')
            .select(`
        *,
        questions (question_text, actual_value)
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (data) setRecentGuesses(data);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse-slow text-6xl">📊</div>
            </div>
        );
    }

    const avgScore = stats && stats.games_played > 0
        ? Math.round(stats.total_score / stats.games_played)
        : 0;

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold gradient-text">Your Stats</h1>
                    <Link href="/" className="btn-secondary">
                        ← Back
                    </Link>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 text-center"
                    >
                        <div className="text-4xl font-bold gradient-text">
                            {stats?.games_played || 0}
                        </div>
                        <div className="text-sm opacity-70 mt-2">Games Played</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6 text-center"
                    >
                        <div className="text-4xl font-bold gradient-text">
                            {stats?.current_streak || 0}
                        </div>
                        <div className="text-sm opacity-70 mt-2">Current Streak 🔥</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 text-center"
                    >
                        <div className="text-4xl font-bold gradient-text">
                            {stats?.longest_streak || 0}
                        </div>
                        <div className="text-sm opacity-70 mt-2">Longest Streak</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-6 text-center"
                    >
                        <div className="text-4xl font-bold gradient-text">
                            {avgScore}
                        </div>
                        <div className="text-sm opacity-70 mt-2">Avg Score</div>
                    </motion.div>
                </div>

                {/* Recent guesses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <h2 className="text-2xl font-bold mb-4">Recent Guesses</h2>

                    {recentGuesses.length === 0 ? (
                        <p className="opacity-70 text-center py-8">No guesses yet. Play your first game!</p>
                    ) : (
                        <div className="space-y-3">
                            {recentGuesses.map((guess, idx) => (
                                <div
                                    key={guess.id}
                                    className="glass-card p-4 flex items-center justify-between"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-sm opacity-90 mb-1">
                                            {guess.questions?.question_text}
                                        </p>
                                        <div className="flex gap-4 text-xs opacity-70">
                                            <span>Your guess: {guess.guess_value}%</span>
                                            <span>Actual: {guess.questions?.actual_value}%</span>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold gradient-text">
                                        {guess.score}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
