import { supabase } from './supabase';

const DEEPL_API_KEY = 'd3b58d17-21a2-4b46-a783-40bd4a00f9e5';
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

// Language code mapping for DeepL
const LANGUAGE_CODES = {
  'en': 'EN-US',
  'de': 'DE',
  'tr': 'TR',
  'zh': 'ZH',
  'ja': 'JA'
} as const;

type DeepLLanguageCode = typeof LANGUAGE_CODES[keyof typeof LANGUAGE_CODES];

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

export async function translateText(
  text: string,
  targetLang: keyof typeof LANGUAGE_CODES,
  sourceLang?: keyof typeof LANGUAGE_CODES
): Promise<string> {
  try {
    const params = new URLSearchParams({
      auth_key: DEEPL_API_KEY,
      text,
      target_lang: LANGUAGE_CODES[targetLang],
      ...(sourceLang && { source_lang: LANGUAGE_CODES[sourceLang] })
    });

    const response = await fetch(`${DEEPL_API_URL}?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status} ${response.statusText}`);
    }

    const data: DeepLResponse = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

// Cache translations in Supabase
export async function getCachedTranslation(
  text: string,
  sourceLang: string,
  targetLang: string
) {
  const { data } = await supabase
    .from('translations')
    .select('translation')
    .eq('source_text', text)
    .eq('source_lang', sourceLang)
    .eq('target_lang', targetLang)
    .single();

  return data?.translation;
}

export async function cacheTranslation(
  text: string,
  translation: string,
  sourceLang: string,
  targetLang: string
) {
  await supabase
    .from('translations')
    .insert({
      source_text: text,
      translation,
      source_lang: sourceLang,
      target_lang: targetLang
    })
    .select()
    .single();
}

// Main translation function with caching
export async function translate(
  text: string,
  targetLang: keyof typeof LANGUAGE_CODES,
  sourceLang: keyof typeof LANGUAGE_CODES = 'en'
): Promise<string> {
  try {
    // Check cache first
    const cached = await getCachedTranslation(
      text,
      sourceLang,
      targetLang
    );

    if (cached) {
      return cached;
    }

    // If not in cache, get from DeepL
    const translation = await translateText(text, targetLang, sourceLang);

    // Cache the result
    await cacheTranslation(
      text,
      translation,
      sourceLang,
      targetLang
    );

    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback to original text on error
  }
}