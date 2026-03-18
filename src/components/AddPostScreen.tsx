import React, { useState } from 'react';
import { Screen, Business, Governorate } from '../types';
import { APP_COLORS, TYPOGRAPHY, MOCK_BUSINESSES, GOVERNORATES } from '../constants';
import { X, Send, Camera, Video, Film, Type, Tag, MapPin, Eye, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  lang: string;
  t: any;
  isRTL: boolean;
  initialMode?: 'post' | 'story';
}

type MediaType = 'photo' | 'video' | 'reel' | 'text';

export default function AddPostScreen({ push, pop, lang, t, isRTL, initialMode = 'post' }: Props) {
  const [selectedBusiness, setSelectedBusiness] = useState<Business>(MOCK_BUSINESSES[0]);
  const [mediaType, setMediaType] = useState<MediaType>('photo');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('baghdad');
  const [showToast, setShowToast] = useState(false);
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const handleShare = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      pop();
    }, 2000);
  };

  const mediaTypes: { id: MediaType; icon: React.ReactNode; label: string }[] = [
    { id: 'photo', icon: <Camera size={18} />, label: t('photo') },
    { id: 'video', icon: <Video size={18} />, label: t('video') },
    { id: 'reel', icon: <Film size={18} />, label: t('reel') },
    { id: 'text', icon: <Type size={18} />, label: t('text') },
  ];

  const getBusinessName = (b: Business) => {
    return b[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Business] as string;
  };

  const getGovName = (id: string) => {
    const gov = GOVERNORATES.find(g => g.id === id);
    return gov?.[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Governorate] || id;
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-background z-[1000] flex flex-col overflow-y-auto"
    >
      {/* Header */}
      <div className="p-4 bg-surface flex justify-between items-center border-b border-border sticky top-0 z-10">
        <button 
          onClick={pop}
          className="flex items-center gap-1 bg-transparent border-none text-text-primary cursor-pointer text-sm font-semibold"
        >
          <X size={20} />
          {t('cancel')}
        </button>
        <h2 className="m-0 text-lg font-bold">{t('addPost')}</h2>
        <button 
          onClick={handleShare}
          className="flex items-center gap-1 bg-transparent border-none text-primary cursor-pointer text-sm font-semibold"
        >
          {t('share')}
          <Send size={18} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Business Selector */}
        <div className="relative">
          <label className="text-xs text-text-secondary mb-2 block">{t('selectBusiness')}</label>
          <div 
            onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
            className="p-3 bg-success/10 rounded-xl flex justify-between items-center cursor-pointer border border-success/40"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center text-white text-xs">
                🏢
              </div>
              <span className="font-semibold text-success">{getBusinessName(selectedBusiness)}</span>
            </div>
            <ChevronDown size={18} className="text-success" />
          </div>
          
          <AnimatePresence>
            {showBusinessDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 bg-surface rounded-xl mt-2 shadow-lg z-20 max-h-[200px] overflow-y-auto border border-border"
              >
                {MOCK_BUSINESSES.map(b => (
                  <div 
                    key={b.id}
                    onClick={() => {
                      setSelectedBusiness(b);
                      setShowBusinessDropdown(false);
                    }}
                    className="p-3 border-b border-border cursor-pointer text-sm text-text-primary last:border-b-0"
                  >
                    {getBusinessName(b)}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Media Type Selector */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {mediaTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setMediaType(type.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-none cursor-pointer whitespace-nowrap shadow-sm transition-all duration-200 ${
                mediaType === type.id ? 'bg-primary text-white' : 'bg-surface text-text-primary'
              }`}
            >
              {type.icon}
              <span className="text-[13px] font-semibold">{type.label}</span>
            </button>
          ))}
        </div>

        {/* Media Preview Area */}
        <div 
          className="w-full bg-black rounded-2xl flex flex-col items-center justify-center text-white/50 relative overflow-hidden"
          style={{
            aspectRatio: mediaType === 'reel' ? '9/16' : '4/3',
            maxHeight: mediaType === 'reel' ? 400 : 'auto'
          }}
        >
          {mediaType === 'text' ? (
            <div className="p-10 text-center">
              <Type size={48} className="mb-4 mx-auto" />
              <p className="text-sm">{t('writeText')}</p>
            </div>
          ) : (
            <>
              <img 
                src={`https://picsum.photos/seed/${mediaType}/800/1200`} 
                alt="Preview" 
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute flex flex-col items-center gap-2.5">
                {mediaType === 'photo' && <Camera size={48} />}
                {mediaType === 'video' && <Video size={48} />}
                {mediaType === 'reel' && <Film size={48} />}
                <p className="text-sm font-semibold text-white">{t('tapToChangeMedia')}</p>
              </div>
            </>
          )}
        </div>

        {/* Caption */}
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
            ✍️
          </div>
          <textarea
            placeholder={t('writeCaption')}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="flex-1 min-h-[100px] bg-transparent border-none outline-none text-base text-text-primary resize-none"
            style={{
              fontFamily: isRTL ? "'Noto Naskh Arabic', sans-serif" : "'Inter', sans-serif",
              direction: isRTL ? 'rtl' : 'ltr'
            }}
          />
        </div>

        <div className="h-px bg-border" />

        {/* Tags */}
        <div className="flex items-center gap-3">
          <Tag size={20} className="text-text-secondary shrink-0" />
          <input 
            type="text"
            placeholder={t('addTags')}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary"
            style={{
              fontFamily: isRTL ? "'Noto Naskh Arabic', sans-serif" : "'Inter', sans-serif"
            }}
          />
        </div>

        {/* Location */}
        <div className="relative">
          <div 
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <MapPin size={20} className="text-text-secondary shrink-0" />
            <div className="flex-1 flex justify-between items-center">
              <span className="text-sm text-text-primary">
                {t('location')}: {getGovName(location)}
              </span>
              <ChevronDown size={16} className="text-text-secondary" />
            </div>
          </div>
          
          <AnimatePresence>
            {showLocationDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 bg-surface rounded-xl mt-2 shadow-lg z-20 max-h-[200px] overflow-y-auto border border-border"
              >
                {GOVERNORATES.map(g => (
                  <div 
                    key={g.id}
                    onClick={() => {
                      setLocation(g.id);
                      setShowLocationDropdown(false);
                    }}
                    className="p-3 border-b border-border cursor-pointer text-sm text-text-primary last:border-b-0"
                  >
                    {getGovName(g.id)}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-2.5">
          <button className="flex-1 p-4 rounded-xl border border-border bg-surface text-text-primary flex items-center justify-center gap-2 font-semibold cursor-pointer">
            <Eye size={20} />
            {t('preview')}
          </button>
          <button 
            onClick={handleShare}
            className="flex-[2] p-4 rounded-xl border-none bg-primary text-white flex items-center justify-center gap-2 font-semibold cursor-pointer"
          >
            {t('shareNow')}
          </button>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-text-primary text-white px-6 py-3 rounded-full flex items-center gap-2.5 z-[2000] shadow-xl"
          >
            <CheckCircle2 size={20} className="text-success" />
            <span className="font-semibold">{t('postShared')} ✓</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
