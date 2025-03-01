/*
  # Add translations table and functions

  1. New Tables
    - `translations`
      - `id` (uuid, primary key)
      - `source_text` (text)
      - `translation` (text)
      - `source_lang` (text)
      - `target_lang` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `translations` table
    - Add policies for authenticated users to read and insert translations
*/

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text text NOT NULL,
  translation text NOT NULL,
  source_lang text NOT NULL,
  target_lang text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(source_text, source_lang, target_lang)
);

-- Enable RLS
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Translations are viewable by all authenticated users"
  ON translations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert translations"
  ON translations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX translations_lookup_idx ON translations (source_text, source_lang, target_lang);

-- Function to get or create translation
CREATE OR REPLACE FUNCTION get_or_create_translation(
  p_source_text text,
  p_translation text,
  p_source_lang text,
  p_target_lang text
) RETURNS text AS $$
BEGIN
  -- Try to insert new translation
  INSERT INTO translations (
    source_text,
    translation,
    source_lang,
    target_lang
  )
  VALUES (
    p_source_text,
    p_translation,
    p_source_lang,
    p_target_lang
  )
  ON CONFLICT (source_text, source_lang, target_lang) 
  DO UPDATE SET translation = EXCLUDED.translation
  RETURNING translation;

  RETURN p_translation;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;