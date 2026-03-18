import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  UserCircle, 
  Plus, 
  Eye, 
  MousePointer2, 
  MessageSquare, 
  Image as ImageIcon,
  ChevronRight,
  Trash2,
  ExternalLink,
  Save,
  Globe,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { APP_COLORS, TYPOGRAPHY, MOCK_BUSINESSES, MOCK_FEED_POSTS } from '../../constants';
import { Screen, Business, FeedPost } from '../../types';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
}

type Tab = 'overview' | 'posts' | 'profile';

export default function BusinessDashboardScreen({ push, pop }: Props) {
  const { t, isRTL, language, currentUser } = useAppState();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Mock business for the current user
  const business = MOCK_BUSINESSES.find(b => b.ownerId === currentUser?.id) || MOCK_BUSINESSES[0];
  const businessPosts = MOCK_FEED_POSTS.filter(p => p.businessId === business.id);

  const renderTabButton = (id: Tab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all relative ${
        activeTab === id ? 'text-primary' : 'text-white/40'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      {activeTab === id && (
        <motion.div 
          layoutId="activeTab"
          className="absolute bottom-0 inset-inline-start-0 inset-inline-end-0 h-0.5 bg-primary"
        />
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      {/* Header */}
      <div className="p-6 pt-12 bg-[#1a1a1f] border-bottom border-white/5 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">
            {isRTL ? 'لوحة التحكم' : 'Dashboard'}
          </h1>
          <p className="text-xs text-white/40">
            {language === 'ar' ? business.nameAr : language === 'ku' ? business.nameKu : business.nameEn}
          </p>
        </div>
        <button 
          onClick={() => push('BusinessMiniSite', { businessId: business.id })}
          className="p-2 rounded-full bg-white/5 text-white/60 hover:text-white transition-colors"
        >
          <ExternalLink size={20} />
        </button>
      </div>

      {/* Internal Tabs */}
      <div className="flex bg-[#1a1a1f] border-bottom border-white/5 px-2">
        {renderTabButton('overview', <LayoutDashboard size={20} />, isRTL ? 'نظرة عامة' : 'Overview')}
        {renderTabButton('posts', <FileText size={20} />, isRTL ? 'المنشورات' : 'Posts')}
        {renderTabButton('profile', <UserCircle size={20} />, isRTL ? 'الملف' : 'Profile')}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  icon={<Eye size={18} className="text-blue-400" />} 
                  label={isRTL ? 'المشاهدات' : 'Views'} 
                  value="1.2k" 
                  trend="+12%"
                />
                <StatCard 
                  icon={<MousePointer2 size={18} className="text-purple-400" />} 
                  label={isRTL ? 'النقرات' : 'Clicks'} 
                  value="450" 
                  trend="+5%"
                />
                <StatCard 
                  icon={<MessageSquare size={18} className="text-green-400" />} 
                  label={isRTL ? 'الرسائل' : 'Messages'} 
                  value="28" 
                  trend="+8%"
                />
                <StatCard 
                  icon={<ImageIcon size={18} className="text-amber-400" />} 
                  label={isRTL ? 'المنشورات' : 'Posts'} 
                  value={businessPosts.length.toString()} 
                />
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white/60 px-1">
                  {isRTL ? 'إجراءات سريعة' : 'Quick Actions'}
                </h3>
                <ActionLink 
                  icon={<Plus size={20} />} 
                  label={isRTL ? 'إضافة منشور جديد' : 'Add New Post'} 
                  onClick={() => push('AddBusinessPost', { business })}
                />
                <ActionLink 
                  icon={<UserCircle size={20} />} 
                  label={isRTL ? 'تعديل الملف التجاري' : 'Edit Business Profile'} 
                  onClick={() => setActiveTab('profile')}
                />
                <ActionLink 
                  icon={<Globe size={20} />} 
                  label={isRTL ? 'عرض الصفحة العامة' : 'View Public Page'} 
                  onClick={() => push('BusinessMiniSite', { businessId: business.id })}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'posts' && (
            <motion.div
              key="posts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {businessPosts.length > 0 ? (
                businessPosts.map(post => (
                  <PostListItem key={post.id} post={post} />
                ))
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <FileText size={32} className="text-white/20" />
                  </div>
                  <p className="text-white/40 text-sm">
                    {isRTL ? 'لا يوجد منشورات بعد' : 'No posts yet'}
                  </p>
                </div>
              )}

              {/* FAB */}
              <button 
                onClick={() => push('AddBusinessPost', { business })}
                className="fixed bottom-24 end-6 w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white z-10"
              >
                <Plus size={28} />
              </button>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <ProfileSection title={isRTL ? 'المعلومات الأساسية' : 'Basic Info'}>
                  <TrilingualInput 
                    label={isRTL ? 'اسم العمل' : 'Business Name'} 
                    values={{ ar: business.nameAr, ku: business.nameKu, en: business.nameEn }} 
                  />
                  <TrilingualInput 
                    label={isRTL ? 'الوصف' : 'Description'} 
                    values={{ ar: business.descriptionAr, ku: business.descriptionKu, en: business.descriptionEn }}
                    multiline
                  />
                </ProfileSection>

                <ProfileSection title={isRTL ? 'معلومات الاتصال' : 'Contact Info'}>
                  <InputField label={isRTL ? 'رقم الهاتف' : 'Phone'} value={business.phone || ''} icon={<Phone size={16} />} isPhone />
                  <InputField label={isRTL ? 'واتساب' : 'WhatsApp'} value={business.phone || ''} icon={<MessageSquare size={16} />} isPhone />
                  <InputField label={isRTL ? 'العنوان' : 'Address'} value={business.address || ''} icon={<MapPin size={16} />} />
                </ProfileSection>

                <ProfileSection title={isRTL ? 'ساعات العمل' : 'Working Hours'}>
                  <InputField label={isRTL ? 'ساعات العمل' : 'Hours'} value={business.openHours || '09:00 - 22:00'} icon={<Clock size={16} />} />
                </ProfileSection>

                <div className="pt-4">
                  <button className="w-full bg-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                    <Save size={20} />
                    {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend?: string }) {
  return (
    <div className="bg-[#1a1a1f] p-4 rounded-2xl border border-white/5">
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
        {trend && <span className="text-[10px] font-bold text-green-400">{trend}</span>}
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold">{label}</div>
    </div>
  );
}

function ActionLink({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  const { language } = useAppState();
  const isRTL = language === 'ar' || language === 'ku';
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-[#1a1a1f] rounded-xl border border-white/5 hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <span className="text-sm font-medium text-white">{label}</span>
      </div>
      <ChevronRight size={18} className="text-white/20" style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }} />
    </button>
  );
}

function PostListItem({ post }: { post: FeedPost, key?: React.Key }) {
  const { isRTL } = useAppState();
  return (
    <div className="flex gap-3 p-3 bg-[#1a1a1f] rounded-xl border border-white/5">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
        {post.media && <img src={post.media} className="w-full h-full object-cover" alt="" />}
      </div>
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div>
          <p className="text-xs text-white line-clamp-2 mb-1">{post.captionAr}</p>
          <div className="flex items-center gap-3 text-[10px] text-white/40">
            <span>{post.likes} likes</span>
            <span>{post.comments} comments</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-white/20 uppercase font-bold">{post.timeAgo}</span>
          <button className="p-1 text-red-500/60 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function TrilingualInput({ label, values, multiline }: { label: string, values: { ar: string, ku: string, en: string }, multiline?: boolean }) {
  const [activeLang, setActiveLang] = useState<'ar' | 'ku' | 'en'>('ar');
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <label className="text-xs font-medium text-white/60">{label}</label>
        <div className="flex bg-white/5 rounded-lg p-0.5">
          {(['ar', 'ku', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => setActiveLang(l)}
              className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase transition-all ${
                activeLang === l ? 'bg-primary text-white' : 'text-white/40'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      {multiline ? (
        <textarea 
          defaultValue={values[activeLang]}
          className="w-full bg-[#1a1a1f] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none min-h-[100px]"
        />
      ) : (
        <input 
          type="text"
          defaultValue={values[activeLang]}
          className="w-full bg-[#1a1a1f] border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none"
        />
      )}
    </div>
  );
}

function InputField({ label, value, icon, isPhone }: { label: string, value: string, icon: React.ReactNode, isPhone?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-white/60 px-1">{label}</label>
      <div className="relative" dir={isPhone ? 'ltr' : 'inherit'}>
        <div className="absolute inset-inline-start-3 top-1/2 -translate-y-1/2 text-white/20">
          {icon}
        </div>
        <input 
          type="text"
          defaultValue={value}
          className="w-full bg-[#1a1a1f] border border-white/10 rounded-xl p-3 ps-10 text-sm text-white focus:border-primary outline-none"
        />
      </div>
    </div>
  );
}
