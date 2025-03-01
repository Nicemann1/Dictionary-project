/*
  # Vocabulary and Saved Words Schema

  1. New Tables
    - `vocabulary_items`
      - Core vocabulary items that can be shared across users
      - Contains word definitions, examples, and metadata
    - `saved_words`
      - User-specific saved words and learning progress
      - Links to vocabulary_items and tracks individual learning stats
    - `flashcard_reviews`
      - Tracks review history and spaced repetition data

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure users can only access their own data

  3. Changes
    - Add foreign key constraints
    - Add indexes for performance
*/

-- Vocabulary items table
CREATE TABLE IF NOT EXISTS vocabulary_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  definition text NOT NULL,
  phonetic text,
  audio_url text,
  source_lang text NOT NULL,
  target_lang text NOT NULL,
  part_of_speech text NOT NULL,
  example text,
  level text CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  topics text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique constraint on term + languages
CREATE UNIQUE INDEX vocabulary_items_term_langs ON vocabulary_items (term, source_lang, target_lang);

-- Saved words table (user-specific)
CREATE TABLE IF NOT EXISTS saved_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  vocabulary_id uuid REFERENCES vocabulary_items ON DELETE CASCADE,
  last_reviewed timestamptz,
  next_review timestamptz,
  review_count integer DEFAULT 0,
  ease_factor float DEFAULT 2.5,
  interval integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, vocabulary_id)
);

-- Flashcard reviews history
CREATE TABLE IF NOT EXISTS flashcard_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  vocabulary_id uuid REFERENCES vocabulary_items ON DELETE CASCADE,
  score integer CHECK (score >= 1 AND score <= 5),
  review_date timestamptz DEFAULT now(),
  next_review timestamptz,
  ease_factor float,
  interval integer
);

-- Enable RLS
ALTER TABLE vocabulary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for vocabulary_items
CREATE POLICY "Vocabulary items are viewable by all authenticated users"
  ON vocabulary_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for saved_words
CREATE POLICY "Users can view their own saved words"
  ON saved_words
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved words"
  ON saved_words
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved words"
  ON saved_words
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved words"
  ON saved_words
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for flashcard_reviews
CREATE POLICY "Users can view their own reviews"
  ON flashcard_reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reviews"
  ON flashcard_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vocabulary_items_updated_at
  BEFORE UPDATE ON vocabulary_items
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_saved_words_updated_at
  BEFORE UPDATE ON saved_words
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX saved_words_user_id_idx ON saved_words (user_id);
CREATE INDEX saved_words_next_review_idx ON saved_words (next_review);
CREATE INDEX flashcard_reviews_user_id_idx ON flashcard_reviews (user_id);
CREATE INDEX vocabulary_items_langs_idx ON vocabulary_items (source_lang, target_lang);