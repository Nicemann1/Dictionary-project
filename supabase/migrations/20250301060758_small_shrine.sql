/*
  # Add Progress Tracking Tables

  1. New Tables
    - `user_progress`
      - Daily activity tracking
      - Study streaks
      - Review accuracy
      - Time studied
    - `daily_activity`
      - Detailed daily study sessions
      - Time spent per session
      - Words reviewed
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  total_words_learned integer DEFAULT 0,
  study_streak integer DEFAULT 0,
  last_study_date date,
  total_study_time interval DEFAULT '0'::interval,
  review_accuracy float DEFAULT 0,
  total_reviews integer DEFAULT 0,
  correct_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Daily Activity Table
CREATE TABLE IF NOT EXISTS daily_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  study_date date NOT NULL,
  study_time interval DEFAULT '0'::interval,
  words_reviewed integer DEFAULT 0,
  words_learned integer DEFAULT 0,
  correct_reviews integer DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, study_date)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;

-- Policies for user_progress
CREATE POLICY "Users can view their own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for daily_activity
CREATE POLICY "Users can view their own daily activity"
  ON daily_activity
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily activity"
  ON daily_activity
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily activity"
  ON daily_activity
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update user progress
CREATE OR REPLACE FUNCTION update_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total study time
  UPDATE user_progress
  SET total_study_time = (
    SELECT COALESCE(SUM(study_time), '0'::interval)
    FROM daily_activity
    WHERE user_id = NEW.user_id
  ),
  -- Update review accuracy
  review_accuracy = CASE 
    WHEN NEW.total_reviews > 0 
    THEN (NEW.correct_reviews::float / NEW.total_reviews) * 100
    ELSE 0 
  END,
  -- Update study streak if studying on consecutive days
  study_streak = CASE
    WHEN (NEW.study_date = COALESCE(last_study_date, CURRENT_DATE - 1) + 1) THEN study_streak + 1
    WHEN (NEW.study_date = last_study_date) THEN study_streak
    ELSE 1
  END,
  last_study_date = NEW.study_date,
  updated_at = now()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user progress on daily activity changes
CREATE TRIGGER update_user_progress_on_activity
  AFTER INSERT OR UPDATE ON daily_activity
  FOR EACH ROW
  EXECUTE FUNCTION update_user_progress();

-- Create indexes for better performance
CREATE INDEX daily_activity_user_date_idx ON daily_activity (user_id, study_date);
CREATE INDEX user_progress_user_id_idx ON user_progress (user_id);