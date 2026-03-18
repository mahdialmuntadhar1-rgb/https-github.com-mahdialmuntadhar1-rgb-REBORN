import React from 'react';
import { Bell, ChevronLeft, Globe } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { APP_COLORS } from '../../constants';
import { Language } from '../../types';

interface Props {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onNotificationClick?: () => void;
}

export default function TopBar({ title, showBack, onBack, onNotificationClick }: Props) {
  const { language, setLanguage, isRTL } = useAppState();

  const languages: { code: Language; label: string }[] = [
    { code: 'ar', label: 'AR' },
    { code: 'ku', label: 'KU' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center px-4 pt-safe">
      <div className="flex-1 flex items-center gap-3">
        {showBack ? (
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-transform active:scale-90"
          >
            <ChevronLeft 
              size={24} 
              className="text-white" 
              style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} 
            />
          </button>
        ) : (
          <span className="text-xl font-black tracking-tighter text-primary" style={{ color: APP_COLORS.PRIMARY }}>
            REBORN
          </span>
        )}
        {title && (
          <h1 className="text-lg font-bold text-white truncate max-w-[150px]">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <div className="flex bg-white/5 rounded-full p-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                language === lang.code 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'text-white/40 hover:text-white/60'
              }`}
              style={language === lang.code ? { backgroundColor: APP_COLORS.PRIMARY } : {}}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Notification Bell */}
        <button 
          onClick={onNotificationClick}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center relative transition-transform active:scale-90"
        >
          <Bell size={20} className="text-white/60" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-[#0a0a0f]" style={{ backgroundColor: APP_COLORS.PRIMARY }} />
        </button>
      </div>
    </div>
  );
}
