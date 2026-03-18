import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { GOVERNORATES } from '../../constants/governorates';
import { GovernorateId, Language } from '../../types';
import { LogIn, UserPlus, Phone, Mail, Globe, MapPin, ChevronDown } from 'lucide-react';

interface AuthScreenProps {
  onPhoneSubmit: (phone: string) => void;
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onPhoneSubmit, onSuccess }) => {
  const { t, isRTL, language, setLanguage, selectedGovernorate, setGovernorate, setCurrentUser } = useAppState();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      onPhoneSubmit(phoneNumber);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Replace with Supabase Email Auth
    setTimeout(() => {
      setCurrentUser({
        id: 'mock-email-user',
        role: 'user',
        language: language,
        governorateId: selectedGovernorate,
        displayName: email.split('@')[0],
        isVerified: true,
        createdAt: new Date().toISOString()
      });
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'ar', label: 'عربي' },
    { code: 'ku', label: 'کوردی' },
    { code: 'en', label: 'English' }
  ];

  const selectedGov = GOVERNORATES.find(g => g.id === selectedGovernorate);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col p-8 overflow-y-auto no-scrollbar" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* App Logo */}
      <div className="flex flex-col items-center mt-12 mb-12">
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-6">
          <span className="text-white text-4xl font-black italic">R</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">REBORN</h1>
        <p className="text-white/40 text-sm mt-2 font-medium tracking-widest uppercase">Iraq Compass</p>
      </div>

      {/* Language & City Selection */}
      <div className="space-y-6 mb-12">
        {/* Language Buttons */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                language === lang.code ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* City Selection */}
        <div className="relative">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 px-1">
            {language === 'ar' ? 'من أي مدينة أنت؟' : language === 'ku' ? 'لە کام شارەوەیت؟' : 'Which city are you from?'}
          </p>
          <button
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 flex items-center justify-between hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-emerald-500" />
              <span className="text-white font-bold">
                {language === 'ar' ? selectedGov?.nameAr : language === 'ku' ? selectedGov?.nameKu : selectedGov?.nameEn}
              </span>
            </div>
            <ChevronDown size={20} className={`text-white/40 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
          </button>

          <AnimatePresence>
            {showCityDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto no-scrollbar"
              >
                {GOVERNORATES.map((gov) => (
                  <button
                    key={gov.id}
                    onClick={() => {
                      setGovernorate(gov.id);
                      setShowCityDropdown(false);
                    }}
                    className={`w-full p-4 text-start hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 flex items-center justify-between ${
                      selectedGovernorate === gov.id ? 'text-emerald-500' : 'text-white/80'
                    }`}
                  >
                    <span className="font-bold">
                      {language === 'ar' ? gov.nameAr : language === 'ku' ? gov.nameKu : gov.nameEn}
                    </span>
                    {selectedGovernorate === gov.id && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Auth Options */}
      <div className="space-y-4">
        {/* Phone Input (Always LTR) */}
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div className="relative" dir="ltr">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Phone size={20} className="text-white/20" />
            </div>
            <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none">
              <span className="text-white font-bold">+964</span>
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="7XXXXXXXXX"
              className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-28 pr-4 text-white font-bold text-lg focus:border-emerald-500 transition-colors outline-none"
              required
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">
                {language === 'ar' ? 'اختياري' : language === 'ku' ? 'دەرکەوتن' : 'Optional'}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={phoneNumber.length < 10 || isLoading}
            className="w-full h-16 bg-emerald-500 text-white rounded-2xl font-black text-lg active:scale-95 transition-transform shadow-xl shadow-emerald-500/20 disabled:opacity-50"
          >
            {language === 'ar' ? 'إرسال الرمز' : language === 'ku' ? 'کۆد بنێرە' : 'Send Code'}
          </button>
        </form>

        {/* Email Auth (Returning Users) */}
        {mode === 'signin' && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleEmailAuth}
            className="space-y-4 pt-4"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Mail size={20} className="text-white/20" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white font-bold focus:border-emerald-500 transition-colors outline-none"
                required
              />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-4 text-white font-bold focus:border-emerald-500 transition-colors outline-none"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-white/10 text-white rounded-2xl font-black text-lg active:scale-95 transition-transform hover:bg-white/20"
            >
              {t('auth_signin')}
            </button>
          </motion.form>
        )}
      </div>

      {/* Toggle Mode */}
      <div className="mt-12 text-center">
        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-white/40 text-sm font-bold hover:text-white transition-colors"
        >
          {mode === 'signin' 
            ? (language === 'ar' ? 'ليس لديك حساب؟ سجل الآن' : language === 'ku' ? 'هەژمارت نییە؟ ئێستا تۆمار بکە' : "Don't have an account? Sign Up")
            : (language === 'ar' ? 'لديك حساب بالفعل؟ سجل دخولك' : language === 'ku' ? 'پێشتر هەژمارت هەبووە؟ بچۆ ژوورەوە' : "Already have an account? Sign In")
          }
        </button>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-12 text-center">
        <button 
          onClick={() => onSuccess()}
          className="text-white/20 text-xs font-black uppercase tracking-widest hover:text-white/40 transition-colors"
        >
          {t('auth_skip')}
        </button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
          />
        </div>
      )}
    </div>
  );
};
