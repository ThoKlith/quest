-- Human Guess Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Questions table: stores all daily questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_number INTEGER UNIQUE NOT NULL,
  question_text TEXT NOT NULL,
  actual_value INTEGER NOT NULL CHECK (actual_value >= 0 AND actual_value <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guesses table: records all user guesses
CREATE TABLE guesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_id TEXT,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  guess_value INTEGER NOT NULL CHECK (guess_value >= 0 AND guess_value <= 100),
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_daily_guess UNIQUE (user_id, day_number),
  CONSTRAINT unique_guest_daily_guess UNIQUE (guest_id, day_number),
  CONSTRAINT user_or_guest CHECK (
    (user_id IS NOT NULL AND guest_id IS NULL) OR 
    (user_id IS NULL AND guest_id IS NOT NULL)
  )
);

-- User stats table: tracks streaks and totals
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  total_score INTEGER DEFAULT 0 NOT NULL,
  games_played INTEGER DEFAULT 0 NOT NULL,
  last_played_day INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_guesses_user_id ON guesses(user_id);
CREATE INDEX idx_guesses_guest_id ON guesses(guest_id);
CREATE INDEX idx_guesses_day_number ON guesses(day_number);
CREATE INDEX idx_questions_day_number ON questions(day_number);

-- Row Level Security Policies

-- Questions: everyone can read
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are viewable by everyone" 
  ON questions FOR SELECT 
  USING (true);

-- Guesses: users can read their own, insert their own
ALTER TABLE guesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own guesses" 
  ON guesses FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    guest_id IS NOT NULL
  );

CREATE POLICY "Users can insert their own guesses" 
  ON guesses FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND guest_id IS NOT NULL)
  );

-- User stats: users can read and update their own
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats" 
  ON user_stats FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
  ON user_stats FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" 
  ON user_stats FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically create user_stats on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create stats on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed questions (30+ creative questions)
INSERT INTO questions (day_number, question_text, actual_value) VALUES
  (0, 'What percentage of people hit the snooze button at least once?', 57),
  (1, 'What percentage of people talk to their pets like they''re human?', 81),
  (2, 'What percentage of people have pretended to be sick to skip work or school?', 43),
  (3, 'What percentage of people sing in the shower?', 67),
  (4, 'What percentage of people have googled themselves?', 72),
  (5, 'What percentage of people lie about reading terms and conditions?', 91),
  (6, 'What percentage of people have sent a text to the wrong person?', 78),
  (7, 'What percentage of people check their phone within 5 minutes of waking up?', 89),
  (8, 'What percentage of people have cried during a movie in the last year?', 54),
  (9, 'What percentage of people have lied about their age online?', 38),
  (10, 'What percentage of people have stalked an ex on social media?', 65),
  (11, 'What percentage of people have pretended to know a song they don''t know?', 47),
  (12, 'What percentage of people have faked a smile in a photo?', 94),
  (13, 'What percentage of people have re-gifted a present?', 41),
  (14, 'What percentage of people have eaten food that fell on the floor?', 73),
  (15, 'What percentage of people have lied on their resume?', 36),
  (16, 'What percentage of people have pretended to be busy to avoid someone?', 68),
  (17, 'What percentage of people have judged someone by their music taste?', 52),
  (18, 'What percentage of people have practiced a conversation before having it?', 76),
  (19, 'What percentage of people have left a party without saying goodbye?', 44),
  (20, 'What percentage of people believe in aliens?', 61),
  (21, 'What percentage of people have cried at work?', 33),
  (22, 'What percentage of people have pretended to laugh at a joke they didn''t get?', 85),
  (23, 'What percentage of people have lied about being on their way when still at home?', 71),
  (24, 'What percentage of people have unfollowed someone for posting too much?', 58),
  (25, 'What percentage of people have canceled plans last minute?', 82),
  (26, 'What percentage of people believe in ghosts?', 45),
  (27, 'What percentage of people have pretended to be asleep to avoid talking?', 63),
  (28, 'What percentage of people have lied about liking a gift?', 88),
  (29, 'What percentage of people have judged someone for their phone brand?', 29),
  (30, 'What percentage of people have argued with a stranger online?', 56),
  (31, 'What percentage of people have walked into a room and forgotten why?', 96),
  (32, 'What percentage of people have pretended to know a celebrity they don''t?', 34),
  (33, 'What percentage of people have lied about watching a popular TV show?', 42),
  (34, 'What percentage of people have judged someone by their handwriting?', 48),
  (35, 'What percentage of people believe they''re better than average drivers?', 80),
  (36, 'What percentage of people have taken a selfie at a funeral?', 7),
  (37, 'What percentage of people have pretended to be interested in a conversation?', 92),
  (38, 'What percentage of people have lied about their salary?', 51),
  (39, 'What percentage of people have judged someone for their coffee order?', 39);
