import React from 'react';
import { Home, Compass, PlusCircle, Bell, User, LayoutDashboard } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { APP_COLORS } from '../../constants';
import { Screen } from '../../types';

interface Props {
  activeTab: Screen;
  onTabChange: (tab: Screen) => void;
  unreadCount?: number;
}

export default function BottomNav({ activeTab, onTabChange, unreadCount = 0 }: Props) {
  const { isRTL, currentUser } = useAppState();
  const isBusinessOwner = currentUser?.role === 'business_owner' && currentUser?.business?.status === 'approved';

  const tabs = [
    { id: 'Home' as Screen, icon: Home, label: isRTL ? 'الرئيسية' : 'Home' },
    { id: 'Search' as Screen, icon: Compass, label: isRTL ? 'استكشف' : 'Explore' },
    { id: 'AddPost' as Screen, icon: PlusCircle, label: isRTL ? 'إضافة' : 'Add', isCenter: true },
    { id: 'Notifications' as Screen, icon: Bell, label: isRTL ? 'التنبيهات' : 'Notifications', badge: unreadCount },
    { id: isBusinessOwner ? 'BusinessDashboard' : 'Profile' as Screen, icon: isBusinessOwner ? LayoutDashboard : User, label: isBusinessOwner ? (isRTL ? 'لوحة التحكم' : 'Dashboard') : (isRTL ? 'حسابي' : 'Profile') },
  ];

  // Reverse tab order in RTL
  const orderedTabs = isRTL ? [...tabs].reverse() : tabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1f] border-t border-white/5 px-4 pb-safe pt-2 z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {orderedTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative -top-6 flex flex-col items-center"
              >
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90"
                  style={{ backgroundColor: APP_COLORS.PRIMARY }}
                >
                  <Icon size={32} color="white" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center py-1 px-2 relative transition-colors"
              style={{ color: isActive ? APP_COLORS.PRIMARY : 'rgba(255,255,255,0.4)' }}
            >
              <Icon size={24} fill={isActive ? APP_COLORS.PRIMARY : 'none'} />
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
              
              {tab.badge !== undefined && tab.badge > 0 && (
                <div className="absolute top-0 right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#1a1a1f]">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
