import React from 'react';

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
  | 'MapView';

export interface NavFrame {
  screen: Screen;
  props?: Record<string, any>;
}

export type TabType = 'shakumaku' | 'madinaty';

export interface Governorate {
  id: string;
  name: {
    en: string;
    ar: string;
    ku: string;
  };
}

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

export interface Business {
  id: string | number;
  name: string;
  nameAr?: string;
  nameKu?: string;
  coverImage?: string;
  imageUrl?: string;
  isPremium?: boolean;
  isFeatured?: boolean;
  category: string;
  subcategory?: string;
  rating: number;
  distance?: number;
  status?: string;
  image?: string;
  verified?: boolean;
  isVerified?: boolean;
  reviews?: number;
  reviewCount?: number;
  governorate?: string;
  city?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  description?: string;
  descriptionAr?: string;
  descriptionKu?: string;
  openHours?: string;
  isOpen?: boolean;
  priceRange?: 1 | 2 | 3 | 4;
  tags?: string[];
  lat?: number;
  lng?: number;
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

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
}

export interface FeedPost {
  id: number;
  businessId: string | null;
  businessName: string;
  businessNameAr: string;
  avatar: string;
  category: string;
  timeAgo: string;
  caption: string;
  captionAr: string;
  media?: string | null;
  mediaType: 'image' | 'video' | 'reel' | 'text';
  likes: number;
  comments: number;
  isLiked: boolean;
  verified: boolean;
  governorate: string;
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
  author: User;
  text: string;
  timeAgo: string;
}
