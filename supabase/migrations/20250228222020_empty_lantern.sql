/*
  # Fix profiles table RLS policies

  1. Security Changes
    - Add insert policy to allow authenticated users to create their own profile
    - Ensure policies use proper auth.uid() checks
    - Keep existing select and update policies

  2. Notes
    - This fixes the 42501 error (RLS policy violation) during signup
    - Maintains security by only allowing users to manage their own profiles
*/

-- Add insert policy for profiles
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Enable insert policy for public during signup
CREATE POLICY "New users can create their profile"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);