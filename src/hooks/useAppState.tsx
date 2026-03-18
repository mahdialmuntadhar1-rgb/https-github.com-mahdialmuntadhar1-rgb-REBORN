import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, GovernorateId, AppUser, AppState } from '../types';
import { t as translate } from '../i18n/translations';
import { GOVERNORATES } from '../constants/governorates';

interface AppStateContextType extends AppState {
  setLanguage: (lang: Language) => void;
  setGovernorate: (id: GovernorateId) => void;
  setCurrentUser: (user: AppUser | null) => void;
  t: (key: string, governorateName?: string) => string;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('reborn_language') as Language) || 'ar';
  });
  
  const [selectedGovernorate, setSelectedGovernorateState] = useState<GovernorateId>(() => {
    return (localStorage.getItem('reborn_governorate') as GovernorateId) || 'baghdad';
  });
  
  const [currentUser, setCurrentUserState] = useState<AppUser | null>(() => {
    const stored = localStorage.getItem('reborn_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!currentUser);

  const setCurrentUser = useCallback((user: AppUser | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('reborn_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('reborn_user');
    }
  }, []);

  const isRTL = language === 'ar' || language === 'ku';

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('reborn_language', lang);
  }, []);

  const setGovernorate = useCallback((id: GovernorateId) => {
    setSelectedGovernorateState(id);
    localStorage.setItem('reborn_governorate', id);
  }, []);

  useEffect(() => {
    const isArabicOrKurdish = language === 'ar' || language === 'ku';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'ar' ? 'ar' : language === 'ku' ? 'ku' : 'en';
    
    // Dynamic Font Switching
    document.documentElement.style.fontFamily = isArabicOrKurdish 
      ? "'Noto Naskh Arabic', sans-serif" 
      : "'Inter', sans-serif";
      
  }, [language, isRTL]);

  useEffect(() => {
    setIsAuthenticated(!!currentUser);
  }, [currentUser]);

  const t = useCallback((key: string, governorateName?: string) => {
    // If governorateName is provided, we use it, otherwise we use the selected one
    const govId = governorateName ? 
      GOVERNORATES.find(g => g.nameAr === governorateName || g.nameKu === governorateName || g.nameEn === governorateName)?.id || selectedGovernorate 
      : selectedGovernorate;
      
    return translate(key, language, govId);
  }, [language, selectedGovernorate]);

  const value: AppStateContextType = {
    language,
    isRTL,
    selectedGovernorate,
    currentUser,
    isAuthenticated,
    setLanguage,
    setGovernorate,
    setCurrentUser,
    t,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
