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
      - `updated_at` (timestamptz)

  2. Functions
    - `get_cached_translation`: Retrieves cached translation
    - `cache_translation`: Stores new translation
    
  3. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create translations table
CREATE TABLE translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text text NOT NULL,
  translation text NOT NULL,
  source_lang text NOT NULL,
  target_lang text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
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

CREATE POLICY "Authenticated users can update translations"
  ON translations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX translations_lookup_idx ON translations (source_text, source_lang, target_lang);
CREATE INDEX translations_langs_idx ON translations (source_lang, target_lang);

-- Function to get cached translation
CREATE OR REPLACE FUNCTION get_cached_translation(
  p_source_text text,
  p_source_lang text,
  p_target_lang text
) RETURNS text AS $$
DECLARE
  v_translation text;
BEGIN
  SELECT translation INTO v_translation
  FROM translations
  WHERE source_text = p_source_text
    AND source_lang = p_source_lang
    AND target_lang = p_target_lang;
    
  RETURN v_translation;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cache translation
CREATE OR REPLACE FUNCTION cache_translation(
  p_source_text text,
  p_translation text,
  p_source_lang text,
  p_target_lang text
) RETURNS text AS $$
BEGIN
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
  DO UPDATE SET 
    translation = EXCLUDED.translation,
    updated_at = now()
  RETURNING translation;

  RETURN p_translation;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;