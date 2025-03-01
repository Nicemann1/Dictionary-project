import React from 'react';
import { ThumbsUp, Clock } from 'lucide-react';
import { Word } from '../types';

interface WordCardProps {
  word: Word;
  onAddExample?: (text: string) => void;
  onVoteExample?: (exampleId: string) => void;
}

export function WordCard({ word, onAddExample, onVoteExample }: WordCardProps) {
  const [newExample, setNewExample] = React.useState('');

  return (
    <div className="glass-card p-6 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{word.term}</h3>
        <div className="flex items-center space-x-3">
          {word.level && (
            <span className={`text-sm font-medium px-2 py-1 rounded ${
              word.level === 'beginner' ? 'glass text-emerald-200' :
              word.level === 'intermediate' ? 'glass text-amber-200' :
              'glass text-rose-200'
            }`}>
              {word.level}
            </span>
          )}
          <span className="text-sm font-medium glass px-2 py-1 rounded-full text-white/90">
            {word.partOfSpeech}
          </span>
          <span className="text-sm text-white/70">
            {word.sourceLang.toUpperCase()} → {word.targetLang.toUpperCase()}
          </span>
        </div>
      </div>
      <p className="text-white/80 mb-4">{word.definition}</p>
      {word.example && (
        <div className="border-l-4 border-white/20 pl-4">
          <p className="text-white/70 italic">"{word.example}"</p>
        </div>
      )}
      
      {/* Contextual Examples */}
      {word.contextualExamples && word.contextualExamples.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-white mb-3">Contextual Examples</h4>
          <div className="space-y-3">
            {word.contextualExamples.map((example) => (
              <div key={example.id} className="glass rounded-lg p-3">
                <p className="text-white/80 italic mb-2">"{example.text}"</p>
                <div className="flex items-center justify-between text-sm text-white/70">
                  <div className="flex items-center space-x-2">
                    {example.source && <span>Source: {example.source}</span>}
                    {example.contributor && <span>by {example.contributor}</span>}
                  </div>
                  <button
                    onClick={() => onVoteExample?.(example.id)}
                    className="flex items-center space-x-1 text-white/90 hover:text-white"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{example.votes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Add Example Form */}
      {onAddExample && (
        <div className="mt-6">
          <h4 className="font-medium text-white mb-3">Add Example</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              placeholder="Share a contextual example..."
              className="glass-input flex-1"
            />
            <button
              onClick={() => {
                onAddExample(newExample);
                setNewExample('');
              }}
              disabled={!newExample.trim()}
              className="glass-button disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}