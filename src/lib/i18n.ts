import { create } from 'zustand';

import { format } from 'date-fns';
import { enUS, tr, de, zhCN, ja } from 'date-fns/locale';

export type Language = 'en' | 'tr' | 'de' | 'zh' | 'ja';

const locales = {
  en: enUS,
  tr: tr,
  de: de,
  zh: zhCN,
  ja: ja
};

interface I18nStore {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

export const useI18nStore = create<I18nStore>((set) => ({
  currentLanguage: (() => {
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'en' || browserLang === 'de' || browserLang === 'tr' || 
            browserLang === 'zh' || browserLang === 'ja') ? browserLang as Language : 'en';
  })(),
  setLanguage: (lang) => set({ currentLanguage: lang })
}));

export function formatDate(date: Date): string {
  const lang = useI18nStore.getState().currentLanguage;
  const locale = locales[lang];
  
  switch (lang) {
    case 'zh':
    case 'ja':
      return format(date, 'yyyy年MM月dd日 EEEE', { locale });
    case 'tr':
      return format(date, 'dd MMMM yyyy, EEEE', { locale });
    case 'de':
      return format(date, 'EEEE, dd. MMMM yyyy', { locale });
    default:
      return format(date, 'EEEE, MMMM dd, yyyy', { locale });
  }
}

export const translations = {
  en: {
    languages: 'Languages',
    allSubjects: 'All subjects',
    flashcards: 'Flashcards',
    practiceNow: 'Practice now',
    hideCards: 'Hide cards',
    noFlashcards: 'No flashcards yet! Search for words above and save them to start practicing.',
    myActivity: 'My activity',
    seeAll: 'See all',
    popularCourses: 'Popular courses',
    searchPlaceholder: 'Search for a word...',
    back: 'Back',
    vocabulary: 'Vocabulary',
    categories: 'Categories',
    recentWords: 'Recent Words',
    viewAll: 'View all',
  },
  tr: {
    languages: 'Diller',
    allSubjects: 'Tüm konular',
    flashcards: 'Kartlar',
    practiceNow: 'Şimdi çalış',
    hideCards: 'Kartları gizle',
    noFlashcards: 'Henüz kart yok! Çalışmaya başlamak için yukarıdan kelime arayın ve kaydedin.',
    myActivity: 'Aktivitelerim',
    seeAll: 'Tümünü gör',
    popularCourses: 'Popüler kurslar',
    searchPlaceholder: 'Bir kelime ara...',
    back: 'Geri',
    vocabulary: 'Kelime Hazinesi',
    categories: 'Kategoriler',
    recentWords: 'Son Kelimeler',
    viewAll: 'Tümünü gör',
  },
  de: {
    languages: 'Sprachen',
    allSubjects: 'Alle Fächer',
    flashcards: 'Karteikarten',
    practiceNow: 'Jetzt üben',
    hideCards: 'Karten ausblenden',
    noFlashcards: 'Noch keine Karteikarten! Suchen Sie oben nach Wörtern und speichern Sie sie, um mit dem Üben zu beginnen.',
    myActivity: 'Meine Aktivität',
    seeAll: 'Alle anzeigen',
    popularCourses: 'Beliebte Kurse',
    searchPlaceholder: 'Nach einem Wort suchen...',
    back: 'Zurück',
    vocabulary: 'Wortschatz',
    categories: 'Kategorien',
    recentWords: 'Aktuelle Wörter',
    viewAll: 'Alle anzeigen',
  },
  zh: {
    languages: '语言',
    allSubjects: '所有科目',
    flashcards: '闪卡',
    practiceNow: '现在练习',
    hideCards: '隐藏卡片',
    noFlashcards: '还没有闪卡！搜索并保存单词以开始练习。',
    myActivity: '我的活动',
    seeAll: '查看全部',
    popularCourses: '热门课程',
    searchPlaceholder: '搜索单词...',
    back: '返回',
    vocabulary: '词汇',
    categories: '分类',
    recentWords: '最近的单词',
    viewAll: '查看全部',
  },
  ja: {
    languages: '言語',
    allSubjects: '全科目',
    flashcards: 'フラッシュカード',
    practiceNow: '今すぐ練習',
    hideCards: 'カードを隠す',
    noFlashcards: 'まだフラッシュカードがありません！上で単語を検索して保存し、練習を始めましょう。',
    myActivity: '私の活動',
    seeAll: 'すべて見る',
    popularCourses: '人気のコース',
    searchPlaceholder: '単語を検索...',
    back: '戻る',
    vocabulary: '語彙',
    categories: 'カテゴリー',
    recentWords: '最近の単語',
    viewAll: 'すべて見る',
  },
} as const;