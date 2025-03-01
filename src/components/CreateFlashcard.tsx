import React from 'react';
import { Plus, X, Volume2 } from 'lucide-react';
import { Word } from '../types';
import { speak } from '../lib/tts';

interface CreateFlashcardProps {
  onSave: (word: Word) => void;
  onClose: () => void;
  language: string;
}

export function CreateFlashcard({ onSave, onClose, language }: CreateFlashcardProps) {
  const [term, setTerm] = React.useState('');
  const [definition, setDefinition] = React.useState('');
  const [example, setExample] = React.useState('');
  const [phonetic, setPhonetic] = React.useState('');
  const [partOfSpeech, setPartOfSpeech] = React.useState<string>('noun');
  const [level, setLevel] = React.useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newWord: Word = {
      term,
      definition,
      example,
      phonetic,
      partOfSpeech,
      level,
      sourceLang: language,
      targetLang: 'english',
      lastReviewed: new Date(),
      reviewCount: 0,
      easeFactor: 2.5,
      interval: 1
    };

    onSave(newWord);
    onClose();
  };

  const handleAudioPlay = async () => {
    if (!term) return;
    
    try {
      setIsPlaying(true);
      const langCode = language === 'english' ? 'en-US' :
                      language === 'german' ? 'de-DE' :
                      language === 'turkish' ? 'tr-TR' :
                      language === 'chinese' ? 'zh-CN' :
                      language === 'japanese' ? 'ja-JP' : 'en-US';
      
      await speak(term, langCode);
      setIsPlaying(false);
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Flashcard
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Term</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="glass-input flex-1"
                placeholder="Enter the word or phrase"
                required
              />
              <button
                type="button"
                onClick={handleAudioPlay}
                className={`glass rounded-full p-2 transition-all duration-300 ${
                  isPlaying ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                disabled={isPlaying || !term}
              >
                <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Phonetic (optional)</label>
            <input
              type="text"
              value={phonetic}
              onChange={(e) => setPhonetic(e.target.value)}
              className="glass-input w-full"
              placeholder="Add pronunciation guide"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Definition</label>
            <textarea
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              className="glass-input w-full min-h-[100px] rounded-2xl"
              placeholder="Enter the meaning"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">Example (optional)</label>
            <textarea
              value={example}
              onChange={(e) => setExample(e.target.value)}
              className="glass-input w-full min-h-[80px] rounded-2xl"
              placeholder="Add an example sentence"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">Part of Speech</label>
              <select
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value)}
                className="glass-input w-full"
              >
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
                <option value="adjective">Adjective</option>
                <option value="adverb">Adverb</option>
                <option value="pronoun">Pronoun</option>
                <option value="preposition">Preposition</option>
                <option value="conjunction">Conjunction</option>
                <option value="interjection">Interjection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                className="glass-input w-full"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="glass-button text-white/70 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass-button bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 hover:text-emerald-100"
            >
              Create Flashcard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}