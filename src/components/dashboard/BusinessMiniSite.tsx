import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Share2, 
  Clock, 
  Info,
  ChevronLeft,
  ChevronRight,
  Store,
  ExternalLink,
  Navigation
} from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { APP_COLORS, TYPOGRAPHY, MOCK_BUSINESSES, MOCK_FEED_POSTS } from '../../constants';
import { Screen, Business, FeedPost } from '../../types';

interface Props {
  businessId: string;
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
}

export default function BusinessMiniSite({ businessId, push, pop }: Props) {
  const { t, isRTL, language } = useAppState();
  
  const business = MOCK_BUSINESSES.find(b => b.id === businessId) || MOCK_BUSINESSES[0];
  const businessPosts = MOCK_FEED_POSTS.filter(p => p.businessId === business.id);

  const name = (language === 'ar' ? business.nameAr : language === 'ku' ? business.nameKu : business.nameEn) || business.nameAr || business.nameEn;
  const description = (language === 'ar' ? business.descriptionAr : language === 'ku' ? business.descriptionKu : business.descriptionEn) || business.descriptionAr || business.descriptionEn;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] overflow-y-auto pb-20">
      {/* Header / Cover */}
      <div className="relative h-[220px] w-full flex-shrink-0">
        <img 
          src={business.coverUrl || 'https://picsum.photos/seed/cover/800/400'} 
          className="w-full h-full object-cover" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Back Button */}
        <button 
          onClick={pop}
          className="absolute top-12 inset-inline-start-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
        >
          <ChevronLeft size={24} style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
        </button>

        {/* Logo Overlay */}
        <div className="absolute -bottom-10 inset-inline-start-6 w-24 h-24 rounded-2xl border-4 border-[#0a0a0f] bg-[#1a1a1f] overflow-hidden shadow-2xl">
          <img 
            src={business.logoUrl || 'https://picsum.photos/seed/logo/200/200'} 
            className="w-full h-full object-cover" 
            alt="" 
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-14 space-y-6 text-start">
        {/* Name & Badges */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">{name}</h1>
            {business.isVerified && <CheckCircle2 size={20} className="text-secondary" />}
          </div>
          
          {/* Other Languages Names */}
          <div className="flex flex-col gap-0.5 text-white/40 text-xs">
            {language !== 'ar' && business.nameAr && <span>{business.nameAr}</span>}
            {language !== 'ku' && business.nameKu && <span>{business.nameKu}</span>}
            {language !== 'en' && business.nameEn && <span>{business.nameEn}</span>}
          </div>

          <div className="flex items-center gap-3 text-sm text-white/60 pt-1">
            <span className="bg-white/5 px-2 py-0.5 rounded-md border border-white/10 text-[10px] font-bold uppercase tracking-wider">
              {t(business.category)}
            </span>
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-primary" />
              <span>{business.governorateId}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer Box */}
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex gap-3">
          <Info size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-amber-200/80">
            {language === 'ar' ? 
              'إخلاء مسؤولية: هذا العمل التجاري مدرج لأغراض معلوماتية. ريبورن ليس مسؤولاً عن جودة الخدمات أو المنتجات المقدمة.' :
              language === 'ku' ?
              'ئاگاداری: ئەم کارە بۆ مەبەستی زانیاری دانراوە. ڕیبۆرن بەرپرسیار نییە لە کوالیتی خزمەتگوزارییەکان.' :
              'Disclaimer: This business is listed for informational purposes. REBORN is not responsible for service quality.'
            }
          </p>
        </div>

        {/* About Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">
            {isRTL ? 'حول العمل' : 'About'}
          </h3>
          <p className="text-sm text-white/80 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Contact Row */}
        <div className="flex gap-4">
          <ContactButton 
            icon={<Phone size={20} />} 
            label={isRTL ? 'اتصال' : 'Call'} 
            color="bg-blue-500"
            onClick={() => window.open(`tel:${business.phone}`)}
          />
          <ContactButton 
            icon={<MessageSquare size={20} />} 
            label={isRTL ? 'واتساب' : 'WhatsApp'} 
            color="bg-green-500"
            onClick={() => window.open(`https://wa.me/${business.phone?.replace(/\s/g, '')}`)}
          />
          <ContactButton 
            icon={<Share2 size={20} />} 
            label={isRTL ? 'مشاركة' : 'Share'} 
            color="bg-white/10"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: name,
                  text: description,
                  url: window.location.href
                });
              }
            }}
          />
        </div>

        {/* Hours Grid */}
        <div className="bg-[#1a1a1f] rounded-2xl border border-white/5 p-4 space-y-3">
          <div className="flex items-center gap-2 text-white/60 mb-2">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">{isRTL ? 'ساعات العمل' : 'Working Hours'}</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-8">
            {['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'].map((day, i) => (
              <div key={i} className="flex justify-between text-[11px]">
                <span className="text-white/40">{day}</span>
                <span className="text-white font-medium">09:00 - 22:00</span>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">
              {isRTL ? 'آخر المنشورات' : 'Latest Posts'}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {businessPosts.map(post => (
              <div key={post.id} className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5">
                {post.media && <img src={post.media} className="w-full h-full object-cover" alt="" />}
              </div>
            ))}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">
            {isRTL ? 'الموقع' : 'Location'}
          </h3>
          <div className="h-40 bg-[#1a1a1f] rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-2 text-white/20">
            <Navigation size={32} />
            <span className="text-xs">{isRTL ? 'خريطة تفاعلية قريباً' : 'Interactive map coming soon'}</span>
          </div>
        </div>

        {/* Claim Button (if unclaimed) */}
        {business.status === 'unclaimed' && (
          <button 
            onClick={() => push('ClaimBusiness', { business })}
            className="w-full bg-amber-500 py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 mt-8"
          >
            <Store size={20} />
            {isRTL ? 'اطلب ملكية هذا العمل' : 'Claim This Business'}
          </button>
        )}
      </div>
    </div>
  );
}

function ContactButton({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-2"
    >
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{label}</span>
    </button>
  );
}
