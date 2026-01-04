'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface LeaderboardEntry {
    user_id: string;
    total_score: number;
    games_played: number;
    current_streak: number;
    longest_streak: number;
}

export default function LeaderboardPage() {
    const [topScores, setTopScores] = useState<LeaderboardEntry[]>([]);
    const [topStreaks, setTopStreaks] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'scores' | 'streaks'>('scores');

    useEffect(() => {
        loadLeaderboards();
    }, []);

    async function loadLeaderboards() {
        // Top scores
        const { data: scores } = await supabase
            .from('user_stats')
            .select('*')
            .order('total_score', { ascending: false })
            .limit(10);

        if (scores) setTopScores(scores);

        // Top streaks
        const { data: streaks } = await supabase
            .from('user_stats')
            .select('*')
            .order('longest_streak', { ascending: false })
            .limit(10);

        if (streaks) setTopStreaks(streaks);

        setLoading(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse-slow text-6xl">🏆</div>
            </div>
        );
    }

    const displayData = activeTab === 'scores' ? topScores : topStreaks;

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold gradient-text">Leaderboard</h1>
                    <Link href="/" className="btn-secondary">
                        ← Back
                    </Link>
                </div>

                {/* Tabs */}
                <div className="glass-card p-2 flex gap-2">
                    <button
                        onClick={() => setActiveTab('scores')}
                        className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${activeTab === 'scores'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'opacity-60 hover:opacity-100'
                            }`}
                    >
                        Top Scores 🎯
                    </button>
                    <button
                        onClick={() => setActiveTab('streaks')}
                        className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${activeTab === 'streaks'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                : 'opacity-60 hover:opacity-100'
                            }`}
                    >
                        Top Streaks 🔥
                    </button>
                </div>

                {/* Leaderboard */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6"
                >
                    {displayData.length === 0 ? (
                        <p className="text-center opacity-70 py-8">No data yet. Be the first!</p>
                    ) : (
                        <div className="space-y-3">
                            {displayData.map((entry, idx) => (
                                <motion.div
                                    key={entry.user_id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="glass-card p-4 flex items-center gap-4"
                                >
                                    {/* Rank */}
                                    <div className="text-3xl font-bold w-12 text-center">
                                        {idx === 0 && '🥇'}
                                        {idx === 1 && '🥈'}
                                        {idx === 2 && '🥉'}
                                        {idx > 2 && (
                                            <span className="opacity-60">#{idx + 1}</span>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex-1">
                                        <div className="font-semibold">Player {entry.user_id.slice(0, 8)}</div>
                                        <div className="text-sm opacity-70">
                                            {entry.games_played} games played
                                        </div>
                                    </div>

                                    {/* Score */}
                                    <div className="text-right">
                                        <div className="text-2xl font-bold gradient-text">
                                            {activeTab === 'scores' ? entry.total_score : entry.longest_streak}
                                        </div>
                                        <div className="text-xs opacity-60">
                                            {activeTab === 'scores' ? 'total points' : 'day streak'}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
