import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Image as ImageIcon, 
  Video, 
  Tag, 
  Globe, 
  MapPin, 
  Users, 
  Send,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { APP_COLORS, TYPOGRAPHY, MOCK_BUSINESSES } from '../../constants';
import { Screen, Business } from '../../types';

interface Props {
  business?: Business;
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
}

type PostCategory = 'offer' | 'event' | 'news' | 'general';
type Visibility = 'public' | 'city' | 'followers';

export default function AddBusinessPostScreen({ business: passedBusiness, push, pop }: Props) {
  const { t, isRTL, language, currentUser } = useAppState();
  
  // Find business if not passed
  const business = passedBusiness || MOCK_BUSINESSES.find(b => b.ownerId === currentUser?.id) || MOCK_BUSINESSES[0];

  const [images, setImages] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<PostCategory>('general');
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [isPublishing, setIsPublishing] = useState(false);

  const handleAddImage = () => {
    if (images.length < 3) {
      const newImg = `https://picsum.photos/seed/${Math.random()}/600/400`;
      setImages([...images, newImg]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!caption && images.length === 0) return;
    
    setIsPublishing(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    setIsPublishing(false);
    pop();
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      {/* Header */}
      <div className="p-6 pt-12 bg-[#1a1a1f] border-bottom border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={pop} className="text-white/60 hover:text-white transition-colors">
            {isRTL ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
          <h1 className="text-lg font-bold text-white">
            {isRTL ? 'منشور جديد' : 'New Post'}
          </h1>
        </div>
        <button 
          onClick={handlePublish}
          disabled={isPublishing || (!caption && images.length === 0)}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
            isPublishing || (!caption && images.length === 0)
              ? 'bg-white/5 text-white/20'
              : 'bg-primary text-white shadow-lg shadow-primary/20'
          }`}
        >
          {isPublishing ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
          {isRTL ? 'نشر' : 'Publish'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Business Context Info */}
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
          <img src={business.logoUrl} className="w-10 h-10 rounded-full border border-white/10" alt="" />
          <div>
            <p className="text-xs font-bold text-white">
              {language === 'ar' ? business.nameAr : language === 'ku' ? business.nameKu : business.nameEn}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-white/40">
              <MapPin size={10} />
              <span>{business.governorateId}</span>
              <span className="mx-1">•</span>
              <span className="text-primary font-bold uppercase tracking-wider">Business Account</span>
            </div>
          </div>
        </div>

        {/* Media Picker */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
            {isRTL ? 'الصور (بحد أقصى 3)' : 'Photos (Max 3)'}
          </label>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {images.map((img, index) => (
              <div key={index} className="relative w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                <img src={img} className="w-full h-full object-cover" alt="" />
                <button 
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <button 
                onClick={handleAddImage}
                className="w-32 h-32 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-white/20 hover:text-white/40 hover:border-white/20 transition-all flex-shrink-0"
              >
                <Plus size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{isRTL ? 'إضافة' : 'Add'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Text Input */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">
            {isRTL ? 'ما الذي تريد مشاركته؟' : 'What do you want to share?'}
          </label>
          <textarea 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder={isRTL ? 'اكتب تفاصيل العرض أو الخبر هنا...' : 'Write offer details or news here...'}
            className="w-full bg-[#1a1a1f] border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-primary outline-none min-h-[150px] resize-none"
          />
        </div>

        {/* Category Tags */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1 flex items-center gap-2">
            <Tag size={14} />
            {isRTL ? 'نوع المنشور' : 'Post Category'}
          </label>
          <div className="flex flex-wrap gap-2">
            {(['general', 'offer', 'event', 'news'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  category === cat 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                {cat === 'general' ? (isRTL ? 'عام' : 'General') :
                 cat === 'offer' ? (isRTL ? 'عرض' : 'Offer') :
                 cat === 'event' ? (isRTL ? 'فعالية' : 'Event') :
                 (isRTL ? 'خبر' : 'News')}
              </button>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1 flex items-center gap-2">
            <Globe size={14} />
            {isRTL ? 'من يمكنه رؤية هذا؟' : 'Who can see this?'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <VisibilityOption 
              active={visibility === 'public'} 
              onClick={() => setVisibility('public')} 
              icon={<Globe size={16} />} 
              label={isRTL ? 'عام' : 'Public'} 
            />
            <VisibilityOption 
              active={visibility === 'city'} 
              onClick={() => setVisibility('city')} 
              icon={<MapPin size={16} />} 
              label={isRTL ? 'مدينتي' : 'City Only'} 
            />
            <VisibilityOption 
              active={visibility === 'followers'} 
              onClick={() => setVisibility('followers')} 
              icon={<Users size={16} />} 
              label={isRTL ? 'المتابعين' : 'Followers'} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function VisibilityOption({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
        active 
          ? 'bg-primary/10 border-primary text-primary' 
          : 'bg-white/5 border-white/10 text-white/40'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}
