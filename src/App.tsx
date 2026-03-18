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
  const [authStep, setAuthStep] = useState<AuthStep>(() => {
    const onboardingDone = localStorage.getItem('onboarding_done') === 'true';
    if (!onboardingDone) return 'onboarding';
    return 'auth';
  });
  const [tempPhone, setTempPhone] = useState('');
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  useEffect(() => {
    if (isAuthenticated) {
      if (!currentUser?.displayName) {
        setAuthStep('profile_setup');
      } else if (!currentUser?.role) {
        setAuthStep('user_type');
      } else if (currentUser?.role === 'business_owner' && authStep !== 'completed') {
        setAuthStep('business_claim');
      } else {
        setAuthStep('completed');
      }
    } else {
      const onboardingDone = localStorage.getItem('onboarding_done') === 'true';
      if (!onboardingDone) {
        setAuthStep('onboarding');
      } else {
        setAuthStep('auth');
      }
    }
  }, [isAuthenticated, currentUser, authStep]);

  const push = (screen: Screen, props?: Record<string, any>) => {
    setDirection(1);
    setNavStack([...navStack, { screen, props }]);
  };

  const pop = () => {
    if (navStack.length > 1) {
      setDirection(-1);
      setNavStack(navStack.slice(0, -1));
    }
  };

  const currentFrame = navStack[navStack.length - 1];
  const showTopBar = authStep === 'completed' && !['StoryViewer'].includes(currentFrame.screen);
  const showBottomNav = authStep === 'completed' && !['StoryViewer', 'AddPost', 'BusinessDetail', 'PostDetail', 'Search', 'CategoryBrowse', 'AddBusinessPost', 'ClaimBusiness'].includes(currentFrame.screen);

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
    <div className="flex items-center justify-center w-screen h-screen bg-[#f0f0f0] overflow-hidden">
      <div className="relative flex flex-col w-[390px] h-[844px] bg-[#0a0a0f] rounded-[44px] shadow-2xl overflow-hidden border-[8px] border-[#1a1a1a] text-white" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-[#1a1a1a] rounded-b-[20px] z-[1000]" />

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

        {/* Auth Flow vs Main App */}
        <div className="relative flex-1 overflow-y-auto no-scrollbar" style={{ 
          paddingTop: showTopBar ? 64 : 0,
          paddingBottom: showBottomNav ? 80 : 0,
        }}>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            {authStep === 'onboarding' && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <OnboardingCarousel onComplete={() => { setDirection(1); setAuthStep('auth'); }} />
              </motion.div>
            )}

            {authStep === 'auth' && (
              <motion.div
                key="auth"
                initial={{ x: promptForwardX, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -promptForwardX, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0"
              >
                <AuthScreen 
                  onPhoneSubmit={(phone) => { 
                    setTempPhone(phone); 
                    setDirection(1);
                    setAuthStep('otp'); 
                  }}
                  onSuccess={() => setDirection(1)} 
                />
              </motion.div>
            )}

            {authStep === 'otp' && (
              <motion.div
                key="otp"
                initial={{ x: promptForwardX, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -promptForwardX, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0"
              >
                <OTPScreen 
                  phoneNumber={tempPhone}
                  onBack={() => { setDirection(-1); setAuthStep('auth'); }}
                  onSuccess={() => setDirection(1)}
                />
              </motion.div>
            )}

            {authStep === 'profile_setup' && (
              <motion.div
                key="profile_setup"
                initial={{ x: promptForwardX, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -promptForwardX, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0"
              >
                <ProfileSetupScreen onSuccess={() => setDirection(1)} />
              </motion.div>
            )}

            {authStep === 'user_type' && (
              <motion.div
                key="user_type"
                initial={{ x: promptForwardX, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -promptForwardX, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0"
              >
                <UserTypeScreen onSuccess={() => setDirection(1)} />
              </motion.div>
            )}

            {authStep === 'business_claim' && (
              <motion.div
                key="business_claim"
                initial={{ x: promptForwardX, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -promptForwardX, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0"
              >
                <BusinessClaimScreen onComplete={() => { setDirection(1); setAuthStep('completed'); }} />
              </motion.div>
            )}

            {authStep === 'completed' && (
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
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNav 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              setActiveTab(tab);
              setNavStack([{ screen: tab }]);
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

