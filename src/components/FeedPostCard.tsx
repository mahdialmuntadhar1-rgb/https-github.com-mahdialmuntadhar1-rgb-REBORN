import React, { useState } from 'react';
import { FeedPost } from '../types';
import { APP_COLORS, TYPOGRAPHY } from '../constants';
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  post: FeedPost;
  onCommentClick: () => void;
  onBusinessClick: (id: string) => void;
  isRTL: boolean;
  t: any;
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

  return (
    <motion.div 
      whileHover={{ translateY: -2 }}
      style={{
        backgroundColor: APP_COLORS.SURFACE,
        borderRadius: 16,
        marginBottom: 20,
        boxShadow: APP_COLORS.SHADOW,
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease'
      }}
    >
      {/* Header */}
      <div style={{ padding: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <div 
            onClick={() => post.businessId && onBusinessClick(post.businessId)}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            <img 
              src={post.avatar} 
              alt={post.businessName} 
              style={{ width: 40, height: 40, borderRadius: 20, objectFit: 'cover' }} 
            />
            {post.verified && (
              <div style={{
                position: 'absolute',
                bottom: -2,
                [isRTL ? 'left' : 'right']: -2,
                backgroundColor: APP_COLORS.SECONDARY,
                borderRadius: '50%',
                width: 14,
                height: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${APP_COLORS.SURFACE}`
              }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
          </div>
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <h4 
              onClick={() => post.businessId && onBusinessClick(post.businessId)}
              style={{ ...TYPOGRAPHY.headline, margin: 0, fontSize: 14, cursor: 'pointer', color: APP_COLORS.TEXT_PRIMARY }}
            >
              {isRTL ? (post.businessNameAr || post.businessName) : post.businessName}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: APP_COLORS.TEXT_SECONDARY, fontSize: 11, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span>{post.category}</span>
              <span>•</span>
              <span>{post.timeAgo}</span>
            </div>
          </div>
        </div>
        <MoreHorizontal size={20} color={APP_COLORS.TEXT_MUTED} style={{ cursor: 'pointer' }} />
      </div>

      {/* Content */}
      <div style={{ padding: '0 15px 12px', textAlign: isRTL ? 'right' : 'left' }}>
        <p style={{ 
          ...TYPOGRAPHY.body, 
          margin: 0, 
          fontSize: 14, 
          lineHeight: 1.6, 
          color: APP_COLORS.TEXT_PRIMARY
        }}>
          {isRTL ? (post.captionAr || post.caption) : post.caption}
        </p>
      </div>

      {/* Media */}
      {post.media && (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', backgroundColor: '#000' }}>
          <img 
            src={post.media} 
            alt="Post content" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          {post.mediaType === 'reel' && (
            <div style={{
              position: 'absolute',
              top: 15,
              right: 15,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: '4px 8px',
              borderRadius: 4,
              color: 'white',
              fontSize: 10,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid white' }} />
              REEL
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        <div style={{ display: 'flex', gap: 20, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <div 
            onClick={toggleLike}
            style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', flexDirection: isRTL ? 'row-reverse' : 'row' }}
          >
            <motion.div
              animate={{ scale: isLikeAnimating ? 1.3 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Heart size={22} color={isLiked ? APP_COLORS.PRIMARY : APP_COLORS.TEXT_PRIMARY} fill={isLiked ? APP_COLORS.PRIMARY : 'none'} />
            </motion.div>
            <span style={{ fontSize: 13, fontWeight: 600, color: APP_COLORS.TEXT_PRIMARY }}>{likesCount}</span>
          </div>
          <div 
            onClick={onCommentClick}
            style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', flexDirection: isRTL ? 'row-reverse' : 'row' }}
          >
            <MessageCircle size={22} color={APP_COLORS.TEXT_PRIMARY} />
            <span style={{ fontSize: 13, fontWeight: 600, color: APP_COLORS.TEXT_PRIMARY }}>{post.comments}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <Share2 size={22} color={APP_COLORS.TEXT_PRIMARY} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: APP_COLORS.TEXT_SECONDARY, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <MapPin size={14} />
          <span style={{ fontSize: 12 }}>{post.governorate === 'baghdad' ? (isRTL ? 'بغداد' : 'Baghdad') : post.governorate}</span>
        </div>
      </div>
    </motion.div>
  );
}
