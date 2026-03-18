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
      case 'like': return <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF3B30' }} />; // Red dot as requested [🔴]
      case 'comment': return <MessageCircle size={18} color={APP_COLORS.TEXT_SECONDARY} />; // [💬]
      case 'review': return <Star size={18} color={APP_COLORS.PREMIUM_GOLD} fill={APP_COLORS.PREMIUM_GOLD} />; // [⭐]
      case 'offer': return <Bell size={18} color={APP_COLORS.SECONDARY} />; // [🔔]
      case 'checkin': return <Heart size={18} color={APP_COLORS.PRIMARY} fill={APP_COLORS.PRIMARY} />; // [❤️]
      default: return <Bell size={18} color={APP_COLORS.TEXT_SECONDARY} />;
    }
  };

  const renderSection = (title: string, section: 'today' | 'yesterday') => {
    const sectionNotifs = visibleNotifications.filter(n => n.section === section);
    if (sectionNotifs.length === 0) return null;

    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '0 20px' }}>
          <span style={{ ...TYPOGRAPHY.headline, fontSize: 14, color: APP_COLORS.TEXT_SECONDARY, whiteSpace: 'nowrap' }}>{title}</span>
          <div style={{ flex: 1, height: 1, backgroundColor: APP_COLORS.BORDER }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sectionNotifs.map(notif => (
            <motion.div 
              key={notif.id}
              whileTap={{ backgroundColor: APP_COLORS.BORDER }}
              onClick={() => {
                // Navigate to relevant screen based on type
                if (notif.type === 'like' || notif.type === 'comment') {
                  push('PostDetail', { postId: 'p1' }); // Mocking p1
                } else if (notif.type === 'review') {
                  push('BusinessDetail', { businessId: 'b1' }); // Mocking b1
                }
              }}
              style={{
                backgroundColor: notif.read ? APP_COLORS.SURFACE : `${APP_COLORS.PRIMARY}08`, // Unread: slightly highlighted background
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                borderBottom: `1px solid ${APP_COLORS.BORDER}40`
              }}
            >
              <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
                {getIcon(notif.type)}
              </div>
              <div style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <p style={{ ...TYPOGRAPHY.body, margin: 0, fontSize: 14, color: APP_COLORS.TEXT_PRIMARY }}>
                    <span style={{ fontWeight: 600 }}>{notif.title}</span> {notif.message}
                  </p>
                  <span style={{ fontSize: 12, color: APP_COLORS.TEXT_MUTED, whiteSpace: 'nowrap', marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>{notif.timestamp}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: APP_COLORS.BACKGROUND, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
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
          <h1 style={{ ...TYPOGRAPHY.headline, margin: 0, fontSize: 18 }}>{t.notifications}</h1>
        </div>
        <button 
          onClick={markAllRead}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            background: 'none', 
            border: 'none', 
            color: APP_COLORS.PRIMARY,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          <CheckCircle size={18} />
          {t.markAllRead}
        </button>
      </div>

      <div style={{ padding: '20px 0', flex: 1, overflowY: 'auto' }}>
        {renderSection(isRTL ? 'اليوم' : 'Today', 'today')}
        {renderSection(isRTL ? 'أمس' : 'Yesterday', 'yesterday')}

        {notifications.length === 0 && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '100px 20px',
            textAlign: 'center'
          }}>
            <Bell size={64} color={APP_COLORS.TEXT_MUTED} strokeWidth={1} style={{ marginBottom: 16 }} />
            <h3 style={{ ...TYPOGRAPHY.headline, fontSize: 18, marginBottom: 8, color: APP_COLORS.TEXT_PRIMARY }}>
              {isRTL ? 'لا توجد إشعارات' : 'No notifications yet'}
            </h3>
            <p style={{ ...TYPOGRAPHY.body, fontSize: 14, color: APP_COLORS.TEXT_SECONDARY }}>
              {isRTL ? 'سنخطرك عند حدوث شيء جديد.' : "We'll notify you when something new happens."}
            </p>
          </div>
        )}

        {hasMore && (
          <div style={{ padding: '0 20px', marginTop: 10 }}>
            <button 
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              style={{
                width: '100%',
                padding: 12,
                backgroundColor: APP_COLORS.SURFACE,
                border: `1px solid ${APP_COLORS.BORDER}`,
                borderRadius: 12,
                color: APP_COLORS.PRIMARY,
                ...TYPOGRAPHY.headline,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {isLoadingMore ? (
                <div style={{
                  width: 18, height: 18, 
                  border: `2px solid ${APP_COLORS.PRIMARY}`, 
                  borderTopColor: 'transparent', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite'
                }} />
              ) : `${t.loadMore} ↓`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
