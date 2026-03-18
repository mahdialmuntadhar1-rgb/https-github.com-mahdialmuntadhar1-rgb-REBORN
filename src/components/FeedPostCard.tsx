import React, { useState } from 'react';
import { FeedPost } from '../types';
import { APP_COLORS, TYPOGRAPHY } from '../constants';
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, Play, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  post: FeedPost;
  onCommentClick: () => void;
  onBusinessClick: (id: string) => void;
  isRTL: boolean;
  t: any;
  key?: React.Key;
}

export default function FeedPostCard({ post, onCommentClick, onBusinessClick, isRTL, t }: Props) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const toggleLike = () => {
    if (!isLiked) {
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 300);
    }
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const businessName = isRTL ? (post.businessNameAr || post.businessName) : post.businessName;
  const caption = isRTL ? (post.captionAr || post.caption) : post.caption;

  return (
    <motion.div 
      whileHover={{ translateY: -2 }}
      className="bg-surface rounded-2xl mb-5 shadow-sm overflow-hidden border border-border"
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => post.businessId && onBusinessClick(post.businessId)}
            className="relative"
          >
            <img 
              src={post.avatar} 
              alt={post.businessName} 
              className="w-10 h-10 rounded-full object-cover border border-border" 
            />
            {post.businessId && (
              <div className="absolute -top-1 inset-inline-start-[-4px] bg-primary rounded-full px-1.5 py-0.5 flex items-center justify-center border border-surface shadow-sm z-10">
                <span className="text-[7px] font-black text-white uppercase tracking-tighter">BIZ</span>
              </div>
            )}
            {post.verified && (
              <div className="absolute -bottom-1 inset-inline-end-[-4px] bg-secondary rounded-full w-4 h-4 flex items-center justify-center border-2 border-surface">
                <CheckCircle2 size={10} className="text-white" />
              </div>
            )}
          </button>
          <div className="text-start">
            <button 
              onClick={() => post.businessId && onBusinessClick(post.businessId)}
              className="text-sm font-bold text-text-primary hover:text-primary transition-colors"
            >
              {businessName}
            </button>
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <span>{post.category}</span>
              <span>•</span>
              <span>{post.timeAgo}</span>
            </div>
          </div>
        </div>
        <button className="text-text-muted hover:text-text-primary transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3 text-start">
        <p className="text-sm leading-relaxed text-text-secondary">
          {caption}
        </p>
      </div>

      {/* Media */}
      {post.media && (
        <div className="relative w-full aspect-[4/3] bg-background">
          <img 
            src={post.media} 
            alt="Post content" 
            className="w-full h-full object-cover" 
          />
          {post.mediaType === 'reel' && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/10">
              <Play size={10} fill="white" />
              REEL
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex justify-between items-center border-t border-border">
        <div className="flex gap-6">
          <button 
            onClick={toggleLike}
            className="flex items-center gap-2 transition-colors"
          >
            <motion.div
              animate={{ scale: isLikeAnimating ? 1.4 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Heart 
                size={20} 
                className={isLiked ? 'text-primary fill-primary' : 'text-text-muted hover:text-text-secondary'} 
              />
            </motion.div>
            <span className={`text-xs font-bold ${isLiked ? 'text-primary' : 'text-text-muted'}`}>{likesCount}</span>
          </button>
          
          <button 
            onClick={onCommentClick}
            className="flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors"
          >
            <MessageCircle size={20} />
            <span className="text-xs font-bold">{post.comments}</span>
          </button>
          
          <button className="text-text-muted hover:text-text-secondary transition-colors">
            <Share2 size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-1.5 text-text-muted">
          <MapPin size={12} />
          <span className="text-[10px] font-medium">
            {post.governorate.charAt(0).toUpperCase() + post.governorate.slice(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
