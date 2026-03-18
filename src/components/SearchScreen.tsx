import React, { useState, useEffect, useRef } from 'react';
import { Screen, Business, Governorate } from '../types';
import { APP_COLORS, TYPOGRAPHY, CATEGORIES, GOVERNORATES } from '../constants';
import { businesses } from '../data/businesses';
import { Search, MapPin, Star, X, Clock, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  t: any;
  isRTL: boolean;
}

export default function SearchScreen({ push, pop, t, isRTL, lang }: Props & { lang: string }) {
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

  const filteredBusinesses = businesses.filter(b => {
    const name = b[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Business] as string;
    const matchesQuery = !query || 
      name.toLowerCase().includes(query.toLowerCase()) || 
      (t(CATEGORIES.find(c => c.id === b.category)?.nameKey || '') || '').toLowerCase().includes(query.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });

  const visibleResults = filteredBusinesses.slice(0, page * PAGE_SIZE);
  const hasMore = visibleResults.length < filteredBusinesses.length;

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, hasMore, isLoadingMore]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    // Simulate slight delay for smooth UI
    await new Promise(r => setTimeout(r, 300)); 
    setPage(p => p + 1);
    setIsLoadingMore(false);
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header & Search Bar */}
      <div className="pt-5 pb-4 px-5 bg-surface sticky top-0 z-10 border-b border-border">
        <div className="flex items-center gap-3">
          <div 
            onClick={pop}
            className="p-2 cursor-pointer flex items-center justify-center"
          >
            <ChevronDown size={24} className={`text-text-primary ${isRTL ? '-rotate-90' : 'rotate-90'}`} />
          </div>
          <div className="flex-1 flex items-center bg-background rounded-2xl py-2.5 px-4 border border-border shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
            <Search size={20} className="text-text-secondary" />
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
              placeholder={t('search')}
              className={`flex-1 border-none outline-none bg-transparent px-3 text-[15px] text-text-primary ${isRTL ? 'text-right' : 'text-left'}`}
            />
            {query && (
              <div 
                onClick={() => {
                  setQuery('');
                  setPage(1);
                }}
                className="cursor-pointer p-1 bg-border rounded-full flex items-center justify-center"
              >
                <X size={14} className="text-text-secondary" />
              </div>
            )}
          </div>
        </div>

        {/* Category Quick Filters */}
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto mt-4 pb-1">
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
                className={`px-4 py-2 rounded-full flex items-center gap-1.5 cursor-pointer whitespace-nowrap border transition-all duration-200 ${
                  isSelected ? 'bg-primary text-white border-primary' : 'bg-background text-text-primary border-border'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span className={`text-[13px] ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                  {t(cat.nameKey)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        {!query && selectedCategory === 'all' ? (
          /* Recent Searches */
          <div>
            <h3 className={`m-0 mb-4 text-base font-bold text-text-primary ${isRTL ? 'text-right' : 'text-left'}`}>{t('recentSearches')}</h3>
            {recentSearches.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recentSearches.map(term => (
                  <motion.div 
                    key={term}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSearch(term)}
                    className="flex items-center justify-between py-3 px-4 bg-surface rounded-xl cursor-pointer border border-border"
                  >
                    <div className="flex items-center gap-3 text-text-secondary">
                      <Clock size={18} />
                      <span className="text-[15px] text-text-primary">{term}</span>
                    </div>
                    <div 
                      onClick={(e) => removeRecentSearch(term, e)}
                      className="p-1 cursor-pointer"
                    >
                      <X size={16} className="text-text-muted" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-text-muted py-10">
                {t('noRecentSearches')}
              </div>
            )}
          </div>
        ) : (
          /* Search Results */
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="m-0 text-base font-bold text-text-primary">
                {t('searchResults')}
              </h3>
              <span className="text-[13px] text-text-muted">
                {filteredBusinesses.length} {t('results')}
              </span>
            </div>

            {filteredBusinesses.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {visibleResults.map(business => (
                    <motion.div 
                      key={business.id}
                      whileHover={{ translateY: -2 }}
                      onClick={() => push('BusinessDetail', { business })}
                      className="bg-surface rounded-2xl overflow-hidden shadow-sm cursor-pointer flex flex-col transition-shadow duration-300 hover:shadow-md"
                    >
                      <div className="relative aspect-square">
                        <img src={business.coverUrl} alt={business[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Business] as string} className="w-full h-full object-cover" />
                        {business.isPremium && (
                          <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-black/60 text-premium-gold px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1`}>
                            <Star size={10} className="fill-premium-gold" /> PREMIUM
                          </div>
                        )}
                      </div>
                      <div className={`p-3 flex-1 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                        <h3 className="m-0 mb-1 text-sm font-bold leading-tight">
                          {business[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Business] as string}
                        </h3>
                        <p className="m-0 mb-2 text-xs text-text-secondary flex items-center gap-1">
                          <MapPin size={12} /> {t(CATEGORIES.find(c => c.id === business.category)?.nameKey || '')}
                        </p>
                        <div className="flex items-center gap-1 mb-3">
                          <Star size={14} className="text-premium-gold fill-premium-gold" />
                          <span className="text-xs font-semibold">{business.rating || 4.8}</span>
                          <span className="text-xs text-text-muted">({business.reviewCount || 247})</span>
                        </div>
                        <div className="mt-auto text-primary text-[13px] font-semibold flex items-center gap-1">
                          {t('viewDetails')} <ChevronDown size={14} className={isRTL ? 'rotate-90' : '-rotate-90'} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {hasMore && (
                  <div 
                    ref={observerTarget}
                    className="w-full p-5 flex justify-center items-center mt-5"
                  >
                    {isLoadingMore && (
                      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
                <div className="text-6xl mb-4">🕵️‍♂️</div>
                <h3 className="m-0 mb-2 text-lg font-bold text-text-primary">
                  {t('noResults')}
                </h3>
                <p className="m-0 text-sm text-text-secondary leading-relaxed">
                  {t('noResultsDesc')} "{query}".<br/>
                  {t('noResultsTry')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
