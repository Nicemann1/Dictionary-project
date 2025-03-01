import { supabase } from './supabase';
import { Word } from '../types';

// Types for database tables
interface VocabularyItem {
  id: string;
  term: string;
  definition: string;
  phonetic: string | null;
  audio_url: string | null;
  source_lang: string;
  target_lang: string;
  part_of_speech: string;
  example: string | null;
  level: 'beginner' | 'intermediate' | 'advanced' | null;
  topics: string[] | null;
}

interface SavedWord {
  id: string;
  user_id: string;
  vocabulary_id: string;
  last_reviewed: string | null;
  next_review: string | null;
  review_count: number;
  ease_factor: number;
  interval: number;
}

interface FlashcardReview {
  id: string;
  user_id: string;
  vocabulary_id: string;
  score: number;
  review_date: string;
  next_review: string | null;
  ease_factor: number | null;
  interval: number | null;
}

// Convert database model to app model
function convertToWord(item: VocabularyItem, savedWord?: SavedWord): Word {
  return {
    term: item.term,
    definition: item.definition,
    phonetic: item.phonetic || undefined,
    audio: item.audio_url || undefined,
    sourceLang: item.source_lang,
    targetLang: item.target_lang,
    partOfSpeech: item.part_of_speech,
    example: item.example || undefined,
    level: item.level || undefined,
    topics: item.topics || undefined,
    lastReviewed: savedWord?.last_reviewed ? new Date(savedWord.last_reviewed) : undefined,
    nextReview: savedWord?.next_review ? new Date(savedWord.next_review) : undefined,
    reviewCount: savedWord?.review_count || 0,
    easeFactor: savedWord?.ease_factor || 2.5,
    interval: savedWord?.interval || 1
  };
}

// Fetch vocabulary items by language pair
export async function getVocabularyItems(sourceLang: string, targetLang: string) {
  const { data, error } = await supabase
    .from('vocabulary_items')
    .select('*')
    .eq('source_lang', sourceLang)
    .eq('target_lang', targetLang);

  if (error) throw error;
  return data.map(item => convertToWord(item));
}

// Save a word to user's vocabulary
export async function saveWord(word: Word) {
  // First, ensure the vocabulary item exists
  const { data: vocabData, error: vocabError } = await supabase
    .from('vocabulary_items')
    .upsert({
      term: word.term,
      definition: word.definition,
      phonetic: word.phonetic,
      audio_url: word.audio,
      source_lang: word.sourceLang,
      target_lang: word.targetLang,
      part_of_speech: word.partOfSpeech,
      example: word.example,
      level: word.level,
      topics: word.topics
    })
    .select()
    .single();

  if (vocabError) throw vocabError;

  // Then save it to user's saved words
  const { data: savedData, error: savedError } = await supabase
    .from('saved_words')
    .upsert({
      vocabulary_id: vocabData.id,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      last_reviewed: word.lastReviewed?.toISOString(),
      next_review: word.nextReview?.toISOString(),
      review_count: word.reviewCount,
      ease_factor: word.easeFactor,
      interval: word.interval
    })
    .select()
    .single();

  if (savedError) throw savedError;
  return convertToWord(vocabData, savedData);
}

// Get user's saved words
export async function getSavedWords(sourceLang: string, targetLang: string) {
  const { data, error } = await supabase
    .from('saved_words')
    .select(`
      *,
      vocabulary_items (*)
    `)
    .eq('vocabulary_items.source_lang', sourceLang)
    .eq('vocabulary_items.target_lang', targetLang);

  if (error) throw error;
  return data.map(item => convertToWord(item.vocabulary_items, item));
}

// Record a flashcard review
export async function recordReview(vocabularyId: string, score: number, nextReview: Date, easeFactor: number, interval: number) {
  const { error } = await supabase
    .from('flashcard_reviews')
    .insert({
      vocabulary_id: vocabularyId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      score,
      next_review: nextReview.toISOString(),
      ease_factor: easeFactor,
      interval
    });

  if (error) throw error;

  // Update saved word with new review data
  const { error: updateError } = await supabase
    .from('saved_words')
    .update({
      last_reviewed: new Date().toISOString(),
      next_review: nextReview.toISOString(),
      ease_factor: easeFactor,
      interval,
      review_count: supabase.sql`review_count + 1`
    })
    .eq('vocabulary_id', vocabularyId)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

  if (updateError) throw updateError;
}

// Delete a saved word
export async function deleteSavedWord(vocabularyId: string) {
  const { error } = await supabase
    .from('saved_words')
    .delete()
    .eq('vocabulary_id', vocabularyId)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;
}

// Get review history for a word
export async function getReviewHistory(vocabularyId: string) {
  const { data, error } = await supabase
    .from('flashcard_reviews')
    .select('*')
    .eq('vocabulary_id', vocabularyId)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    .order('review_date', { ascending: false });

  if (error) throw error;
  return data;
}