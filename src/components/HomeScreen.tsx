import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Play, MoreVertical, Heart, MessageCircle, 
  Share2, MapPin, Star, CheckCircle2, Compass, Bell, 
  ChevronDown, X, Camera, Store 
} from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { 
  APP_COLORS, TYPOGRAPHY, MOCK_STORIES, MOCK_BUSINESSES, 
  GOVERNORATES, MOCK_FEED_POSTS, CATEGORIES, MOCK_REELS 
} from '../constants';
import { Screen, TabType, FeedPost, Reel, Business, Story } from '../types';
import FeedPostCard from './FeedPostCard';
import BusinessPostcard from './business/BusinessPostcard';
import BusinessPostcardModal from './business/BusinessPostcardModal';
import { useBusinessFilter } from '../hooks/useBusinessFilter';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  selectedCity: string;
  setSelectedCity: (city: any) => void;
  lang: string;
  t: any;
  isRTL: boolean;
}

export default function HomeScreen({ push }: Props) {
  const { language, isRTL, selectedGovernorate, setGovernorate, t } = useAppState();
  const [activeTab, setActiveTab] = useState<TabType>('shakumaku');
  const [showFABMenu, setShowFABMenu] = useState(false);

  // Hero Slogans Rotation
  const [sloganIndex, setSloganIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % 5);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const currentGov = GOVERNORATES.find(g => g.id === selectedGovernorate);
  const cityName = currentGov ? (language === 'ar' ? currentGov.nameAr : language === 'ku' ? currentGov.nameKu : currentGov.nameEn) : '';

  const slogans = [
    {
      ar: t('slogan_1_ar'),
      ku: t('slogan_1_ku'),
      en: t('slogan_1_en')
    },
    {
      ar: t('slogan_2_ar').replace('{city}', cityName),
      ku: t('slogan_2_ku').replace('{city}', cityName),
      en: t('slogan_2_en')
    },
    {
      ar: t('slogan_3_ar'),
      ku: t('slogan_3_ku'),
      en: t('slogan_3_en')
    },
    {
      ar: t('slogan_4_ar'),
      ku: t('slogan_4_ku'),
      en: t('slogan_4_en')
    },
    {
      ar: t('slogan_5_ar'),
      ku: t('slogan_5_ku'),
      en: t('slogan_5_en')
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-white relative overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[180px] bg-gradient-to-b from-[#1a1a2f] to-[#0a0a0f] overflow-hidden flex flex-col justify-center items-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={sloganIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-1"
          >
            <h2 
              className="text-2xl font-bold leading-tight"
              style={{ fontFamily: (language === 'ar' || language === 'ku') ? "'Noto Naskh Arabic', sans-serif" : "inherit" }}
            >
              {slogans[sloganIndex].ar}
            </h2>
            <h3 className="text-lg opacity-80 font-medium">
              {slogans[sloganIndex].ku}
            </h3>
            <p className="text-xs opacity-60 tracking-wide uppercase">
              {slogans[sloganIndex].en}
            </p>
          </motion.div>
        </AnimatePresence>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
          <div className="absolute top-4 start-4 w-24 h-24 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-4 end-4 w-32 h-32 rounded-full bg-secondary blur-3xl" />
        </div>
      </section>

      {/* 2. GOVERNORATE CHIPS (TICKER) */}
      <div className="w-full py-4 bg-[#0a0a0f] border-b border-white/5 overflow-hidden relative group">
        <div className={`flex whitespace-nowrap hover:pause-ticker touch-pan-x ${isRTL ? 'animate-ticker-rtl' : 'animate-ticker'}`}>
          {/* Duplicate for infinite effect */}
          {[...GOVERNORATES, ...GOVERNORATES].map((gov, idx) => {
            const isSelected = selectedGovernorate === gov.id;
            const name = language === 'ar' ? gov.nameAr : language === 'ku' ? gov.nameKu : gov.nameEn;
            return (
              <motion.button
                key={`${gov.id}-${idx}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGovernorate(gov.id)}
                className={`mx-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  isSelected 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {name}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 3. TABS */}
      <div className="sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex w-full">
          <TabButton 
            active={activeTab === 'shakumaku'} 
            onClick={() => setActiveTab('shakumaku')}
            label={t('tab_shakumaku')}
          />
          <TabButton 
            active={activeTab === 'madinaty'} 
            onClick={() => setActiveTab('madinaty')}
            label={t('tab_madinaty')}
          />
        </div>
        {/* Sliding Underline */}
        <div className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
             style={{ 
               width: '50%', 
               insetInlineStart: activeTab === 'shakumaku' ? '0%' : '50%',
             }} 
        />
      </div>

      {/* 4. CONTENT AREA */}
      <main className="flex-1 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'shakumaku' ? (
            <motion.div
              key="shakumaku"
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? -20 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <ShakumakuTab push={push} />
            </motion.div>
          ) : (
            <motion.div
              key="madinaty"
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <MadinatyTab push={push} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 5. FLOATING ACTION BUTTON */}
      <div className="fixed bottom-6 end-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showFABMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-[#1a1a2f] border border-white/10 rounded-2xl p-2 shadow-2xl min-w-[180px]"
            >
              <FABOption 
                icon={<Camera size={18} />} 
                label={t('action_add_post')} 
                onClick={() => { push('AddPost'); setShowFABMenu(false); }} 
              />
              <div className="h-px bg-white/5 my-1" />
              <FABOption 
                icon={<Store size={18} />} 
                label={t('action_add_business')} 
                onClick={() => { push('CategoryBrowse'); setShowFABMenu(false); }} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFABMenu(!showFABMenu)}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 text-white"
        >
          <motion.div
            animate={{ rotate: showFABMenu ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Plus size={28} />
          </motion.div>
        </motion.button>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ticker-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
        .animate-ticker-rtl {
          animation: ticker-rtl 40s linear infinite;
        }
        .pause-ticker {
          animation-play-state: paused;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 py-4 text-sm font-bold transition-colors duration-300 ${
        active ? 'text-primary' : 'text-white/40 hover:text-white/60'
      }`}
    >
      {label}
    </button>
  );
}

function FABOption({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl transition-colors text-sm font-medium"
    >
      <span className="text-primary">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// --- SHAKUMAKU TAB ---
function ShakumakuTab({ push }: { push: (screen: Screen, props?: Record<string, any>) => void }) {
  const { language, selectedGovernorate, t } = useAppState();
  const [visibleCount, setVisibleCount] = useState(5);
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredPosts = MOCK_FEED_POSTS.filter(p => p.governorate === selectedGovernorate);
  const visiblePosts = filteredPosts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 5);
      setLoadingMore(false);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stories Row */}
      <div className="flex overflow-x-auto no-scrollbar gap-4 px-6 py-4">
        <div className="flex flex-col items-center gap-2 min-w-[70px]">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center bg-white/5">
            <Plus size={24} className="text-white/40" />
          </div>
          <span className="text-[10px] text-white/40 font-medium">Your Story</span>
        </div>
        {MOCK_STORIES.map(story => (
          <StoryCircle key={story.id} story={story} onClick={() => push('StoryViewer', { storyId: story.id })} />
        ))}
      </div>

      {/* Reels Row */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center px-6">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <Play size={16} className="text-primary fill-primary" />
            {t('feed_reels_title')}
          </h4>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-3 px-6">
          {MOCK_REELS.map(reel => (
            <ReelCard key={reel.id} reel={reel} onClick={() => push('PostDetail', { reelId: reel.id })} isRTL={language === 'ar' || language === 'ku'} />
          ))}
        </div>
      </div>

      {/* Feed Posts */}
      <div className="flex flex-col gap-4 px-4">
        {visiblePosts.length > 0 ? (
          <>
            {visiblePosts.map(post => (
              <FeedPostCard 
                key={post.id} 
                post={post} 
                onCommentClick={() => push('PostDetail', { post })} 
                onBusinessClick={(bId) => push('BusinessDetail', { businessId: bId })}
                isRTL={language === 'ar' || language === 'ku'}
                t={t}
              />
            ))}
            {visibleCount < filteredPosts.length && (
              <button 
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-primary font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                {loadingMore ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t('feed_load_more')}</span>
                    <ChevronDown size={16} />
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center px-10 gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
              <MessageCircle size={32} />
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              {t('feed_no_posts_city')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StoryCircle({ story, onClick }: { story: Story, onClick: () => void, key?: any }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 min-w-[70px]">
      <div className={`w-16 h-16 rounded-full p-0.5 ${story.viewed ? 'bg-white/10' : 'bg-gradient-to-tr from-primary to-secondary'}`}>
        <div className="w-full h-full rounded-full border-2 border-[#0a0a0f] overflow-hidden">
          <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
        </div>
      </div>
      <span className="text-[10px] text-white/60 font-medium truncate w-full text-center">{story.name}</span>
    </button>
  );
}

function ReelCard({ reel, onClick, isRTL }: { reel: Reel, onClick: () => void, isRTL: boolean, key?: any }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative min-w-[120px] h-[200px] rounded-2xl overflow-hidden bg-white/5 group"
    >
      <img src={reel.thumbnailUrl} alt={reel.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <Play size={20} fill="white" style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
      </div>

      <div className="absolute bottom-3 inset-inline-start-3 inset-inline-end-3 flex flex-col gap-1 text-start">
        <span className="text-[10px] font-bold text-white truncate">{reel.creatorName}</span>
        <span className="text-[8px] text-white/60 line-clamp-2 leading-tight">{reel.title}</span>
      </div>
    </motion.button>
  );
}

// --- MADINATY TAB ---
function MadinatyTab({ push }: { push: (screen: Screen, props?: Record<string, any>) => void }) {
  const { language, selectedGovernorate, t } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { businesses, isLoading, loadMore, hasMore } = useBusinessFilter({
    governorateId: selectedGovernorate,
    category: selectedCategory,
    searchQuery
  });

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  const handleClaimClick = (business: Business) => {
    push('ClaimBusiness', { business });
  };

  return (
    <div className="flex flex-col gap-6 px-6 pt-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
        <input 
          type="text"
          placeholder={t('madinaty_search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl ps-12 pe-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 py-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
              selectedCategory === cat.id 
                ? 'bg-primary border-primary text-white' 
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{t(cat.nameKey)}</span>
          </button>
        ))}
      </div>

      {/* Business Grid */}
      {businesses.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {businesses.map(business => (
            <BusinessPostcard 
              key={business.id} 
              business={business} 
              onClick={() => handleBusinessClick(business)}
              onClaimClick={() => handleClaimClick(business)}
            />
          ))}
          {hasMore && (
            <div className="col-span-2 mt-2">
              <button 
                onClick={loadMore}
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-primary font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{t('feed_load_more')}</span>
                    <ChevronDown size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
            <Store size={32} />
          </div>
          <p className="text-sm text-white/40 leading-relaxed px-10">
            {t('madinaty_no_businesses')}
          </p>
        </div>
      )}

      <BusinessPostcardModal 
        business={selectedBusiness}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClaim={() => {
          setIsModalOpen(false);
          if (selectedBusiness) handleClaimClick(selectedBusiness);
        }}
        onViewProfile={() => {
          setIsModalOpen(false);
          if (selectedBusiness) push('BusinessDetail', { business: selectedBusiness });
        }}
      />
    </div>
  );
}

