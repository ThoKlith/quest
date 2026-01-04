import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Question {
  id: string;
  day_number: number;
  question_text: string;
  actual_value: number;
  created_at: string;
}

export interface Guess {
  id: string;
  user_id: string | null;
  guest_id: string | null;
  question_id: string;
  day_number: number;
  guess_value: number;
  score: number;
  created_at: string;
}

export interface UserStats {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  total_score: number;
  games_played: number;
  last_played_day: number | null;
  updated_at: string;
}
