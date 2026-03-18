import React, { useState } from 'react';
import { Screen, FeedPost, Business } from '../types';
import { APP_COLORS, TYPOGRAPHY, MOCK_USERS, MOCK_FEED_POSTS, MOCK_BUSINESSES } from '../constants';
import { 
  ArrowLeft, 
  Edit2, 
  MapPin, 
  Globe, 
  Moon, 
  Bell, 
  Share2, 
  Phone, 
  LogOut, 
  ChevronRight,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  t: any;
  isRTL: boolean;
  lang: 'en' | 'ar' | 'ku';
  setLang: (l: 'en' | 'ar' | 'ku') => void;
}

export default function ProfileScreen({ pop, push, t, isRTL, lang, setLang }: Props) {
  const user = MOCK_USERS[0];
  // Since FeedPost doesn't have author.id yet, we'll just use all posts for now or filter by a mock condition
  const myPosts = MOCK_FEED_POSTS; 
  const savedBusinesses = MOCK_BUSINESSES.slice(0, 12); // Mocking more saved businesses

  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLangModal, setShowLangModal] = useState(false);
  
  // Pagination for Posts
  const [postsPage, setPostsPage] = useState(1);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);
  const POSTS_PAGE_SIZE = 6;
  const visiblePosts = myPosts.slice(0, postsPage * POSTS_PAGE_SIZE);
  const hasMorePosts = visiblePosts.length < myPosts.length;

  const handleLoadMorePosts = async () => {
    setIsLoadingMorePosts(true);
    await new Promise(r => setTimeout(r, 800));
    setPostsPage(p => p + 1);
    setIsLoadingMorePosts(false);
  };

  // Pagination for Saved Businesses
  const [savedPage, setSavedPage] = useState(1);
  const [isLoadingMoreSaved, setIsLoadingMoreSaved] = useState(false);
  const SAVED_PAGE_SIZE = 6;
  const visibleSaved = savedBusinesses.slice(0, savedPage * SAVED_PAGE_SIZE);
  const hasMoreSaved = visibleSaved.length < savedBusinesses.length;

  const handleLoadMoreSaved = async () => {
    setIsLoadingMoreSaved(true);
    await new Promise(r => setTimeout(r, 800));
    setSavedPage(p => p + 1);
    setIsLoadingMoreSaved(false);
  };

  const renderToggle = (value: boolean, onChange: (v: boolean) => void) => (
    <div 
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: value ? APP_COLORS.PRIMARY : APP_COLORS.BORDER,
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
    >
      <motion.div 
        animate={{ left: value ? 22 : 2 }}
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: 'white',
          position: 'absolute',
          top: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }} 
      />
    </div>
  );

  return (
    <div style={{ backgroundColor: APP_COLORS.BACKGROUND, minHeight: '100%', paddingBottom: 100, overflowY: 'auto' }}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Header */}
      <div style={{
        padding: '20px',
        backgroundColor: APP_COLORS.SURFACE,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${APP_COLORS.BORDER}`,
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isRTL ? (
            <ArrowRight size={24} color={APP_COLORS.TEXT_PRIMARY} onClick={pop} style={{ cursor: 'pointer' }} />
          ) : (
            <ArrowLeft size={24} color={APP_COLORS.TEXT_PRIMARY} onClick={pop} style={{ cursor: 'pointer' }} />
          )}
          <h1 style={{ ...TYPOGRAPHY.headline, margin: 0, fontSize: 18 }}>{t('profile')}</h1>
        </div>
        <button style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 6, 
          background: 'none', 
          border: 'none', 
          color: APP_COLORS.PRIMARY,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600
        }}>
          {t('edit')} <Edit2 size={16} />
        </button>
      </div>

      {/* User Info */}
      <div style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: APP_COLORS.SURFACE }}>
        <img 
          src={user.avatarUrl} 
          alt={user.displayName} 
          style={{ width: 80, height: 80, borderRadius: 40, objectFit: 'cover', marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
        />
        <h2 style={{ ...TYPOGRAPHY.headline, margin: '0 0 4px 0', fontSize: 22 }}>{user.displayName}</h2>
        <p style={{ ...TYPOGRAPHY.body, margin: '0 0 8px 0', fontSize: 14, color: APP_COLORS.TEXT_SECONDARY }}>{user.email}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: APP_COLORS.TEXT_SECONDARY }}>
          <MapPin size={16} />
          <span style={{ fontSize: 14 }}>{isRTL ? 'بغداد' : 'Baghdad'}</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 40, marginTop: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>24</div>
            <div style={{ fontSize: 12, color: APP_COLORS.TEXT_SECONDARY }}>{t('following')}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>118</div>
            <div style={{ fontSize: 12, color: APP_COLORS.TEXT_SECONDARY }}>{t('followers')}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{myPosts.length}</div>
            <div style={{ fontSize: 12, color: APP_COLORS.TEXT_SECONDARY }}>{t('posts')}</div>
          </div>
        </div>
      </div>

      {/* My Posts Section */}
      <div style={{ marginTop: 12, backgroundColor: APP_COLORS.SURFACE, padding: '20px 0' }}>
        <div style={{ padding: '0 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ ...TYPOGRAPHY.headline, fontSize: 14, color: APP_COLORS.TEXT_SECONDARY, whiteSpace: 'nowrap' }}>{t('posts')}</span>
          <div style={{ flex: 1, height: 1, backgroundColor: APP_COLORS.BORDER }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, padding: '0 2px' }}>
          {visiblePosts.map(post => (
            <motion.div 
              key={post.id} 
              whileTap={{ opacity: 0.7 }}
              onClick={() => push('PostDetail', { post })}
              style={{ aspectRatio: '1/1', backgroundColor: APP_COLORS.BORDER, cursor: 'pointer' }}
            >
              {post.media && post.mediaType === 'image' && (
                <img src={post.media} alt="post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </motion.div>
          ))}
        </div>
        {hasMorePosts && (
          <div style={{ padding: '0 20px', marginTop: 15 }}>
            <button 
              onClick={handleLoadMorePosts}
              disabled={isLoadingMorePosts}
              style={{
                width: '100%',
                padding: 10,
                backgroundColor: APP_COLORS.BACKGROUND,
                border: `1px solid ${APP_COLORS.BORDER}`,
                borderRadius: 10,
                color: APP_COLORS.PRIMARY,
                ...TYPOGRAPHY.headline,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {isLoadingMorePosts ? (
                <div style={{
                  width: 16, height: 16, 
                  border: `2px solid ${APP_COLORS.PRIMARY}`, 
                  borderTopColor: 'transparent', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite'
                }} />
              ) : `${t('loadMore')} ↓`}
            </button>
          </div>
        )}
      </div>

      {/* Saved Businesses Section */}
      <div style={{ marginTop: 12, backgroundColor: APP_COLORS.SURFACE, padding: '20px 0' }}>
        <div style={{ padding: '0 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ ...TYPOGRAPHY.headline, fontSize: 14, color: APP_COLORS.TEXT_SECONDARY, whiteSpace: 'nowrap' }}>{t('saved')}</span>
          <div style={{ flex: 1, height: 1, backgroundColor: APP_COLORS.BORDER }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '0 20px' }}>
            {visibleSaved.map(business => (
              <motion.div 
                key={business.id}
                whileHover={{ translateY: -2 }}
                onClick={() => push('BusinessDetail', { business })}
                style={{
                  backgroundColor: APP_COLORS.SURFACE,
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: `1px solid ${APP_COLORS.BORDER}`,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease'
                }}
              >
                <img src={business.coverUrl} alt={business[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Business] as string} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                <div style={{ padding: 10, textAlign: isRTL ? 'right' : 'left' }}>
                  <h4 style={{ ...TYPOGRAPHY.headline, margin: '0 0 4px 0', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {business[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Business] as string}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={12} color={APP_COLORS.PREMIUM_GOLD} fill={APP_COLORS.PREMIUM_GOLD} />
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{business.rating || 4.8}</span>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
        {hasMoreSaved && (
          <div style={{ padding: '0 20px', marginTop: 15 }}>
            <button 
              onClick={handleLoadMoreSaved}
              disabled={isLoadingMoreSaved}
              style={{
                width: '100%',
                padding: 10,
                backgroundColor: APP_COLORS.BACKGROUND,
                border: `1px solid ${APP_COLORS.BORDER}`,
                borderRadius: 10,
                color: APP_COLORS.PRIMARY,
                ...TYPOGRAPHY.headline,
                fontSize: 13,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {isLoadingMoreSaved ? (
                <div style={{
                  width: 16, height: 16, 
                  border: `2px solid ${APP_COLORS.PRIMARY}`, 
                  borderTopColor: 'transparent', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite'
                }} />
              ) : `${t('loadMore')} ↓`}
            </button>
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div style={{ marginTop: 12, backgroundColor: APP_COLORS.SURFACE, padding: '20px 0' }}>
        <div style={{ padding: '0 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ ...TYPOGRAPHY.headline, fontSize: 14, color: APP_COLORS.TEXT_SECONDARY, whiteSpace: 'nowrap' }}>{t('settings')}</span>
          <div style={{ flex: 1, height: 1, backgroundColor: APP_COLORS.BORDER }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <SettingItem 
            icon={<Globe size={20} color={APP_COLORS.TEXT_SECONDARY} />} 
            label={t('language')} 
            value={lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'کوردی'} 
            onClick={() => setShowLangModal(true)}
            isRTL={isRTL}
          />
          <SettingItem 
            icon={<Moon size={20} color={APP_COLORS.TEXT_SECONDARY} />} 
            label={t('darkMode')} 
            action={renderToggle(darkMode, setDarkMode)}
            isRTL={isRTL}
          />
          <SettingItem 
            icon={<Bell size={20} color={APP_COLORS.TEXT_SECONDARY} />} 
            label={t('notifications')} 
            action={renderToggle(notificationsEnabled, setNotificationsEnabled)}
            isRTL={isRTL}
          />
          <SettingItem 
            icon={<Share2 size={20} color={APP_COLORS.TEXT_SECONDARY} />} 
            label={t('shareApp')} 
            showArrow 
            isRTL={isRTL}
          />
          <SettingItem 
            icon={<Phone size={20} color={APP_COLORS.TEXT_SECONDARY} />} 
            label={t('contactSupport')} 
            showArrow 
            isRTL={isRTL}
          />
          <SettingItem 
            icon={<LogOut size={20} color="#FF3B30" />} 
            label={t('signOut')} 
            labelColor="#FF3B30"
            isRTL={isRTL}
          />
        </div>
      </div>

      {/* Language Modal */}
      <AnimatePresence>
        {showLangModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLangModal(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 100
              }}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: APP_COLORS.SURFACE,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: '24px 20px 40px',
                zIndex: 101,
                boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ ...TYPOGRAPHY.headline, fontSize: 18, marginBottom: 20, textAlign: isRTL ? 'right' : 'left' }}>{t('language')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { id: 'en', label: 'English' },
                  { id: 'ar', label: 'العربية' },
                  { id: 'ku', label: 'کوردی' }
                ].map(l => (
                  <div 
                    key={l.id}
                    onClick={() => {
                      setLang(l.id as any);
                      setShowLangModal(false);
                    }}
                    style={{
                      padding: '16px',
                      borderRadius: 12,
                      backgroundColor: lang === l.id ? `${APP_COLORS.PRIMARY}15` : APP_COLORS.BACKGROUND,
                      border: `1px solid ${lang === l.id ? APP_COLORS.PRIMARY : APP_COLORS.BORDER}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: lang === l.id ? 600 : 400 }}>{l.label}</span>
                    {lang === l.id && <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: APP_COLORS.PRIMARY }} />}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingItem({ 
  icon, 
  label, 
  value, 
  action, 
  showArrow, 
  onClick,
  isRTL,
  labelColor = APP_COLORS.TEXT_PRIMARY 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value?: string, 
  action?: React.ReactNode,
  showArrow?: boolean,
  onClick?: () => void,
  isRTL: boolean,
  labelColor?: string
}) {
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: `1px solid ${APP_COLORS.BORDER}40`,
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {icon}
        <span style={{ fontSize: 15, color: labelColor, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {value && <span style={{ fontSize: 14, color: APP_COLORS.TEXT_SECONDARY }}>{value}</span>}
        {action}
        {showArrow && (
          isRTL ? <ChevronRight size={18} color={APP_COLORS.TEXT_MUTED} style={{ transform: 'rotate(180deg)' }} /> : <ChevronRight size={18} color={APP_COLORS.TEXT_MUTED} />
        )}
      </div>
    </div>
  );
}
