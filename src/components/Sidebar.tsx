import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Moon, Sun, Share2, Heart, LogOut, HelpCircle, Mail, Twitter, MessageSquare, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { signOut } from '../lib/auth';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = React.useMemo(() => [
    { icon: User, label: 'Profile', onClick: () => console.log('Profile clicked') },
    { icon: BookOpen, label: 'My Words', onClick: () => navigate('/words') },
    { icon: Heart, label: 'Favorites', onClick: () => navigate('/favorites') },
    { 
      icon: isDarkMode ? Sun : Moon, 
      label: 'Theme', 
      onClick: () => setIsDarkMode(!isDarkMode),
      className: 'group-hover:rotate-90 transition-transform duration-300'
    },
    { icon: Settings, label: 'Settings', onClick: () => navigate('/settings') },
    { icon: HelpCircle, label: 'Help', onClick: () => window.open('/help', '_blank') },
    {
      icon: LogOut,
      label: 'Logout',
      onClick: handleSignOut,
      className: 'text-rose-200 hover:text-rose-100',
      loading: isLoading,
      danger: true
    }
  ], [isDarkMode, navigate]);

  const socialLinks = [
    { 
      icon: MessageSquare, 
      label: 'WeChat', 
      href: 'https://wechat.com',
      className: 'hover:text-purple-400 transition-colors duration-300'
    },
    { 
      icon: Twitter, 
      label: 'Twitter', 
      href: 'https://twitter.com/wediction',
      className: 'hover:text-blue-400 transition-colors duration-300'
    },
    { 
      icon: Mail, 
      label: 'Email', 
      href: 'mailto:Wediction@outlook.com',
      className: 'hover:text-orange-400 transition-colors duration-300'
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-64 glass z-50
                 bg-gradient-to-b from-white/20 to-white/10
                 border-r border-white/20"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center
                         hover:scale-110 transition-transform duration-300 cursor-pointer
                         hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.3)]">
              <User className="w-5 h-5 text-white animate-pulse-soft" />
            </div>
            <div>
              <h3 className="font-medium text-white">Guest User</h3>
              <p className="text-sm text-white/70 animate-pulse-light">Free Account</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                disabled={item.loading}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg relative
                         text-white/70 hover:text-white transition-all duration-300 
                         hover:bg-white/10 group overflow-hidden disabled:opacity-50 
                         disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 w-0 bg-gradient-to-r from-white/5 to-transparent
                             group-hover:w-full transition-all duration-500"></div>
                {item.loading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent 
                               rounded-full animate-spin relative z-10" />
                ) : (
                  <item.icon className={`w-5 h-5 relative z-10 ${
                    item.danger ? 'group-hover:rotate-180 transition-transform duration-300' : ''
                  } ${item.className || ''}`} />
                )}
                <span>{item.label}</span>
                {item.danger && (
                  <div className="absolute inset-0 w-0 bg-gradient-to-r from-rose-500/20 to-transparent
                               group-hover:w-full transition-all duration-500" />
                )}
              </button>
            ))}
            
            {/* Social Links */}
            <div className="mt-4 space-y-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg relative
                           text-white/50 hover:text-white transition-all duration-300 
                           hover:bg-white/10 group overflow-hidden ${link.className}`}
                >
                  <div className="absolute inset-0 w-0 bg-gradient-to-r from-white/5 to-transparent
                               group-hover:w-full transition-all duration-500"></div>
                  <link.icon className="w-5 h-5 relative z-10" />
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </motion.div>
    </>
  );
}