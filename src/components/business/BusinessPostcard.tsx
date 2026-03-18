import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Phone, Star, Store } from 'lucide-react';
import { Business } from '../../types';
import { useAppState } from '../../hooks/useAppState';
import { APP_COLORS } from '../../constants';

interface Props {
  business: Business;
  onClick: () => void;
  onClaimClick: () => void;
}

const BusinessPostcard: React.FC<Props> = ({ business, onClick, onClaimClick }) => {
  const { language, t, isRTL } = useAppState();

  const name = (language === 'ar' ? business.nameAr : language === 'ku' ? business.nameKu : business.nameEn) || business.nameAr || business.nameEn;
  const categoryName = t(business.category);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col bg-[#1a1a2f] rounded-2xl overflow-hidden border border-white/5 shadow-xl relative aspect-[4/5]"
    >
      {/* Top 60%: Cover Image */}
      <div className="relative h-[60%] w-full cursor-pointer" onClick={onClick}>
        {business.coverUrl ? (
          <img src={business.coverUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Store size={40} className="text-white/20" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 inset-inline-start-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10">
          {categoryName}
        </div>

        {/* Verified Badge */}
        {business.isVerified && (
          <div className="absolute top-2 inset-inline-end-2 bg-secondary/80 backdrop-blur-md p-1 rounded-full text-white border border-white/10">
            <CheckCircle2 size={12} />
          </div>
        )}

        {/* Open/Closed Pill */}
        <div className={`absolute bottom-2 inset-inline-end-2 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${
          business.isOpen 
            ? 'bg-green-500/20 border-green-500/50 text-green-400' 
            : 'bg-red-500/20 border-red-500/50 text-red-400'
        }`}>
          {business.isOpen ? (isRTL ? 'مفتوح' : 'Open') : (isRTL ? 'مغلق' : 'Closed')}
        </div>
      </div>

      {/* Bottom 40%: Info */}
      <div className="relative h-[40%] p-3 pt-6 flex flex-col justify-between cursor-pointer" onClick={onClick}>
        {/* Logo Circle Overlapping */}
        <div className="absolute -top-6 inset-inline-start-3 w-12 h-12 rounded-full border-2 border-[#1a1a2f] bg-[#1a1a2f] overflow-hidden shadow-lg">
          {business.logoUrl ? (
            <img src={business.logoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <Store size={20} className="text-white/20" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <h5 className="text-xs font-bold truncate text-white">{name}</h5>
          <div className="flex items-center gap-1 text-[9px] text-white/40">
            <MapPin size={10} />
            <span className="truncate">{business.address || business.governorateId}</span>
          </div>
          {business.phone && (
            <div className="flex items-center gap-1 text-[9px] text-white/40">
              <Phone size={10} />
              <span>{business.phone}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <Star size={10} className="text-primary fill-primary" />
            <span className="text-[10px] font-bold text-white">{business.rating || 4.5}</span>
          </div>
          <button className="text-[10px] font-bold text-primary px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
            {isRTL ? 'عرض' : 'View'}
          </button>
        </div>
      </div>

      {/* Unclaimed Banner */}
      {business.status === 'unclaimed' && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClaimClick();
          }}
          className="absolute bottom-0 inset-inline-start-0 inset-inline-end-0 bg-amber-500/90 py-1.5 px-3 flex items-center justify-center gap-2 hover:bg-amber-500 transition-colors"
        >
          <span className="text-[9px] font-bold text-black">
            {language === 'ar' ? 'هل هذا عملك؟ اطلب ملكيته' : 
             language === 'ku' ? 'ئایا ئەمە بازرگانیەکەتە؟' : 
             'Own this business? Claim it'}
          </span>
        </button>
      )}
    </motion.div>
  );
};

export default BusinessPostcard;
