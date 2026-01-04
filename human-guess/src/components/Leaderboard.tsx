import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Medal } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LeaderboardProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
    const [scores, setScores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'daily' | 'alltime'>('daily');

    useEffect(() => {
        if (isOpen) {
            fetchScores();
        }
    }, [isOpen, tab]);

    const fetchScores = async () => {
        setLoading(true);

        if (tab === 'daily') {
            const today = new Date().toISOString().split('T')[0];

            // Get today's sound first
            const { data: todaySound } = await supabase
                .from('sounds')
                .select('id')
                .eq('day_date', today)
                .single();

            if (todaySound) {
                const { data, error } = await supabase
                    .from('daily_scores')
                    .select(`
                        points,
                        attempts,
                        guest_name,
                        user_id,
                        profiles (username, avatar_url)
                    `)
                    .eq('sound_id', todaySound.id)
                    .order('points', { ascending: false })
                    .order('attempts', { ascending: true })
                    .limit(10);

                if (data) setScores(data);
            }
        } else {
            const { data, error } = await supabase
                .from('profiles')
                .select('username, total_points, avatar_url')
                .order('total_points', { ascending: false })
                .limit(10);

            if (data) setScores(data);
        }
        setLoading(false);
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
                        className="relative w-full max-w-md glass p-8 border border-gray-800"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-3 mb-8">
                            <Trophy className="text-yellow-500" size={32} />
                            <h2 className="text-2xl font-black tracking-tighter uppercase">Classifica</h2>
                        </div>

                        <div className="flex gap-2 mb-6 p-1 bg-gray-900 rounded-xl">
                            <button
                                onClick={() => setTab('daily')}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'daily' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                OGGI
                            </button>
                            <button
                                onClick={() => setTab('alltime')}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'alltime' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                ALL-TIME
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {loading ? (
                                <div className="py-12 text-center text-gray-500 animate-pulse">Caricamento...</div>
                            ) : scores.length > 0 ? (
                                scores.map((score, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 flex items-center justify-center font-black text-lg italic text-gray-500">
                                                {index === 0 ? <Medal className="text-yellow-500" /> : index + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">
                                                    {tab === 'daily'
                                                        ? (score.profiles?.username || score.guest_name || 'Anonimo')
                                                        : score.username}
                                                </div>
                                                {tab === 'daily' && (
                                                    <div className="text-xs text-gray-500">{score.attempts} tentativi</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xl font-black text-blue-400">
                                            {tab === 'daily' ? score.points : score.total_points}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-gray-500">Nessun punteggio ancora.</div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
