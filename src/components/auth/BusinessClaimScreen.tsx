import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { Search, Plus, ArrowRight, Building2 } from 'lucide-react';

interface BusinessClaimScreenProps {
  onComplete: () => void;
}

export const BusinessClaimScreen: React.FC<BusinessClaimScreenProps> = ({ onComplete }) => {
  const { t, isRTL, language } = useAppState();

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Title */}
      <div className="mt-12 mb-12">
        <h2 className="text-3xl font-black text-white mb-4">
          {language === 'ar' ? 'أعلن عن عملك' : language === 'ku' ? 'کارەکەت ڕابگەیەنە' : 'Claim Your Business'}
        </h2>
        <p className="text-white/40 text-sm font-medium leading-relaxed">
          {language === 'ar' 
            ? 'هل تملك عملاً تجارياً بالفعل؟ ابحث عنه وقم بتوثيقه، أو أضف عملاً جديداً' 
            : language === 'ku' 
            ? 'ئایا پێشتر کارت هەبووە؟ بگەڕێ و تۆماری بکە، یان کارێکی نوێ زیاد بکە' 
            : 'Do you already have a business? Search and verify it, or add a new one'}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-6">
        <button className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-colors group">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Search size={24} />
          </div>
          <div className="text-start">
            <h3 className="text-white font-bold">
              {language === 'ar' ? 'ابحث عن عملي' : language === 'ku' ? 'بەدوای کارەکەمدا بگەڕێ' : 'Search for my business'}
            </h3>
            <p className="text-white/40 text-xs">
              {language === 'ar' ? 'إذا كان عملك موجوداً مسبقاً' : language === 'ku' ? 'ئەگەر کارەکەت پێشتر هەبووە' : 'If your business is already listed'}
            </p>
          </div>
          <ArrowRight size={20} className={`text-white/20 ms-auto ${isRTL ? 'rotate-180' : ''}`} />
        </button>

        <button className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-colors group">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <Plus size={24} />
          </div>
          <div className="text-start">
            <h3 className="text-white font-bold">
              {language === 'ar' ? 'إضافة عمل جديد' : language === 'ku' ? 'کارێکی نوێ زیاد بکە' : 'Add a new business'}
            </h3>
            <p className="text-white/40 text-xs">
              {language === 'ar' ? 'ابدأ من الصفر' : language === 'ku' ? 'لە سەرەتاوە دەست پێ بکە' : 'Start from scratch'}
            </p>
          </div>
          <ArrowRight size={20} className={`text-white/20 ms-auto ${isRTL ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Illustration */}
      <div className="mt-auto flex flex-col items-center py-12 opacity-20">
        <Building2 size={120} className="text-white mb-4" />
        <p className="text-white text-xs font-black uppercase tracking-widest">REBORN BUSINESS</p>
      </div>

      {/* Skip/Complete */}
      <div className="mt-auto">
        <button
          onClick={onComplete}
          className="w-full h-16 bg-white/10 text-white rounded-2xl font-black text-lg active:scale-95 transition-all hover:bg-white/20"
        >
          {language === 'ar' ? 'تخطي الآن' : language === 'ku' ? 'ئێستا تێپەڕێنە' : 'Skip for now'}
        </button>
      </div>
    </div>
  );
};
