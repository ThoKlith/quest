'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import AudioPlayer from '@/components/AudioPlayer';
import LetterBoard from '@/components/LetterBoard';
import UnlockLetterButton from '@/components/UnlockLetterButton';
import ScoreDisplay from '@/components/ScoreDisplay';
import Leaderboard from '@/components/Leaderboard';
import AuthModal from '@/components/AuthModal';
import ProfileMenu from '@/components/ProfileMenu';
import { calculatePoints, AUDIO_STEPS, formatScoreSummary, LETTER_UNLOCK_PENALTY } from '@/lib/game-logic';
import { supabase } from '@/lib/supabase';
import { Share2, Trophy, LogIn, LogOut, User } from 'lucide-react';

export default function GamePage() {
  const [sound, setSound] = useState<{
    id: string;
    audio_url: string;
    correct_answer: string;
    dictionary: string[];
  } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(1000);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [unlockedIndices, setUnlockedIndices] = useState<Set<number>>(new Set());
  const [userGuess, setUserGuess] = useState<string>('');
  const [wrongLetters, setWrongLetters] = useState<Set<string>>(new Set()); // Tracks failed word attempts
  const [letterUnlocks, setLetterUnlocks] = useState(0);
  const [lastGameTimestamp, setLastGameTimestamp] = useState<number>(0);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [todayScore, setTodayScore] = useState<number | null>(null);


  useEffect(() => {
    setMounted(true);
    fetchDailySound();
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      // Create profile if user just signed in and doesn't have one
      if (event === 'SIGNED_IN' && session?.user) {
        await createProfileIfNotExists(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createProfileIfNotExists = async (user: any) => {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!existingProfile) {
      const username = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      await supabase.from('profiles').insert({
        id: user.id,
        username: username,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture
      });
    }
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await createProfileIfNotExists(user);
    }
    setAuthLoading(false);
  };

  // Check if user already played today (DB or LocalStorage)
  const checkAlreadyPlayed = async (soundId: string, userId?: string) => {
    let hasPlayed = false;
    let score = 0;

    // 1. Check DB if logged in
    if (userId) {
      const { data } = await supabase
        .from('daily_scores')
        .select('points')
        .eq('user_id', userId)
        .eq('sound_id', soundId)
        .single();

      if (data) {
        hasPlayed = true;
        score = data.points;
      }
    }

    // 2. Check LocalStorage (fallback or guest)
    if (!hasPlayed) {
      const localData = typeof window !== 'undefined' ? localStorage.getItem(`played_${soundId}`) : null;
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          hasPlayed = true;
          score = parsed.points;
        } catch (e) { console.error('Error parsing local score', e); }
      }
    }

    if (hasPlayed) {
      console.log('User already played this sound', soundId);
      setAlreadyPlayed(true);
      setTodayScore(score);
      setIsFinished(true);
    } else {
      setAlreadyPlayed(false);
      setIsFinished(false);
    }
  };

  // Check when user logs in or sound loads
  useEffect(() => {
    if (sound && sound.id !== 'fallback' && !authLoading) {
      console.log('Checking already played for sound:', sound.id);
      checkAlreadyPlayed(sound.id, user?.id);
    }
  }, [user, sound, authLoading]);

  const fetchDailySound = async () => {
    try {
      // Check for test date in URL (e.g., ?testDate=2026-01-07)
      const urlParams = new URLSearchParams(window.location.search);
      const testDate = urlParams.get('testDate');

      // Use test date if provided, otherwise use Italian time
      const today = testDate || new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Rome' });

      if (testDate) {
        console.log('🧪 TEST MODE: Using date', testDate);
      }

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 15000)
      );

      const fetchPromise = supabase
        .from('sounds')
        .select('*')
        .eq('day_date', today)
        .single();


      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error || !data) {
        console.error('Error fetching sound:', error);
        setFetchError(true);
      } else {
        setSound(data);
      }
    } catch (err) {
      console.error('Failed to fetch sound:', err);
      setFetchError(true);
    }
    setLoading(false);
  };


  const [isShaking, setIsShaking] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Handle typing letters (via hidden input)
  const handleInputChange = (value: string) => {
    if (isFinished || !sound || isShaking) return;
    setUserGuess(value);
  };

  const handleSubmit = () => {
    if (isFinished || !sound || isShaking) return;

    const correctAnswer = sound.correct_answer.toUpperCase();
    const totalSlots = correctAnswer.length;
    const unlockedCount = unlockedIndices.size;
    const availableSlots = totalSlots - unlockedCount;

    if (userGuess.length !== availableSlots) {
      // Shake animation for incomplete word
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    // Construct the full guess
    let fullGuess = '';
    let userGuessIndex = 0;
    for (let i = 0; i < totalSlots; i++) {
      if (unlockedIndices.has(i)) {
        fullGuess += correctAnswer[i];
      } else {
        fullGuess += userGuess[userGuessIndex] || '';
        userGuessIndex++;
      }
    }

    if (fullGuess === correctAnswer) {
      handleWin();
    } else {
      // Wrong guess - Shake and Reset
      setIsShaking(true);

      // Add to wrong attempts for stats
      setWrongLetters(prev => {
        const newSet = new Set(prev);
        newSet.add(`ATTEMPT_${Date.now()}`);
        return newSet;
      });

      // Wait for shake to finish before clearing
      setTimeout(() => {
        setIsShaking(false);
        setUserGuess(''); // STRICT RESET
        inputRef.current?.focus(); // Refocus input
      }, 500);
    }
  };

  const handleUnlockLetter = () => {
    if (isFinished || !sound) return;

    const correctAnswer = sound.correct_answer.toUpperCase();
    const totalLength = correctAnswer.length;

    // Find all indices that are NOT yet unlocked
    const availableIndices: number[] = [];
    for (let i = 0; i < totalLength; i++) {
      if (!unlockedIndices.has(i)) {
        availableIndices.push(i);
      }
    }

    if (availableIndices.length > 0) {
      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

      const newUnlocked = new Set(unlockedIndices);
      newUnlocked.add(randomIndex);
      setUnlockedIndices(newUnlocked);

      // Clear user guess to avoid misalignment
      setUserGuess('');
      inputRef.current?.focus();

      const newUnlocks = letterUnlocks + 1;
      setLetterUnlocks(newUnlocks);
      updateScore(wrongLetters.size, currentStep, newUnlocks);

      // Check if word is complete (auto-win if all letters unlocked?)
      if (newUnlocked.size === totalLength) {
        handleWin();
      }
    }
  };

  const handleUnlock = () => {
    if (currentStep < AUDIO_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateScore(wrongLetters.size, nextStep, letterUnlocks);
    }
  };

  const updateScore = (errors: number, unlocks: number, letterUnlocksCount: number = 0) => {
    const penalty = (errors * 0) + (unlocks * 50) + (letterUnlocksCount * LETTER_UNLOCK_PENALTY);
    const newScore = Math.max(10, 1000 - penalty);
    setScore(newScore);
  };

  const handleWin = async () => {
    setIsFinished(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#ffffff']
    });

    // Save score only if user is logged in AND it's not the fallback sound
    if (user && sound && sound.id !== 'fallback') {
      console.log('Attempting to save score:', {
        user_id: user.id,
        sound_id: sound.id,
        points: score
      });

      // Check if user already played today
      const { data: existingScore } = await supabase
        .from('daily_scores')
        .select('id')
        .eq('user_id', user.id)
        .eq('sound_id', sound.id)
        .single();

      if (existingScore) {
        console.log('User already played today');
        alert('Hai già giocato oggi! Torna domani per un nuovo suono. 🎮');
      } else {
        // Insert daily score
        const { error: scoreError } = await supabase.from('daily_scores').insert({
          user_id: user.id,
          sound_id: sound.id,
          points: score,
          attempts: wrongLetters.size + 1,
          unlocked_duration: AUDIO_STEPS[currentStep]
        });

        if (scoreError) {
          console.error('Error saving score:', scoreError);
          alert(`Errore salvataggio classifica: ${scoreError.message}`);
        } else {
          console.log('Score saved successfully!');

          // Update total_points in profiles
          const { error: updateError } = await supabase.rpc('increment_total_points', {
            user_id: user.id,
            points_to_add: score
          });

          if (updateError) {
            console.error('Error updating total points:', updateError);
          }
        }
      }

      // ALWAYS save to localStorage for redundancy and guest support
      localStorage.setItem(`played_${sound.id}`, JSON.stringify({
        points: score,
        timestamp: Date.now()
      }));

      // Trigger leaderboard refresh
      setLastGameTimestamp(Date.now());
    }
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : ''
      }
    });
    if (error) alert(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const shareResult = () => {
    const summary = formatScoreSummary(1, score, wrongLetters.size + 1);
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Soundle',
        text: summary,
        url: window.location.href
      });
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(summary);
      alert('Risultato copiato negli appunti!');
    }
  };

  if (!mounted || loading || authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (fetchError) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6 text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Errore Caricamento</h1>
      <p className="text-gray-400 mb-6">Impossibile caricare il suono del giorno.</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition-all"
      >
        Riprova
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-12 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Soundle" className="w-10 h-10 rounded-xl shadow-lg" />
          <h1 className="text-2xl font-[var(--font-outfit)] font-black tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">SOUNDLE</h1>

        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Trophy size={24} />
          </button>
          {user ? (
            <ProfileMenu user={user} onLogout={handleLogout} />
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all text-sm font-medium"
            >
              <LogIn size={18} />
              Login
            </button>
          )}
        </div>
      </div>

      <ScoreDisplay score={score} />

      <div className="w-full max-w-2xl flex flex-col items-center">
        <AudioPlayer
          audioUrl={sound?.audio_url || ''}
          maxDuration={AUDIO_STEPS[currentStep]}
          onUnlock={handleUnlock}
          canUnlock={currentStep < AUDIO_STEPS.length - 1 && !isFinished}
        />

        {!isFinished ? (
          <>
            <LetterBoard
              word={sound?.correct_answer || ''}
              unlockedIndices={unlockedIndices}
              userGuess={userGuess}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isShaking={isShaking}
              inputRef={inputRef}
            />
            <div className="mt-6">
              <UnlockLetterButton
                onUnlock={handleUnlockLetter}
                disabled={isFinished || !sound}
              />
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-8 glass p-8 w-full max-w-md text-center ${alreadyPlayed ? 'border-blue-500/30 bg-blue-500/5' : 'border-green-500/30 bg-green-500/5'}`}
          >
            {alreadyPlayed ? (
              <>
                <h2 className="text-3xl font-black text-blue-400 mb-2">GIÀ GIOCATO!</h2>
                <p className="text-gray-400 mb-4">Hai totalizzato <span className="text-blue-400 font-bold">{todayScore}</span> punti oggi.</p>
                <p className="text-gray-500 text-sm mb-6">Torna domani per un nuovo suono! 🎧</p>
                <button
                  onClick={() => setIsLeaderboardOpen(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500"
                >
                  <Trophy size={20} />
                  VEDI CLASSIFICA
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-black text-green-400 mb-2">INDOVINATO!</h2>
                <p className="text-gray-400 mb-6">Hai totalizzato {score} punti con {wrongLetters.size} tentativi errati!</p>
                <button
                  onClick={shareResult}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                  CONDIVIDI RISULTATO
                </button>
              </>
            )}
          </motion.div>
        )}

      </div>

      <Leaderboard
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        refreshTrigger={lastGameTimestamp}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Footer info */}
      <div className="mt-auto pt-12 text-center text-gray-600 text-xs uppercase tracking-widest font-bold">
        Nuovo suono ogni giorno alle 00:00
      </div>
    </main>
  );
}
