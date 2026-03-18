import React from 'react';
import { Bell, ChevronLeft } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
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
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'ع' },
    { code: 'ku', label: 'ک' },
  ];

  return (
    <div className="sticky top-0 left-0 right-0 h-[56px] bg-background/90 backdrop-blur-xl border-b border-border z-50 flex items-center px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex-1 flex items-center gap-3">
        {showBack ? (
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center transition-transform active:scale-90"
          >
            <ChevronLeft 
              size={24} 
              className="text-text-primary" 
              style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} 
            />
          </button>
        ) : (
          <span className="text-lg font-black tracking-tighter truncate text-primary">
            {language === 'en' ? "What's up in Baghdad" : language === 'ar' ? "شكو ماكو بغداد" : "چۆنی چاکیت بەغدا"}
          </span>
        )}
        {title && showBack && (
          <h1 className="text-lg font-bold text-text-primary truncate max-w-[150px] ms-2">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <div className="flex bg-black/5 rounded-full p-1" dir="ltr">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-2.5 py-1 rounded-full text-[12px] font-bold transition-all ${
                language === lang.code 
                  ? 'text-white shadow-md bg-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Notification Bell */}
        <button 
          onClick={onNotificationClick}
          className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center relative transition-transform active:scale-90"
        >
          <Bell size={20} className="text-text-secondary" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full border-2 border-background bg-primary" />
        </button>
      </div>
    </div>
  );
}
