import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { PlayCircle } from 'lucide-react';
import { ActivityChart } from './components/ActivityChart';
import { DictionarySearch } from './components/DictionarySearch';
import { ScheduleList } from './components/ScheduleList';
import { ProgressCard } from './components/ProgressCard';
import { FlashcardDeck } from './components/FlashcardDeck';
import { Course, ScheduleItem, PopularCourse, UserProgress, DailyActivity } from './types';
import { LanguagePage } from './pages/LanguagePage';
import { CategoryPage } from './pages/CategoryPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage.tsx';
import { useTranslationStore } from './lib/translationApis';
import { useI18nStore, translations, formatDate } from './lib/i18n';
import { LanguageSelector } from './components/LanguageSelector';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChange } from './lib/auth';
import { getUserProgress, getDailyActivity } from './lib/progress';
import { testSupabaseConnection } from './lib/supabase';

// Sample data
const languages: Array<{
  id: string;
  name: string;
  icon: string;
  nativeText: string;
  status: 'active' | 'inactive';
}> = [
  { id: 'chinese', name: 'Chinese', icon: '🇨🇳', nativeText: '中文', status: 'active' },
  { id: 'german', name: 'German', icon: '🇩🇪', nativeText: 'Deutsch', status: 'active' },
  { id: 'turkish', name: 'Turkish', icon: '🇹🇷', nativeText: 'Türkçe', status: 'active' },
  { id: 'japanese', name: 'Japanese', icon: '🇯🇵', nativeText: '日本語', status: 'active' },
  { id: 'english', name: 'English', icon: '🇬🇧', nativeText: 'English', status: 'active' }
];

const scheduleItems: ScheduleItem[] = [
  {
    id: '1',
    time: '10:00',
    title: 'Maths In',
    subtitle: 'Simple Terms',
    type: 'lecture',
    status: 'completed'
  },
  {
    id: '2',
    time: '12:00',
    title: 'Chemistry',
    subtitle: 'Is Easy!',
    type: 'practical',
    status: 'upcoming'
  }
];

const courses: Course[] = [
  {
    id: '1',
    title: 'Tags in layout',
    progress: 75,
    lectures: 10,
    practicalWork: 5,
    icon: '🏷️'
  },
  {
    id: '2',
    title: 'Chemistry is easy!',
    progress: 45,
    lectures: 8,
    practicalWork: 4,
    icon: '🧪'
  },
  {
    id: '3',
    title: 'Economic Geography',
    progress: 60,
    lectures: 8,
    practicalWork: 4,
    icon: '🌍'
  },
  {
    id: '4',
    title: 'Maths in simple terms',
    progress: 30,
    lectures: 24,
    practicalWork: 16,
    icon: '📐'
  },
];

const popularCourses: PopularCourse[] = [
  {
    id: '1',
    title: 'German Grammar and Vocabulary',
    category: 'Languages',
    backgroundClass: 'bg-blue-50',
    icons: ['🔤', '📚', '🗣️']
  },
  {
    id: '2',
    title: 'Logic and Problem Solving',
    category: 'Maths',
    backgroundClass: 'bg-pink-50',
    icons: ['🧮', '🤔', '✏️']
  },
  {
    id: '3',
    title: 'Chemistry and the Environment',
    category: 'Chemistry',
    backgroundClass: 'bg-yellow-50',
    icons: ['🧪', '🌱', '🔬']
  }
];

const englishCategories = [
  {
    id: '1',
    name: 'Business',
    icon: '💼',
    description: 'Professional vocabulary',
    wordCount: 50,
  },
  {
    id: '2',
    name: 'Travel',
    icon: '✈️',
    description: 'Essential travel words',
    wordCount: 40,
  },
  {
    id: '3',
    name: 'Academic',
    icon: '📚',
    description: 'Study and research terms',
    wordCount: 45,
  },
  {
    id: '4',
    name: 'Technology',
    icon: '💻',
    description: 'Tech and digital terms',
    wordCount: 35,
  },
  {
    id: '5',
    name: 'Social',
    icon: '🗣️',
    description: 'Everyday conversation',
    wordCount: 30,
  },
  {
    id: '6',
    name: 'Culture',
    icon: '🎭',
    description: 'Arts and entertainment',
    wordCount: 25,
  },
];

function App() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { savedWords } = useTranslationStore();
  const { currentLanguage } = useI18nStore();
  const [showFlashcards, setShowFlashcards] = React.useState(false);
  const [flippedCard, setFlippedCard] = React.useState<string | null>(null);
  const t = translations[currentLanguage];
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const location = useLocation();
  const [userProgress, setUserProgress] = React.useState<UserProgress>({
    totalWordsLearned: 0,
    studyStreak: 0,
    reviewAccuracy: 0,
    totalStudyTime: '0',
    lastStudyDate: null
  });
  const [dailyActivity, setDailyActivity] = React.useState<DailyActivity[]>([]);
  const [dbConnectionStatus, setDbConnectionStatus] = React.useState<{success: boolean; error?: string}>({success: false});

  // Test database connection on app load
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const result = await testSupabaseConnection();
        setDbConnectionStatus(result);
        console.log('Connection test result:', result);
      } catch (error) {
        console.error('Error testing connection:', error);
        setDbConnectionStatus({
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };
    
    testConnection();
  }, []);

  // Fetch user progress data
  React.useEffect(() => {
    if (isAuthenticated) {
      const fetchProgress = async () => {
        try {
          const progress = await getUserProgress();
          const activity = await getDailyActivity(7);
          setUserProgress(progress);
          setDailyActivity(activity);
        } catch (error) {
          console.error('Error fetching progress:', error);
        }
      };
      fetchProgress();
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-black/30 backdrop-blur-[2px] flex items-center justify-center">Loading...</div>;
  }

  // Show database connection error if connection failed
  if (!dbConnectionStatus.success && !location.pathname.includes('/login') && !location.pathname.includes('/signup')) {
    return (
      <div className="min-h-screen bg-black/30 backdrop-blur-[2px] flex flex-col items-center justify-center p-5 text-white">
        <h2 className="text-2xl font-bold mb-4">Database Connection Error</h2>
        <p className="mb-4">Could not connect to the database. Please check your internet connection and try again.</p>
        {dbConnectionStatus.error && (
          <div className="p-4 bg-red-900/50 rounded-lg max-w-lg mb-2">
            <p className="font-mono text-sm">{dbConnectionStatus.error}</p>
          </div>
        )}
        {(dbConnectionStatus as any).details && (
          <div className="p-4 bg-red-900/30 rounded-lg max-w-lg text-red-200">
            <p className="font-mono text-xs">{(dbConnectionStatus as any).details}</p>
          </div>
        )}
        <div className="mt-6 flex gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            Retry Connection
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className="px-6 py-2 bg-blue-600/40 rounded-full hover:bg-blue-600/60 transition-colors"
          >
            Go to Login
          </button>
        </div>
        <div className="mt-6 text-sm text-white/60">
          <p>If you're the project owner, please verify:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Supabase project is active and accessible</li>
            <li>Database schema includes the required tables</li>
            <li>API keys are correct and have necessary permissions</li>
          </ul>
        </div>
      </div>
    );
  }

  const handleLanguageClick = (languageName: string) => {
    const languageId = languages.find(l => l.name === languageName)?.id;
    if (languageId) {
      navigate(`/language/${languageId}`);
    }
  };

  const handleWordReview = async (wordId: string, score: number) => {
    // In a real app, update the word's review status and schedule
    console.log(`Word ${wordId} reviewed with score ${score}`);
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
      <Route path="/signup" element={<SignUpPage />} />
      
      {/* Protected routes */}
      <Route path="/language/:language" element={
        isAuthenticated ? <LanguagePage /> : <Navigate to="/login" state={{ from: location }} replace />
      } />
      <Route path="/language/:language/category/:category" element={
        isAuthenticated ? <CategoryPage /> : <Navigate to="/login" state={{ from: location }} replace />
      } />
      <Route path="/" element={isAuthenticated ? (
    <div className="min-h-screen bg-black/30 backdrop-blur-[2px] p-5 relative overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* Search and Icons */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="glass p-2 rounded-lg transition-all duration-300 hover:bg-white/20 group flex items-center gap-2"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
          ) : (
            <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white" />
          )}
          <span className="text-white/70 group-hover:text-white text-sm font-medium">{formatDate(currentDate)}</span>
        </button>
        <DictionarySearch />
      </div>
      
      {/* Languages Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="glass-card p-6 transform transition-all duration-500 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">{t.languages}</h2>
            <button className="bg-white px-4 py-1 rounded-full text-sm text-gray-600 hover:bg-gray-50 border border-gray-200 flex items-center gap-2">
              {t.allSubjects} <span className="text-xs">↓</span>
            </button>
          </div>
          <div className="grid grid-cols-5 gap-6">
            {languages.map(language => (
              <div
                key={language.id}
                className="flex flex-col items-center space-y-3 cursor-pointer group relative
                         transform transition-all duration-500 hover:scale-105"
                onClick={() => handleLanguageClick(language.name)}
              >
                <div className="relative">
                  <div className="w-20 h-20 glass rounded-full flex items-center justify-center text-4xl 
                               transition-all duration-500 group-hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.3)]
                               relative overflow-hidden before:absolute before:inset-0 
                               before:bg-gradient-to-br before:from-white/20 before:to-transparent
                               before:opacity-0 before:transition-opacity before:duration-500
                               group-hover:before:opacity-100">
                    <div className="relative z-10 transform transition-transform duration-500 
                                group-hover:scale-110 group-hover:rotate-[360deg]">
                      {language.icon}
                    </div>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 transform transition-all duration-500
                                group-hover:scale-125 ${
                    language.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  } rounded-full border-2 border-white`}></div>
                </div>
                <div className="text-center transform transition-all duration-500">
                  <span className="text-sm font-medium text-white block group-hover:text-white/90">{language.name}</span>
                  <span className="block text-xs text-white/70 mt-1 transition-all duration-500 
                               group-hover:text-white/80">{language.nativeText}</span>
                </div>
              </div>
            ))}
            <button className="flex flex-col items-center justify-center group">
              <div className="w-20 h-20 glass rounded-full flex items-center justify-center text-2xl 
                           text-white/70 transition-all duration-500 transform
                           group-hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]
                           group-hover:scale-105 group-hover:bg-white/20">
                +
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* English Test Banner */}
          <div className="glass-card p-6 text-white backdrop-blur-sm bg-white/10 relative">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white floating">{t.flashcards}</h2>
              </div>
              <div className="text-3xl floating">📚</div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {englishCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setFlippedCard(flippedCard === category.id ? null : category.id)}
                  className="glass rounded-xl p-4 flex flex-col items-center justify-center space-y-2
                           transition-all duration-500 group hover:bg-white/20 
                           relative overflow-hidden hover:scale-105 min-h-[160px]
                           perspective-1000 cursor-pointer hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]"
                  role="button"
                  tabIndex={0}
                >
                  <div className={`w-full h-full transition-all duration-500 transform-style-3d ${
                    flippedCard === category.id ? 'rotate-y-180' : ''
                  }`}>
                    {/* Front of card */}
                    <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-4">
                      <div className="relative w-12 h-12 mb-3">
                        <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse-soft"></div>
                        <span className="absolute inset-0 flex items-center justify-center text-2xl floating">
                          {category.icon}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-white group-hover:text-white/90">
                        {category.name}
                      </h3>
                      <p className="text-xs text-white/70 text-center mt-1">
                        {category.description}
                      </p>
                      <div className="glass px-3 py-1.5 rounded-full text-xs font-medium text-white/80 mt-3
                                  bg-white/10 backdrop-blur-md shadow-inner">
                        {category.wordCount} words
                      </div>
                    </div>
                    
                    {/* Back of card */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center
                                bg-gradient-to-br from-white/20 to-white/5 rounded-xl">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); 
                          const path = `/language/english/category/${category.id.toLowerCase()}`;
                          navigate(path);
                        }}
                        className="glass-button flex items-center gap-2 text-emerald-200 hover:text-emerald-100 text-sm
                                bg-emerald-500/10 hover:bg-emerald-500/20 shadow-lg hover:shadow-emerald-500/20
                                transform hover:scale-110 transition-all duration-300"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Start Learning
                      </button>
                      <p className="text-xs text-white/50 mt-4 text-center">
                        Click to start practicing {category.wordCount} words
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Card */}
          <div className="glass-card p-6 backdrop-blur-sm bg-white/10">
            <h3 className="font-semibold text-white floating">English for travelling</h3>
            <p className="text-sm text-white/70 mt-1">Start date: 04/05/2024</p>
            <p className="text-sm text-white/70 mt-1">Tutor: Volter Anderson</p>
            <div className="mt-4">
              <div className="relative w-16 h-16">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="175.9"
                    strokeDashoffset="63.3"
                    className="shimmer"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-semibold text-white">
                  64%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8 flex flex-col">
          {/* Popular Courses */}
          <div className="glass-card p-6 backdrop-blur-sm bg-white/10 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white floating">{t.popularCourses}</h2>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center glass rounded-full text-white/70 hover:text-white transition-colors">
                  ←
                </button>
                <button className="w-8 h-8 flex items-center justify-center glass rounded-full text-white/70 hover:text-white transition-colors">
                  →
                </button>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {popularCourses.map(course => (
                <div
                  key={course.id}
                  className="min-w-[220px] h-[180px] glass rounded-[15px] relative p-4 cursor-pointer group transition-all duration-300"
                >
                  <div className="glass rounded-full px-4 py-1.5 text-sm inline-block text-white/90 shimmer">
                    {course.category}
                  </div>
                  <div className="absolute bottom-16 left-0 w-full flex justify-around">
                    {course.icons.map((icon, index) => (
                      <span key={index} className="text-2xl floating">{icon}</span>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full glass p-4 rounded-b-[15px] backdrop-blur-md bg-white/20 
                                group-hover:bg-white/30 transition-all duration-300">
                    <h3 className="font-semibold text-white">{course.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity Section - Now at bottom */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="glass-card p-8 backdrop-blur-sm bg-white/10 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white floating">My Progress</h2>
            <button className="text-white/70 hover:text-white flex items-center gap-2 transition-colors">
              {t.seeAll} <span className="text-xs shimmer">→</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Words Learned Card */}
            <div className="glass rounded-xl p-4 hover:bg-white/15 transition-all duration-300">
              <h3 className="text-sm font-medium text-white/70 mb-2">Words Learned</h3>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">{userProgress.totalWordsLearned}</span>
                <span className="text-sm text-white/50 mb-1">words</span>
              </div>
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500/50 rounded-full shimmer" 
                  style={{ 
                    width: `${Math.min((userProgress.totalWordsLearned / 100) * 100, 100)}%` 
                  }} 
                />
              </div>
            </div>

            {/* Study Streak Card */}
            <div className="glass rounded-xl p-4 hover:bg-white/15 transition-all duration-300">
              <h3 className="text-sm font-medium text-white/70 mb-2">Study Streak</h3>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">{userProgress.studyStreak}</span>
                <span className="text-sm text-white/50 mb-1">days</span>
              </div>
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500/50 rounded-full shimmer" 
                  style={{ width: `${Math.min((userProgress.studyStreak / 30) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Review Accuracy Card */}
            <div className="glass rounded-xl p-4 hover:bg-white/15 transition-all duration-300">
              <h3 className="text-sm font-medium text-white/70 mb-2">Review Accuracy</h3>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">{Math.round(userProgress.reviewAccuracy)}</span>
                <span className="text-sm text-white/50 mb-1">%</span>
              </div>
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500/50 rounded-full shimmer"
                  style={{ width: `${userProgress.reviewAccuracy}%` }}
                />
              </div>
            </div>

            {/* Time Studied Card */}
            <div className="glass rounded-xl p-4 hover:bg-white/15 transition-all duration-300">
              <h3 className="text-sm font-medium text-white/70 mb-2">Time Studied</h3>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">
                  {(parseInt(userProgress.totalStudyTime.split(' ')[0]) / 60).toFixed(1)}
                </span>
                <span className="text-sm text-white/50 mb-1">hours</span>
              </div>
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500/50 rounded-full shimmer"
                  style={{ 
                    width: `${Math.min((parseInt(userProgress.totalStudyTime.split(' ')[0]) / (8 * 60)) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Activity Chart Section */}
          <div className="mt-12">
            <ActivityChart />
          </div>
        </div>
      </div>
    </div>) : <Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App