/*
  # Update translations table and functions

  This migration safely adds or updates:
  1. Missing indexes
  2. RLS policies
  3. Helper functions
  
  It uses IF NOT EXISTS and defensive programming to avoid conflicts.
*/

-- Ensure indexes exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'translations_lookup_idx'
  ) THEN
    CREATE INDEX translations_lookup_idx ON translations (source_text, source_lang, target_lang);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'translations_langs_idx'
  ) THEN
    CREATE INDEX translations_langs_idx ON translations (source_lang, target_lang);
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Translations are viewable by all authenticated users" ON translations;
DROP POLICY IF EXISTS "Authenticated users can insert translations" ON translations;
DROP POLICY IF EXISTS "Authenticated users can update translations" ON translations;

-- Recreate policies
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

-- Update or create helper functions
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