import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Phone, MapPin, Star, CheckCircle2, 
  Share2, MessageCircle, Info, Store, Tag, 
  ChevronRight, ExternalLink
} from 'lucide-react';
import { Business } from '../../types';
import { useAppState } from '../../hooks/useAppState';
import { APP_COLORS } from '../../constants';

interface Props {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  onViewProfile?: () => void;
}

export default function BusinessPostcardModal({ business, isOpen, onClose, onClaim, onViewProfile }: Props) {
  const { language, t, isRTL } = useAppState();

  if (!business) return null;

  const name = language === 'ar' ? business.nameAr : language === 'ku' ? business.nameKu : business.nameEn;
  const description = language === 'ar' ? business.descriptionAr : language === 'ku' ? business.descriptionKu : business.descriptionEn;
  const categoryName = t(business.category);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#0a0a0f] rounded-t-[32px] z-[101] max-h-[90vh] overflow-hidden flex flex-col border-t border-white/10"
          >
            {/* Drag Handle */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-3" />

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
              {/* Cover Header */}
              <div className="relative h-[200px] w-full">
                {business.coverUrl ? (
                  <img src={business.coverUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Store size={60} className="text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                
                {/* Logo Overlap */}
                <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl border-4 border-[#0a0a0f] bg-[#1a1a2f] overflow-hidden shadow-2xl">
                  {business.logoUrl ? (
                    <img src={business.logoUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <Store size={32} className="text-white/20" />
                    </div>
                  )}
                </div>
              </div>

              {/* Body Content */}
              <div className="px-6 pt-14 flex flex-col gap-6">
                {/* Header Info */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">{name}</h2>
                    {business.isVerified && <CheckCircle2 size={20} className="text-secondary" />}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-primary fill-primary" />
                      <span className="font-bold text-white">{business.rating || 4.5}</span>
                      <span>({business.reviewCount || 0} reviews)</span>
                    </div>
                    <span>•</span>
                    <span className="text-primary font-bold">{business.priceRange}</span>
                  </div>
                </div>

                {/* Disclaimer Notice */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex gap-3">
                  <Info size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    {language === 'ar' ? 'تنبيه: المعلومات المعروضة مجمّعة من مصادر عامة وقد لا تكون محدّثة. تحقق مباشرة من العمل التجاري.' : 
                     language === 'ku' ? 'ئاگاداری: زانیاریەکانی پیشاندراو لە سەرچاوە گشتییەکان کۆکراوەتەوە و لەوانەیە نوێ نەبێت.' : 
                     'Notice: Business information is collected from public sources and may not be current. Verify directly with the business.'}
                  </p>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-white/40 uppercase tracking-wider">
                    {isRTL ? 'عن العمل' : 'About'}
                  </h4>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Contact & Location */}
                <div className="flex flex-col gap-3">
                  {business.phone && (
                    <a 
                      href={`tel:${business.phone}`}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <Phone size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-white/40">{isRTL ? 'رقم الهاتف' : 'Phone'}</span>
                          <span className="text-sm font-bold text-white">{business.phone}</span>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-white/20" />
                    </a>
                  )}

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                        <MapPin size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/40">{isRTL ? 'العنوان' : 'Address'}</span>
                        <span className="text-sm font-bold text-white">{business.address || business.governorateId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold text-white/60">
                    <Tag size={12} />
                    {categoryName}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold text-white/60">
                    <MapPin size={12} />
                    {business.governorateId.charAt(0).toUpperCase() + business.governorateId.slice(1)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-4">
                  {business.status === 'unclaimed' ? (
                    <button 
                      onClick={onClaim}
                      className="w-full py-4 bg-amber-500 rounded-2xl text-black font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      {language === 'ar' ? 'اطلب ملكية هذا العمل' : 
                       language === 'ku' ? 'داوای خاوەندارێتی ئەم کارە بکە' : 
                       'Claim This Business'}
                    </button>
                  ) : (
                    business.ownerId && (
                      <button className="w-full py-4 bg-primary rounded-2xl text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <MessageCircle size={18} />
                        {isRTL ? 'مراسلة صاحب العمل' : 'Message Owner'}
                      </button>
                    )
                  )}

                  <button 
                    onClick={onViewProfile}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Store size={18} />
                    {isRTL ? 'عرض الملف الكامل' : 'View Full Profile'}
                  </button>

                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Share2 size={18} />
                    {isRTL ? 'مشاركة' : 'Share'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
