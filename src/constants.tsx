import React from 'react';
import { Business, Story, FeedPost, HeroSlide, Category, Notification, AppUser, Reel } from './types';
import { GOVERNORATES } from './constants/governorates';

import { businesses as MOCK_BUSINESSES } from './data/businesses';

export { GOVERNORATES, MOCK_BUSINESSES };

export const APP_COLORS = {
  PRIMARY: '#1a56db',
  SECONDARY: '#f59e0b',
  BACKGROUND: '#f8fafc',
  SURFACE: '#ffffff',
  TEXT_PRIMARY: '#0f172a',
  TEXT_SECONDARY: '#475569',
  TEXT_MUTED: '#94a3b8',
  BORDER: '#e2e8f0',
  SHADOW: 'rgba(0,0,0,0.05)',
  PREMIUM_GOLD: '#f59e0b',
  LIVE_RED: '#ef4444',
  SUCCESS: '#10b981',
  UNREAD_BG: '#eff6ff',
};

export const TYPOGRAPHY = {
  headline: { fontFamily: "'Noto Naskh Arabic', sans-serif", fontWeight: 700 },
  body: { fontFamily: "'Inter', sans-serif", fontWeight: 400 },
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: "أفضل المقاهي في بغداد",
    subtitle: "Trending Cafes in Baghdad",
    image: "https://picsum.photos/seed/cafe-baghdad/800/400",
  },
  {
    id: 2,
    title: "مطاعم اليوم المميزة",
    subtitle: "Best Restaurants Today",
    image: "https://picsum.photos/seed/restaurant-iraq/800/400",
  },
  {
    id: 3,
    title: "الجواهر الخفية في السليمانية",
    subtitle: "Hidden Gems in Sulaymaniyah",
    image: "https://picsum.photos/seed/sulaymaniyah-city/800/400",
  },
];

export const MOCK_USERS: AppUser[] = [
  { 
    id: 'u1', 
    displayName: 'User Name', 
    avatarUrl: 'https://picsum.photos/seed/u1/100/100', 
    email: 'user@email.com',
    role: 'user',
    language: 'ar',
    governorateId: 'baghdad',
    isVerified: false,
    createdAt: new Date().toISOString()
  },
  { 
    id: 'u2', 
    displayName: 'سارة محمد', 
    avatarUrl: 'https://picsum.photos/seed/u2/100/100', 
    email: 'sara@example.com',
    role: 'user',
    language: 'ar',
    governorateId: 'baghdad',
    isVerified: true,
    createdAt: new Date().toISOString()
  },
];

export const CATEGORIES: Category[] = [
  { id: 'all', icon: '🏙️', nameKey: 'all', eventCount: 0 },
  { id: 'cafes', icon: '☕', nameKey: 'cafes', eventCount: 24, recommended: true,
    subcategories: [
      { id: 'espresso-bars', icon: '☕', nameKey: 'espressoBars' },
      { id: 'traditional', icon: '🫖', nameKey: 'traditionalCafe' },
      { id: 'rooftop', icon: '🏙️', nameKey: 'rooftopCafe' },
    ]
  },
  { id: 'restaurants', icon: '🍽️', nameKey: 'restaurants', eventCount: 47,
    subcategories: [
      { id: 'iraqi', icon: '🫕', nameKey: 'iraqiFood' },
      { id: 'grills', icon: '🔥', nameKey: 'grills' },
      { id: 'seafood', icon: '🐟', nameKey: 'seafood' },
      { id: 'pizza', icon: '🍕', nameKey: 'pizza' },
    ]
  },
  { id: 'gyms', icon: '💪', nameKey: 'gyms', eventCount: 12 },
  { id: 'clinics', icon: '🏥', nameKey: 'clinics', eventCount: 31 },
  { id: 'hotels', icon: '🏨', nameKey: 'hotels', eventCount: 18 },
  { id: 'shopping', icon: '🛍️', nameKey: 'shopping', eventCount: 55, recommended: true },
];

export const MOCK_STORIES: Story[] = [
  {
    id: 1,
    avatar: 'https://i.pravatar.cc/80?img=1',
    name: 'Green Garden',
    viewed: false,
    verified: true,
    thumbnail: 'https://picsum.photos/seed/cafe/200/300',
    userName: 'greengarden_bgh',
    type: 'business',
    aiVerified: true,
    isLive: false,
    media: ['https://picsum.photos/seed/coffee/400/700'],
    timeAgo: '2m ago',
  },
  {
    id: 2,
    avatar: 'https://i.pravatar.cc/80?img=5',
    name: 'Baghdad Grill',
    viewed: false,
    verified: true,
    thumbnail: 'https://picsum.photos/seed/grill/200/300',
    userName: 'baghdadgrill',
    type: 'business',
    aiVerified: false,
    isLive: true,
    media: ['https://picsum.photos/seed/food/400/700'],
    timeAgo: '5m ago',
  },
];

export const MOCK_FEED_POSTS: FeedPost[] = [
  {
    id: 1, businessId: 'b1', businessName: 'Green Garden Cafe',
    businessNameAr: 'مقهى الحديقة الخضراء',
    businessNameKu: 'کافێی بُستانی سەوز',
    avatar: 'https://i.pravatar.cc/60?img=1',
    category: 'Cafe', timeAgo: '1h ago',
    caption: 'Try our new espresso blend ☕ Now available all day!',
    captionAr: 'جربوا خلطة الإسبريسو الجديدة ☕ متوفرة طوال اليوم!',
    captionKu: 'تامی تێکەڵەی نوێی ئێسپێرێسۆمان بکەن ☕ ئێستا بە درێژایی ڕۆژ بەردەستە!',
    media: 'https://picsum.photos/seed/coffee/600/400',
    mediaType: 'image', likes: 247, comments: 34, isLiked: false,
    verified: true, governorate: 'baghdad'
  },
  {
    id: 2, businessId: 'b2', businessName: 'Baghdad Grill',
    businessNameAr: 'مشاوي بغداد',
    businessNameKu: 'گرێلی بەغدا',
    avatar: 'https://i.pravatar.cc/60?img=5',
    category: 'Restaurant', timeAgo: '2h ago',
    caption: '🔥 20% discount tonight only! Bring your family.',
    captionAr: '🔥 خصم ٢٠٪ الليلة فقط! تعالوا مع عائلتكم.',
    captionKu: '🔥 ٢٠٪ داشکاندن تەنها ئەمشەو! خێزانەکانتان بهێنن.',
    media: 'https://picsum.photos/seed/grilled/600/400',
    mediaType: 'reel', likes: 891, comments: 102, isLiked: true,
    verified: true, governorate: 'baghdad'
  },
];

export const MOCK_REELS: Reel[] = [
  {
    id: 'r1',
    videoUrl: 'https://example.com/reel1.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/reel1/240/400',
    creatorName: 'Ahmed Ali',
    creatorAvatar: 'https://i.pravatar.cc/100?img=11',
    title: 'Best Coffee in Karrada ☕',
    likes: 1200,
    comments: 45,
    governorateId: 'baghdad'
  },
  {
    id: 'r2',
    videoUrl: 'https://example.com/reel2.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/reel2/240/400',
    creatorName: 'Sara Ahmed',
    creatorAvatar: 'https://i.pravatar.cc/100?img=12',
    title: 'Sunset at Tigris 🌅',
    likes: 3400,
    comments: 89,
    governorateId: 'baghdad'
  },
  {
    id: 'r3',
    videoUrl: 'https://example.com/reel3.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/reel3/240/400',
    creatorName: 'Mustafa J.',
    creatorAvatar: 'https://i.pravatar.cc/100?img=13',
    title: 'Hidden Gem in Erbil 🏰',
    likes: 890,
    comments: 23,
    governorateId: 'erbil'
  },
  {
    id: 'r4',
    videoUrl: 'https://example.com/reel4.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/reel4/240/400',
    creatorName: 'Layla K.',
    creatorAvatar: 'https://i.pravatar.cc/100?img=14',
    title: 'Sulaymaniyah Vibes ✨',
    likes: 2100,
    comments: 56,
    governorateId: 'sulaymaniyah'
  },
  {
    id: 'r5',
    videoUrl: 'https://example.com/reel5.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/reel5/240/400',
    creatorName: 'Zaid M.',
    creatorAvatar: 'https://i.pravatar.cc/100?img=15',
    title: 'Basra Night Life 🌃',
    likes: 1500,
    comments: 34,
    governorateId: 'basra'
  },
  {
    id: 'r6',
    videoUrl: 'https://example.com/reel6.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/reel6/240/400',
    creatorName: 'Noor A.',
    creatorAvatar: 'https://i.pravatar.cc/100?img=16',
    title: 'Traditional Food 🥘',
    likes: 4200,
    comments: 120,
    governorateId: 'baghdad'
  },
  {
    id: 'r7',
    videoUrl: 'https://example.com/reel7.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/reel7/240/400',
    creatorName: 'Hassan S.',
    creatorAvatar: 'https://i.pravatar.cc/100?img=17',
    title: 'Street Art Baghdad 🎨',
    likes: 980,
    comments: 15,
    governorateId: 'baghdad'
  },
  {
    id: 'r8',
    videoUrl: 'https://example.com/reel8.mp4',
    thumbnailUrl: 'https://picsum.photos/seed/reel8/240/400',
    creatorName: 'Dina R.',
    creatorAvatar: 'https://i.pravatar.cc/100?img=18',
    title: 'New Mall Opening 🛍️',
    likes: 2700,
    comments: 67,
    governorateId: 'erbil'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Green Garden Cafe', message: 'liked your post', timestamp: '1h ago', read: false, type: 'like', section: 'today' },
  { id: 'n2', title: 'New comment', message: '"Amazing place!"', timestamp: '2h ago', read: false, type: 'comment', section: 'today' },
];
