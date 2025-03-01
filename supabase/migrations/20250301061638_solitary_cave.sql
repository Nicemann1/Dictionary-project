/*
  # Fix progress tracking initialization

  1. Changes
    - Add trigger to create user progress record on signup
    - Add function to initialize daily activity
    - Add default values for new users
  
  2. Security
    - Maintain existing RLS policies
    - Add trigger security definer
*/

-- Function to initialize user progress on signup
CREATE OR REPLACE FUNCTION initialize_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_progress (
    user_id,
    total_words_learned,
    study_streak,
    review_accuracy,
    total_study_time,
    total_reviews,
    correct_reviews
  ) VALUES (
    NEW.id,
    0,
    0,
    0,
    '0'::interval,
    0,
    0
  );

  -- Initialize today's activity record
  INSERT INTO daily_activity (
    user_id,
    study_date,
    study_time,
    words_reviewed,
    words_learned,
    correct_reviews,
    total_reviews
  ) VALUES (
    NEW.id,
    CURRENT_DATE,
    '0'::interval,
    0,
    0,
    0,
    0
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to initialize progress on signup
DROP TRIGGER IF EXISTS initialize_user_progress_on_signup ON auth.users;
CREATE TRIGGER initialize_user_progress_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_progress();

-- Function to ensure daily activity record exists
CREATE OR REPLACE FUNCTION get_or_create_daily_activity(user_uuid uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO daily_activity (
    user_id,
    study_date,
    study_time,
    words_reviewed,
    words_learned,
    correct_reviews,
    total_reviews
  )
  VALUES (
    user_uuid,
    CURRENT_DATE,
    '0'::interval,
    0,
    0,
    0,
    0
  )
  ON CONFLICT (user_id, study_date) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Initialize progress for existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users LOOP
    -- Initialize user progress
    INSERT INTO user_progress (
      user_id,
      total_words_learned,
      study_streak,
      review_accuracy,
      total_study_time,
      total_reviews,
      correct_reviews
    )
    VALUES (
      user_record.id,
      0,
      0,
      0,
      '0'::interval,
      0,
      0
    )
    ON CONFLICT (user_id) DO NOTHING;

    -- Initialize daily activity
    INSERT INTO daily_activity (
      user_id,
      study_date,
      study_time,
      words_reviewed,
      words_learned,
      correct_reviews,
      total_reviews
    )
    VALUES (
      user_record.id,
      CURRENT_DATE,
      '0'::interval,
      0,
      0,
      0,
      0
    )
    ON CONFLICT (user_id, study_date) DO NOTHING;
  END LOOP;
END $$;