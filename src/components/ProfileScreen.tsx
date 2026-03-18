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
      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${value ? 'bg-primary' : 'bg-border'}`}
    >
      <motion.div 
        animate={{ left: value ? 22 : 2 }}
        className="w-5 h-5 rounded-full bg-white absolute top-0.5 shadow-sm"
      />
    </div>
  );

  return (
    <div className="bg-background min-h-screen pb-24 overflow-y-auto">
      {/* Header */}
      <div className="p-5 bg-surface flex justify-between items-center border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {isRTL ? (
            <ArrowRight size={24} className="text-text-primary cursor-pointer" onClick={pop} />
          ) : (
            <ArrowLeft size={24} className="text-text-primary cursor-pointer" onClick={pop} />
          )}
          <h1 className="m-0 text-lg font-bold">{t('profile')}</h1>
        </div>
        <button className="flex items-center gap-1.5 bg-transparent border-none text-primary cursor-pointer text-sm font-semibold">
          {t('edit')} <Edit2 size={16} />
        </button>
      </div>

      {/* User Info */}
      <div className="py-8 px-5 flex flex-col items-center bg-surface">
        <img 
          src={user.avatarUrl} 
          alt={user.displayName} 
          className="w-20 h-20 rounded-full object-cover mb-4 shadow-md"
        />
        <h2 className="m-0 mb-1 text-2xl font-bold">{user.displayName}</h2>
        <p className="m-0 mb-2 text-sm text-text-secondary">{user.email}</p>
        <div className="flex items-center gap-1 text-text-secondary">
          <MapPin size={16} />
          <span className="text-sm">{isRTL ? 'بغداد' : 'Baghdad'}</span>
        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-6">
          <div className="text-center">
            <div className="font-bold text-lg">24</div>
            <div className="text-xs text-text-secondary">{t('following')}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">118</div>
            <div className="text-xs text-text-secondary">{t('followers')}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{myPosts.length}</div>
            <div className="text-xs text-text-secondary">{t('posts')}</div>
          </div>
        </div>
      </div>

      {/* My Posts Section */}
      <div className="mt-3 bg-surface py-5">
        <div className="px-5 mb-4 flex items-center gap-3">
          <span className="text-sm font-bold text-text-secondary whitespace-nowrap">{t('posts')}</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-3 gap-0.5 px-0.5">
          {visiblePosts.map(post => (
            <motion.div 
              key={post.id} 
              whileTap={{ opacity: 0.7 }}
              onClick={() => push('PostDetail', { post })}
              className="aspect-square bg-border cursor-pointer"
            >
              {post.media && post.mediaType === 'image' && (
                <img src={post.media} alt="post" className="w-full h-full object-cover" />
              )}
            </motion.div>
          ))}
        </div>
        {hasMorePosts && (
          <div className="px-5 mt-4">
            <button 
              onClick={handleLoadMorePosts}
              disabled={isLoadingMorePosts}
              className="w-full p-2.5 bg-background border border-border rounded-xl text-primary text-sm font-bold cursor-pointer flex justify-center items-center"
            >
              {isLoadingMorePosts ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : `${t('loadMore')} ↓`}
            </button>
          </div>
        )}
      </div>

      {/* Saved Businesses Section */}
      <div className="mt-3 bg-surface py-5">
        <div className="px-5 mb-4 flex items-center gap-3">
          <span className="text-sm font-bold text-text-secondary whitespace-nowrap">{t('saved')}</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-2 gap-4 px-5">
            {visibleSaved.map(business => (
              <motion.div 
                key={business.id}
                whileHover={{ translateY: -2 }}
                onClick={() => push('BusinessDetail', { business })}
                className="bg-surface rounded-xl overflow-hidden shadow-sm border border-border cursor-pointer transition-shadow hover:shadow-md"
              >
                <img src={business.coverUrl} alt={business[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Business] as string} className="w-full h-24 object-cover" />
                <div className={`p-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <h4 className="m-0 mb-1 text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                    {business[`name${lang.charAt(0).toUpperCase()}${lang.slice(1)}` as keyof Business] as string}
                  </h4>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-premium-gold fill-premium-gold" />
                    <span className="text-xs font-semibold">{business.rating || 4.8}</span>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
        {hasMoreSaved && (
          <div className="px-5 mt-4">
            <button 
              onClick={handleLoadMoreSaved}
              disabled={isLoadingMoreSaved}
              className="w-full p-2.5 bg-background border border-border rounded-xl text-primary text-sm font-bold cursor-pointer flex justify-center items-center"
            >
              {isLoadingMoreSaved ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : `${t('loadMore')} ↓`}
            </button>
          </div>
        )}
      </div>

      {/* Settings Section */}
      <div className="mt-3 bg-surface py-5">
        <div className="px-5 mb-4 flex items-center gap-3">
          <span className="text-sm font-bold text-text-secondary whitespace-nowrap">{t('settings')}</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        
        <div className="flex flex-col">
          <SettingItem 
            icon={<Globe size={20} className="text-text-secondary" />} 
            label={t('language')} 
            value={lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'کوردی'} 
            onClick={() => setShowLangModal(true)}
            isRTL={isRTL}
          />
          <SettingItem 
            icon={<Moon size={20} className="text-text-secondary" />} 
            label={t('darkMode')} 
            action={renderToggle(darkMode, setDarkMode)}
            isRTL={isRTL}
          />
          <SettingItem 
            icon={<Bell size={20} className="text-text-secondary" />} 
            label={t('notifications')} 
            action={renderToggle(notificationsEnabled, setNotificationsEnabled)}
            isRTL={isRTL}
          />
          <SettingItem 
            icon={<Share2 size={20} className="text-text-secondary" />} 
            label={t('shareApp')} 
            showArrow 
            isRTL={isRTL}
          />
          <SettingItem 
            icon={<Phone size={20} className="text-text-secondary" />} 
            label={t('contactSupport')} 
            showArrow 
            isRTL={isRTL}
          />
          <SettingItem 
            icon={<LogOut size={20} className="text-error" />} 
            label={t('signOut')} 
            labelColor="text-error"
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
              className="fixed inset-0 bg-black/50 z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl pt-6 px-5 pb-10 z-[101] shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
            >
              <h3 className={`m-0 mb-5 text-lg font-bold ${isRTL ? 'text-right' : 'text-left'}`}>{t('language')}</h3>
              <div className="flex flex-col gap-3">
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
                    className={`p-4 rounded-xl flex items-center justify-between cursor-pointer border ${
                      lang === l.id ? 'bg-primary/15 border-primary' : 'bg-background border-border'
                    }`}
                  >
                    <span className={`text-base ${lang === l.id ? 'font-semibold' : 'font-normal'}`}>{l.label}</span>
                    {lang === l.id && <div className="w-2 h-2 rounded-full bg-primary" />}
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
  labelColor = 'text-text-primary' 
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
      className="flex items-center justify-between py-4 px-5 border-b border-border/40 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {icon}
        <span className={`text-[15px] font-medium ${labelColor}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-text-secondary">{value}</span>}
        {action}
        {showArrow && (
          isRTL ? <ChevronRight size={18} className="text-text-muted rotate-180" /> : <ChevronRight size={18} className="text-text-muted" />
        )}
      </div>
    </div>
  );
}
