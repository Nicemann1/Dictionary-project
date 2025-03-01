/*
  # Fix progress tracking tables and functions

  1. New Tables
    - user_study_sessions: Track individual study sessions
    - user_achievements: Track user achievements and milestones
  
  2. Functions
    - record_study_session: Record and update study progress
    - update_achievements: Update user achievements based on progress
  
  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Study sessions table
CREATE TABLE IF NOT EXISTS user_study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  duration interval,
  words_reviewed integer DEFAULT 0,
  words_learned integer DEFAULT 0,
  correct_reviews integer DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_value integer NOT NULL,
  achieved_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

-- Enable RLS
ALTER TABLE user_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies for study sessions
CREATE POLICY "Users can view their own study sessions"
  ON user_study_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study sessions"
  ON user_study_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions"
  ON user_study_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for achievements
CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to record study session and update progress
CREATE OR REPLACE FUNCTION record_study_session(
  p_user_id uuid,
  p_duration interval,
  p_words_reviewed integer,
  p_words_learned integer,
  p_correct_reviews integer
)
RETURNS void AS $$
DECLARE
  v_total_time interval;
  v_accuracy float;
BEGIN
  -- Insert study session
  INSERT INTO user_study_sessions (
    user_id,
    duration,
    words_reviewed,
    words_learned,
    correct_reviews,
    total_reviews,
    end_time
  ) VALUES (
    p_user_id,
    p_duration,
    p_words_reviewed,
    p_words_learned,
    p_correct_reviews,
    p_words_reviewed,
    now()
  );

  -- Update daily activity
  INSERT INTO daily_activity (
    user_id,
    study_date,
    study_time,
    words_reviewed,
    words_learned,
    correct_reviews,
    total_reviews
  ) VALUES (
    p_user_id,
    CURRENT_DATE,
    p_duration,
    p_words_reviewed,
    p_words_learned,
    p_correct_reviews,
    p_words_reviewed
  )
  ON CONFLICT (user_id, study_date) 
  DO UPDATE SET
    study_time = daily_activity.study_time + EXCLUDED.study_time,
    words_reviewed = daily_activity.words_reviewed + EXCLUDED.words_reviewed,
    words_learned = daily_activity.words_learned + EXCLUDED.words_learned,
    correct_reviews = daily_activity.correct_reviews + EXCLUDED.correct_reviews,
    total_reviews = daily_activity.total_reviews + EXCLUDED.total_reviews;

  -- Calculate total study time
  SELECT COALESCE(SUM(duration), '0'::interval)
  INTO v_total_time
  FROM user_study_sessions
  WHERE user_id = p_user_id;

  -- Calculate accuracy
  SELECT CASE 
    WHEN SUM(total_reviews) > 0 
    THEN (SUM(correct_reviews)::float / SUM(total_reviews)) * 100
    ELSE 0 
  END
  INTO v_accuracy
  FROM user_study_sessions
  WHERE user_id = p_user_id;

  -- Update user progress
  UPDATE user_progress
  SET 
    total_study_time = v_total_time,
    total_words_learned = total_words_learned + p_words_learned,
    review_accuracy = v_accuracy,
    total_reviews = total_reviews + p_words_reviewed,
    correct_reviews = correct_reviews + p_correct_reviews,
    last_study_date = CURRENT_DATE,
    study_streak = CASE
      WHEN last_study_date = CURRENT_DATE - 1 THEN study_streak + 1
      WHEN last_study_date = CURRENT_DATE THEN study_streak
      ELSE 1
    END
  WHERE user_id = p_user_id;

  -- Check and update achievements
  PERFORM update_achievements(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update achievements
CREATE OR REPLACE FUNCTION update_achievements(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_total_words integer;
  v_study_streak integer;
  v_accuracy float;
BEGIN
  -- Get current stats
  SELECT 
    total_words_learned,
    study_streak,
    review_accuracy
  INTO
    v_total_words,
    v_study_streak,
    v_accuracy
  FROM user_progress
  WHERE user_id = p_user_id;

  -- Words learned achievements
  IF v_total_words >= 100 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_value)
    VALUES (p_user_id, 'words_learned', 100)
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;

  -- Study streak achievements
  IF v_study_streak >= 7 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_value)
    VALUES (p_user_id, 'study_streak', 7)
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;

  -- Accuracy achievements
  IF v_accuracy >= 90 THEN
    INSERT INTO user_achievements (user_id, achievement_type, achievement_value)
    VALUES (p_user_id, 'high_accuracy', 90)
    ON CONFLICT (user_id, achievement_type) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;