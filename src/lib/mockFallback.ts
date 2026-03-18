import { MOCK_BUSINESSES, MOCK_FEED_POSTS, MOCK_USERS, MOCK_STORIES, MOCK_REELS, MOCK_NOTIFICATIONS } from '../constants';
import { Business, FeedPost, AppUser, Story, Reel, Notification } from '../types';

/**
 * Mock async functions to simulate Supabase calls.
 * TODO: Replace these with real Supabase calls in Phase 7.
 */

export const getBusinesses = async (): Promise<Business[]> => {
  // TODO: replace with supabase.from('businesses').select('*').eq('status', 'approved')
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_BUSINESSES), 500));
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  // TODO: replace with supabase.from('businesses').select('*').eq('id', id).single()
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_BUSINESSES.find(b => b.id === id) || null), 300));
};

export const getFeedPosts = async (): Promise<FeedPost[]> => {
  // TODO: replace with supabase.from('posts').select('*').order('created_at', { ascending: false })
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_FEED_POSTS), 600));
};

export const getUserProfile = async (id: string): Promise<AppUser | null> => {
  // TODO: replace with supabase.from('profiles').select('*').eq('id', id).single()
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_USERS.find(u => u.id === id) || null), 400));
};

export const getStories = async (): Promise<Story[]> => {
  // TODO: replace with supabase.from('stories').select('*')
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_STORIES), 500));
};

export const getReels = async (): Promise<Reel[]> => {
  // TODO: replace with supabase.from('reels').select('*')
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_REELS), 500));
};

export const getNotifications = async (): Promise<Notification[]> => {
  // TODO: replace with supabase.from('notifications').select('*').eq('user_id', currentUserId)
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_NOTIFICATIONS), 400));
};
