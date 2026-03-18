import React, { useState } from 'react';
import { Screen, FeedPost, Comment } from '../types';
import { MOCK_BUSINESSES } from '../constants';
import { ArrowLeft, Send } from 'lucide-react';
import FeedPostCard from './FeedPostCard';

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
    <div className="absolute inset-0 bg-background z-[100] flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 bg-surface flex items-center gap-4 border-b border-border sticky top-0 z-10">
        <ArrowLeft 
          size={24} 
          className="text-text-primary cursor-pointer rtl:rotate-0 ltr:rotate-180" 
          onClick={pop} 
        />
        <h2 className="font-bold text-lg m-0 text-text-primary">{t('postDetail')}</h2>
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-y-auto pb-20"
        onScroll={(e) => {
          if (e.currentTarget.scrollTop < -50 && !isRefreshing) {
            handleRefresh();
          }
        }}
      >
        {isRefreshing && (
          <div className="flex justify-center p-5">
            <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />
          </div>
        )}

        <div className="p-4 pt-4">
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
        <div className="px-5 pb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-text-secondary text-sm font-medium">
              {t('comments')} ({post.comments + (comments.length - INITIAL_COMMENTS.length)})
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex flex-col gap-5">
            {visibleComments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <img 
                  src={comment.author.avatar} 
                  alt={comment.author.name} 
                  className="w-9 h-9 rounded-full object-cover" 
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-text-primary">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-text-muted">
                      {comment.timeAgo}
                    </span>
                  </div>
                  <p className="m-0 text-sm text-text-primary leading-relaxed">
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
              className="w-full p-3 bg-surface border border-border rounded-xl text-primary font-bold text-sm cursor-pointer mt-5 flex justify-center items-center hover:bg-background transition-colors"
            >
              {isLoadingMore ? (
                <div className="w-[18px] h-[18px] border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : `${t('loadMore')} ↓`}
            </button>
          )}
        </div>
      </div>

      {/* Add Comment Input */}
      <div className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border px-5 py-3 flex items-center gap-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <img 
          src="https://i.pravatar.cc/150?img=33" 
          alt="You" 
          className="w-9 h-9 rounded-full object-cover" 
        />
        <div className="flex-1 bg-background rounded-full px-4 py-2 flex items-center border border-border">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('writeCaption')}
            className="flex-1 border-none bg-transparent outline-none resize-none text-sm text-text-primary font-inherit max-h-20 min-h-[20px] placeholder:text-text-muted"
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
          className={`bg-transparent border-none p-2 flex items-center justify-center rtl:rotate-0 ltr:rotate-180 ${newComment.trim() ? 'cursor-pointer opacity-100' : 'cursor-default opacity-50'}`}
        >
          <Send size={24} className="text-primary" />
        </button>
      </div>
    </div>
  );
}
