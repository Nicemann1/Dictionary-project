interface Phonetic {
  text: string;
  audio?: string;
}

interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics?: Phonetic[];
  meanings: Meaning[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls?: string[];
}

const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries';

export async function searchWord(word: string): Promise<DictionaryEntry | null> {
  try {
    const trimmedWord = word.trim().toLowerCase();
    
    // Validate input
    if (!trimmedWord || trimmedWord.length < 2) {
      throw new Error('Please enter at least 2 characters to search');
    }

    // Check for valid characters
    const validCharRegex = /^[a-zA-Z\s\-']+$/;
    if (!validCharRegex.test(trimmedWord)) {
      throw new Error('Please use only letters, spaces, hyphens, and apostrophes');
    }

    const response = await fetch(`${DICTIONARY_API_URL}/en/${encodeURIComponent(trimmedWord)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`No definition found for "${trimmedWord}"`);
        return null;
      }
      throw new Error('Unable to fetch definition. Please try again later.');
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid response from dictionary API');
    }

    return data[0] as DictionaryEntry;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching the definition');
  }
}

export function getPhonetics(phonetics?: Phonetic[]): { text?: string; audio?: string } {
  if (!phonetics || phonetics.length === 0) {
    return {};
  }

  // Find the first phonetic with audio
  const phoneticWithAudio = phonetics.find(p => p.audio && p.text);
  if (phoneticWithAudio) {
    return {
      text: phoneticWithAudio.text,
      audio: phoneticWithAudio.audio
    };
  }
  
  // If no phonetic with both text and audio, get the first available text
  const phoneticText = phonetics.find(p => p.text)?.text;
  return { text: phoneticText };
}

export async function translateWord(word: string, targetLang: string): Promise<DictionaryEntry | null> {
  try {
    const trimmedWord = word.trim().toLowerCase();
    
    // Validate input
    if (!trimmedWord || trimmedWord.length < 2) {
      console.log('Word too short for translation');
      return null;
    }

    // Check for valid characters
    const validCharRegex = /^[a-zA-Z\s\-']+$/;
    if (!validCharRegex.test(trimmedWord)) {
      console.log('Invalid characters in word');
      return null;
    }

    // Only attempt translation for supported languages
    const supportedLanguages = ['de', 'es', 'fr', 'it', 'pt', 'ru'];
    if (!supportedLanguages.includes(targetLang.toLowerCase())) {
      console.warn(`Translation not supported for language: ${targetLang}`);
      return null;
    }

    const response = await fetch(`${DICTIONARY_API_URL}/${targetLang}/${encodeURIComponent(trimmedWord)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Unable to fetch translation. Please try again later.');
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    return data[0] as DictionaryEntry;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching the translation');
  }
}