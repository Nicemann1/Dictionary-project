/*
  # Add name field to profiles table

  1. Changes
    - Add name column to profiles table
    - Update policies to include name field
*/

-- Add name column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN name text;
  END IF;
END $$;