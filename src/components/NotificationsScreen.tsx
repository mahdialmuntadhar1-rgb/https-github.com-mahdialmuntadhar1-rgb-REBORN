import React, { useState } from 'react';
import { Screen, Notification } from '../types';
import { APP_COLORS, TYPOGRAPHY, MOCK_NOTIFICATIONS } from '../constants';
import { ArrowLeft, CheckCircle, Heart, MessageCircle, Star, Bell, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  t: any;
  isRTL: boolean;
}

export default function NotificationsScreen({ pop, push, t, isRTL }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const PAGE_SIZE = 5;
  const visibleNotifications = notifications.slice(0, page * PAGE_SIZE);
  const hasMore = visibleNotifications.length < notifications.length;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise(r => setTimeout(r, 800)); // simulate fetch
    setPage(p => p + 1);
    setIsLoadingMore(false);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like': return <div className="w-3 h-3 rounded-full bg-[#FF3B30]" />; // Red dot as requested [🔴]
      case 'comment': return <MessageCircle size={18} className="text-text-secondary" />; // [💬]
      case 'review': return <Star size={18} className="text-premium-gold fill-premium-gold" />; // [⭐]
      case 'offer': return <Bell size={18} className="text-secondary" />; // [🔔]
      case 'checkin': return <Heart size={18} className="text-primary fill-primary" />; // [❤️]
      default: return <Bell size={18} className="text-text-secondary" />;
    }
  };

  const renderSection = (title: string, section: 'today' | 'yesterday') => {
    const sectionNotifs = visibleNotifications.filter(n => n.section === section);
    if (sectionNotifs.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4 px-5">
          <span className="text-sm font-bold text-text-secondary whitespace-nowrap">{title}</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="flex flex-col gap-0.5">
          {sectionNotifs.map(notif => (
            <motion.div 
              key={notif.id}
              whileTap={{ backgroundColor: 'var(--color-border)' }}
              onClick={() => {
                // Navigate to relevant screen based on type
                if (notif.type === 'like' || notif.type === 'comment') {
                  push('PostDetail', { postId: 'p1' }); // Mocking p1
                } else if (notif.type === 'review') {
                  push('BusinessDetail', { businessId: 'b1' }); // Mocking b1
                }
              }}
              className={`px-5 py-4 flex items-center gap-4 cursor-pointer transition-colors border-b border-border/40 ${
                notif.read ? 'bg-surface' : 'bg-primary/5'
              }`}
            >
              <div className="w-6 flex justify-center">
                {getIcon(notif.type)}
              </div>
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="flex justify-between items-baseline">
                  <p className="m-0 text-sm text-text-primary">
                    <span className="font-semibold">{notif.title}</span> {notif.message}
                  </p>
                  <span className={`text-xs text-text-muted whitespace-nowrap ${isRTL ? 'mr-2' : 'ml-2'}`}>
                    {notif.timestamp}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-5 bg-surface flex justify-between items-center border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {isRTL ? (
            <ArrowRight size={24} className="text-text-primary cursor-pointer" onClick={pop} />
          ) : (
            <ArrowLeft size={24} className="text-text-primary cursor-pointer" onClick={pop} />
          )}
          <h1 className="m-0 text-lg font-bold">{t('notifications')}</h1>
        </div>
        <button 
          onClick={markAllRead}
          className="flex items-center gap-1.5 bg-transparent border-none text-primary cursor-pointer text-sm font-semibold"
        >
          <CheckCircle size={18} />
          {t('markAllRead')}
        </button>
      </div>

      <div className="py-5 flex-1 overflow-y-auto">
        {renderSection(isRTL ? 'اليوم' : 'Today', 'today')}
        {renderSection(isRTL ? 'أمس' : 'Yesterday', 'yesterday')}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-5 text-center">
            <Bell size={64} className="text-text-muted mb-4" strokeWidth={1} />
            <h3 className="text-lg font-bold mb-2 text-text-primary">
              {isRTL ? 'لا توجد إشعارات' : 'No notifications yet'}
            </h3>
            <p className="text-sm text-text-secondary">
              {isRTL ? 'سنخطرك عند حدوث شيء جديد.' : "We'll notify you when something new happens."}
            </p>
          </div>
        )}

        {hasMore && (
          <div className="px-5 mt-2.5">
            <button 
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full p-3 bg-surface border border-border rounded-xl text-primary text-sm font-bold cursor-pointer flex justify-center items-center"
            >
              {isLoadingMore ? (
                <div className="w-4.5 h-4.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : `${t('loadMore')} ↓`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
