import React, { useState } from 'react';
import { Screen, FeedPost, Comment } from '../types';
import { APP_COLORS, TYPOGRAPHY, MOCK_BUSINESSES } from '../constants';
import { ArrowLeft, Send } from 'lucide-react';
import FeedPostCard from './FeedPostCard';
import { motion } from 'framer-motion';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  post?: FeedPost;
  t: any;
  isRTL: boolean;
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: { id: 'u1', name: 'Ahmed Ali', avatar: 'https://i.pravatar.cc/150?img=11' },
    text: 'This looks amazing! Can\'t wait to try it.',
    timeAgo: '30m ago'
  },
  {
    id: 'c2',
    author: { id: 'u2', name: 'Sara K.', avatar: 'https://i.pravatar.cc/150?img=5' },
    text: 'Where exactly is this located?',
    timeAgo: '1h ago'
  },
  {
    id: 'c3',
    author: { id: 'u3', name: 'Mustafa', avatar: 'https://i.pravatar.cc/150?img=8' },
    text: 'Highly recommended, the atmosphere is great.',
    timeAgo: '2h ago'
  },
  {
    id: 'c4',
    author: { id: 'u4', name: 'Zainab', avatar: 'https://i.pravatar.cc/150?img=9' },
    text: 'Is it open on Fridays?',
    timeAgo: '3h ago'
  },
  {
    id: 'c5',
    author: { id: 'u5', name: 'Ali H.', avatar: 'https://i.pravatar.cc/150?img=12' },
    text: 'Prices are a bit high but quality is good.',
    timeAgo: '5h ago'
  }
];

export default function PostDetailScreen({ push, pop, post, t, isRTL }: Props) {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const PAGE_SIZE = 5;
  const visibleComments = comments.slice(0, page * PAGE_SIZE);
  const hasMore = visibleComments.length < comments.length;

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    await new Promise(r => setTimeout(r, 800)); // simulate fetch
    setPage(p => p + 1);
    setIsLoadingMore(false);
  };

  if (!post) return <div onClick={pop}>Error: No post data</div>;

  const handleSend = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: { id: 'me', name: 'You', avatar: 'https://i.pravatar.cc/150?img=33' },
      text: newComment,
      timeAgo: 'Just now'
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: APP_COLORS.BACKGROUND,
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Header */}
      <div style={{
        padding: '15px 20px',
        backgroundColor: APP_COLORS.SURFACE,
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        borderBottom: `1px solid ${APP_COLORS.BORDER}`,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        flexDirection: isRTL ? 'row' : 'row-reverse'
      }}>
        <ArrowLeft size={24} color={APP_COLORS.TEXT_PRIMARY} onClick={pop} style={{ cursor: 'pointer', transform: isRTL ? 'none' : 'rotate(180deg)' }} />
        <h2 style={{ ...TYPOGRAPHY.headline, margin: 0, fontSize: 18 }}>{t('postDetail')}</h2>
      </div>

      {/* Content */}
      <div 
        style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}
        onScroll={(e) => {
          if (e.currentTarget.scrollTop < -50 && !isRefreshing) {
            handleRefresh();
          }
        }}
      >
        {isRefreshing && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
            <div style={{
              width: 24,
              height: 24,
              border: `2px solid ${APP_COLORS.BORDER}`,
              borderTopColor: APP_COLORS.PRIMARY,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}

        <div style={{ padding: '15px 15px 0' }}>
          <FeedPostCard 
            post={post} 
            onCommentClick={() => {}} 
            onBusinessClick={(bId) => {
              const b = MOCK_BUSINESSES.find(x => x.id === bId);
              if(b) push('BusinessDetail', { business: b });
            }} 
            isRTL={isRTL}
            t={t}
          />
        </div>

        {/* Comments Section */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexDirection: isRTL ? 'row' : 'row-reverse' }}>
            <div style={{ flex: 1, height: 1, backgroundColor: APP_COLORS.BORDER }} />
            <span style={{ color: APP_COLORS.TEXT_SECONDARY, fontSize: 14, fontWeight: 500 }}>
              {t('comments')} ({post.comments + (comments.length - INITIAL_COMMENTS.length)})
            </span>
            <div style={{ flex: 1, height: 1, backgroundColor: APP_COLORS.BORDER }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {visibleComments.map(comment => (
              <div key={comment.id} style={{ display: 'flex', gap: 12, flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                <img 
                  src={comment.author.avatar} 
                  alt={comment.author.name} 
                  style={{ width: 36, height: 36, borderRadius: 18, objectFit: 'cover' }} 
                />
                <div style={{ flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexDirection: isRTL ? 'row' : 'row-reverse' }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: APP_COLORS.TEXT_PRIMARY }}>
                      {comment.author.name}
                    </span>
                    <span style={{ fontSize: 12, color: APP_COLORS.TEXT_MUTED }}>
                      {comment.timeAgo}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: APP_COLORS.TEXT_PRIMARY, lineHeight: 1.4 }}>
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
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
                marginTop: 20,
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
              ) : `${t('loadMore')} ↓`}
            </button>
          )}
        </div>
      </div>

      {/* Add Comment Input */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: APP_COLORS.SURFACE,
        borderTop: `1px solid ${APP_COLORS.BORDER}`,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        flexDirection: isRTL ? 'row' : 'row-reverse'
      }}>
        <img 
          src="https://i.pravatar.cc/150?img=33" 
          alt="You" 
          style={{ width: 36, height: 36, borderRadius: 18, objectFit: 'cover' }} 
        />
        <div style={{
          flex: 1,
          backgroundColor: APP_COLORS.BACKGROUND,
          borderRadius: 20,
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          border: `1px solid ${APP_COLORS.BORDER}`,
          flexDirection: isRTL ? 'row' : 'row-reverse'
        }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('writeCaption')}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              resize: 'none',
              fontSize: 14,
              color: APP_COLORS.TEXT_PRIMARY,
              fontFamily: 'inherit',
              maxHeight: 80,
              minHeight: 20,
              textAlign: isRTL ? 'right' : 'left'
            }}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>
        <button 
          onClick={handleSend}
          disabled={!newComment.trim()}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 8,
            cursor: newComment.trim() ? 'pointer' : 'default',
            opacity: newComment.trim() ? 1 : 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isRTL ? 'none' : 'rotate(180deg)'
          }}
        >
          <Send size={24} color={APP_COLORS.PRIMARY} />
        </button>
      </div>
    </div>
  );
}
