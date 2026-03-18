import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen, Business, Governorate } from '../types';
import { CATEGORIES, GOVERNORATES } from '../constants';
import { ChevronRight, ChevronLeft, Star, MapPin, Phone, Clock, Share2, Heart, MessageCircle, Navigation, Globe, Tag } from 'lucide-react';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  business?: Business;
  lang: string;
  t: any;
  isRTL: boolean;
}

export default function BusinessDetailScreen({ push, pop, business, lang, t, isRTL }: Props) {
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'photos' | 'map'>('about');

  useEffect(() => {
    if (business?.status === 'approved') {
      push('BusinessMiniSite', { businessId: business.id });
    }
  }, [business, push]);

  if (!business) return (
    <div 
      onClick={pop} 
      className="h-full flex items-center justify-center bg-background text-text-primary cursor-pointer"
    >
      {t.noData}
    </div>
  );

  const name = business[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Business] as string;
  const description = business[`description${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Business] as string;
  const govName = GOVERNORATES.find(g => g.id === business.governorateId)?.[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Governorate] || business.governorateId;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: name,
          text: `Check out ${name} on Iraq Compass!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        console.log('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            size={14} 
            className={star <= rating ? "fill-amber-500 text-amber-500" : "fill-transparent text-border"} 
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
      className="absolute inset-0 z-[100] flex flex-col bg-background overflow-y-auto"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header Image */}
      <div className="relative h-60 shrink-0">
        <img 
          src={business.coverUrl} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
        
        {/* Top Bar */}
        <div className="absolute top-10 left-5 right-5 flex justify-between items-center z-10">
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={pop}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex justify-center items-center cursor-pointer"
          >
            {isRTL ? <ChevronRight size={24} className="text-text-primary" /> : <ChevronLeft size={24} className="text-text-primary" />}
          </motion.div>
          <div className="flex gap-2.5">
            <motion.div 
              whileTap={{ scale: 1.3 }}
              onClick={() => setLiked(!liked)}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex justify-center items-center cursor-pointer"
            >
              <Heart 
                size={20} 
                className={liked ? "fill-red-500 text-red-500" : "fill-transparent text-text-primary"} 
              />
            </motion.div>
            <motion.div 
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex justify-center items-center cursor-pointer"
            >
              <Share2 size={20} className="text-text-primary" />
            </motion.div>
          </div>
        </div>

        {business.isPremium && (
          <div className={`absolute bottom-8 ${isRTL ? 'left-5' : 'right-5'} bg-black/70 text-amber-500 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm`}>
            <Star size={12} className="fill-amber-500" /> {t.premium}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="bg-surface rounded-t-3xl -mt-6 relative px-5 pt-6 flex-1 flex flex-col">
        <div className={`mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="font-bold text-2xl m-0 mb-1 text-text-primary">
            {name}
          </h1>
          <p className="m-0 text-text-secondary text-base">
            {govName}
          </p>
        </div>

        <div className="flex flex-col gap-2 mb-5">
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Star size={16} className="text-amber-500 fill-amber-500" />
            <span className="font-semibold text-text-primary">{business.rating || 4.8}</span>
            <span>({business.reviewCount || 247} {t.reviewsCount})</span>
            <span>•</span>
            <MapPin size={14} />
            <span>{govName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Clock size={14} className={business.isOpen !== false ? "text-emerald-500" : "text-red-500"} />
            <span className={`font-semibold ${business.isOpen !== false ? "text-emerald-500" : "text-red-500"}`}>
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
                <span className="font-semibold">{business.priceRange}</span>
              </>
            )}
          </div>
        </div>

        {/* Inner Tabs */}
        <div className="flex border-b border-border mb-5 gap-6">
          {[
            { id: 'about', label: t.about },
            { id: 'reviews', label: t.reviews },
            { id: 'photos', label: t.photos },
            { id: 'map', label: t.map }
          ].map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 cursor-pointer transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'text-primary font-semibold border-primary' 
                  : 'text-text-secondary font-normal border-transparent'
              }`}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 pb-24">
          {activeTab === 'about' && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
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
                <div className="flex items-start gap-3">
                  <div className="text-text-secondary mt-0.5"><Tag size={18} /></div>
                  <div className="flex flex-wrap gap-2">
                    {business.tags.map(tag => (
                      <span key={tag} className="bg-primary/10 text-primary px-2.5 py-1 rounded-xl text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="font-bold text-base mb-2 text-text-primary">{t.description}</h3>
                <p className="text-[15px] leading-relaxed text-text-primary">
                  {description}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div className="text-center">
                  <div className="text-4xl font-bold text-text-primary">{business.rating || 4.8}</div>
                  {renderStars(Math.round(business.rating || 4.8))}
                  <div className="text-xs text-text-secondary mt-1">{business.reviewCount || 247} {t.reviewsCount}</div>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-text-secondary w-2.5">{star}</span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className={`h-full bg-amber-500 ${
                          star === 5 ? 'w-[70%]' : star === 4 ? 'w-[20%]' : star === 3 ? 'w-[5%]' : 'w-[2%]'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                className="w-full p-3.5 bg-transparent border border-primary text-primary rounded-xl font-semibold text-[15px] cursor-pointer"
              >
                {t.writeReview}
              </motion.button>

              <div className="flex flex-col gap-5">
                {[
                  { id: 1, name: 'Ahmed Ali', avatar: 'https://i.pravatar.cc/150?u=1', rating: 5, text: 'Amazing place! The atmosphere is great and the service is excellent.', time: '2 days ago' },
                  { id: 2, name: 'Sara M.', avatar: 'https://i.pravatar.cc/150?u=2', rating: 4, text: 'Really good food, but it was a bit crowded when we visited.', time: '1 week ago' },
                  { id: 3, name: 'Mohammed K.', avatar: 'https://i.pravatar.cc/150?u=3', rating: 5, text: 'Best coffee in Baghdad. Highly recommended!', time: '2 weeks ago' },
                ].map(review => (
                  <div key={review.id} className="flex gap-3">
                    <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full" />
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-text-primary">{review.name}</span>
                        <span className="text-xs text-text-secondary">{review.time}</span>
                      </div>
                      <div className="mb-2">{renderStars(review.rating)}</div>
                      <p className="m-0 text-sm text-text-primary leading-relaxed">{review.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square rounded-lg overflow-hidden"
                >
                  <img 
                    src={`https://picsum.photos/seed/${business.id}-photo-${i}/200/200`} 
                    alt={`Photo ${i}`} 
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'map' && (
            <div className="flex flex-col gap-4">
              <div className="w-full h-50 rounded-2xl overflow-hidden bg-border">
                <img 
                  src={`https://picsum.photos/seed/${business.id}-map/800/400`} 
                  alt="Map" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-primary mt-0.5" />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <div className="font-semibold text-[15px] mb-1 text-text-primary">{business.address}</div>
                  <div className="text-text-secondary text-sm">{govName}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-surface px-5 py-4 border-t border-border flex gap-3 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="flex-1 p-3.5 bg-primary text-white border-none rounded-xl font-semibold text-[15px] cursor-pointer flex justify-center items-center gap-2"
        >
          <Phone size={18} /> {t.callNow}
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="flex-1 p-3.5 bg-[#25D366] text-white border-none rounded-xl font-semibold text-[15px] cursor-pointer flex justify-center items-center gap-2"
        >
          <MessageCircle size={18} /> {t.whatsapp}
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="flex-1 p-3.5 bg-secondary/15 text-secondary border-none rounded-xl font-semibold text-[15px] cursor-pointer flex justify-center items-center gap-2"
        >
          <Navigation size={18} /> {t.directions}
        </motion.button>
      </div>
    </motion.div>
  );
}

function InfoRow({ icon, text, dir = 'ltr', action, isRTL }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-text-secondary">{icon}</div>
        <span className="text-[15px] text-text-primary" dir={dir}>{text}</span>
      </div>
      {action && (
        <span className="text-primary text-sm font-semibold cursor-pointer">
          {action}
        </span>
      )}
    </div>
  );
}
