import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Star, PlayCircle, Plus } from 'lucide-react';
import { DictionarySearch } from '../components/DictionarySearch';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { WordCard } from '../components/WordCard';
import { CreateFlashcard } from '../components/CreateFlashcard';
import { useTranslationStore, translateWord } from '../lib/translationApis';
import { 
  vocabularyCategories,
  englishVocabulary,
  chineseVocabulary,
  germanVocabulary,
  japaneseVocabulary
} from '../lib/vocabularyData';

export function LanguagePage() {
  const { language } = useParams();
  const navigate = useNavigate();
  
  // Get the appropriate vocabulary data based on language
  const getVocabularyData = React.useCallback(() => {
    switch (language) {
      case 'english':
        return Object.entries(englishVocabulary).reduce((acc, [key, category]) => {
          acc[key] = {
            ...category,
            words: category.words.map(word => ({
              ...word,
              sourceLang: 'english',
              targetLang: 'english'
            }))
          };
          return acc;
        }, {} as typeof englishVocabulary);
      case 'chinese':
        return chineseVocabulary;
      case 'german':
        return germanVocabulary;
      case 'japanese':
        return japaneseVocabulary;
      default:
        return vocabularyCategories;
    }
  }, [language]);

  const currentVocabulary = React.useMemo(() => getVocabularyData(), [getVocabularyData]);
  
  const [activeTab, setActiveTab] = React.useState<'vocabulary' | 'flashcards' | 'practice'>('vocabulary');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [flippedCard, setFlippedCard] = React.useState<string | null>(null);
  const [showCreateFlashcard, setShowCreateFlashcard] = React.useState(false);
  const { savedWords, saveWord, flashcards, addFlashcard, convertToFlashcard } = useTranslationStore();

  // Get flashcards for current language
  const currentFlashcards = React.useMemo(() => {
    return flashcards[language?.toLowerCase() || ''] || [];
  }, [flashcards, language]);

  const handleWordReview = async (wordId: string, score: number) => {
    // In a real app, update the word's review status and schedule
    console.log(`Word ${wordId} reviewed with score ${score}`);
  };

  // Handle category selection
  const handleCategorySelect = React.useCallback((categoryId: string) => {
    navigate(`/language/${language}/category/${categoryId}`);
  }, [navigate, language]);

  // Get all words for the current language
  const allWords = React.useMemo(() => {
    if (language === 'english') {
      return Object.values(englishVocabulary).flatMap(category => category.words);
    }
    return [];
  }, [language]);

  const languageInfo = { name: language || '' };

  return (
    <div className="min-h-screen bg-black/30 backdrop-blur-[2px] p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="glass-button flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          <h1 className="text-2xl font-bold text-white floating">
            Learn {language?.charAt(0).toUpperCase()}{language?.slice(1)}
          </h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'vocabulary'
                ? 'glass text-white shimmer'
                : 'glass text-white/70 hover:text-white hover:bg-white/20'
            }`}
          >
            <Book className="w-4 h-4" />
            Vocabulary
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'flashcards'
                ? 'glass text-white shimmer'
                : 'glass text-white/70 hover:text-white hover:bg-white/20'
            }`}
          >
            <Star className="w-4 h-4" />
            Flashcards
          </button>
          <button
            onClick={() => setShowCreateFlashcard(true)}
            className="glass-button flex items-center gap-2 text-emerald-200 hover:text-emerald-100"
          >
            <Plus className="w-4 h-4" />
            Create Flashcard
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <DictionarySearch />
        </div>

        {activeTab === 'vocabulary' && (
          <div className="glass-card p-6 backdrop-blur-sm bg-white/10">
          <h2 className="text-xl font-semibold text-white floating mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(currentVocabulary).map(([key, category]) => (
              <div
                key={key}
                onClick={() => setFlippedCard(flippedCard === key ? null : key)}
                className="glass rounded-xl p-6 flex flex-col items-center justify-center space-y-3
                         transition-all duration-500 group hover:bg-white/20
                         relative overflow-hidden hover:scale-105 min-h-[200px]
                         hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.3)]
                         before:absolute before:inset-0 before:bg-gradient-to-br
                         before:from-white/20 before:to-transparent before:opacity-0
                         before:transition-opacity before:duration-500 hover:before:opacity-100
                         perspective-1000 cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.code === 'Enter' || e.code === 'Space') {
                    e.preventDefault();
                    setFlippedCard(flippedCard === key ? null : key);
                  }
                }}
              >
                <div className={`w-full h-full transition-all duration-500 transform-style-3d ${
                  flippedCard === key ? 'rotate-y-180' : ''
                }`}>
                  {/* Front of card */}
                  <div className="absolute inset-0 backface-hidden">
                    <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                      <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse-soft"></div>
                      <span className="text-4xl floating relative z-10">{category.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-white/90 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/70 text-center leading-relaxed px-2 mb-3">
                      {category.description}
                    </p>
                    <div className="glass px-3 py-1.5 rounded-full text-xs font-medium text-white/80 mt-auto">
                      {category.words.length} words
                    </div>
                  </div>
                  
                  {/* Back of card */}
                  <div 
                    className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/language/${language}/category/${key}`);
                    }}
                  >
                    <div
                      role="button"
                      tabIndex={-1}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/language/${language}/category/${key}`);
                      }}
                      className="glass-button flex items-center gap-2 text-emerald-200 hover:text-emerald-100"
                    >
                      <PlayCircle className="w-5 h-5" />
                      Start Learning
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Selected Category Words */}
          {selectedCategory && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {vocabularyCategories[selectedCategory].name} - Turkish Vocabulary
                  </h3>
                  <p className="text-sm text-white/70 mt-1">
                    {vocabularyCategories[selectedCategory].words.length} words to learn
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate(`/language/${language}/category/${selectedCategory}`)}
                    className="glass-button flex items-center gap-2 text-emerald-200 hover:text-emerald-100"
                  >
                    <PlayCircle className="w-5 h-5" />
                    Start Learning
                  </button>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="glass-button text-sm"
                  >
                    Back to Categories
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vocabularyCategories[selectedCategory].words.map((word) => (
                  <WordCard
                    key={word.term}
                    word={word}
                    onAddExample={(text) => {
                      console.log(`Adding example for ${word.term}: ${text}`);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="space-y-8">
            <FlashcardDeck
              words={currentFlashcards}
              onReview={handleWordReview}
            />
            {savedWords[language?.toLowerCase() || '']?.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Saved Words</h3>
                <p className="text-white/70 mb-4">Convert your saved words to flashcards to start practicing:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedWords[language?.toLowerCase() || ''].map((word) => (
                    <div key={word.term} className="glass p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-medium">{word.term}</h4>
                        <button
                          onClick={() => convertToFlashcard(language?.toLowerCase() || '', word.term)}
                          className="text-emerald-200 hover:text-emerald-100 text-sm"
                        >
                          Convert
                        </button>
                      </div>
                      <p className="text-white/70 text-sm">{word.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vocabulary' && (
          <div className="mt-8 glass-card p-6 backdrop-blur-sm bg-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white floating">Recent Words</h2>
            <button className="glass-button shimmer">View all</button>
          </div>
          <div className="space-y-4">
            {(savedWords[language?.toLowerCase() || ''] || []).map((word) => (
              <WordCard
                key={word.term}
                word={word}
                onAddExample={(text) => {
                  // Handle adding example
                  console.log(`Adding example for ${word.term}: ${text}`);
                }}
                onVoteExample={(exampleId) => {
                  // Handle voting
                  console.log(`Voting for example ${exampleId}`);
                }}
              />
            ))}
          </div>
          </div>
        )}
      </div>
      
      {showCreateFlashcard && (
        <CreateFlashcard
          onSave={(word) => {
            addFlashcard(language?.toLowerCase() || '', word);
            setShowCreateFlashcard(false);
          }}
          onClose={() => setShowCreateFlashcard(false)}
          language={language?.toLowerCase() || 'english'}
        />
      )}
    </div>
  );
}