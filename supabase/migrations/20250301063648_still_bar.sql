/*
  # Fix ambiguous column references

  1. Changes
    - Fix ambiguous user_id references in functions
    - Qualify column references in get_user_progress_with_activity function
    - Add explicit table aliases for clarity
*/

-- Drop and recreate the function with qualified column references
CREATE OR REPLACE FUNCTION get_user_progress_with_activity(user_uuid uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  total_words_learned integer,
  study_streak integer,
  review_accuracy float,
  total_study_time interval,
  last_study_date date
) AS $$
BEGIN
  -- Ensure daily activity record exists
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
  ON CONFLICT (daily_activity.user_id, study_date) DO NOTHING;
  
  -- Return user progress with explicit table alias
  RETURN QUERY
  SELECT 
    up.id,
    up.user_id,
    up.total_words_learned,
    up.study_streak,
    up.review_accuracy,
    up.total_study_time,
    up.last_study_date
  FROM user_progress up
  WHERE up.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;