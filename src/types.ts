import React from 'react';

export type Language = 'ar' | 'ku' | 'en';
export type UserRole = 'user' | 'business_owner' | 'admin';
export type GovernorateId = 'baghdad' | 'sulaymaniyah' | 'erbil' | 'basra' | 'nineveh' | 'anbar' | 'diyala' | 'babil' | 'karbala' | 'najaf' | 'wasit' | 'muthanna' | 'qadisiyyah' | 'dhi_qar' | 'maysan' | 'kirkuk' | 'saladin' | 'dahuk';

export interface Governorate {
  id: GovernorateId;
  nameAr: string;
  nameKu: string;
  nameEn: string;
  region: 'center' | 'south' | 'north' | 'kurdistan';
}

export interface AppUser {
  id: string;
  role: UserRole;
  language: Language;
  governorateId: GovernorateId;
  displayName: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Business {
  id: string;
  nameAr: string;
  nameKu: string;
  nameEn: string;
  descriptionAr: string;
  descriptionKu: string;
  descriptionEn: string;
  category: string;
  governorateId: GovernorateId;
  phone?: string;
  address?: string;
  logoUrl?: string;
  coverUrl?: string;
  isOpen?: boolean;
  isVerified: boolean;
  isPremium?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  tags?: string[];
  openHours?: string;
  subcategory?: string;
  lat?: number;
  lng?: number;
  ownerId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'unclaimed';
  createdAt: string;
}

export interface AppState {
  language: Language;
  isRTL: boolean;
  selectedGovernorate: GovernorateId;
  currentUser: AppUser | null;
  isAuthenticated: boolean;
}

export type Screen =
  | 'Home'
  | 'BusinessDetail'
  | 'PostDetail'
  | 'StoryViewer'
  | 'CategoryBrowse'
  | 'CitySelect'
  | 'Search'
  | 'Profile'
  | 'AddPost'
  | 'Notifications'
  | 'EventDetail'
  | 'DealDetail'
  | 'MapView'
  | 'ClaimBusiness'
  | 'BusinessDashboard'
  | 'BusinessMiniSite'
  | 'AddBusinessPost';

export interface NavFrame {
  screen: Screen;
  props?: Record<string, any>;
}

export type TabType = 'shakumaku' | 'madinaty';

export interface Story {
  id: number;
  avatar: string;
  name: string;
  viewed?: boolean;
  verified?: boolean;
  thumbnail: string;
  userName: string;
  type: 'business' | 'community';
  aiVerified?: boolean;
  isLive?: boolean;
  media: string[];
  timeAgo: string;
}

export interface Category {
  id: string;
  icon: React.ReactNode;
  nameKey: string;
  eventCount: number;
  recommended?: boolean;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  icon: React.ReactNode;
  nameKey: string;
  count?: number;
  subcategories?: Subcategory[];
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

export interface Event {
  id: number;
  image: string;
  title: string;
  aiRecommended?: boolean;
  date: Date;
  venue: string;
  attendees: number;
  price: number;
  governorate?: string;
}

export interface Deal {
  id: number;
  discount: number;
  businessLogo: string;
  title: string;
  description: string;
  expiresIn: string;
  claimed: number;
  total: number;
  governorate?: string;
}

export interface FeedPost {
  id: number;
  businessId: string | null;
  businessName: string;
  businessNameAr: string;
  businessNameKu: string;
  avatar: string;
  category: string;
  timeAgo: string;
  caption: string;
  captionAr: string;
  captionKu: string;
  media?: string | null;
  mediaType: 'image' | 'video' | 'reel' | 'text';
  likes: number;
  comments: number;
  isLiked: boolean;
  verified: boolean;
  governorate: string;
}

export interface Reel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  likes: number;
  comments: number;
  governorateId: GovernorateId;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'like' | 'comment' | 'review' | 'offer' | 'checkin';
  section: 'today' | 'yesterday';
}

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  timeAgo: string;
}
