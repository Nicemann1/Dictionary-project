import { create } from 'zustand';
import { searchWord, translateWord } from './dictionary';
import { translate } from './deepseek';
import { saveWord as saveWordToDb, getSavedWords, deleteSavedWord, recordReview } from './vocabulary';
import { supabase } from './supabase';
import { Word } from '../types';

interface TranslationStore {
  savedWords: Record<string, Word[]>;
  flashcards: Record<string, Word[]>;
  saveWord: (language: string, word: Word) => void;
  removeWord: (language: string, term: string) => void;
  addFlashcard: (language: string, word: Word) => void;
  removeFlashcard: (language: string, term: string) => void;
  convertToFlashcard: (language: string, term: string) => void;
}

export const useTranslationStore = create<TranslationStore>((set) => ({
  savedWords: {},
  flashcards: {},
  saveWord: (language, word) => set((state) => ({
    savedWords: async () => {
      try {
        const savedWord = await saveWordToDb(word);
        return {
          ...state.savedWords,
          [language]: [
            ...(state.savedWords[language] || []).filter(w => w.term !== word.term),
            savedWord
          ]
        };
      } catch (error) {
        console.error('Error saving word:', error);
        return state.savedWords;
      }
    }
  })),
  removeWord: (language, term) => set((state) => ({
    savedWords: async () => {
      try {
        await deleteSavedWord(term);
        return {
          ...state.savedWords,
          [language]: (state.savedWords[language] || []).filter(w => w.term !== term)
        };
      } catch (error) {
        console.error('Error removing word:', error);
        return state.savedWords;
      }
    }
  })),
  addFlashcard: (language, word) => set((state) => ({
    flashcards: {
      ...state.flashcards,
      [language]: [
        ...(state.flashcards[language] || []).filter(w => w.term !== word.term),
        { ...word, lastReviewed: new Date(), reviewCount: 0, easeFactor: 2.5, interval: 1 }
      ]
    }
  })),
  removeFlashcard: (language, term) => set((state) => ({
    flashcards: {
      ...state.flashcards,
      [language]: (state.flashcards[language] || []).filter(w => w.term !== term)
    }
  })),
  convertToFlashcard: (language, term) => set((state) => {
    const word = state.savedWords[language]?.find(w => w.term === term);
    if (!word) return state;

    return {
      savedWords: {
        ...state.savedWords,
        [language]: state.savedWords[language].filter(w => w.term !== term)
      },
      flashcards: {
        ...state.flashcards,
        [language]: [
          ...(state.flashcards[language] || []).filter(w => w.term !== term),
          { ...word, lastReviewed: new Date(), reviewCount: 0, easeFactor: 2.5, interval: 1 }
        ]
      }
    };
  })
}));

export async function getWordDetails(word: string, targetLang?: string) {
  try {
    const trimmedWord = word.trim();

    if (!trimmedWord) {
      throw new Error('Please enter a word to search.');
    }

    // Validate input length
    if (trimmedWord.length < 2) {
      throw new Error('Please enter at least 2 characters to search.');
    }

    // Enhanced input validation
    const validCharRegex = /^[a-zA-Z\s\-']+$/;
    if (!validCharRegex.test(trimmedWord)) {
      throw new Error('Please use only letters, spaces, hyphens, and apostrophes.');
    }

    // Check for common input mistakes
    if (/^\s+|\s+$|\s{2,}/.test(trimmedWord)) {
      throw new Error('Please remove extra spaces from your search term.');
    }

    if (trimmedWord.length > 50) {
      throw new Error('Search term is too long. Please enter a shorter word or phrase.');
    }

    // First get the English definition
    const sourceResult = await searchWord(trimmedWord);

    if (!sourceResult && targetLang === 'en') {
      throw new Error(`No definition found for "${trimmedWord}". Please check your spelling or try a different word.`);
    }

    // If we have a source result, use it
    if (sourceResult) {
      const firstMeaning = sourceResult.meanings[0];
      if (!firstMeaning) {
        throw new Error('Invalid dictionary response: missing word meanings');
      }

      const definitions = sourceResult.meanings
        .map(m => m.definitions.map(d => d.definition))
        .flat();
      const examples = sourceResult.meanings
        .map(m => m.definitions.filter(d => d.example).map(d => d.example!))
        .flat();

      // Try to get cached translation first
      let translation = null;
      if (targetLang && targetLang !== 'en') {
        try {
          const { data } = await supabase
            .rpc('get_cached_translation', {
              p_source_text: trimmedWord,
              p_source_lang: 'en',
              p_target_lang: targetLang
            });
          translation = data;
        } catch (error) {
          console.warn('Cache lookup failed:', error);
        }

        // If not in cache, get new translation
        if (!translation) {
          try {
            translation = await translate(trimmedWord, targetLang as any, 'en');
            
            // Cache the translation
            try {
              await supabase.rpc('cache_translation', {
                p_source_text: trimmedWord,
                p_translation: translation,
                p_source_lang: 'en',
                p_target_lang: targetLang
              });
            } catch (cacheError) {
              console.warn('Failed to cache translation:', cacheError);
            }
          } catch (error) {
            console.warn('Translation failed:', error);
            translation = sourceResult.word; // Fallback to original word
          }
        }
      }

      return {
        word: sourceResult.word,
        translation: translation || sourceResult.word,
        definitions,
        examples: examples.length > 0 ? examples : undefined,
        phonetic: sourceResult.phonetic,
        audio: sourceResult.phonetics?.[0]?.audio,
        partOfSpeech: firstMeaning.partOfSpeech,
        level: 'beginner' // Default level since the API doesn't provide this
      };
    } else {
      // Try direct translation if no English definition found
      try {
        const translation = await translate(trimmedWord, targetLang as any, 'en');
        return {
          word: trimmedWord,
          translation: translation || trimmedWord,
          definitions: [translation],
          partOfSpeech: 'unknown',
          level: 'beginner'
        };
      } catch (error) {
        throw new Error(`No definition or translation found for "${trimmedWord}". Please try a different word.`);
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while fetching word details.';
    console.error('Word details error:', errorMessage);
    throw new Error(errorMessage);
  }
}