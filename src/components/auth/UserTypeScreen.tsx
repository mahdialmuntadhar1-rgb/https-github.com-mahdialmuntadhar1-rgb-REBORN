import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { User, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

interface UserTypeScreenProps {
  onSuccess: () => void;
}

export const UserTypeScreen: React.FC<UserTypeScreenProps> = ({ onSuccess }) => {
  const { t, isRTL, language, currentUser, setCurrentUser } = useAppState();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    // TODO: Replace with Supabase Role Update
    setTimeout(() => {
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          role: selectedRole
        });
      }
      setIsLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Title */}
      <div className="mt-12 mb-12">
        <h2 className="text-3xl font-black text-white mb-4">
          {language === 'ar' ? 'كيف ستستخدم ريبورن؟' : language === 'ku' ? 'چۆن ڕیبۆرن بەکاردەهێنیت؟' : 'How will you use REBORN?'}
        </h2>
        <p className="text-white/40 text-sm font-medium leading-relaxed">
          {language === 'ar' 
            ? 'اختر نوع الحساب الذي يناسبك' 
            : language === 'ku' 
            ? 'جۆری هەژمارەکەت هەڵبژێرە' 
            : 'Choose the account type that fits you best'}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4 mb-12">
        {/* Regular User */}
        <button
          onClick={() => setSelectedRole('user')}
          className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center gap-6 text-start relative overflow-hidden ${
            selectedRole === 'user' 
              ? 'bg-emerald-500/10 border-emerald-500 shadow-2xl shadow-emerald-500/10' 
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
            selectedRole === 'user' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'
          }`}>
            <User size={28} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-black mb-1 transition-colors ${
              selectedRole === 'user' ? 'text-white' : 'text-white/80'
            }`}>
              {language === 'ar' ? 'مواطن' : language === 'ku' ? 'هاووڵاتی' : 'Citizen'}
            </h3>
            <p className="text-white/40 text-xs font-medium leading-relaxed">
              {language === 'ar' 
                ? 'استكشف مدينتك، تابع الفعاليات، وتواصل مع الآخرين' 
                : language === 'ku' 
                ? 'شارەکەت بپشکنە، بەدوای چالاکییەکاندا بگەڕێ' 
                : 'Explore your city, follow events, and connect with others'}
            </p>
          </div>
          {selectedRole === 'user' && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 text-emerald-500"
            >
              <CheckCircle2 size={24} />
            </motion.div>
          )}
        </button>

        {/* Business Owner */}
        <button
          onClick={() => setSelectedRole('business_owner')}
          className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center gap-6 text-start relative overflow-hidden ${
            selectedRole === 'business_owner' 
              ? 'bg-blue-500/10 border-blue-500 shadow-2xl shadow-blue-500/10' 
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
            selectedRole === 'business_owner' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/40'
          }`}>
            <Briefcase size={28} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-black mb-1 transition-colors ${
              selectedRole === 'business_owner' ? 'text-white' : 'text-white/80'
            }`}>
              {language === 'ar' ? 'صاحب عمل' : language === 'ku' ? 'خاوەن کار' : 'Business Owner'}
            </h3>
            <p className="text-white/40 text-xs font-medium leading-relaxed">
              {language === 'ar' 
                ? 'أضف عملك التجاري، أعلن عن خدماتك، وتواصل مع الزبائن' 
                : language === 'ku' 
                ? 'کارەکەت تۆمار بکە، خزمەتگوزارییەکانت بڵاو بکەرەوە' 
                : 'List your business, promote services, and reach customers'}
            </p>
          </div>
          {selectedRole === 'business_owner' && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 text-blue-500"
            >
              <CheckCircle2 size={24} />
            </motion.div>
          )}
        </button>
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <button
          onClick={handleComplete}
          disabled={!selectedRole || isLoading}
          className={`w-full h-16 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 ${
            selectedRole === 'business_owner' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
          }`}
        >
          <span>{language === 'ar' ? 'تأكيد' : language === 'ku' ? 'تەواو' : 'Confirm'}</span>
          <ArrowRight size={20} className={isRTL ? 'rotate-180' : ''} />
        </button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`w-12 h-12 border-4 border-t-transparent rounded-full ${
              selectedRole === 'business_owner' ? 'border-blue-500' : 'border-emerald-500'
            }`}
          />
        </div>
      )}
    </div>
  );
};
