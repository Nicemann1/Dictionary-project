import { create } from 'zustand';
import { Word } from '../types';

interface DictionaryStore {
  recentSearches: string[];
  savedWords: Word[];
  addRecentSearch: (term: string) => void;
  saveWord: (word: Word) => void;
  removeWord: (term: string) => void;
}

export const useDictionaryStore = create<DictionaryStore>((set) => ({
  recentSearches: [],
  savedWords: [],
  addRecentSearch: (term) =>
    set((state) => ({
      recentSearches: [term, ...state.recentSearches.filter(t => t !== term)].slice(0, 10)
    })),
  saveWord: (word) =>
    set((state) => ({
      savedWords: [...state.savedWords.filter(w => w.term !== word.term), word]
    })),
  removeWord: (term) =>
    set((state) => ({
      savedWords: state.savedWords.filter(w => w.term !== term)
    }))
}));