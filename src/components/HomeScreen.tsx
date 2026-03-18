import React, { useState, useEffect, useRef } from 'react';
import { Screen, Story, Business, TabType, FeedPost } from '../types';
import { APP_COLORS, TYPOGRAPHY, MOCK_STORIES, MOCK_BUSINESSES, HERO_SLIDES, GOVERNORATES, MOCK_FEED_POSTS, CATEGORIES, TRANSLATIONS } from '../constants';
import { MapPin, Star, Heart, MessageCircle, Share2, Compass, ChevronDown, Search, Bell, Play, MoreHorizontal, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FeedPostCard from './FeedPostCard';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  lang: 'en' | 'ar' | 'ku';
  t: any;
  isRTL: boolean;
}

export default function HomeScreen({ push, selectedCity, setSelectedCity, lang, t, isRTL }: Props) {
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('shakumaku');

  const PAGE_SIZE = 5;
  const visiblePosts = MOCK_FEED_POSTS.slice(0, page * PAGE_SIZE);
  const hasMore = visiblePosts.length < MOCK_FEED_POSTS.length;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise(r => setTimeout(r, 800)); // simulate fetch
    setPage(p => p + 1);
    setIsLoadingMore(false);
  };

  const selectedCityName = GOVERNORATES.find(g => g.id === selectedCity)?.name[lang] || 'Baghdad';

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* 1A. STICKY HEADER */}
      <div style={{
        padding: '20px 20px 15px',
        backgroundColor: APP_COLORS.SURFACE,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: APP_COLORS.SHADOW,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Compass size={28} color={APP_COLORS.PRIMARY} />
            <h1 style={{ ...TYPOGRAPHY.headline, margin: 0, fontSize: 20, color: APP_COLORS.PRIMARY }}>{t.appName}</h1>
          </div>
          <div 
            onClick={() => push('CitySelect')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              backgroundColor: `${APP_COLORS.SECONDARY}15`,
              borderRadius: 20,
              color: APP_COLORS.SECONDARY,
              cursor: 'pointer'
            }}
          >
            <ChevronDown size={16} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{selectedCityName}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 15 }}>
          <Bell size={24} color={APP_COLORS.TEXT_PRIMARY} onClick={() => push('Notifications')} style={{ cursor: 'pointer' }} />
          <Search size={24} color={APP_COLORS.TEXT_PRIMARY} onClick={() => push('Search')} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      {/* 1B. HERO CAROUSEL */}
      <HeroCarousel t={t} isRTL={isRTL} />

      {/* 1C. CITY FILTER BAR */}
      <CityFilterBar selectedCity={selectedCity} setSelectedCity={setSelectedCity} lang={lang} isRTL={isRTL} />

      {/* 1D. TAB BAR */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} t={t} isRTL={isRTL} />

      {activeTab === 'shakumaku' && (
        <>
          {/* Stories */}
          <div className="no-scrollbar" style={{
            display: 'flex',
            overflowX: 'auto',
            padding: '20px',
            gap: 15,
            backgroundColor: APP_COLORS.SURFACE,
            marginBottom: 10,
            alignItems: 'flex-start'
          }}>
            {/* Add Your Story */}
            <div 
              onClick={() => push('AddPost', { mode: 'story' })}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                width: 70
              }}
            >
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                border: `2px dashed ${APP_COLORS.TEXT_MUTED}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: APP_COLORS.BACKGROUND
              }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: APP_COLORS.PRIMARY,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 18,
                  lineHeight: 1
                }}>
                  +
                </div>
              </div>
              <span style={{ 
                fontSize: 11, 
                color: APP_COLORS.TEXT_SECONDARY, 
                width: '100%', 
                textAlign: 'center', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                fontFamily: "'IBM Plex Sans Arabic', sans-serif"
              }}>
                {t.addPost}
              </span>
            </div>

            {MOCK_STORIES.map(story => (
              <StoryCircle key={story.id} story={story} onClick={() => push('StoryViewer', { initialStoryId: story.id })} />
            ))}
          </div>

          {/* Featured Businesses */}
          <div style={{ padding: '0 20px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <h2 style={{ ...TYPOGRAPHY.headline, margin: 0, fontSize: 18 }}>{isRTL ? 'أماكن مميزة' : 'Featured Places'}</h2>
              <span onClick={() => push('CategoryBrowse')} style={{ color: APP_COLORS.PRIMARY, fontSize: 14, cursor: 'pointer' }}>{isRTL ? 'عرض الكل' : 'View All'}</span>
            </div>
            <div className="no-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: 15, paddingBottom: 10 }}>
              {MOCK_BUSINESSES.map(business => (
                <BusinessCard key={business.id} business={business} onClick={() => push('BusinessDetail', { business })} />
              ))}
            </div>
          </div>

          {/* Feed */}
          <div style={{ padding: '0 20px' }}>
            <h2 style={{ ...TYPOGRAPHY.headline, margin: '0 0 15px 0', fontSize: 18, textAlign: isRTL ? 'right' : 'left' }}>{isRTL ? 'أحدث التجارب' : 'Latest Experiences'}</h2>
            {visiblePosts.map((post, index) => (
              <React.Fragment key={post.id}>
                <FeedPostCard 
                  post={post} 
                  onCommentClick={() => push('PostDetail', { post })} 
                  onBusinessClick={(bId) => {
                    const b = MOCK_BUSINESSES.find(x => x.id === bId);
                    if(b) push('BusinessDetail', { business: b });
                  }} 
                  isRTL={isRTL}
                  t={t}
                />
                {/* Inline Story every 4 posts */}
                {(index + 1) % 4 === 0 && MOCK_STORIES[Math.floor(index / 4)] && (
                  <InlineStoryCard 
                    story={MOCK_STORIES[Math.floor(index / 4)]} 
                    onClick={() => push('StoryViewer', { initialStoryId: MOCK_STORIES[Math.floor(index / 4)].id })} 
                  />
                )}
              </React.Fragment>
            ))}
            
            {hasMore && (
              <button 
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                style={{
                  width: '100%',
                  padding: 15,
                  backgroundColor: APP_COLORS.SURFACE,
                  border: `1px solid ${APP_COLORS.BORDER}`,
                  borderRadius: 12,
                  color: APP_COLORS.PRIMARY,
                  ...TYPOGRAPHY.headline,
                  cursor: 'pointer',
                  marginTop: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {isLoadingMore ? (
                  <div style={{
                    width: 20, height: 20, 
                    border: `2px solid ${APP_COLORS.PRIMARY}`, 
                    borderTopColor: 'transparent', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite'
                  }} />
                ) : `${t.loadMore} ↓`}
              </button>
            )}
          </div>
        </>
      )}

      {activeTab === 'madinaty' && (
        <MadinatyTab push={push} t={t} isRTL={isRTL} lang={lang} />
      )}

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 ${APP_COLORS.PRIMARY}80; }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px ${APP_COLORS.PRIMARY}00; }
            100% { transform: scale(1); box-shadow: 0 0 0 0 ${APP_COLORS.PRIMARY}00; }
          }
        `}
      </style>
    </div>
  );
}

function HeroCarousel({ t, isRTL }: { t: any, isRTL: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, margin: '20px 20px 0', height: 200 }}>
      <motion.div 
        animate={{ x: isRTL ? currentIndex * 100 + '%' : -currentIndex * 100 + '%' }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          display: 'flex',
          width: '100%',
          height: '100%'
        }}
      >
        {HERO_SLIDES.map((slide) => (
          <div key={slide.id} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
            <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 20,
              textAlign: isRTL ? 'right' : 'left'
            }}>
              <h3 style={{ ...TYPOGRAPHY.headline, color: 'white', margin: '0 0 4px 0', fontSize: 18 }}>{slide.title}</h3>
              <p style={{ ...TYPOGRAPHY.body, color: 'rgba(255,255,255,0.8)', margin: '0 0 12px 0', fontSize: 12 }}>{slide.subtitle}</p>
              <button style={{
                backgroundColor: APP_COLORS.PRIMARY,
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 8,
                ...TYPOGRAPHY.headline,
                fontSize: 14,
                cursor: 'pointer',
                alignSelf: isRTL ? 'flex-start' : 'flex-end'
              }}>
                {isRTL ? 'استكشف الآن' : 'Explore Now'}
              </button>
            </div>
          </div>
        ))}
      </motion.div>
      <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
        {HERO_SLIDES.map((_, idx) => (
          <div key={idx} style={{
            width: idx === currentIndex ? 16 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: idx === currentIndex ? APP_COLORS.PRIMARY : 'rgba(255,255,255,0.5)',
            transition: 'all 0.3s'
          }} />
        ))}
      </div>
    </div>
  );
}

function CityFilterBar({ selectedCity, setSelectedCity, lang, isRTL }: { selectedCity: string, setSelectedCity: (id: string) => void, lang: any, isRTL: boolean }) {
  return (
    <div className="no-scrollbar" style={{
      display: 'flex',
      overflowX: 'auto',
      padding: '15px 20px',
      gap: 10,
      backgroundColor: APP_COLORS.BACKGROUND,
      position: 'sticky',
      top: 70,
      zIndex: 40
    }}>
      {GOVERNORATES.map(city => {
        const isSelected = city.id === selectedCity;
        return (
          <motion.div
            key={city.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCity(city.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: isSelected ? APP_COLORS.PRIMARY : APP_COLORS.SURFACE,
              color: isSelected ? 'white' : APP_COLORS.TEXT_PRIMARY,
              borderRadius: 20,
              border: isSelected ? 'none' : `1px solid ${APP_COLORS.BORDER}`,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              ...TYPOGRAPHY.headline,
              fontSize: 14,
              transition: 'all 0.2s'
            }}
          >
            {city.name[lang]}
          </motion.div>
        );
      })}
    </div>
  );
}

function TabBar({ activeTab, setActiveTab, t, isRTL }: { activeTab: TabType, setActiveTab: (tab: TabType) => void, t: any, isRTL: boolean }) {
  return (
    <div style={{
      display: 'flex',
      backgroundColor: APP_COLORS.SURFACE,
      position: 'sticky',
      top: 125,
      zIndex: 30
    }}>
      <div 
        onClick={() => setActiveTab('shakumaku')}
        style={{
          flex: 1,
          textAlign: 'center',
          padding: '15px 0',
          cursor: 'pointer',
          color: activeTab === 'shakumaku' ? APP_COLORS.PRIMARY : APP_COLORS.TEXT_SECONDARY,
          ...TYPOGRAPHY.headline,
          fontSize: 16,
          position: 'relative'
        }}
      >
        {t.shakumaku}
        {activeTab === 'shakumaku' && (
          <motion.div 
            layoutId="tabUnderline"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: APP_COLORS.PRIMARY
            }}
          />
        )}
      </div>
      <div 
        onClick={() => setActiveTab('madinaty')}
        style={{
          flex: 1,
          textAlign: 'center',
          padding: '15px 0',
          cursor: 'pointer',
          color: activeTab === 'madinaty' ? APP_COLORS.PRIMARY : APP_COLORS.TEXT_SECONDARY,
          ...TYPOGRAPHY.headline,
          fontSize: 16,
          position: 'relative'
        }}
      >
        {t.madinaty}
        {activeTab === 'madinaty' && (
          <motion.div 
            layoutId="tabUnderline"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: APP_COLORS.PRIMARY
            }}
          />
        )}
      </div>
    </div>
  );
}

function StoryCircle({ story, onClick }: { story: Story, onClick: () => void, key?: any }) {
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        position: 'relative',
        width: 70
      }}
    >
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        padding: 2,
        background: story.viewed ? APP_COLORS.TEXT_MUTED : APP_COLORS.PRIMARY,
        position: 'relative',
        animation: !story.viewed ? 'pulse 2s infinite' : 'none'
      }}>
        <img 
          src={story.avatar} 
          alt={story.name}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 30,
            objectFit: 'cover',
            border: `2px solid ${APP_COLORS.SURFACE}`
          }}
        />
        {story.type === 'business' && story.verified && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: APP_COLORS.SECONDARY,
            borderRadius: '50%',
            width: 16,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${APP_COLORS.SURFACE}`
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
      </div>
      <span style={{ 
        fontSize: 11, 
        color: APP_COLORS.TEXT_PRIMARY, 
        width: '100%', 
        textAlign: 'center', 
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
        fontFamily: "'IBM Plex Sans Arabic', sans-serif"
      }}>
        {story.name}
      </span>
    </div>
  );
}

function BusinessCard({ business, onClick }: { business: Business, onClick: () => void, key?: any }) {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ translateY: -2 }}
      style={{
        minWidth: 200,
        backgroundColor: APP_COLORS.SURFACE,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: APP_COLORS.SHADOW,
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease'
      }}
    >
      <img src={business.coverImage || business.image} alt={business.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
      <div style={{ padding: 12 }}>
        <h3 style={{ ...TYPOGRAPHY.headline, margin: '0 0 4px 0', fontSize: 14 }}>{business.name}</h3>
        <p style={{ ...TYPOGRAPHY.body, margin: '0 0 8px 0', fontSize: 12, color: APP_COLORS.TEXT_SECONDARY }}>{business.category} • {business.city}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Star size={14} color={APP_COLORS.PREMIUM_GOLD} fill={APP_COLORS.PREMIUM_GOLD} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>{business.rating}</span>
          <span style={{ fontSize: 12, color: APP_COLORS.TEXT_MUTED }}>({business.reviewCount || business.reviews})</span>
        </div>
      </div>
    </motion.div>
  );
}

function InlineStoryCard({ story, onClick }: { story: Story, onClick: () => void }) {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ translateY: -2 }}
      style={{
        backgroundColor: APP_COLORS.SURFACE,
        borderRadius: 16,
        marginBottom: 15,
        boxShadow: APP_COLORS.SHADOW,
        overflow: 'hidden',
        position: 'relative',
        height: 200,
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease'
      }}
    >
      <img src={story.media[0]} alt={story.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 15
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 20, padding: 2,
            background: APP_COLORS.PRIMARY
          }}>
            <img src={story.avatar} alt={story.name} style={{ width: '100%', height: '100%', borderRadius: 20, border: '2px solid white', objectFit: 'cover' }} />
          </div>
          <div>
            <h4 style={{ color: 'white', margin: 0, fontSize: 14, fontWeight: 'bold', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>{story.name}</h4>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>شاهد القصة</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MadinatyTab({ push, t, isRTL, lang }: { push: (screen: Screen, props?: Record<string, any>) => void, t: any, isRTL: boolean, lang: string }) {
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const PAGE_SIZE = 6;

  const activeCategory = CATEGORIES.find(c => c.id === selectedCategory);
  
  // Filter businesses
  let filteredBusinesses = MOCK_BUSINESSES;
  if (selectedCategory !== 'all') {
    filteredBusinesses = filteredBusinesses.filter(b => b.category === selectedCategory);
    if (selectedSubcategory) {
      filteredBusinesses = filteredBusinesses.filter(b => b.subcategory === selectedSubcategory);
    }
  }

  const visibleBusinesses = filteredBusinesses.slice(0, page * PAGE_SIZE);
  const hasMore = visibleBusinesses.length < filteredBusinesses.length;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise(r => setTimeout(r, 800)); // simulate fetch
    setPage(p => p + 1);
    setIsLoadingMore(false);
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Category Filter Row */}
      <div className="no-scrollbar" style={{
        display: 'flex',
        overflowX: 'auto',
        padding: '15px 20px',
        gap: 10,
        backgroundColor: APP_COLORS.SURFACE,
        borderBottom: `1px solid ${APP_COLORS.BORDER}`
      }}>
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;

          const handlePressStart = () => {
            if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
            pressTimerRef.current = setTimeout(() => {
              push('CategoryBrowse', { categoryId: cat.id });
            }, 500); // 500ms for long press
          };

          const handlePressEnd = () => {
            if (pressTimerRef.current) {
              clearTimeout(pressTimerRef.current);
              pressTimerRef.current = null;
            }
          };

          return (
            <motion.div
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedSubcategory(null);
                setPage(1);
              }}
              onPointerDown={handlePressStart}
              onPointerUp={handlePressEnd}
              onPointerLeave={handlePressEnd}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                backgroundColor: isSelected ? APP_COLORS.PRIMARY : APP_COLORS.SURFACE,
                border: `1px solid ${isSelected ? APP_COLORS.PRIMARY : APP_COLORS.BORDER}`,
                borderRadius: 20,
                color: isSelected ? 'white' : APP_COLORS.TEXT_PRIMARY,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
            >
              <span style={{ fontSize: 16 }}>{cat.icon}</span>
              <span style={{ fontSize: 14, fontWeight: isSelected ? 600 : 400 }}>
                {t[cat.nameKey] || cat.nameKey}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Subcategory Filter Row */}
      {activeCategory?.subcategories && (
        <div className="no-scrollbar" style={{
          display: 'flex',
          overflowX: 'auto',
          padding: '10px 20px',
          gap: 10,
          backgroundColor: '#FAFAFA',
          borderBottom: `1px solid ${APP_COLORS.BORDER}`
        }}>
          <div
            onClick={() => {
              setSelectedSubcategory(null);
              setPage(1);
            }}
            style={{
              padding: '6px 14px',
              backgroundColor: selectedSubcategory === null ? APP_COLORS.TEXT_PRIMARY : 'transparent',
              border: `1px solid ${selectedSubcategory === null ? APP_COLORS.TEXT_PRIMARY : APP_COLORS.BORDER}`,
              borderRadius: 16,
              color: selectedSubcategory === null ? 'white' : APP_COLORS.TEXT_SECONDARY,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {t.all}
          </div>
          {activeCategory.subcategories.map(sub => {
            const isSelected = selectedSubcategory === sub.id;
            return (
              <div
                key={sub.id}
                onClick={() => {
                  setSelectedSubcategory(sub.id);
                  setPage(1);
                }}
                style={{
                  padding: '6px 14px',
                  backgroundColor: isSelected ? APP_COLORS.TEXT_PRIMARY : 'transparent',
                  border: `1px solid ${isSelected ? APP_COLORS.TEXT_PRIMARY : APP_COLORS.BORDER}`,
                  borderRadius: 16,
                  color: isSelected ? 'white' : APP_COLORS.TEXT_SECONDARY,
                  fontSize: 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {t[sub.nameKey] || sub.nameKey}
              </div>
            );
          })}
        </div>
      )}

      {/* Business Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 15,
        padding: 20
      }}>
        {visibleBusinesses.map(business => (
          <BusinessGridCard key={business.id} business={business} onClick={() => push('BusinessDetail', { business })} />
        ))}
      </div>

      {hasMore && (
        <div style={{ padding: '0 20px' }}>
          <button 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            style={{
              width: '100%',
              padding: 15,
              backgroundColor: APP_COLORS.SURFACE,
              border: `1px solid ${APP_COLORS.BORDER}`,
              borderRadius: 12,
              color: APP_COLORS.PRIMARY,
              ...TYPOGRAPHY.headline,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {isLoadingMore ? (
              <div style={{
                width: 20, height: 20, 
                border: `2px solid ${APP_COLORS.PRIMARY}`, 
                borderTopColor: 'transparent', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite'
              }} />
            ) : `${t.loadMore} ↓`}
          </button>
        </div>
      )}
    </div>
  );
}

function BusinessGridCard({ business, onClick }: { business: Business, onClick: () => void, key?: any }) {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ translateY: -2 }}
      style={{
        backgroundColor: APP_COLORS.SURFACE,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: APP_COLORS.SHADOW,
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease'
      }}
    >
      <img src={business.coverImage || business.image} alt={business.name} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
      <div style={{ padding: 10 }}>
        <h3 style={{ ...TYPOGRAPHY.headline, margin: '0 0 2px 0', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{business.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <Star size={12} color={APP_COLORS.PREMIUM_GOLD} fill={APP_COLORS.PREMIUM_GOLD} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>{business.rating}</span>
        </div>
        <div style={{ fontSize: 10, color: APP_COLORS.TEXT_SECONDARY }}>{business.city}</div>
      </div>
    </motion.div>
  );
}
