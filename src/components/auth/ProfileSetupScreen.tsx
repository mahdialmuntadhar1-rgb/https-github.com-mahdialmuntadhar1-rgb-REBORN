import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { User, Check } from 'lucide-react';

interface ProfileSetupScreenProps {
  onSuccess: () => void;
}

const AVATAR_COLORS = [
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899'  // Pink
];

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ onSuccess }) => {
  const { t, isRTL, language, currentUser, setCurrentUser } = useAppState();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim().length < 2) return;

    setIsLoading(true);
    // TODO: Replace with Supabase Profile Update
    setTimeout(() => {
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          displayName: displayName,
          avatarUrl: selectedColor, // Using color as placeholder for avatar
          isVerified: true
        });
      }
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Title */}
      <div className="mt-12 mb-12">
        <h2 className="text-3xl font-black text-white mb-4">
          {language === 'ar' ? 'أكمل ملفك الشخصي' : language === 'ku' ? 'پڕۆفایلەکەت تەواو بکە' : 'Complete Your Profile'}
        </h2>
        <p className="text-white/40 text-sm font-medium leading-relaxed">
          {language === 'ar' 
            ? 'أخبرنا باسمك واختر لوناً لملفك الشخصي' 
            : language === 'ku' 
            ? 'ناوەکەتمان پێ بڵێ و ڕەنگێک بۆ پڕۆفایلەکەت هەڵبژێرە' 
            : 'Tell us your name and pick a color for your profile'}
        </p>
      </div>

      {/* Avatar Selection */}
      <div className="flex flex-col items-center mb-12">
        <motion.div
          animate={{ backgroundColor: selectedColor }}
          className="w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-2xl transition-colors duration-500 mb-8"
        >
          {initial}
        </motion.div>

        <div className="flex gap-4">
          {AVATAR_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                selectedColor === color ? 'scale-125 ring-4 ring-white/20' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && <Check size={20} className="text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <form onSubmit={handleContinue} className="space-y-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <User size={20} className="text-white/20" />
          </div>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={language === 'ar' ? 'الاسم الكامل' : language === 'ku' ? 'ناوی تەواو' : 'Full Name'}
            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white font-bold text-lg focus:border-emerald-500 transition-colors outline-none"
            required
            minLength={2}
          />
        </div>

        <button
          type="submit"
          disabled={displayName.trim().length < 2 || isLoading}
          className="w-full h-16 bg-white text-black rounded-2xl font-black text-lg active:scale-95 transition-transform shadow-xl disabled:opacity-50"
        >
          {language === 'ar' ? 'متابعة' : language === 'ku' ? 'بەردەوام بە' : 'Continue'}
        </button>
      </form>

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
