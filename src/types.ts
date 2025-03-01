export interface DictionaryResult {
  word: string;
  definition: string;
  definitions: string[];
  examples?: string[];
  phonetic?: string;
  audio?: string;
  partOfSpeech: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Word {
  term: string;
  definition: string;
  phonetic?: string;
  audio?: string;
  sourceLang: string;
  targetLang: string;
  partOfSpeech: string;
  example?: string;
  contextualExamples?: ContextualExample[];
  level?: 'beginner' | 'intermediate' | 'advanced';
  topics?: string[];
  lastReviewed?: Date;
  nextReview?: Date;
  reviewCount?: number;
  easeFactor?: number;
  interval?: number;
}

export interface ContextualExample {
  id: string;
  text: string;
  source?: string;
  contributor?: string;
  dateAdded: Date;
  votes: number;
}

export interface Course {
  id: string;
  title: string;
  progress: number;
  lectures: number;
  practicalWork: number;
  icon: string;
  startDate?: string;
  tutor?: string;
}

export interface Teacher {
  id: string;
  name: string;
  imageUrl: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: 'lecture' | 'practical';
  subtitle?: string;
  status: 'online' | 'offline' | 'completed' | 'upcoming';
}

export interface PopularCourse {
  id: string;
  title: string;
  category: string;
  backgroundClass: string;
  icons: string[];
}

// Progress interfaces
export interface UserProgress {
  totalWordsLearned: number;
  studyStreak: number;
  reviewAccuracy: number;
  totalStudyTime: string;
  lastStudyDate: Date | null;
}

export interface DailyActivity {
  studyDate: Date;
  studyTime: string;
  wordsReviewed: number;
  wordsLearned: number;
  correctReviews: number;
  totalReviews: number;
}

// Auth interfaces
export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
}