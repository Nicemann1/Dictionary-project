import React from 'react';
import { Globe } from 'lucide-react';
import { useI18nStore, type Language } from '../lib/i18n';

const languages: Array<{
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}> = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
];

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useI18nStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button flex items-center gap-1.5 px-2.5 py-1.5 text-sm"
      >
        <Globe size={14} />
        <span>{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.nativeName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass-card p-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors
                         ${currentLanguage === lang.code ? 'glass text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
              <span className="text-white/50 ml-auto">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}