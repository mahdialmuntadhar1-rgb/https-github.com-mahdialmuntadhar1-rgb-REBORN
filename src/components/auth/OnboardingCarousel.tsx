import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';

interface Slide {
  id: number;
  titleAr: string;
  titleKu: string;
  titleEn: string;
  subAr: string;
  subKu: string;
  subEn: string;
  color: string;
}

const slides: Slide[] = [
  {
    id: 1,
    titleAr: 'أول منصة اجتماعية في العراق',
    titleKu: 'یەکەم پلاتفۆرمی کۆمەڵایەتی عێراقی',
    titleEn: "Iraq's first social discovery platform",
    subAr: 'اكتشف أفضل الأماكن والفعاليات في كل المحافظات',
    subKu: 'باشترین شوێن و چالاکییەکان لە هەموو پارێزگاکان بدۆزەرەوە',
    subEn: 'Discover the best places and events across all governorates',
    color: '#10b981'
  },
  {
    id: 2,
    titleAr: 'شوف شو صاير في مدينتك هلأ',
    titleKu: 'ببینە ئێستا چی لە شارەکەت دەبێت',
    titleEn: "See what's happening in your city right now",
    subAr: 'ابق على اطلاع دائم بآخر الأخبار والنشاطات المحلية',
    subKu: 'هەمیشە ئاگاداری دوایین هەواڵ و چالاکییە ناوخۆییەکان بە',
    subEn: 'Stay updated with the latest local news and activities',
    color: '#3b82f6'
  },
  {
    id: 3,
    titleAr: 'أكثر من ١٧ ألف عمل تجاري',
    titleKu: 'زیاتر لە ١٧ هەزار بازرگانی',
    titleEn: '17,000+ businesses in every category',
    subAr: 'من المطاعم إلى الخدمات، كل شيء في مكان واحد',
    subKu: 'لە چێشتخانەکانەوە تا خزمەتگوزارییەکان، هەمووی لە یەک شوێندا',
    subEn: 'From restaurants to services, everything in one place',
    color: '#f59e0b'
  },
  {
    id: 4,
    titleAr: 'محافظتك، فيدك — ١٨ مدينة',
    titleKu: 'پارێزگاکەت، فیدەکەت — ١٨ شار',
    titleEn: 'Your governorate, your feed — 18 cities',
    subAr: 'محتوى مخصص حسب موقعك الجغرافي',
    subKu: 'ناوەڕۆکی تایبەت بەپێی شوێنی جوگرافیاییت',
    subEn: 'Personalized content based on your location',
    color: '#8b5cf6'
  },
  {
    id: 5,
    titleAr: 'انضم كمواطن أو اعلن عن عملك',
    titleKu: 'وەک هاووڵاتی بچووی یان بازرگانیەکەت تۆمار بکە',
    titleEn: 'Join as a citizen or list your business',
    subAr: 'كن جزءاً من مجتمعنا المتنامي اليوم',
    subKu: 'ئەمڕۆ ببە بە بەشێک لە کۆمەڵگە گەشەسەندووەکەمان',
    subEn: 'Be part of our growing community today',
    color: '#ec4899'
  }
];

interface OnboardingCarouselProps {
  onComplete: () => void;
}

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isRTL } = useAppState();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    localStorage.setItem('onboarding_done', 'true');
    onComplete();
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col overflow-hidden z-[1000]">
      {/* Skip Button */}
      <div className="absolute top-12 right-6 z-10">
        <button 
          onClick={handleFinish}
          className="text-white/50 text-sm font-medium hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 50 : -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full px-8 flex flex-col items-center text-center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) handleNext();
              else if (info.offset.x > 50 && currentIndex > 0) setCurrentIndex(currentIndex - 1);
            }}
          >
            {/* Abstract SVG Illustration */}
            <div className="w-64 h-64 mb-12 relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute inset-0 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: currentSlide.color }}
              />
              <svg viewBox="0 0 200 200" className="w-full h-full text-white">
                <defs>
                  <linearGradient id={`grad-${currentIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: currentSlide.color, stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.5 }} />
                  </linearGradient>
                </defs>
                {currentIndex === 0 && (
                  <path d="M40,100 Q100,20 L160,100 Q100,180 Z" fill={`url(#grad-${currentIndex})`} />
                )}
                {currentIndex === 1 && (
                  <circle cx="100" cy="100" r="60" stroke={`url(#grad-${currentIndex})`} strokeWidth="8" fill="none" />
                )}
                {currentIndex === 2 && (
                  <rect x="50" y="50" width="100" height="100" rx="20" fill={`url(#grad-${currentIndex})`} />
                )}
                {currentIndex === 3 && (
                  <path d="M100,40 L160,140 L40,140 Z" fill={`url(#grad-${currentIndex})`} />
                )}
                {currentIndex === 4 && (
                  <path d="M100,40 C140,40 160,80 160,100 C160,140 100,180 100,180 C100,180 40,140 40,100 C40,80 60,40 100,40" fill={`url(#grad-${currentIndex})`} />
                )}
              </svg>
            </div>

            {/* Headlines */}
            <div className="space-y-4 mb-8">
              <h2 className="text-2xl font-bold text-white leading-tight">
                {currentSlide.titleAr}
              </h2>
              <h3 className="text-lg font-medium text-white/80 leading-tight">
                {currentSlide.titleKu}
              </h3>
              <p className="text-sm text-white/60">
                {currentSlide.titleEn}
              </p>
            </div>

            {/* Subtext */}
            <div className="space-y-2">
              <p className="text-sm text-white/40 leading-relaxed">
                {currentSlide.subAr}
              </p>
              <p className="text-xs text-white/30 leading-relaxed">
                {currentSlide.subKu}
              </p>
              <p className="text-[10px] text-white/20 uppercase tracking-widest">
                {currentSlide.subEn}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="p-8 flex flex-col items-center gap-8">
        {/* Dot Indicators */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full h-14 bg-white text-black rounded-2xl font-bold text-lg active:scale-95 transition-transform shadow-xl"
        >
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
};
