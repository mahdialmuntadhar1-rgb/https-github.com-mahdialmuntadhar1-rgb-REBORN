import React, { useState, useEffect } from 'react';
import { Screen, NavFrame } from './types';
import { APP_COLORS, TYPOGRAPHY, TRANSLATIONS } from './constants';
import { Home, Search, Plus, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import HomeScreen from './components/HomeScreen';
import BusinessDetailScreen from './components/BusinessDetailScreen';
import PostDetailScreen from './components/PostDetailScreen';
import StoryViewerScreen from './components/StoryViewerScreen';
import SearchScreen from './components/SearchScreen';
import ProfileScreen from './components/ProfileScreen';
import NotificationsScreen from './components/NotificationsScreen';
import AddPostScreen from './components/AddPostScreen';
import CategoryBrowseScreen from './components/CategoryBrowseScreen';
import CitySelectScreen from './components/CitySelectScreen';

export default function App() {
  const [navStack, setNavStack] = useState<NavFrame[]>([{ screen: 'Home' }]);
  const [activeTab, setActiveTab] = useState<Screen>('Home');
  const [selectedCity, setSelectedCity] = useState('baghdad');
  const [lang, setLang] = useState<'en' | 'ar' | 'ku'>('ar');

  const push = (screen: Screen, props?: Record<string, any>) => {
    setNavStack([...navStack, { screen, props }]);
  };

  const pop = () => {
    if (navStack.length > 1) {
      setNavStack(navStack.slice(0, -1));
    }
  };

  const currentFrame = navStack[navStack.length - 1];
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar' || lang === 'ku';

  const renderScreen = () => {
    const screenProps = { push, pop, lang, setLang, t, isRTL };
    
    switch (currentFrame.screen) {
      case 'Home': return <HomeScreen {...screenProps} selectedCity={selectedCity} setSelectedCity={setSelectedCity} />;
      case 'BusinessDetail': return <BusinessDetailScreen {...screenProps} {...currentFrame.props} />;
      case 'PostDetail': return <PostDetailScreen {...screenProps} {...currentFrame.props} />;
      case 'StoryViewer': return <StoryViewerScreen {...screenProps} {...currentFrame.props} />;
      case 'Search': return <SearchScreen {...screenProps} />;
      case 'Profile': return <ProfileScreen {...screenProps} />;
      case 'Notifications': return <NotificationsScreen {...screenProps} />;
      case 'AddPost': return <AddPostScreen {...screenProps} />;
      case 'CategoryBrowse': return <CategoryBrowseScreen {...screenProps} categoryId={currentFrame.props?.categoryId} />;
      case 'CitySelect': return <CitySelectScreen {...screenProps} selectedCity={selectedCity} setSelectedCity={setSelectedCity} />;
      default: return (
        <div style={{ padding: 20, textAlign: 'center', paddingTop: 100 }}>
          <h2 style={{ ...TYPOGRAPHY.headline, color: APP_COLORS.TEXT_PRIMARY }}>{isRTL ? 'قريباً' : 'Coming Soon'}</h2>
          <p style={{ ...TYPOGRAPHY.body, color: APP_COLORS.TEXT_SECONDARY }}>{isRTL ? 'هذه الصفحة قيد التطوير' : 'This page is under development'}</p>
          <button 
            onClick={pop}
            style={{
              marginTop: 20,
              padding: '10px 20px',
              backgroundColor: APP_COLORS.PRIMARY,
              color: 'white',
              border: 'none',
              borderRadius: 8,
              ...TYPOGRAPHY.headline,
              cursor: 'pointer'
            }}
          >
            {t.back}
          </button>
        </div>
      );
    }
  };

  const showBottomNav = !['StoryViewer', 'AddPost', 'BusinessDetail', 'PostDetail', 'Search', 'CategoryBrowse'].includes(currentFrame.screen);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      overflow: 'hidden'
    }}>
      <div style={{
        width: 390,
        height: 844,
        backgroundColor: APP_COLORS.BACKGROUND,
        borderRadius: 44,
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
        color: APP_COLORS.TEXT_PRIMARY,
        direction: isRTL ? 'rtl' : 'ltr',
        border: '8px solid #1a1a1a'
      }}>
        {/* Notch */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 150,
          height: 30,
          backgroundColor: '#1a1a1a',
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          zIndex: 1000
        }} />

        {/* Content Area with Transitions */}
        <div className="no-scrollbar" style={{ 
          flex: 1, 
          overflowY: 'auto', 
          paddingBottom: showBottomNav ? 80 : 0,
          position: 'relative'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFrame.screen + (currentFrame.props?.id || '')}
              initial={{ x: isRTL ? -100 : 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRTL ? 100 : -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ width: '100%', height: '100%' }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            backgroundColor: APP_COLORS.SURFACE,
            borderTop: `1px solid ${APP_COLORS.BORDER}`,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 20,
            zIndex: 100
          }}>
            <Tab icon={<Home />} label={t.shakumaku} isActive={activeTab === 'Home'} onClick={() => { setActiveTab('Home'); setNavStack([{screen: 'Home'}]); }} />
            <Tab icon={<Search />} label={t.search.split(' ')[0]} isActive={activeTab === 'Search'} onClick={() => { setActiveTab('Search'); setNavStack([{screen: 'Search'}]); }} />
            
            {/* Add Post Button */}
            <motion.div 
              onClick={() => push('AddPost')}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: APP_COLORS.PRIMARY,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                transform: 'translateY(-20px)',
                boxShadow: `0 4px 12px ${APP_COLORS.PRIMARY}80`,
                cursor: 'pointer'
              }}
            >
              <Plus size={28} />
            </motion.div>

            <Tab icon={<Bell />} label={t.notifications} isActive={activeTab === 'Notifications'} onClick={() => { setActiveTab('Notifications'); setNavStack([{screen: 'Notifications'}]); }} />
            <Tab icon={<User />} label={t.profile} isActive={activeTab === 'Profile'} onClick={() => { setActiveTab('Profile'); setNavStack([{screen: 'Profile'}]); }} />
          </div>
        )}
      </div>
    </div>
  );
}

function Tab({ icon, label, isActive, onClick }: any) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onClick={onClick} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: isActive ? APP_COLORS.PRIMARY : (isHovered ? APP_COLORS.PRIMARY : APP_COLORS.TEXT_SECONDARY),
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: 16,
        backgroundColor: isActive ? `${APP_COLORS.PRIMARY}15` : (isHovered ? `${APP_COLORS.PRIMARY}0A` : 'transparent'),
        transition: 'all 0.2s',
        minWidth: 60
      }}
    >
      {React.cloneElement(icon, { size: 24 })}
      <span style={{ fontSize: 10, marginTop: 4, fontWeight: isActive ? 600 : 400 }}>{label}</span>
    </div>
  );
}
