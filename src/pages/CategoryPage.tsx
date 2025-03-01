import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Sparkles, Trophy, Clock, RotateCcw, Volume2 } from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { speak } from '../lib/tts';
import { 
  vocabularyCategories,
  englishVocabulary,
  chineseVocabulary,
  germanVocabulary,
  japaneseVocabulary
} from '../lib/vocabularyData';
import { calculateNextReview } from '../lib/spacedRepetition';
import { Word } from '../types';

interface StudySession {
  currentWordIndex: number;
  correctCount: number;
  totalReviewed: number;
  startTime: Date;
}

export function CategoryPage() {
  const { language, category } = useParams();
  const navigate = useNavigate();
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [session, setSession] = React.useState<StudySession>({
    currentWordIndex: 0,
    correctCount: 0,
    totalReviewed: 0, 
    startTime: new Date()
  });
  const [reviewInfo, setReviewInfo] = React.useState<string>('');
  const y = useMotionValue(0);
  const scale = useTransform(y, [-100, 0, 100], [0.95, 1, 0.95]);
  const opacity = useTransform(y, [-200, 0, 200], [0, 1, 0]);
  const controls = useAnimation();
  const dragConstraints = React.useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = React.useState(false);
  const [dragDirection, setDragDirection] = React.useState<'up' | 'down' | null>(null);

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    const yOffset = info.offset.y;
    const velocity = info.velocity.y;

    if (Math.abs(yOffset) > swipeThreshold || Math.abs(velocity) > 300) {
      const direction = yOffset > 0 ? 'down' : 'up';
      setDragDirection(direction);

      await controls.start({
        y: direction === 'up' ? -window.innerHeight : window.innerHeight,
        opacity: 0,
        transition: { duration: 0.15, ease: 'easeOut' }
      });

      handleScore(direction === 'up' ? 5 : 1);
      setDragDirection(null);
    } else {
      controls.start({ y: 0, opacity: 1 });
    }
  };

  const getCategoryData = () => {
    switch (language?.toLowerCase()) {
      case 'english':
        return englishVocabulary[category as keyof typeof englishVocabulary];
      case 'chinese':
        return chineseVocabulary[category as keyof typeof chineseVocabulary];
      case 'german':
        return germanVocabulary[category as keyof typeof germanVocabulary];
      case 'japanese':
        return japaneseVocabulary[category as keyof typeof japaneseVocabulary];
      default:
        return vocabularyCategories[category as keyof typeof vocabularyCategories];
    }
  };

  const categoryData = getCategoryData();
  const currentWord = categoryData?.words[session.currentWordIndex];
  
  // Get due words for review
  const getDueWords = () => {
    return categoryData?.words.filter(word => {
      if (!word.nextReview) return true;
      return new Date(word.nextReview) <= new Date();
    });
  };

  const handleScore = async (score: number) => {
    if (!currentWord) return;

    // Calculate next review interval using spaced repetition
    const nextReview = calculateNextReview(score, {
      easeFactor: currentWord.easeFactor || 2.5,
      interval: currentWord.interval || 1,
      repetitions: currentWord.reviewCount || 0,
      dueDate: currentWord.nextReview || new Date()
    });
    
    // Show review schedule feedback
    const days = Math.round(nextReview.interval);
    setReviewInfo(
      score < 3 
        ? 'Card will be shown again soon'
        : `Next review in ${days} ${days === 1 ? 'day' : 'days'}`
    );

    // Update word with new review data
    const updatedWord: Word = {
      ...currentWord,
      easeFactor: nextReview.easeFactor,
      interval: nextReview.interval,
      reviewCount: nextReview.repetitions,
      nextReview: nextReview.dueDate,
      lastReviewed: new Date()
    };

    const nextIndex = session.currentWordIndex + 1;
    const isLastCard = nextIndex >= categoryData.words.length;

    // Update session stats
    setSession(prev => ({
      ...prev,
      correctCount: prev.correctCount + (score >= 3 ? 1 : 0),
      totalReviewed: prev.totalReviewed + 1,
      currentWordIndex: nextIndex
    }));

    if (isLastCard) navigate(`/language/${language}`);

    setShowAnswer(false);
  };

  const handleAudioPlay = async () => {
    if (!currentWord) return;
    
    try {
      setIsPlaying(true);
      
      // Use audio file if available, otherwise fallback to TTS
      if (currentWord.audio) {
        if (!audioRef.current) {
          audioRef.current = new Audio(currentWord.audio);
        } else if (audioRef.current.src !== currentWord.audio) {
          audioRef.current.src = currentWord.audio;
        }
        await audioRef.current.play();
        audioRef.current.onended = () => setIsPlaying(false);
      } else {
        // Get language code for TTS
        const langCode = language === 'english' ? 'en-US' :
                        language === 'german' ? 'de-DE' :
                        language === 'turkish' ? 'tr-TR' :
                        language === 'chinese' ? 'zh-CN' :
                        language === 'japanese' ? 'ja-JP' : 'en-US';
        
        await speak(currentWord.term, langCode);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
    }
  };

  if (!categoryData) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-black/30 backdrop-blur-[2px] p-5">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/language/${language}`)}
              className="glass-button flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Categories
            </button>
            <h2 className="text-xl font-semibold text-white">
              {categoryData.name} - Learning Session
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-300" />
              <span className="text-white/90">
                {session.correctCount}/{session.totalReviewed}
              </span>
            </div>
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span className="text-white/90">
                Level {Math.floor(session.totalReviewed / 10) + 1}
              </span>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <AnimatePresence mode="wait">
          {currentWord && (
            <div ref={dragConstraints} className="overflow-hidden">
              <motion.div
                key={currentWord.term}
                style={{ y, scale, opacity }}
                animate={controls}
                drag={showAnswer ? "y" : false}
                dragConstraints={dragConstraints}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, y: window.innerHeight }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: dragDirection === 'up' ? -window.innerHeight : window.innerHeight }}
                transition={{
                  type: "spring",
                  stiffness: 700,
                  damping: 25,
                  mass: 1
                }}
                className="glass-card p-6 mb-8 min-h-[300px] flex flex-col
                         max-w-xl mx-auto bg-gradient-to-br from-white/15 to-white/5
                         hover:from-white/20 hover:to-white/10
                         transition-all duration-500 transform cursor-grab active:cursor-grabbing
                         shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
                         hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.15)]
                         will-change-transform">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white/60">
                  Word {session.currentWordIndex + 1} of {categoryData.words.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="glass px-3 py-1.5 rounded-full text-sm font-medium bg-white/10 text-white/90">
                    {currentWord.partOfSpeech}
                  </span>
                  <span className={`glass px-3 py-1.5 rounded-full text-sm font-medium ${
                    currentWord.level === 'beginner' ? 'bg-emerald-500/20 text-emerald-200' :
                    currentWord.level === 'intermediate' ? 'bg-amber-500/20 text-amber-200' :
                    'bg-rose-500/20 text-rose-200'
                  }`}>
                    {currentWord.level}
                  </span>
                </div>
              </div>

              {/* Review Info */}
              {reviewInfo && (
                <div className="flex items-center justify-center gap-2 text-white/70 text-sm mb-4">
                  <Clock className="w-4 h-4" />
                  {reviewInfo}
                </div>
              )}

              <div 
                className="flex-1 flex flex-col items-center justify-center cursor-pointer select-none min-h-[200px]
                         hover:bg-white/5 rounded-xl transition-all duration-300 px-4 py-8"
                onClick={() => setShowAnswer(!showAnswer)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.code === 'Space') {
                    e.preventDefault();
                    setShowAnswer(!showAnswer);
                  } else if (showAnswer) {
                    if (e.code === 'ArrowLeft') handleScore(1);
                    else if (e.code === 'ArrowUp') handleScore(3);
                    else if (e.code === 'ArrowRight') handleScore(5);
                  }
                }}
              >
                <div className="text-center w-full">
                  <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                             from-white to-white/80 mb-4 floating tracking-tight">{currentWord.term}</h2>
                  {currentWord.phonetic && (
                    <p className="text-base text-white/70 mb-3 font-mono tracking-wider">{currentWord.phonetic}</p>
                  )}
                  {!showAnswer && (
                    <div className="space-y-4">
                      <p className="text-white/60 text-sm animate-pulse px-4 py-2 glass rounded-full inline-block">
                        Click or press Space to reveal definition
                      </p>
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAudioPlay();
                          }}
                          className={`glass rounded-full p-3 transition-all duration-300 ${
                            isPlaying ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                          }`}
                          disabled={isPlaying}
                        >
                          <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
                        </button>
                      </div>
                    </div>
                  )}
                  {showAnswer && (
                    <div className="text-center animate-fadeIn w-full max-w-md mx-auto mt-6
                                transform transition-all duration-500 px-4">
                      <p className="text-xl text-white/90 mb-3 leading-relaxed">{currentWord.definition}</p>
                      {currentWord.example && (
                        <p className="text-base text-white/80 italic glass p-3 rounded-xl mt-4
                                  bg-white/5 shadow-inner leading-relaxed">
                          "{currentWord.example}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            
              <div className="mt-8">
                {showAnswer ? (
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScore(1);
                      }}
                      className="glass-button bg-rose-500/10 hover:bg-rose-500/20 text-rose-200 
                             hover:text-rose-100 min-w-[100px] py-2 flex items-center gap-2 
                             transition-all duration-300 justify-center font-medium"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Again
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScore(3);
                      }}
                      className="glass-button bg-amber-500/10 hover:bg-amber-500/20 text-amber-200
                             hover:text-amber-100 min-w-[100px] py-2 flex items-center gap-2
                             transition-all duration-300 justify-center font-medium"
                    >
                      <Clock className="w-4 h-4" />
                      Good
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScore(5);
                      }}
                      className="glass-button bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200
                             hover:text-emerald-100 min-w-[100px] py-2 flex items-center gap-2
                             transition-all duration-300 justify-center font-medium"
                    >
                      <Trophy className="w-4 h-4" />
                      Easy
                    </button>
                  </div>
                ) : (
                  <div className="text-center glass rounded-full py-2 px-4 bg-white/5 inline-block mx-auto">
                    <p className="text-white/50">Space to reveal • ← Again • ↑ Good • → Easy</p>
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none
                           flex justify-between px-4 text-white/30 text-sm">
                <motion.div style={{ opacity: useTransform(y, [-100, 0], [1, 0]) }}>
                  Swipe up for Easy
                </motion.div>
                <motion.div style={{ opacity: useTransform(y, [0, 100], [0, 1]) }}>
                  Swipe down for Again
                </motion.div>
              </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="text-lg font-semibold text-white">Progress</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Mastery</span>
                  <span className="text-white/90">
                    {Math.round((session.correctCount / Math.max(session.totalReviewed, 1)) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(session.correctCount / Math.max(session.totalReviewed, 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Words Reviewed</span>
                  <span className="text-white/90">{session.totalReviewed}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-300 to-indigo-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${(session.totalReviewed / categoryData.words.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}