import React, { useState, useEffect } from 'react';
import { Screen, Business } from '../types';
import { APP_COLORS, TYPOGRAPHY, MOCK_BUSINESSES, CATEGORIES } from '../constants';
import { ChevronDown, MapPin, Star, Filter, ChevronRight } from 'lucide-react';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  categoryId?: string;
}

export default function CategoryBrowseScreen({ push, pop, categoryId = 'all' }: Props) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const PAGE_SIZE = 6;

  const translateCategory = (key: string) => {
    const translations: Record<string, string> = {
      all: 'الكل',
      cafes: 'مقاهي',
      restaurants: 'مطاعم',
      gyms: 'نوادي رياضية',
      salons: 'صالونات',
      malls: 'مولات',
      coworking: 'مساحات عمل',
      entertainment: 'ترفيه',
      hotels: 'فنادق',
      medical: 'طبي',
      fashion: 'أزياء',
      electronics: 'إلكترونيات',
      home: 'أثاث',
      automotive: 'سيارات',
      education: 'تعليم',
      services: 'خدمات',
      realestate: 'عقارات',
      travel: 'سفر',
      burger: 'برجر',
      iraqi: 'عراقي',
      cafe: 'كافيه',
      specialty: 'مختص',
      pizza: 'بيتزا',
    };
    return translations[key] || key;
  };

  const activeCategory = CATEGORIES.find(c => c.id === categoryId);

  // Filter businesses
  let filteredBusinesses = MOCK_BUSINESSES;
  if (categoryId !== 'all') {
    filteredBusinesses = filteredBusinesses.filter(b => b.category === categoryId);
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
    <div style={{ backgroundColor: APP_COLORS.BACKGROUND, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '40px 20px 15px',
        backgroundColor: APP_COLORS.SURFACE,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: `1px solid ${APP_COLORS.BORDER}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div 
            onClick={pop}
            style={{ 
              padding: 8, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: APP_COLORS.BACKGROUND,
              borderRadius: '50%'
            }}
          >
            <ChevronRight size={24} color={APP_COLORS.TEXT_PRIMARY} />
          </div>
          <h1 style={{ ...TYPOGRAPHY.headline, fontSize: 20, margin: 0 }}>
            {activeCategory ? `${activeCategory.icon} ${translateCategory(activeCategory.nameKey)}` : 'تصفح الكل'}
          </h1>
        </div>
        <div style={{ 
          padding: 8, 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: APP_COLORS.BACKGROUND,
          borderRadius: '50%'
        }}>
          <Filter size={20} color={APP_COLORS.TEXT_PRIMARY} />
        </div>
      </div>

      {/* Subcategories */}
      {activeCategory && activeCategory.subcategories && activeCategory.subcategories.length > 0 && (
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          padding: '15px 20px',
          gap: 10,
          backgroundColor: APP_COLORS.SURFACE,
          borderBottom: `1px solid ${APP_COLORS.BORDER}`,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <div
            onClick={() => {
              setSelectedSubcategory(null);
              setPage(1);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              backgroundColor: selectedSubcategory === null ? APP_COLORS.PRIMARY : APP_COLORS.SURFACE,
              border: `1px solid ${selectedSubcategory === null ? APP_COLORS.PRIMARY : APP_COLORS.BORDER}`,
              borderRadius: 20,
              color: selectedSubcategory === null ? 'white' : APP_COLORS.TEXT_PRIMARY,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: 13, fontWeight: selectedSubcategory === null ? 600 : 400 }}>الكل</span>
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
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: 14 }}>{sub.icon}</span>
                <span style={{ fontSize: 13, fontWeight: isSelected ? 600 : 400 }}>
                  {translateCategory(sub.nameKey)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Grid */}
      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {visibleBusinesses.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            {visibleBusinesses.map(business => (
              <div 
                key={business.id}
                onClick={() => push('BusinessDetail', { business })}
                style={{
                  backgroundColor: APP_COLORS.SURFACE,
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: APP_COLORS.SHADOW,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '1/1' }}>
                  <img src={business.coverImage || business.image} alt={business.nameAr || business.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {business.isPremium && (
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
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
                  {business.status && (
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: APP_COLORS.SUCCESS,
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: 8,
                      fontSize: 10,
                      fontWeight: 'bold'
                    }}>
                      {business.status}
                    </div>
                  )}
                </div>
                <div style={{ padding: 12, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ ...TYPOGRAPHY.headline, margin: '0 0 4px 0', fontSize: 14, lineHeight: 1.3 }}>
                    {business.nameAr || business.name}
                  </h3>
                  <p style={{ ...TYPOGRAPHY.body, margin: '0 0 8px 0', fontSize: 12, color: APP_COLORS.TEXT_SECONDARY, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {translateCategory(CATEGORIES.find(c => c.id === business.category)?.nameKey || business.category)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                    <Star size={14} color={APP_COLORS.PREMIUM_GOLD} fill={APP_COLORS.PREMIUM_GOLD} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{business.rating}</span>
                    <span style={{ fontSize: 12, color: APP_COLORS.TEXT_MUTED }}>({business.reviewCount || business.reviews})</span>
                  </div>
                  <div style={{ marginTop: 'auto', color: APP_COLORS.PRIMARY, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    عرض التفاصيل <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: APP_COLORS.TEXT_MUTED, padding: '40px 0' }}>
            لا توجد أعمال في هذه الفئة حالياً
          </div>
        )}

        {hasMore && (
          <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              style={{
                padding: '12px 24px',
                backgroundColor: APP_COLORS.SURFACE,
                color: APP_COLORS.PRIMARY,
                border: `1px solid ${APP_COLORS.PRIMARY}`,
                borderRadius: 24,
                ...TYPOGRAPHY.headline,
                fontSize: 14,
                cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                opacity: isLoadingMore ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: 200
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
              ) : 'عرض المزيد ↓'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
