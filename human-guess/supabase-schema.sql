-- Soundle Database Schema

-- 1. Profiles table (linked to Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    avatar_url TEXT,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Sounds table
CREATE TABLE IF NOT EXISTS sounds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    day_date DATE UNIQUE NOT NULL, -- The date this sound is for
    audio_url TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    dictionary TEXT[] DEFAULT '{}', -- List of words for autocomplete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Guesses/Scores table
CREATE TABLE IF NOT EXISTS daily_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    sound_id UUID REFERENCES sounds ON DELETE CASCADE,
    points INTEGER NOT NULL,
    attempts INTEGER NOT NULL,
    unlocked_duration FLOAT NOT NULL,
    is_guest BOOLEAN DEFAULT FALSE,
    guest_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, sound_id) -- One score per user per sound
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_scores ENABLE ROW LEVEL SECURITY;

-- Policies
-- Profiles: Anyone can read, only owner can update
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Sounds: Anyone can read
CREATE POLICY "Sounds are viewable by everyone" ON sounds FOR SELECT USING (true);

-- Daily Scores: Anyone can read (for leaderboard), only owner can insert
CREATE POLICY "Scores are viewable by everyone" ON daily_scores FOR SELECT USING (true);
CREATE POLICY "Users can insert own scores" ON daily_scores FOR INSERT WITH CHECK (auth.uid() = user_id OR is_guest = true);

-- Functions for leaderboard
CREATE OR REPLACE FUNCTION get_daily_leaderboard(target_date DATE)
RETURNS TABLE (
    username TEXT,
    points INTEGER,
    attempts INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(p.username, ds.guest_name, 'Anonymous') as username,
        ds.points,
        ds.attempts
    FROM daily_scores ds
    JOIN sounds s ON ds.sound_id = s.id
    LEFT JOIN profiles p ON ds.user_id = p.id
    WHERE s.day_date = target_date
    ORDER BY ds.points DESC, ds.attempts ASC;
END;
$$ LANGUAGE plpgsql;
