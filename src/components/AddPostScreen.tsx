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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: APP_COLORS.BACKGROUND,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        backgroundColor: APP_COLORS.SURFACE,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${APP_COLORS.BORDER}`,
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button 
          onClick={pop}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4, 
            background: 'none', 
            border: 'none', 
            color: APP_COLORS.TEXT_PRIMARY,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          <X size={20} />
          {t('cancel')}
        </button>
        <h2 style={{ ...TYPOGRAPHY.headline, margin: 0, fontSize: 18 }}>{t('addPost')}</h2>
        <button 
          onClick={handleShare}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4, 
            background: 'none', 
            border: 'none', 
            color: APP_COLORS.PRIMARY,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          {t('share')}
          <Send size={18} />
        </button>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Business Selector */}
        <div style={{ position: 'relative' }}>
          <label style={{ fontSize: 12, color: APP_COLORS.TEXT_SECONDARY, marginBottom: 8, display: 'block' }}>{t('selectBusiness')}</label>
          <div 
            onClick={() => setShowBusinessDropdown(!showBusinessDropdown)}
            style={{
              padding: '12px 16px',
              backgroundColor: `${APP_COLORS.SUCCESS}15`,
              borderRadius: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              border: `1px solid ${APP_COLORS.SUCCESS}40`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: APP_COLORS.SUCCESS, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>
                🏢
              </div>
              <span style={{ fontWeight: 600, color: APP_COLORS.SUCCESS }}>{getBusinessName(selectedBusiness)}</span>
            </div>
            <ChevronDown size={18} color={APP_COLORS.SUCCESS} />
          </div>
          
          <AnimatePresence>
            {showBusinessDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: APP_COLORS.SURFACE,
                  borderRadius: 12,
                  marginTop: 8,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 20,
                  maxHeight: 200,
                  overflowY: 'auto',
                  border: `1px solid ${APP_COLORS.BORDER}`
                }}
              >
                {MOCK_BUSINESSES.map(b => (
                  <div 
                    key={b.id}
                    onClick={() => {
                      setSelectedBusiness(b);
                      setShowBusinessDropdown(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      borderBottom: `1px solid ${APP_COLORS.BORDER}`,
                      cursor: 'pointer',
                      fontSize: 14,
                      color: APP_COLORS.TEXT_PRIMARY
                    }}
                  >
                    {getBusinessName(b)}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Media Type Selector */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 5 }} className="no-scrollbar">
          {mediaTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setMediaType(type.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 25,
                border: 'none',
                backgroundColor: mediaType === type.id ? APP_COLORS.PRIMARY : APP_COLORS.SURFACE,
                color: mediaType === type.id ? 'white' : APP_COLORS.TEXT_PRIMARY,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: APP_COLORS.SHADOW,
                transition: 'all 0.2s'
              }}
            >
              {type.icon}
              <span style={{ fontSize: 13, fontWeight: 600 }}>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Media Preview Area */}
        <div style={{
          width: '100%',
          aspectRatio: mediaType === 'reel' ? '9/16' : '4/3',
          backgroundColor: '#000',
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.5)',
          position: 'relative',
          overflow: 'hidden',
          maxHeight: mediaType === 'reel' ? 400 : 'auto'
        }}>
          {mediaType === 'text' ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <Type size={48} style={{ marginBottom: 15 }} />
              <p style={{ fontSize: 14 }}>{t('writeText')}</p>
            </div>
          ) : (
            <>
              <img 
                src={`https://picsum.photos/seed/${mediaType}/800/1200`} 
                alt="Preview" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} 
              />
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                {mediaType === 'photo' && <Camera size={48} />}
                {mediaType === 'video' && <Video size={48} />}
                {mediaType === 'reel' && <Film size={48} />}
                <p style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{t('tapToChangeMedia')}</p>
              </div>
            </>
          )}
        </div>

        {/* Caption */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: APP_COLORS.PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            ✍️
          </div>
          <textarea
            placeholder={t('writeCaption')}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{
              flex: 1,
              minHeight: 100,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 16,
              color: APP_COLORS.TEXT_PRIMARY,
              resize: 'none',
              fontFamily: isRTL ? "'Noto Naskh Arabic', sans-serif" : "'Inter', sans-serif",
              direction: isRTL ? 'rtl' : 'ltr'
            }}
          />
        </div>

        <div style={{ height: 1, backgroundColor: APP_COLORS.BORDER }} />

        {/* Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Tag size={20} color={APP_COLORS.TEXT_SECONDARY} />
          <input 
            type="text"
            placeholder={t('addTags')}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 14,
              color: APP_COLORS.TEXT_PRIMARY,
              fontFamily: isRTL ? "'Noto Naskh Arabic', sans-serif" : "'Inter', sans-serif"
            }}
          />
        </div>

        {/* Location */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          >
            <MapPin size={20} color={APP_COLORS.TEXT_SECONDARY} />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: APP_COLORS.TEXT_PRIMARY }}>
                {t('location')}: {getGovName(location)}
              </span>
              <ChevronDown size={16} color={APP_COLORS.TEXT_SECONDARY} />
            </div>
          </div>
          
          <AnimatePresence>
            {showLocationDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: APP_COLORS.SURFACE,
                  borderRadius: 12,
                  marginTop: 8,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 20,
                  maxHeight: 200,
                  overflowY: 'auto',
                  border: `1px solid ${APP_COLORS.BORDER}`
                }}
              >
                {GOVERNORATES.map(g => (
                  <div 
                    key={g.id}
                    onClick={() => {
                      setLocation(g.id);
                      setShowLocationDropdown(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      borderBottom: `1px solid ${APP_COLORS.BORDER}`,
                      cursor: 'pointer',
                      fontSize: 14,
                      color: APP_COLORS.TEXT_PRIMARY
                    }}
                  >
                    {getGovName(g.id)}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
          <button style={{
            flex: 1,
            padding: '15px',
            borderRadius: 12,
            border: `1px solid ${APP_COLORS.BORDER}`,
            backgroundColor: APP_COLORS.SURFACE,
            color: APP_COLORS.TEXT_PRIMARY,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            <Eye size={20} />
            {t('preview')}
          </button>
          <button 
            onClick={handleShare}
            style={{
              flex: 2,
              padding: '15px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: APP_COLORS.PRIMARY,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontWeight: 600,
              cursor: 'pointer'
            }}
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
            style={{
              position: 'fixed',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: APP_COLORS.TEXT_PRIMARY,
              color: 'white',
              padding: '12px 24px',
              borderRadius: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              zIndex: 2000,
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}
          >
            <CheckCircle2 size={20} color={APP_COLORS.SUCCESS} />
            <span style={{ fontWeight: 600 }}>{t('postShared')} ✓</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
