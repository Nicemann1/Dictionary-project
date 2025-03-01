import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Facebook, X, Instagram, Check, Moon, Sun, ChevronDown, Globe, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from '../lib/auth';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const browserLang = navigator.language.split('-')[0];
    const supportedLanguages = {
      'en': 'English',
      'de': 'German',
      'tr': 'Turkish',
      'zh': 'Chinese',
      'ug': 'Uyghur'
    };
    return supportedLanguages[browserLang as keyof typeof supportedLanguages] || 'English';
  });
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Translations for all supported languages
  const translations = {
    English: {
      welcome: "Welcome back!",
      loginToAccount: "Log in to your account to continue",
      email: "e-mail address",
      password: "password",
      login: "Log in",
      show: "Show",
      hide: "Hide",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      signup: "Sign up",
      dayOfWeek: "Fri",
      dateOfMonth: "28th Feb",
      timeFormat: "19 PM",
      motivationalQuote: "Believe in yourself and all that you are.",
      specialEvent: "Special Event",
      grandOpening: "Grand opening",
      newStore: "New store",
      joinIn: "Join in"
    },
    German: {
      welcome: "Willkommen zurück!",
      loginToAccount: "Melden Sie sich an, um fortzufahren",
      email: "E-Mail-Adresse",
      password: "Passwort",
      login: "Anmelden",
      show: "Zeigen",
      hide: "Verbergen",
      rememberMe: "Angemeldet bleiben",
      forgotPassword: "Passwort vergessen?",
      signup: "Registrieren",
      dayOfWeek: "Fr",
      dateOfMonth: "28. Feb",
      timeFormat: "19 Uhr",
      motivationalQuote: "Glaube an dich selbst und alles, was du bist.",
      specialEvent: "Spezielle Veranstaltung",
      grandOpening: "Große Eröffnung",
      newStore: "Neuer Laden",
      joinIn: "Teilnehmen"
    },
    Turkish: {
      welcome: "Tekrar\u00A0hoş\u00A0geldiniz!",
      loginToAccount: "Devam etmek için hesabınıza giriş yapın",
      email: "e-posta adresi",
      password: "şifre",
      login: "Giriş Yap",
      show: "Göster",
      hide: "Gizle",
      rememberMe: "Beni hatırla",
      forgotPassword: "Şifremi unuttum?",
      signup: "Kaydol",
      dayOfWeek: "Cuma",
      dateOfMonth: "28 Şubat",
      timeFormat: "19:00",
      motivationalQuote: "Kendine ve olduğun her şeye inan.",
      specialEvent: "Özel Etkinlik",
      grandOpening: "Büyük açılış",
      newStore: "Yeni mağaza",
      joinIn: "Katıl"
    },
    Chinese: {
      welcome: "欢迎回来!",
      loginToAccount: "登录您的账户以继续",
      email: "电子邮件地址",
      password: "密码",
      login: "登录",
      show: "显示",
      hide: "隐藏",
      rememberMe: "记住我",
      forgotPassword: "忘记密码？",
      signup: "注册",
      dayOfWeek: "周五",
      dateOfMonth: "2月28日",
      timeFormat: "19:00",
      motivationalQuote: "相信自己，相信你的一切。",
      specialEvent: "特别活动",
      grandOpening: "盛大开业",
      newStore: "新店铺",
      joinIn: "加入"
    },
    Uyghur: {
      welcome: "خۇش كەلدىڭىز!",
      loginToAccount: "داۋاملاشتۇرۇش ئۈچۈن ھېساباتىڭىزغا كىرىڭ",
      email: "ئېلېكترونلۇق خەت ئادرېسى",
      password: "پارول",
      login: "كىرىش",
      show: "كۆرسەت",
      hide: "يوشۇر",
      rememberMe: "مېنى ئەستە تۇت",
      forgotPassword: "پارولنى ئۇنتۇدىڭىزمۇ؟",
      signup: "تىزىملىتىش",
      dayOfWeek: "جۈمە",
      dateOfMonth: "28-فېۋرال",
      timeFormat: "19:00",
      motivationalQuote: "ئۆزىڭىزگە ۋە ئۆزىڭىزنىڭ بارلىقىغا ئىشىنىڭ.",
      specialEvent: "ئالاھىدە پائالىيەت",
      grandOpening: "چوڭ ئېچىلىش",
      newStore: "يېڭى دۇكان",
      joinIn: "قاتنىشىڭ"
    }
  };
  
  // Function to get text based on the current language
  const t = (key: keyof typeof translations.English) => {
    return translations[currentLanguage as keyof typeof translations][key] || translations['English'][key];
  };
  
  // Define text direction based on language selection
  const isRTL = currentLanguage === 'Uyghur';
  
  // Handle language selection
  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    setShowLanguageDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let errorMessage = '';
    
    try {
      await signIn(email, password);
      onLogin();
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An error occurred during login';
      }
      console.error('Login error:', errorMessage);
      // Show error message to user
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="relative w-full h-full overflow-hidden perspective-1000 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className={`flex items-center justify-center min-h-screen w-full p-6 ${
          isDarkMode ? 'bg-neutral-900' : 'bg-gradient-to-br from-neutral-50 via-orange-50 to-neutral-100'
        } bg-opacity-30 backdrop-blur-[2px] transition-colors duration-700 text-base`}
        dir={isRTL ? 'rtl' : 'ltr'}
        lang={currentLanguage === 'Turkish' ? 'tr' : 
              currentLanguage === 'German' ? 'de' :
              currentLanguage === 'Chinese' ? 'zh' :
              currentLanguage === 'Uyghur' ? 'ug' : 'en'}
        style={{
          position: 'relative',
          animation: 'subtle-pulse 15s ease-in-out infinite',
        }}
      >
        {/* Animated Background Words & Letters */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Floating words */}
          {['Welcome', 'Connect', 'Explore', 'Create', 'Discover', 'Share', 'Learn', 'Grow', 'Inspire'].map((word, i) => (
            <motion.div 
              key={`word-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.05, y: 0 }}
              transition={{ 
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: Math.random() * 2
              }}
              className={`absolute text-2xl md:text-4xl font-thin tracking-wider whitespace-nowrap ${
                isDarkMode ? 'text-white/5' : 'text-black/5'
              }`}
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                animation: `float-word ${Math.random() * 10 + 20}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {word}
            </motion.div>
          ))}
          
          {/* Individual floating letters */}
          {Array.from('WEDICTION').map((letter, i) => (
            <motion.div 
              key={`letter-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5,
                delay: i * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 10
              }}
              className={`absolute text-5xl md:text-8xl font-bold ${
                isDarkMode ? 'text-white/5' : 'text-black/5'
              }`}
              style={{
                top: `${Math.random() * 90 + 5}%`,
                left: `${Math.random() * 90 + 5}%`,
                transform: `rotate(${Math.random() * 40 - 20}deg)`,
                animation: `float-letter ${Math.random() * 15 + 15}s ease-in-out infinite, letter-opacity ${Math.random() * 8 + 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {letter}
            </motion.div>
          ))}
          
          {/* Animated symbols */}
          {['✨', '●', '■', '◆', '▲', '○', '□', '◇', '△'].map((symbol, i) => (
            <motion.div 
              key={`symbol-${i}`}
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className={`absolute text-3xl md:text-6xl ${
                isDarkMode 
                  ? i % 3 === 0 ? 'text-orange-500/10' : i % 3 === 1 ? 'text-pink-500/10' : 'text-blue-400/10'
                  : i % 3 === 0 ? 'text-orange-500/10' : i % 3 === 1 ? 'text-pink-500/10' : 'text-blue-500/10'
              }`}
              style={{
                top: `${Math.random() * 90 + 5}%`,
                left: `${Math.random() * 90 + 5}%`,
                transform: `rotate(${Math.random() * 40 - 20}deg) scale(${Math.random() * 0.5 + 0.5})`,
                animation: `float-symbol ${Math.random() * 20 + 10}s ease-in-out infinite, symbol-pulse ${Math.random() * 4 + 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {symbol}
            </motion.div>
          ))}
        </div>
        
        {/* Dynamic Background Elements */}
        <div className="absolute -bottom-20 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 opacity-60 blur-lg animate-float-slow"></div>
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-tr from-blue-100 to-purple-200 blur-lg animate-float-reverse"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 rounded-full bg-gradient-to-bl from-purple-100 to-blue-200 opacity-40 blur-lg animate-float-medium"></div>
        <div className="absolute top-40 left-20 w-36 h-36 rounded-full bg-gradient-to-tl from-pink-100 to-orange-100 opacity-50 blur-xl animate-float"></div>
        <div className="absolute top-1/4 left-1/3 w-52 h-52 rounded-full bg-gradient-to-r from-yellow-100 to-green-100 opacity-30 blur-xl animate-float-xlarge"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-gradient-to-l from-blue-50 to-indigo-100 opacity-40 blur-xl animate-float-xlarge-reverse"></div>
        
        {/* Enhanced Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 60 }).map((_, i) => (
            <div 
              key={i}
              className={`absolute rounded-full ${
                i % 5 === 0 ? 'bg-pink-200' : 
                i % 5 === 1 ? 'bg-blue-200' : 
                i % 5 === 2 ? 'bg-orange-200' : 
                i % 5 === 3 ? 'bg-purple-200' : 
                'bg-white'
              }`}
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.2,
                animation: `float-particle ${Math.random() * 20 + 15}s linear infinite, glow ${Math.random() * 4 + 3}s ease-in-out infinite alternate, spin-slow ${Math.random() * 15 + 15}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
                filter: `blur(${Math.random() * 1}px)`,
              }}
            />
          ))}
        </div>
        
        {/* Enhanced Glass Overlay with better blur */}
        <div className="absolute inset-0 backdrop-blur-sm z-0 bg-white/5"></div>
        
        {/* Enhanced Dynamic light effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 animate-shimmer"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-30 animate-shimmer-reverse"></div>
        
        {/* Controls */}
        <motion.div 
          className="absolute top-4 right-4 flex items-center space-x-4 z-20"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="relative">
            <button 
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className={`flex items-center px-3 py-1 rounded-full backdrop-blur-md border text-sm shadow-sm hover:shadow-md transition-all duration-500 active:scale-95 animate-border-pulse ${
                isDarkMode 
                  ? 'bg-white/15 border-white/20 hover:bg-white/20 text-white/90' 
                  : 'bg-white/30 border-white/30 hover:bg-white/40 text-neutral-800'
              }`}
            >
              <Globe size={14} className={`${isDarkMode ? 'text-white/90' : 'text-neutral-800'} ${isRTL ? 'ml-1' : 'mr-1'} animate-spin-very-slow`} />
              <span className={`${isDarkMode ? 'text-white/90' : 'text-neutral-800'} ${isRTL ? 'mr-1' : 'ml-1'}`}>
                {currentLanguage}
                {isRTL && <span className={`text-xs rounded px-1 py-0.5 mr-1 ml-1 inline-block animate-pulse-light ${
                  isDarkMode ? 'bg-orange-500/30 border border-orange-400/20 text-orange-200' : 'bg-orange-400/30 border border-orange-200/30 text-orange-600'
                }`}>RTL</span>}
              </span>
              <ChevronDown size={14} className={`${isDarkMode ? 'text-white/90' : 'text-neutral-800'} transition-transform duration-300 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showLanguageDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`absolute right-0 mt-2 py-1 w-48 rounded-lg shadow-lg z-50 backdrop-blur-md border animate-slide-in-down ${
                  isDarkMode 
                    ? 'bg-neutral-900/70 border-white/15' 
                    : 'bg-white/70 border-white/40'
                }`}
                style={{
                  backdropFilter: "blur(12px)",
                  boxShadow: isDarkMode 
                    ? "0 10px 25px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 255, 255, 0.05)" 
                    : "0 10px 25px rgba(31, 38, 135, 0.15), 0 0 10px rgba(255, 255, 255, 0.2)",
                }}
              >
                {Object.keys(translations).map((lang, index) => {
                  const isRtlLanguage = lang === 'Uyghur';
                  return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm ${
                      isRtlLanguage ? 'text-right' : 'text-left'
                    } ${
                      currentLanguage === lang
                        ? isDarkMode 
                          ? 'bg-white/10 text-white' 
                          : 'bg-white/50 text-neutral-900'
                        : isDarkMode 
                          ? 'text-white/80 hover:bg-white/5' 
                          : 'text-neutral-700 hover:bg-white/30'
                    } transition-all duration-300 animate-slide-in-right hover:translate-x-1`}
                    dir={isRtlLanguage ? 'rtl' : 'ltr'}
                    style={{animationDelay: `${0.1 + index * 0.05}s`}}
                  >
                    <span className={`flex-grow ${lang === 'Uyghur' ? 'font-bold text-blue-400' : ''}`}>{lang}</span>
                    {isRtlLanguage && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ml-2 ${
                        isDarkMode ? 'bg-orange-500/20 border border-orange-400/20 text-orange-300' : 'bg-orange-100/70 border border-orange-200/50 text-orange-800'
                      }`}>
                        RTL
                      </span>
                    )}
                  </button>
                )})}
              </motion.div>
            )}
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={`p-2 rounded-full backdrop-blur-md border shadow-sm hover:shadow-md transition-all duration-500 active:scale-95 overflow-hidden relative group animate-border-pulse ${
              isDarkMode 
                ? 'bg-white/15 border-white/20 hover:bg-white/20' 
                : 'bg-white/30 border-white/30 hover:bg-white/40'
            }`}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full ${
              isDarkMode ? 'bg-gradient-to-r from-yellow-200/20 to-blue-200/10' : 'bg-gradient-to-r from-yellow-100/30 to-blue-100/30'
            }`}></div>
            {isDarkMode ? (
              <Sun size={16} className="text-white/90 relative z-10 animate-spin-slow" />
            ) : (
              <Moon size={16} className="text-neutral-800 relative z-10 animate-pulse-slow" />
            )}
          </button>
        </motion.div>
        
        {/* Main Content */}
        <div className="flex flex-col gap-6 max-w-5xl w-full z-10 font-sans antialiased">
          {/* Date at the top with motivational sentence on left */}
          <div 
            className={`w-full backdrop-blur-xl rounded-3xl p-6 shadow-xl transition-all duration-500 hover:shadow-2xl animate-fade-in transform hover:translate-y-[-2px] hover:rotate-1 motion-safe:translate-z-0 ${
              isDarkMode 
                ? 'bg-white/10 border border-white/15 dark-glass-card' 
                : 'bg-white/20 border border-white/30 light-glass-card'
            }`}
            style={{
              backdropFilter: "blur(12px)",
              boxShadow: isDarkMode 
                ? "0 10px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 255, 255, 0.05)" 
                : "0 10px 30px rgba(31, 38, 135, 0.15), 0 0 10px rgba(255, 255, 255, 0.2)",
              WebkitBackdropFilter: "blur(12px)",
              animation: "card-float 6s ease-in-out infinite"
            }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Motivational sentence on left side */}
              <div className="md:w-1/2 mb-4 md:mb-0 animate-slide-in-left" style={{animationDelay: "0.1s"}}>
                <div className={`border rounded-full p-4 backdrop-blur-md shadow-inner transform transition-all duration-500 hover:shadow-lg ${
                  isDarkMode 
                    ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                    : 'bg-white/20 border-white/50 hover:bg-white/30'
                } animate-border-pulse`}>
                  <p className={`text-lg italic ${isDarkMode ? 'text-white/90' : 'text-neutral-800'} ${isRTL ? 'text-right font-uyghur dir-rtl' : 'text-left'} animate-gentle-pulse tracking-wide break-normal`}>{t('motivationalQuote')}</p>
                </div>
              </div>
              
              {/* Date information on right side */}
              <div className="md:w-1/2 text-right animate-slide-in-right" style={{animationDelay: "0.3s"}}>
                <h2 className={`text-4xl font-bold tracking-wide animate-float-text ${isDarkMode ? 'text-white/90' : 'text-neutral-900'}`}>{t('dayOfWeek')}</h2>
                <p className={`text-4xl font-light animate-float-text-delayed ${isDarkMode ? 'text-white/60' : 'text-neutral-500/80'}`} style={{animationDelay: "0.2s"}}>{t('dateOfMonth')}</p>
                <p className={`text-sm mt-2 animate-float-text-delayed ${isDarkMode ? 'text-white/70' : 'text-neutral-800/90'}`} style={{animationDelay: "0.4s"}}>{t('timeFormat')}</p>
              </div>
            </div>
          </div>
          
          {/* Sign In Form */}
          <div 
            className={`flex-1 backdrop-blur-xl rounded-3xl p-8 shadow-xl transition-all duration-500 hover:shadow-2xl animate-fade-in-delayed transform hover:translate-y-[-3px] ${
              isDarkMode 
                ? 'bg-white/10 border border-white/15 dark-glass-card' 
                : 'bg-white/20 border border-white/30 light-glass-card'
            }`}
            style={{
              animationDelay: "0.2s",
              backdropFilter: "blur(12px)",
              boxShadow: isDarkMode 
                ? "0 10px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 255, 255, 0.05)" 
                : "0 10px 30px rgba(31, 38, 135, 0.15), 0 0 10px rgba(255, 255, 255, 0.2)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-lg font-medium flex items-center animate-slide-in-left ${
                isDarkMode ? 'text-white/90' : 'text-neutral-800'
              }`} style={{animationDelay: "0.3s"}}>
                WeDiction
                <span className="ml-1 inline-block w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 animate-strong-pulse"></span>
              </h2>
              <button 
                onClick={() => navigate('/signup')}
                className={`text-sm px-4 py-2 rounded-full shadow-sm transition-all duration-300 hover:shadow-md hover:bg-gradient-to-r active:scale-95 animate-slide-in-right ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-orange-400/30 to-pink-400/30 text-white/90 hover:from-orange-400/40 hover:to-pink-400/40'
                    : 'bg-gradient-to-r from-orange-100 to-pink-100 text-neutral-800 hover:from-orange-200 hover:to-pink-200'
                }`}
                style={{animationDelay: "0.3s"}}
              >
                {t('signup')}
              </button>
            </div>

            <h1 className={`text-3xl font-bold mb-2 tracking-wide animate-slide-in-up ${
              isDarkMode ? 'text-white/90' : 'text-neutral-900'
            } ${isRTL ? 'text-right w-full font-uyghur' : 'prevent-word-break'}`} style={{animationDelay: "0.4s", textShadow: isDarkMode ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 2px rgba(0,0,0,0.05)", wordSpacing: currentLanguage === 'Turkish' ? '0.25em' : 'normal'}}>
              <div className={`overflow-hidden ${isRTL ? 'whitespace-normal' : 'whitespace-nowrap'} ${isRTL ? 'dir-rtl' : ''}`}>
                <span className={`${isRTL ? '' : 'animate-wave-text inline-flex'}`}>
                  {!isRTL ? t('welcome').split('').map((char, index) => (
                    <span key={index} style={{ animationDelay: `${index * 0.1}s` }} className="inline-block">{char}</span>
                  )) : t('welcome')}
                </span>
              </div>
            </h1>
              
            <p className={`text-sm mb-8 animate-slide-in-up ${
              isDarkMode ? 'text-white/70' : 'text-neutral-500'
            } font-normal ${isRTL ? 'text-right w-full font-uyghur' : ''}`} style={{animationDelay: "0.5s"}}>
              <span className={`${isRTL ? '' : 'typing-container'} inline-block ${isRTL ? 'whitespace-normal' : 'whitespace-nowrap'} overflow-hidden ${isRTL ? '' : 'w-auto border-r-2 border-r-orange-400'} ${isRTL ? 'dir-rtl' : ''}`}>
                {t('loginToAccount')}
              </span>
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
              {/* Email field */}
              <div 
                className={`rounded-full py-3 px-4 flex items-center backdrop-blur-md shadow-sm transition-all duration-300 focus-within:shadow-md focus-within:ring-2 focus-within:ring-opacity-50 animate-slide-in-up hover:translate-y-[-2px] ${
                  isDarkMode
                    ? 'bg-white/15 border border-white/20 focus-within:border-white/30 focus-within:bg-white/20 focus-within:ring-white/30'
                    : 'bg-white/20 border border-white/30 focus-within:border-white/50 focus-within:bg-white/30 focus-within:ring-orange-200/50'
                }`}
                style={{animationDelay: "0.6s"}}
              >
                <Mail 
                  size={18} 
                  className={`${isDarkMode ? 'text-white/70' : 'text-neutral-500'} ${isRTL ? 'ml-2' : 'mr-2'} transition-all duration-300 animate-float-icon`} 
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('email')}
                  className={`bg-transparent w-full focus:outline-none ${isRTL ? 'text-right font-uyghur' : 'text-left'} 
                    ${isDarkMode ? 'text-white/90 placeholder-white/50' : ' text-neutral-800 placeholder-neutral-400'} transition-all duration-300 leading-normal`}
                  style={{textShadow: isDarkMode ? "0 1px 2px rgba(0,0,0,0.2)" : "0 1px 1px rgba(255,255,255,0.1)"}}
                />
                <Check size={18} className="text-green-500 animate-success-bounce" />
              </div>
              
              {/* Password field */}
              <div 
                className={`rounded-full py-3 px-4 flex items-center backdrop-blur-md shadow-sm transition-all duration-300 focus-within:shadow-md focus-within:ring-2 focus-within:ring-opacity-50 animate-slide-in-up hover:translate-y-[-2px] ${
                  isDarkMode
                    ? 'bg-white/15 border border-white/20 focus-within:border-white/30 focus-within:bg-white/20 focus-within:ring-white/30'
                    : 'bg-white/20 border border-white/30 focus-within:border-white/50 focus-within:bg-white/30 focus-within:ring-orange-200/50'
                }`}
                style={{animationDelay: "0.7s"}}
              >
                <Lock 
                  size={18} 
                  className={`${isDarkMode ? 'text-white/70' : 'text-neutral-500'} ${isRTL ? 'ml-2' : 'mr-2'} transition-all duration-300 animate-float-icon`}
                  style={{animationDelay: "0.2s"}}
                />
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('password')}
                  className={`bg-transparent w-full focus:outline-none ${isRTL ? 'text-right font-uyghur' : 'text-left'} 
                  ${isDarkMode ? 'text-white/90 placeholder-white/50' : 'text-neutral-800 placeholder-neutral-400'} transition-all duration-300 leading-normal`}
                  style={{textShadow: isDarkMode ? "0 1px 2px rgba(0,0,0,0.2)" : "0 1px 1px rgba(255,255,255,0.1)"}}
                />
                <button 
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className={`text-xs whitespace-nowrap px-2 py-1 rounded-full backdrop-blur-sm border hover:bg-white/40 active:scale-95 transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-white/20 border-white/30 text-white/80 hover:text-white/90 hover:bg-white/25' 
                      : 'bg-white/30 border-white/20 text-neutral-500 hover:text-neutral-700'
                  } ml-2 flex-shrink-0`}
                >
                  {isPasswordVisible ? t('hide') : t('show')}
                </button>
              </div>
              
              {/* Remember me checkbox */}
              <div className="flex items-center justify-between px-2 animate-slide-in-up" style={{animationDelay: "0.8s"}}>
                <div className="flex items-center group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className={`w-4 h-4 rounded-sm focus:ring-offset-2 appearance-none transition-all duration-300 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-sm before:backdrop-blur-sm before:border before:transition-all before:duration-300 ${
                        isDarkMode
                          ? 'text-orange-400 focus:ring-orange-400/30 before:bg-white/15 before:border-white/30 hover:before:bg-white/25'
                          : 'text-orange-500 focus:ring-orange-500 before:bg-white/20 before:border-white/30 hover:before:bg-white/30'
                      } ${
                        rememberMe
                          ? 'before:bg-gradient-to-r before:from-orange-400 before:to-pink-500 checked:before:border-transparent'
                          : ''
                      }`}
                    />
                    {rememberMe && (
                      <Check 
                        size={12} 
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isDarkMode ? 'text-white' : 'text-white'} animate-check animate-pulse-fast`} 
                      />
                    )}
                  </div>
                  <label 
                    htmlFor="remember" 
                    className={`${isRTL ? 'mr-2 font-uyghur' : 'ml-2'} text-xs transition-all duration-300 group-hover:translate-x-0.5 ${
                      isDarkMode ? 'text-white/70 group-hover:text-white/90' : 'text-neutral-600 group-hover:text-neutral-800'
                    }`}
                  >
                    {t('rememberMe')}
                  </label>
                </div>
                <button 
                  type="button"
                  className={`text-xs whitespace-nowrap px-2 py-1 rounded-full backdrop-blur-sm border hover:shadow hover:translate-y-[-1px] active:scale-95 transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-white/15 border-white/20 text-white/70 hover:bg-white/20 hover:text-white/90'
                      : 'bg-white/20 border-white/30 text-neutral-500 hover:bg-white/30 hover:text-neutral-700'
                  } ${isRTL ? 'font-uyghur' : ''}`}
                >
                  {t('forgotPassword')}
                </button>
              </div>
              
              {/* Login button */}
              <button 
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r text-white py-3 rounded-full flex items-center justify-center shadow-md hover:shadow-lg active:shadow transition-all duration-300 hover:from-orange-500 hover:to-pink-600 active:scale-[0.99] relative animate-slide-in-up overflow-hidden group ${
                  isDarkMode
                    ? 'from-orange-500 to-pink-600 shadow-[0_4px_15px_rgba(255,102,102,0.25)]'
                    : 'from-orange-400 to-pink-500 shadow-[0_4px_15px_rgba(255,102,102,0.2)]'
                } ${isRTL ? 'font-uyghur text-lg' : ''}`}
                style={{
                  animationDelay: "0.9s", 
                  boxShadow: "0 10px 25px rgba(254, 182, 146, 0.15), 0 5px 15px rgba(234, 76, 137, 0.1)"
                }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10 animate-pulse-light">{t('login')}</span>
                    <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-700 group-hover:w-full z-0"></span>
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                      <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 animate-spin-very-slow rounded-full blur-xl opacity-30"></span>
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Event Card */}
          <div 
            className={`rounded-3xl overflow-hidden shadow-xl transition-all duration-500 backdrop-blur-xl hover:shadow-2xl transform hover:translate-y-[-3px] hover:rotate-[-1deg] animate-fade-in-delayed ${
              isDarkMode
                ? 'bg-gradient-to-b from-neutral-900/50 to-orange-950/40 border border-white/10 dark-glass-card'
                : 'bg-gradient-to-b from-neutral-50/30 to-orange-50/30 border border-white/30 light-glass-card'
            }`}
            style={{
              animationDelay: "0.4s",
              backdropFilter: "blur(12px)",
              boxShadow: isDarkMode 
                ? "0 10px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(255, 255, 255, 0.05)" 
                : "0 10px 30px rgba(31, 38, 135, 0.15), 0 0 10px rgba(255, 255, 255, 0.2)",
            }}
          >
            <div className="p-8 relative flex flex-col">
              <div className="mt-2 flex animate-slide-in-left" style={{animationDelay: "0.9s"}}>
                <div className={`inline-flex px-3 py-1 rounded-full text-xs backdrop-blur-sm border shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode
                    ? 'bg-white/15 border-white/20 text-white/90'
                    : 'bg-white/30 border-white/30 text-neutral-800'
                }`}>
                  <span role="img" aria-label="Celebration" className="animate-bounce-light">🎉</span>
                  <span className={isRTL ? 'mr-1' : 'ml-1'}>{t('specialEvent')}</span>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col items-center">
                <div className="text-center mb-4 animate-slide-in-down" style={{animationDelay: "1s"}}>
                  <div className="w-8 h-8 mx-auto mb-2 animate-spin-slow transform hover:scale-110 transition-transform duration-300">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-svg-colors">
                      <circle cx="20" cy="20" r="19" stroke={isDarkMode ? "#f0f0f0" : "#222"} strokeWidth="2" className="animate-pulse-light"/>
                      <circle cx="20" cy="20" r="10" fill={isDarkMode ? "#f0f0f0" : "#111"} className="animate-pulse-medium"/>
                    </svg>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-neutral-600'} ${isRTL ? 'font-uyghur text-right' : ''}`}>WeDiction</p>
                </div>
                
                <div 
                  className={`w-full p-4 rounded-xl backdrop-blur-md border transition-all duration-500 hover:shadow-lg animate-slide-in-up shadow-sm hover:translate-y-[-2px] animate-border-glow ${
                    isDarkMode
                      ? 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30'
                      : 'bg-white/30 border-white/40 hover:bg-white/40'
                  }`}
                  style={{animationDelay: "1.1s"}}
                >
                  <div className="flex justify-between w-full items-center">
                    <div>
                      <p className={`text-sm font-medium animate-float-text-mini ${isDarkMode ? 'text-white/90' : 'text-neutral-900'} ${isRTL ? 'font-uyghur text-right' : ''}`}>{t('grandOpening')}</p>
                      <p className={`text-sm animate-float-text-mini ${isDarkMode ? 'text-white/70' : 'text-neutral-500'} ${isRTL ? 'font-uyghur text-right' : ''}`} style={{animationDelay: "0.2s"}}>{t('newStore')}</p>
                    </div>
                    
                    <button 
                      className={`bg-gradient-to-r text-white px-4 py-2 rounded-full flex items-center shadow-md hover:shadow-xl active:shadow transition-all duration-500 active:scale-[0.98] relative overflow-hidden group transform hover:scale-105 ${
                        isDarkMode
                          ? 'from-orange-500 to-pink-600 shadow-[0_4px_15px_rgba(255,102,102,0.25)]'
                          : 'from-orange-400 to-pink-500 shadow-[0_4px_15px_rgba(255,102,102,0.15)]'
                      }`}
                    >
                      <span className="relative z-10 mr-1 animate-pulse-light">{t('joinIn')}</span>
                      <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 animate-slide-lr" />
                      <span className="absolute inset-0 w-full bg-gradient-to-r from-pink-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-x-0 group-hover:scale-x-100 origin-left"></span>
                    </button>
                  </div>
                </div>
                
                {isRTL && (
                  <div className="text-right mt-4 w-full animate-slide-in-right" style={{animationDelay: "1.2s"}}>
                    <p className={`text-lg font-bold animate-float-text-mini ${isDarkMode ? 'text-white/90' : 'text-neutral-800'}`}>چوڭ ئېچىلىش</p>
                    <p className={`animate-float-text-mini ${isDarkMode ? 'text-white/70' : 'text-neutral-600'}`} style={{animationDelay: "0.1s"}}>يېڭى دۇكان</p>
                  </div>
                )}
              </div>
              
              {/* Enhanced decorative elements */}
              <div className={`absolute -right-20 top-1/2 w-40 h-40 rounded-full blur-xl animate-pulse-slow ${
                isDarkMode ? 'bg-orange-500/20' : 'bg-orange-300/60'
              }`}></div>
              <div className={`absolute -left-10 bottom-1/4 w-24 h-24 rounded-full blur-xl animate-float-medium ${
                isDarkMode ? 'bg-pink-500/20' : 'bg-pink-200/40'
              }`}></div>
              <div className={`absolute bottom-0 right-1/4 w-32 h-32 rounded-full blur-xl opacity-30 animate-float-reverse ${
                isDarkMode ? 'bg-blue-400/20' : 'bg-blue-200/30'
              }`}></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}