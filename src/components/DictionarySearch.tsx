import React, { useState } from 'react';
import { Volume2, Loader2, BookOpen, AlertCircle, Heart, Image as ImageIcon, HelpCircle, Info } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getWordDetails } from '../lib/translationApis';
import { SearchBar } from './SearchBar';
import { useTranslationStore } from '../lib/translationApis';
import type { DictionaryResult } from '../types';

const DEBOUNCE_DELAY = 300; // ms
const MIN_SEARCH_LENGTH = 2;
const MAX_SEARCH_LENGTH = 50;

export function DictionarySearch() {
  const { language } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DictionaryResult[]>([]);
  const [showImage, setShowImage] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { saveWord, savedWords } = useTranslationStore();
  const searchTimeoutRef = React.useRef<number>();
  const abortControllerRef = React.useRef<AbortController>();
  const tooltipTimeoutRef = React.useRef<number>();
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleTooltip = (event: React.MouseEvent<HTMLElement>, content: string) => {
    const target = event.currentTarget;
    const tooltip = document.createElement('div');
    tooltip.className = 'glass-card p-2 text-sm text-white/90 absolute z-50 animate-fadeIn';
    tooltip.style.top = `${target.offsetTop - 40}px`;
    tooltip.style.left = `${target.offsetLeft}px`;
    tooltip.textContent = content;
    document.body.appendChild(tooltip);

    tooltipTimeoutRef.current = window.setTimeout(() => {
      document.body.removeChild(tooltip);
    }, 2000);

    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      if (document.body.contains(tooltip)) {
        document.body.removeChild(tooltip);
      }
    };
  };

  const handleAudioPlay = async (audioUrl: string) => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
      } else if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
      }

      setIsPlaying(true);
      await audioRef.current.play();
      audioRef.current.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
    }
  };

  const isWordSaved = (word: string) => {
    const lang = language?.toLowerCase() || 'english';
    return savedWords[lang]?.some(w => w.term === word);
  };

  const handleSearchInput = (term: string) => {
    setSearchTerm(term);
    
    setError(null);
    setResults([]);

    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear results for empty input
    if (!term.trim()) {
      setResults([]);
      return;
    }

    // Show minimum length error
    const trimmedTerm = term.trim().toLowerCase();
    if (trimmedTerm.length < MIN_SEARCH_LENGTH) {
      setError(`Please enter at least ${MIN_SEARCH_LENGTH} characters to search.`);
      return;
    }

    // Show maximum length error
    if (trimmedTerm.length > MAX_SEARCH_LENGTH) {
      setError(`Search term cannot be longer than ${MAX_SEARCH_LENGTH} characters.`);
      return;
    }

    // Validate characters
    const validCharRegex = /^[a-zA-Z\s\-']+$/;
    if (trimmedTerm && !validCharRegex.test(trimmedTerm)) {
      setError('Please use only English letters, spaces, hyphens, and apostrophes.');
      return;
    }

    // Debounce the search
    searchTimeoutRef.current = window.setTimeout(() => {
      handleSearch(term);
    }, DEBOUNCE_DELAY);
  };

  const handleSearch = async (term: string) => {
    const trimmedTerm = term.trim();
    if (trimmedTerm.length < MIN_SEARCH_LENGTH) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResults([]);
    
    try {
      // Create new abort controller
      abortControllerRef.current = new AbortController();

      const result = await getWordDetails(trimmedTerm, language?.toLowerCase());
      if (result) {
        setResults([result]);
      } else {
        setError(`No results found for "${trimmedTerm}". Please try a different word.`);
      }
    } catch (err: any) {
      // Handle abort error
      if (err.name === 'AbortError') {
        return;
      }
      
      // Handle other errors
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred while searching. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto relative">
      <SearchBar 
        onSearch={handleSearch}
        onInputChange={handleSearchInput}
        placeholder="Search for a word..."
        isLoading={isLoading}
      />

      {/* Minimum Length Warning */}
      {searchTerm.trim().length > 0 && searchTerm.trim().length < MIN_SEARCH_LENGTH && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card p-3 text-sm text-white/70 animate-fadeIn">
          <div className="flex items-center gap-2 justify-center">
            <AlertCircle size={16} className="text-amber-400" />
            Please enter at least {MIN_SEARCH_LENGTH} characters to search
          </div>
        </div>
      )}

      {/* Maximum Length Warning */}
      {searchTerm.trim().length > MAX_SEARCH_LENGTH && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card p-3 text-sm text-white/70 animate-fadeIn">
          <div className="flex items-center gap-2 justify-center">
            <AlertCircle size={16} className="text-amber-400" />
            Search term cannot be longer than {MAX_SEARCH_LENGTH} characters
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="flex justify-center items-center mt-8">
          <Loader2 className="animate-spin text-white animate-pulse-soft" size={32} />
        </div>
      )}

      {/* Error State */}
      {error && searchTerm.trim().length >= MIN_SEARCH_LENGTH && (
        <div className="mt-8 flex items-center justify-center gap-2 text-white/80 glass-card p-4 animate-fadeIn">
          <AlertCircle size={20} className="text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && searchTerm && results.length === 0 && (
        <div className="mt-8 text-center text-white/80 glass-card p-6 animate-fadeIn">
          <BookOpen size={32} className="mx-auto mb-4 text-white/50" />
          <p>No results found for "{searchTerm}"</p>
          <p className="text-sm mt-2 text-white/60">Try searching for a different word</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && results.map((result, index) => (
        <div key={index} className="mt-6 glass-card overflow-hidden animate-fadeIn backdrop-blur-lg bg-white/10">
          {/* Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tighter">
                  {result.word || searchTerm}
                </h2>
                <div className="flex items-center">
                  <span 
                    className="text-sm font-medium px-2 py-0.5 glass rounded-full tracking-wide cursor-help"
                    onMouseEnter={(e) => handleTooltip(e, 'Part of speech')}
                  >
                    {result.partOfSpeech}
                  </span>
                </div>
                {result.audio && (
                  <button 
                    onClick={() => handleAudioPlay(result.audio!)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                              ${isPlaying ? 'glass text-white scale-110' : 'text-white/60 hover:text-white hover:glass'}`}
                    title="Listen to pronunciation"
                    disabled={isPlaying}
                  >
                    <Volume2 size={16} className={isPlaying ? 'animate-pulse' : ''} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowImage(!showImage)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                              ${showImage ? 'glass text-white' : 'text-white/60 hover:text-white hover:glass'}`}
                    title="Toggle image"
                  >
                    <ImageIcon size={16} />
                  </button>
                  <button
                    onClick={() => {
                      const wordData = {
                        term: result.word,
                        definition: result.definition,
                        sourceLang: 'english',
                        targetLang: language?.toLowerCase() || 'english',
                        partOfSpeech: result.partOfSpeech,
                        phonetic: result.phonetic,
                        audio: result.audio,
                        example: result.examples?.[0],
                        level: 'beginner'
                      };
                      saveWord(language?.toLowerCase() || 'english', wordData);
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                              ${isWordSaved(result.word) ? 'glass text-rose-300' : 'text-white/60 hover:text-white hover:glass'}`}
                    title={isWordSaved(result.word) ? 'Word saved' : 'Save word'}
                  >
                    <Heart size={16} className={isWordSaved(result.word) ? 'fill-current' : ''} />
                  </button>
                  <button
                    onClick={(e) => handleTooltip(e, 'Click icons to: play audio, show image, or save word')}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white transition-colors"
                  >
                    <Info size={16} />
                  </button>
                </div>
              </div>
            </div>
            {(result.definition && result.definition !== result.word) && (
              <p className="text-xl font-medium text-white/90 mt-2 tracking-normal">{result.definition}</p>
            )}
            {result.phonetic && (
              <p className="text-sm text-white/70 mt-1.5 font-medium tracking-wider">{result.phonetic}</p>
            )}
          </div>

          {/* Optional Image */}
          {showImage && (
            <div className="p-6 border-b border-white/5">
              <img
                src={`https://source.unsplash.com/featured/?${encodeURIComponent(result.word)}`}
                alt={result.word}
                className="w-full h-48 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
          )}

          {/* Content */}
          <div className="divide-y divide-white/10">
            {/* Definitions */}
            <div className="p-6">
              {result.definitions.slice(0, 2).map((definition, index) => (
                <div key={index} className="text-white/80 text-base py-2 hover:text-white transition-colors font-normal leading-relaxed">
                  {index + 1}. {definition}
                </div>
              ))}
            </div>

            {/* Examples */}
            {result.examples && result.examples.slice(0, 1).length > 0 && (
              <div className="p-6">
                {result.examples.slice(0, 1).map((example, index) => (
                  <div key={index} className="text-white/80 text-base pl-6 py-2 italic hover:text-white transition-colors font-normal leading-relaxed">
                    "{example}"
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}