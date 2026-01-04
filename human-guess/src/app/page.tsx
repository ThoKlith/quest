'use client';

import { useState, useEffect } from 'react';
import { supabase, UserStats } from '@/lib/supabase';
import GameCard from '@/components/GameCard';
import StreakCounter from '@/components/StreakCounter';
import AuthModal from '@/components/AuthModal';
import { getCurrentDayNumber } from '@/lib/game-logic';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadUserStats(session.user.id);
      } else {
        setStats(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await loadUserStats(user.id);
    }
    setLoading(false);
  }

  async function loadUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setStats(null);
  }

  function handleAuthSuccess() {
    checkUser();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-6xl">🤔</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              Human Guess
            </h1>
            <nav className="hidden md:flex items-center gap-4 ml-4">
              <Link href="/leaderboard" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                Leaderboard
              </Link>
              {user && (
                <Link href="/stats" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
                  Stats
                </Link>
              )}
            </nav>
            {user && stats && (
              <StreakCounter
                streak={stats.current_streak}
                longestStreak={stats.longest_streak}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="md:hidden flex gap-2 mr-2">
              <Link href="/leaderboard" className="p-2 glass-card rounded-lg text-xs">
                🏆
              </Link>
              {user && (
                <Link href="/stats" className="p-2 glass-card rounded-lg text-xs">
                  📊
                </Link>
              )}
            </div>
            {user ? (
              <button
                onClick={handleSignOut}
                className="btn-secondary text-sm"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-secondary text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 pb-8">
        <div className="w-full max-w-2xl">
          <GameCard />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center opacity-60 text-sm">
        <p>Made with ❤️ for Human Guessers • New question every day at midnight UTC 🌍</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

