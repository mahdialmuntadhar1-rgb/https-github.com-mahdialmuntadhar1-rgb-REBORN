import React, { useState, useEffect } from 'react';
import { Screen, NavFrame } from './types';
import { APP_COLORS, TYPOGRAPHY } from './constants';
import { Home, Search, Plus, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppStateProvider, useAppState } from './hooks/useAppState';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import TopBar from './components/navigation/TopBar';
import BottomNav from './components/navigation/BottomNav';

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
import ClaimBusinessScreen from './components/business/ClaimBusinessScreen';
import BusinessDashboardScreen from './components/dashboard/BusinessDashboardScreen';
import BusinessMiniSite from './components/dashboard/BusinessMiniSite';
import AddBusinessPostScreen from './components/dashboard/AddBusinessPostScreen';

// Auth Screens
import { OnboardingCarousel } from './components/auth/OnboardingCarousel';
import { AuthScreen } from './components/auth/AuthScreen';
import { OTPScreen } from './components/auth/OTPScreen';
import { ProfileSetupScreen } from './components/auth/ProfileSetupScreen';
import { UserTypeScreen } from './components/auth/UserTypeScreen';
import { BusinessClaimScreen } from './components/auth/BusinessClaimScreen';

const ServiceWorkerRegistration = () => {
  // Placeholder for service worker registration logic
  return null;
};

type AuthStep = 'onboarding' | 'auth' | 'otp' | 'profile_setup' | 'user_type' | 'business_claim' | 'completed';

function AppContent() {
  const { t, isRTL, language, selectedGovernorate, setGovernorate, setLanguage, currentUser, isAuthenticated } = useAppState();
  const [navStack, setNavStack] = useState<NavFrame[]>([{ screen: 'Home' }]);
  const [activeTab, setActiveTab] = useState<Screen>('Home');
  
  // Auth Flow State
  const [authStep, setAuthStep] = useState<AuthStep>('completed');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [tempPhone, setTempPhone] = useState('');
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  useEffect(() => {
    if (isAuthenticated) {
      if (!currentUser?.displayName) {
        setAuthStep('profile_setup');
        setShowAuthModal(true);
      } else if (!currentUser?.role) {
        setAuthStep('user_type');
        setShowAuthModal(true);
      } else if (currentUser?.role === 'business_owner' && authStep !== 'completed') {
        setAuthStep('business_claim');
        setShowAuthModal(true);
      } else {
        setAuthStep('completed');
        setShowAuthModal(false);
      }
    } else {
      setAuthStep('auth');
    }
  }, [isAuthenticated, currentUser]);

  const requireAuth = (callback: () => void) => {
    if (isAuthenticated) {
      callback();
    } else {
      setAuthStep('auth');
      setShowAuthModal(true);
    }
  };

  const push = (screen: Screen, props?: Record<string, any>) => {
    const protectedScreens = ['AddPost', 'Notifications', 'Profile', 'BusinessDashboard', 'AddBusinessPost', 'ClaimBusiness'];
    if (protectedScreens.includes(screen)) {
      requireAuth(() => {
        setDirection(1);
        setNavStack([...navStack, { screen, props }]);
      });
    } else {
      setDirection(1);
      setNavStack([...navStack, { screen, props }]);
    }
  };

  const pop = () => {
    if (navStack.length > 1) {
      setDirection(-1);
      setNavStack(navStack.slice(0, -1));
    }
  };

  const currentFrame = navStack[navStack.length - 1];
  const showTopBar = !['StoryViewer'].includes(currentFrame.screen);
  const showBottomNav = !['StoryViewer', 'AddPost', 'BusinessDetail', 'PostDetail', 'Search', 'CategoryBrowse', 'AddBusinessPost', 'ClaimBusiness'].includes(currentFrame.screen);

  const renderScreen = () => {
    const screenProps = { push, pop, lang: language, t, isRTL };
    
    switch (currentFrame.screen) {
      case 'Home': return <HomeScreen {...screenProps} selectedCity={selectedGovernorate} setSelectedCity={setGovernorate} />;
      case 'BusinessDetail': return <BusinessDetailScreen {...screenProps} {...currentFrame.props} />;
      case 'PostDetail': return <PostDetailScreen {...screenProps} {...currentFrame.props} />;
      case 'StoryViewer': return <StoryViewerScreen {...screenProps} {...currentFrame.props} />;
      case 'Search': return <SearchScreen {...screenProps} />;
      case 'Profile': return <ProfileScreen {...screenProps} setLang={setLanguage} />;
      case 'Notifications': return <NotificationsScreen {...screenProps} />;
      case 'AddPost': return <AddPostScreen {...screenProps} />;
      case 'CategoryBrowse': return <CategoryBrowseScreen {...screenProps} categoryId={currentFrame.props?.categoryId} />;
      case 'CitySelect': return <CitySelectScreen {...screenProps} selectedCity={selectedGovernorate} setSelectedCity={setGovernorate} />;
      case 'ClaimBusiness': return <ClaimBusinessScreen {...screenProps} business={currentFrame.props?.business} />;
      case 'BusinessDashboard': return <BusinessDashboardScreen {...screenProps} />;
      case 'BusinessMiniSite': return <BusinessMiniSite {...screenProps} businessId={currentFrame.props?.businessId} />;
      case 'AddBusinessPost': return <AddBusinessPostScreen {...screenProps} business={currentFrame.props?.business} />;
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
            {t('general_back')}
          </button>
        </div>
      );
    }
  };

  const xOffset = isRTL ? -390 : 390;
  const forwardX = direction * xOffset; // If forward (1) and LTR, comes from 390. If forward (1) and RTL, comes from -390.
  // Wait, prompt said: "forward = slide from LEFT in LTR, slide from RIGHT in RTL"
  // Slide from LEFT in LTR means initial x is -390.
  // Slide from RIGHT in RTL means initial x is 390.
  const promptForwardX = isRTL ? (direction * 390) : (direction * -390);

  return (
    <div className="w-full min-h-screen bg-background text-text-primary overflow-hidden flex justify-center" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="relative flex flex-col w-full max-w-[500px] min-h-screen bg-background shadow-2xl overflow-hidden">
        {showTopBar && (
          <TopBar 
            title={currentFrame.screen === 'Home' ? undefined : t(`screen_${currentFrame.screen.toLowerCase()}`)}
            showBack={navStack.length > 1}
            onBack={pop}
            onNotificationClick={() => {
              setActiveTab('Notifications');
              setNavStack([{ screen: 'Notifications' }]);
            }}
          />
        )}

        {/* Main App Content */}
        <div className="relative flex-1 overflow-y-auto no-scrollbar" style={{ 
          paddingTop: showTopBar ? 64 : 0,
          paddingBottom: showBottomNav ? 80 : 0,
        }}>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentFrame.screen + (currentFrame.props?.id || '')}
              initial={{ x: promptForwardX, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -promptForwardX, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Auth Modal Overlay */}
        <AnimatePresence>
          {showAuthModal && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-[2000] bg-background"
            >
              {authStep === 'onboarding' && (
                <OnboardingCarousel onComplete={() => {
                  localStorage.setItem('onboarding_done', 'true');
                  setAuthStep('auth');
                }} />
              )}

              {authStep === 'auth' && (
                <AuthScreen 
                  onPhoneSubmit={(phone) => {
                    setTempPhone(phone);
                    setAuthStep('otp');
                  }}
                  onSuccess={() => setShowAuthModal(false)}
                />
              )}

              {authStep === 'otp' && (
                <OTPScreen 
                  phoneNumber={tempPhone}
                  onBack={() => setAuthStep('auth')}
                  onSuccess={() => {}}
                />
              )}

              {authStep === 'profile_setup' && (
                <ProfileSetupScreen onSuccess={() => {}} />
              )}

              {authStep === 'user_type' && (
                <UserTypeScreen onSuccess={() => {}} />
              )}

              {authStep === 'business_claim' && (
                <BusinessClaimScreen onComplete={() => { setAuthStep('completed'); setShowAuthModal(false); }} />
              )}
              
              {/* Close button for modal */}
              {authStep === 'auth' && (
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-12 end-6 w-10 h-10 bg-black/10 rounded-full flex items-center justify-center text-text-primary z-[2001]"
                >
                  ✕
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              const protectedTabs = ['AddPost', 'Notifications', 'Profile', 'BusinessDashboard'];
              if (protectedTabs.includes(tab)) {
                requireAuth(() => {
                  setActiveTab(tab);
                  setNavStack([{ screen: tab }]);
                });
              } else {
                setActiveTab(tab);
                setNavStack([{ screen: tab }]);
              }
            }}
            unreadCount={2}
          />
        )}
        
        <PWAInstallBanner />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <ServiceWorkerRegistration />
      <AppContent />
    </AppStateProvider>
  );
}

