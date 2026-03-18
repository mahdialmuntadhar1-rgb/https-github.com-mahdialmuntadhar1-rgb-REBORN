import React, { useState, useEffect, useRef } from 'react';
import { Screen } from '../types';
import { APP_COLORS, TYPOGRAPHY, MOCK_BUSINESSES, CATEGORIES } from '../constants';
import { Search, MapPin, Star, X, Clock, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  t: any;
  isRTL: boolean;
}

export default function SearchScreen({ push, pop, t, isRTL }: Props) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['مطاعم', 'مقاهي', 'مول بغداد', 'برجر']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const PAGE_SIZE = 6;

  useEffect(() => {
    // Autofocus the search input when the screen mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setPage(1);
    if (searchTerm.trim() && !recentSearches.includes(searchTerm.trim())) {
      setRecentSearches(prev => [searchTerm.trim(), ...prev].slice(0, 8));
    }
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(t => t !== term));
  };

  const filteredBusinesses = MOCK_BUSINESSES.filter(b => {
    const matchesQuery = !query || 
      b.name.toLowerCase().includes(query.toLowerCase()) || 
      (b.nameAr && b.nameAr.includes(query)) || 
      (t[CATEGORIES.find(c => c.id === b.category)?.nameKey || ''] || '').includes(query);
      
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });

  const visibleResults = filteredBusinesses.slice(0, page * PAGE_SIZE);
  const hasMore = visibleResults.length < filteredBusinesses.length;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise(r => setTimeout(r, 800)); // simulate fetch
    setPage(p => p + 1);
    setIsLoadingMore(false);
  };

  return (
    <div style={{ backgroundColor: APP_COLORS.BACKGROUND, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Header & Search Bar */}
      <div style={{
        padding: '20px 20px 15px',
        backgroundColor: APP_COLORS.SURFACE,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: `1px solid ${APP_COLORS.BORDER}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div 
            onClick={pop}
            style={{ 
              padding: 8, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronDown size={24} color={APP_COLORS.TEXT_PRIMARY} style={{ transform: isRTL ? 'rotate(-90deg)' : 'rotate(90deg)' }} />
          </div>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: APP_COLORS.BACKGROUND,
            borderRadius: 16,
            padding: '10px 16px',
            border: `1px solid ${APP_COLORS.BORDER}`,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <Search size={20} color={APP_COLORS.TEXT_SECONDARY} />
            <input 
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(query);
                }
              }}
              placeholder={t.search}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                padding: '0 12px',
                ...TYPOGRAPHY.body,
                fontSize: 15,
                color: APP_COLORS.TEXT_PRIMARY,
                textAlign: isRTL ? 'right' : 'left'
              }}
            />
            {query && (
              <div 
                onClick={() => {
                  setQuery('');
                  setPage(1);
                }}
                style={{ 
                  cursor: 'pointer', 
                  padding: 4, 
                  backgroundColor: APP_COLORS.BORDER, 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={14} color={APP_COLORS.TEXT_SECONDARY} />
              </div>
            )}
          </div>
        </div>

        {/* Category Quick Filters */}
        <div className="no-scrollbar" style={{ 
          display: 'flex', 
          gap: 10, 
          overflowX: 'auto', 
          marginTop: 15,
          paddingBottom: 5
        }}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.div 
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: isSelected ? APP_COLORS.PRIMARY : APP_COLORS.BACKGROUND,
                  color: isSelected ? 'white' : APP_COLORS.TEXT_PRIMARY,
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  border: `1px solid ${isSelected ? APP_COLORS.PRIMARY : APP_COLORS.BORDER}`,
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: 14 }}>{cat.icon}</span>
                <span style={{ fontSize: 13, fontWeight: isSelected ? 600 : 400 }}>
                  {t[cat.nameKey] || cat.nameKey}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: 100 }}>
        {!query && selectedCategory === 'all' ? (
          /* Recent Searches */
          <div>
            <h3 style={{ ...TYPOGRAPHY.headline, fontSize: 16, marginBottom: 16, color: APP_COLORS.TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }}>{isRTL ? 'عمليات بحث سابقة' : 'Recent Searches'}</h3>
            {recentSearches.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentSearches.map(term => (
                  <motion.div 
                    key={term}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSearch(term)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      backgroundColor: APP_COLORS.SURFACE,
                      borderRadius: 12,
                      cursor: 'pointer',
                      border: `1px solid ${APP_COLORS.BORDER}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: APP_COLORS.TEXT_SECONDARY }}>
                      <Clock size={18} />
                      <span style={{ ...TYPOGRAPHY.body, fontSize: 15, color: APP_COLORS.TEXT_PRIMARY }}>{term}</span>
                    </div>
                    <div 
                      onClick={(e) => removeRecentSearch(term, e)}
                      style={{ padding: 4, cursor: 'pointer' }}
                    >
                      <X size={16} color={APP_COLORS.TEXT_MUTED} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: APP_COLORS.TEXT_MUTED, padding: '40px 0' }}>
                {isRTL ? 'لا توجد عمليات بحث سابقة' : 'No recent searches'}
              </div>
            )}
          </div>
        ) : (
          /* Search Results */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ ...TYPOGRAPHY.headline, fontSize: 16, margin: 0, color: APP_COLORS.TEXT_PRIMARY }}>
                {isRTL ? 'نتائج البحث' : 'Search Results'}
              </h3>
              <span style={{ fontSize: 13, color: APP_COLORS.TEXT_MUTED }}>
                {filteredBusinesses.length} {isRTL ? 'نتيجة' : 'results'}
              </span>
            </div>

            {filteredBusinesses.length > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  {visibleResults.map(business => (
                    <motion.div 
                      key={business.id}
                      whileHover={{ translateY: -2 }}
                      onClick={() => push('BusinessDetail', { business })}
                      style={{
                        backgroundColor: APP_COLORS.SURFACE,
                        borderRadius: 16,
                        overflow: 'hidden',
                        boxShadow: APP_COLORS.SHADOW,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'box-shadow 0.3s ease'
                      }}
                    >
                      <div style={{ position: 'relative', aspectRatio: '1/1' }}>
                        <img src={business.coverImage || business.image} alt={business.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {business.isPremium && (
                          <div style={{
                            position: 'absolute',
                            top: 8,
                            left: isRTL ? 'auto' : 8,
                            right: isRTL ? 8 : 'auto',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: APP_COLORS.PREMIUM_GOLD,
                            padding: '4px 8px',
                            borderRadius: 8,
                            fontSize: 10,
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            <Star size={10} fill={APP_COLORS.PREMIUM_GOLD} /> PREMIUM
                          </div>
                        )}
                      </div>
                      <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column', textAlign: isRTL ? 'right' : 'left' }}>
                        <h3 style={{ ...TYPOGRAPHY.headline, margin: '0 0 4px 0', fontSize: 14, lineHeight: 1.3 }}>
                          {business.name}
                        </h3>
                        <p style={{ ...TYPOGRAPHY.body, margin: '0 0 8px 0', fontSize: 12, color: APP_COLORS.TEXT_SECONDARY, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} /> {t[CATEGORIES.find(c => c.id === business.category)?.nameKey || ''] || business.category}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                          <Star size={14} color={APP_COLORS.PREMIUM_GOLD} fill={APP_COLORS.PREMIUM_GOLD} />
                          <span style={{ fontSize: 12, fontWeight: 600 }}>{business.rating}</span>
                          <span style={{ fontSize: 12, color: APP_COLORS.TEXT_MUTED }}>({business.reviewCount || business.reviews})</span>
                        </div>
                        <div style={{ marginTop: 'auto', color: APP_COLORS.PRIMARY, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {isRTL ? 'عرض التفاصيل' : 'View Details'} <ChevronDown size={14} style={{ transform: isRTL ? 'rotate(90deg)' : 'rotate(-90deg)' }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {hasMore && (
                  <button 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    style={{
                      width: '100%',
                      padding: 12,
                      backgroundColor: APP_COLORS.SURFACE,
                      border: `1px solid ${APP_COLORS.BORDER}`,
                      borderRadius: 12,
                      color: APP_COLORS.PRIMARY,
                      ...TYPOGRAPHY.headline,
                      fontSize: 14,
                      cursor: 'pointer',
                      marginTop: 20,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {isLoadingMore ? (
                      <div style={{
                        width: 18, height: 18, 
                        border: `2px solid ${APP_COLORS.PRIMARY}`, 
                        borderTopColor: 'transparent', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite'
                      }} />
                    ) : `${t.loadMore} ↓`}
                  </button>
                )}
              </>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '60px 20px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🕵️‍♂️</div>
                <h3 style={{ ...TYPOGRAPHY.headline, fontSize: 18, marginBottom: 8, color: APP_COLORS.TEXT_PRIMARY }}>
                  {isRTL ? 'لا توجد نتائج' : 'No results found'}
                </h3>
                <p style={{ ...TYPOGRAPHY.body, fontSize: 14, color: APP_COLORS.TEXT_SECONDARY, lineHeight: 1.5 }}>
                  {isRTL ? `لم نتمكن من العثور على أي نتائج لـ "${query}".` : `We couldn't find any results for "${query}".`}<br/>
                  {isRTL ? 'جرب استخدام كلمات مختلفة أو تصفح الفئات.' : 'Try using different keywords or browse categories.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
