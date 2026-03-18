import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Filter, Search, 
  Store, MapPin, Star, X, SlidersHorizontal
} from 'lucide-react';
import { Screen, Business, GovernorateId } from '../types';
import { useAppState } from '../hooks/useAppState';
import { CATEGORIES, GOVERNORATES } from '../constants';
import { useBusinessFilter } from '../hooks/useBusinessFilter';
import BusinessPostcard from './business/BusinessPostcard';
import BusinessPostcardModal from './business/BusinessPostcardModal';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  categoryId?: string;
}

export default function CategoryBrowseScreen({ push, pop, categoryId = 'all' }: Props) {
  const { language, t, isRTL, selectedGovernorate } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryId);
  
  const { businesses, isLoading, loadMore, hasMore } = useBusinessFilter({
    governorateId: selectedGovernorate,
    category: selectedCategory,
    searchQuery
  });

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeCategory = CATEGORIES.find(c => c.id === selectedCategory);

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  const handleClaimClick = (business: Business) => {
    push('ClaimBusiness', { business });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={pop} className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-muted hover:text-text-primary transition-colors border border-border">
            {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">
              {activeCategory ? t(activeCategory.nameKey) : (isRTL ? 'تصفح الكل' : 'Browse All')}
            </h1>
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
              {GOVERNORATES.find(g => g.id === selectedGovernorate)?.[language === 'ar' ? 'nameAr' : language === 'ku' ? 'nameKu' : 'nameEn']}
            </span>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-text-muted hover:text-text-primary transition-colors border border-border">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Search & Categories */}
      <div className="p-6 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text"
            placeholder={t('madinaty_search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-surface border border-border rounded-2xl ps-12 pe-4 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-colors placeholder:text-text-muted"
          />
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-2 py-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-primary border-primary text-white' 
                  : 'bg-surface border-border text-text-secondary hover:bg-background'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{t(cat.nameKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex-1 px-6 pb-10">
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
              <div className="col-span-2 mt-4">
                <button 
                  onClick={loadMore}
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-surface border border-border text-primary font-bold text-sm hover:bg-background transition-colors flex items-center justify-center gap-2"
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
            <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted">
              <Store size={32} />
            </div>
            <p className="text-sm text-text-muted leading-relaxed px-10">
              {t('madinaty_no_businesses')}
            </p>
          </div>
        )}
      </div>

      <BusinessPostcardModal 
        business={selectedBusiness}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClaim={() => {
          setIsModalOpen(false);
          if (selectedBusiness) handleClaimClick(selectedBusiness);
        }}
      />
    </div>
  );
}

function ChevronDown({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
