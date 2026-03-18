import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen, Business } from '../types';
import { APP_COLORS, TYPOGRAPHY, CATEGORIES } from '../constants';
import { ChevronRight, ChevronLeft, Star, MapPin, Phone, Clock, Share2, Heart, MessageCircle, Navigation, Globe, Tag } from 'lucide-react';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  business?: Business;
  t: any;
  isRTL: boolean;
}

export default function BusinessDetailScreen({ push, pop, business, t, isRTL }: Props) {
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'photos' | 'map'>('about');

  if (!business) return (
    <div 
      onClick={pop} 
      style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: APP_COLORS.BACKGROUND,
        color: APP_COLORS.TEXT_PRIMARY
      }}
    >
      {t.noData}
    </div>
  );

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: isRTL ? (business.nameAr || business.name) : business.name,
          text: `Check out ${isRTL ? (business.nameAr || business.name) : business.name} on Iraq Compass!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Using a simple toast-like alert for now
        console.log('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            size={14} 
            fill={star <= rating ? APP_COLORS.PREMIUM_GOLD : 'transparent'} 
            color={star <= rating ? APP_COLORS.PREMIUM_GOLD : APP_COLORS.BORDER} 
          />
        ))}
      </div>
    );
  };

  const categoryName = CATEGORIES.find(c => c.id === business.category)?.nameKey || business.category;

  return (
    <motion.div 
      initial={{ x: isRTL ? '-100%' : '100%' }}
      animate={{ x: 0 }}
      exit={{ x: isRTL ? '-100%' : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ 
        backgroundColor: APP_COLORS.BACKGROUND, 
        minHeight: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        overflowY: 'auto',
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      {/* Header Image */}
      <div style={{ position: 'relative', height: 240, flexShrink: 0 }}>
        <img 
          src={business.coverImage || business.image} 
          alt={business.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        
        {/* Top Bar */}
        <div style={{
          position: 'absolute',
          top: 40,
          left: 20,
          right: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={pop}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            {isRTL ? <ChevronRight size={24} color={APP_COLORS.TEXT_PRIMARY} /> : <ChevronLeft size={24} color={APP_COLORS.TEXT_PRIMARY} />}
          </motion.div>
          <div style={{ display: 'flex', gap: 10 }}>
            <motion.div 
              whileTap={{ scale: 1.3 }}
              onClick={() => setLiked(!liked)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Heart 
                size={20} 
                fill={liked ? APP_COLORS.LIVE_RED : 'transparent'} 
                color={liked ? APP_COLORS.LIVE_RED : APP_COLORS.TEXT_PRIMARY} 
              />
            </motion.div>
            <motion.div 
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Share2 size={20} color={APP_COLORS.TEXT_PRIMARY} />
            </motion.div>
          </div>
        </div>

        {business.isPremium && (
          <div style={{
            position: 'absolute',
            bottom: 32,
            [isRTL ? 'left' : 'right']: 20,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: APP_COLORS.PREMIUM_GOLD,
            padding: '6px 12px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backdropFilter: 'blur(4px)'
          }}>
            <Star size={12} fill={APP_COLORS.PREMIUM_GOLD} /> {t.premium}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{
        backgroundColor: APP_COLORS.SURFACE,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -24,
        position: 'relative',
        padding: '24px 20px 0',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: 16, textAlign: isRTL ? 'right' : 'left' }}>
          <h1 style={{ ...TYPOGRAPHY.headline, margin: '0 0 4px 0', fontSize: 24, color: APP_COLORS.TEXT_PRIMARY }}>
            {isRTL ? (business.nameAr || business.name) : business.name}
          </h1>
          {(business.nameAr || business.nameKu) && (
            <p style={{ ...TYPOGRAPHY.body, margin: 0, color: APP_COLORS.TEXT_SECONDARY, fontSize: 16 }}>
              {isRTL ? business.name : (business.nameAr || business.nameKu)}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            color: APP_COLORS.TEXT_SECONDARY, 
            fontSize: 14
          }}>
            <Star size={16} color={APP_COLORS.PREMIUM_GOLD} fill={APP_COLORS.PREMIUM_GOLD} />
            <span style={{ fontWeight: 600, color: APP_COLORS.TEXT_PRIMARY }}>{business.rating}</span>
            <span>({business.reviewCount || business.reviews} {t.reviewsCount})</span>
            <span>•</span>
            <MapPin size={14} />
            <span>{business.city}, {business.governorate || 'Baghdad'}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            color: APP_COLORS.TEXT_SECONDARY, 
            fontSize: 14
          }}>
            <Clock size={14} color={business.isOpen !== false ? APP_COLORS.SUCCESS : APP_COLORS.LIVE_RED} />
            <span style={{ color: business.isOpen !== false ? APP_COLORS.SUCCESS : APP_COLORS.LIVE_RED, fontWeight: 600 }}>
              {business.isOpen !== false ? t.openNow : t.closed}
            </span>
            {business.openHours && (
              <>
                <span>•</span>
                <span>{business.openHours}</span>
              </>
            )}
            {business.priceRange && (
              <>
                <span>•</span>
                <span style={{ fontWeight: 600 }}>{'💰'.repeat(business.priceRange)}</span>
              </>
            )}
          </div>
        </div>

        {/* Inner Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: `1px solid ${APP_COLORS.BORDER}`,
          marginBottom: 20,
          gap: 24
        }}>
          {[
            { id: 'about', label: t.about },
            { id: 'reviews', label: t.reviews },
            { id: 'photos', label: t.photos },
            { id: 'map', label: t.map }
          ].map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                paddingBottom: 12,
                cursor: 'pointer',
                color: activeTab === tab.id ? APP_COLORS.PRIMARY : APP_COLORS.TEXT_SECONDARY,
                fontWeight: activeTab === tab.id ? 600 : 400,
                borderBottom: `2px solid ${activeTab === tab.id ? APP_COLORS.PRIMARY : 'transparent'}`,
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, paddingBottom: 100 }}>
          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <InfoRow 
                  icon={<Phone size={18} />} 
                  text={business.phone || '+964 770 111 2233'} 
                  dir="ltr" 
                  action={t.call} 
                  isRTL={isRTL}
                />
                <InfoRow 
                  icon={<Globe size={18} />} 
                  text="www.example.com" 
                  dir="ltr" 
                  action={t.visitWebsite} 
                  isRTL={isRTL}
                />
              </div>
              
              {business.tags && business.tags.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ color: APP_COLORS.TEXT_SECONDARY, marginTop: 2 }}><Tag size={18} /></div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {business.tags.map(tag => (
                      <span key={tag} style={{ 
                        backgroundColor: `${APP_COLORS.PRIMARY}15`, 
                        color: APP_COLORS.PRIMARY, 
                        padding: '4px 10px', 
                        borderRadius: 12, 
                        fontSize: 12,
                        fontWeight: 500
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                <h3 style={{ ...TYPOGRAPHY.headline, fontSize: 16, marginBottom: 8, color: APP_COLORS.TEXT_PRIMARY }}>{t.description}</h3>
                <p style={{ ...TYPOGRAPHY.body, fontSize: 15, lineHeight: 1.6, color: APP_COLORS.TEXT_PRIMARY }}>
                  {isRTL ? (business.descriptionAr || business.description) : business.description}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 'bold', color: APP_COLORS.TEXT_PRIMARY }}>{business.rating}</div>
                  {renderStars(Math.round(business.rating))}
                  <div style={{ fontSize: 12, color: APP_COLORS.TEXT_SECONDARY, marginTop: 4 }}>{business.reviewCount || business.reviews} {t.reviewsCount}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: APP_COLORS.TEXT_SECONDARY, width: 10 }}>{star}</span>
                      <div style={{ flex: 1, height: 6, backgroundColor: APP_COLORS.BORDER, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          backgroundColor: APP_COLORS.PREMIUM_GOLD, 
                          width: star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '5%' : '2%' 
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: 14,
                  backgroundColor: 'transparent',
                  border: `1px solid ${APP_COLORS.PRIMARY}`,
                  color: APP_COLORS.PRIMARY,
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer'
                }}
              >
                {t.writeReview}
              </motion.button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { id: 1, name: 'Ahmed Ali', avatar: 'https://i.pravatar.cc/150?u=1', rating: 5, text: 'Amazing place! The atmosphere is great and the service is excellent.', time: '2 days ago' },
                  { id: 2, name: 'Sara M.', avatar: 'https://i.pravatar.cc/150?u=2', rating: 4, text: 'Really good food, but it was a bit crowded when we visited.', time: '1 week ago' },
                  { id: 3, name: 'Mohammed K.', avatar: 'https://i.pravatar.cc/150?u=3', rating: 5, text: 'Best coffee in Baghdad. Highly recommended!', time: '2 weeks ago' },
                ].map(review => (
                  <div key={review.id} style={{ display: 'flex', gap: 12 }}>
                    <img src={review.avatar} alt={review.name} style={{ width: 40, height: 40, borderRadius: 20 }} />
                    <div style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: APP_COLORS.TEXT_PRIMARY }}>{review.name}</span>
                        <span style={{ fontSize: 12, color: APP_COLORS.TEXT_SECONDARY }}>{review.time}</span>
                      </div>
                      <div style={{ marginBottom: 8 }}>{renderStars(review.rating)}</div>
                      <p style={{ margin: 0, fontSize: 14, color: APP_COLORS.TEXT_PRIMARY, lineHeight: 1.5 }}>{review.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05 }}
                  style={{ aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden' }}
                >
                  <img 
                    src={`https://picsum.photos/seed/${business.id}-photo-${i}/200/200`} 
                    alt={`Photo ${i}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'map' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ width: '100%', height: 200, borderRadius: 16, overflow: 'hidden', backgroundColor: APP_COLORS.BORDER }}>
                <img 
                  src={`https://picsum.photos/seed/${business.id}-map/800/400`} 
                  alt="Map" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <MapPin size={20} color={APP_COLORS.PRIMARY} style={{ marginTop: 2 }} />
                <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: APP_COLORS.TEXT_PRIMARY }}>{business.address}</div>
                  <div style={{ color: APP_COLORS.TEXT_SECONDARY, fontSize: 14 }}>{business.city}, {business.governorate || 'Baghdad'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: APP_COLORS.SURFACE,
        padding: '16px 20px',
        borderTop: `1px solid ${APP_COLORS.BORDER}`,
        display: 'flex',
        gap: 12,
        zIndex: 20,
        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
      }}>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          style={{
            flex: 1,
            padding: '14px',
            backgroundColor: APP_COLORS.PRIMARY,
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Phone size={18} /> {t.callNow}
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          style={{
            flex: 1,
            padding: '14px',
            backgroundColor: '#25D366', // WhatsApp Green
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8
          }}
        >
          <MessageCircle size={18} /> {t.whatsapp}
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          style={{
            flex: 1,
            padding: '14px',
            backgroundColor: `${APP_COLORS.SECONDARY}15`,
            color: APP_COLORS.SECONDARY,
            border: 'none',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Navigation size={18} /> {t.directions}
        </motion.button>
      </div>
    </motion.div>
  );
}

function InfoRow({ icon, text, color = APP_COLORS.TEXT_PRIMARY, dir = 'ltr', action, isRTL }: any) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ color: APP_COLORS.TEXT_SECONDARY }}>{icon}</div>
        <span style={{ ...TYPOGRAPHY.body, fontSize: 15, color, direction: dir as any }}>{text}</span>
      </div>
      {action && (
        <span style={{ color: APP_COLORS.PRIMARY, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          {action}
        </span>
      )}
    </div>
  );
}
