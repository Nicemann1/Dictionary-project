import React from 'react';
import { Word } from '../types';

interface FlashcardDeckProps {
  words: Word[];
  onReview: (wordId: string, score: number) => void;
}

export function FlashcardDeck({ words, onReview }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [isReviewing, setIsReviewing] = React.useState(false);
  const currentWord = words && words.length > 0 ? words[currentIndex] : null;

  const handleScore = async (score: number) => {
    if (!currentWord) return;
    setIsReviewing(true);
    
    try {
      await onReview(currentWord.term, score);
      setShowAnswer(false);
      
      // Check if this was the last card
      if (currentIndex === words.length - 1) {
        // Show completion message
        return;
      }
      
      setCurrentIndex((prev) => (prev + 1) % words.length);
    } catch (error) {
      console.error('Error reviewing word:', error);
    } finally {
      setIsReviewing(false);
    }
  };

  if (!words || words.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 glass rounded-full flex items-center justify-center">
          <span className="text-3xl animate-bounce">📚</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">No Flashcards Yet</h3>
        <p className="text-white/70 mb-6">Start by searching for words and saving them as flashcards.</p>
        <div className="flex justify-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="glass-button text-emerald-200 hover:text-emerald-100"
          >
            Search Words
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-white/70">
          Card {currentIndex + 1} of {words?.length || 0}
          <div className="mt-1 w-full bg-white/10 h-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/30 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium glass px-2 py-1 rounded-full">
            {currentWord.partOfSpeech}
          </span>
          {currentWord.level && (
            <span className={`text-sm font-medium px-2 py-1 rounded ${
              currentWord.level === 'beginner' ? 'glass text-emerald-200' :
              currentWord.level === 'intermediate' ? 'glass text-amber-200' :
              'glass text-rose-200'
            }`}>
              {currentWord.level}
            </span>
          )}
        </div>
      </div>

      <div 
        className="min-h-[200px] flex items-center justify-center cursor-pointer"
        onClick={() => setShowAnswer(!showAnswer)}
      >
        {showAnswer ? (
          <div className="text-center">
            <p className="text-xl font-medium text-white mb-2">{currentWord.definition}</p>
            {currentWord.example && (
              <p className="text-white/70 italic mt-4">"{currentWord.example}"</p>
            )}
          </div>
        ) : (
          <h2 className="text-2xl font-semibold text-white">{currentWord.term}</h2>
        )}
      </div>

      {showAnswer && (
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => !isReviewing && handleScore(1)}
            disabled={isReviewing}
            className="glass-button text-rose-200 hover:text-rose-100"
          >
            Hard
          </button>
          <button
            onClick={() => !isReviewing && handleScore(3)}
            disabled={isReviewing}
            className="glass-button text-amber-200 hover:text-amber-100"
          >
            Good
          </button>
          <button
            onClick={() => !isReviewing && handleScore(5)}
            disabled={isReviewing}
            className="glass-button text-emerald-200 hover:text-emerald-100"
          >
            Easy
          </button>
        </div>
      )}
    </div>
  );
}