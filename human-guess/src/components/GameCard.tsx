'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, Question, Guess } from '@/lib/supabase';
import { getCurrentDayNumber, calculateScore, getGuestId } from '@/lib/game-logic';
import GuessSlider from './GuessSlider';
import ResultsReveal from './ResultsReveal';

export default function GameCard() {
    const [question, setQuestion] = useState<Question | null>(null);
    const [guess, setGuess] = useState(50);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [todayGuess, setTodayGuess] = useState<Guess | null>(null);
    const [globalAverage, setGlobalAverage] = useState<number | undefined>();
    const [loading, setLoading] = useState(true);

    const dayNumber = getCurrentDayNumber();

    useEffect(() => {
        loadTodayQuestion();
        checkExistingGuess();
    }, []);

    async function loadTodayQuestion() {
        try {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .eq('day_number', dayNumber)
                .single();

            if (error) throw error;
            setQuestion(data);
        } catch (error) {
            console.error('Error loading question:', error);
        } finally {
            setLoading(false);
        }
    }

    async function checkExistingGuess() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const guestId = getGuestId();

            let query = supabase
                .from('guesses')
                .select('*')
                .eq('day_number', dayNumber);

            if (user) {
                query = query.eq('user_id', user.id);
            } else {
                query = query.eq('guest_id', guestId);
            }

            const { data, error } = await query.single();

            if (!error && data) {
                setTodayGuess(data);
                await loadGlobalAverage();
            }
        } catch (error) {
            // No guess found, which is fine
        }
    }

    async function loadGlobalAverage() {
        try {
            const { data, error } = await supabase
                .from('guesses')
                .select('guess_value')
                .eq('day_number', dayNumber);

            if (!error && data && data.length > 0) {
                const avg = data.reduce((sum, g) => sum + g.guess_value, 0) / data.length;
                setGlobalAverage(Math.round(avg));
            }
        } catch (error) {
            console.error('Error loading global average:', error);
        }
    }

    async function handleSubmit() {
        if (!question) return;

        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const guestId = getGuestId();
            const score = calculateScore(guess, question.actual_value);

            const guessData = {
                user_id: user?.id || null,
                guest_id: user ? null : guestId,
                question_id: question.id,
                day_number: dayNumber,
                guess_value: guess,
                score: score
            };

            const { data, error } = await supabase
                .from('guesses')
                .insert(guessData)
                .select()
                .single();

            if (error) throw error;

            setTodayGuess(data);
            await loadGlobalAverage();

            // Update user stats if logged in
            if (user) {
                await updateUserStats(user.id, score);
            }
        } catch (error) {
            console.error('Error submitting guess:', error);
            alert('Failed to submit guess. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function updateUserStats(userId: string, score: number) {
        try {
            // Get current stats
            const { data: stats } = await supabase
                .from('user_stats')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (stats) {
                // Check if streak continues
                const lastDay = stats.last_played_day;
                const isConsecutive = lastDay === dayNumber - 1;
                const newStreak = isConsecutive ? stats.current_streak + 1 : 1;

                await supabase
                    .from('user_stats')
                    .update({
                        current_streak: newStreak,
                        longest_streak: Math.max(newStreak, stats.longest_streak),
                        total_score: stats.total_score + score,
                        games_played: stats.games_played + 1,
                        last_played_day: dayNumber,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', userId);
            }
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    if (loading) {
        return (
            <div className="glass-card p-8 text-center">
                <div className="animate-pulse-slow text-4xl mb-4">🤔</div>
                <p className="opacity-70">Loading today&apos;s question...</p>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="glass-card p-8 text-center">
                <div className="text-4xl mb-4">😕</div>
                <p className="opacity-70">No question available for today.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 space-y-8"
        >
            {!todayGuess ? (
                <>
                    {/* Question */}
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="text-4xl mb-4"
                        >
                            🤔
                        </motion.div>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                            {question.question_text}
                        </h2>
                    </div>

                    {/* Slider */}
                    <GuessSlider
                        value={guess}
                        onChange={setGuess}
                        disabled={isSubmitting}
                    />

                    {/* Submit button */}
                    <motion.button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="btn-primary w-full"
                        whileTap={{ scale: 0.98 }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Guess'}
                    </motion.button>
                </>
            ) : (
                <ResultsReveal
                    guessValue={todayGuess.guess_value}
                    actualValue={question.actual_value}
                    score={todayGuess.score}
                    dayNumber={dayNumber}
                    globalAverage={globalAverage}
                />
            )}
        </motion.div>
    );
}
