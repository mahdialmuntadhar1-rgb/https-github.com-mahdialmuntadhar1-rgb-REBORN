import React, { useState, useEffect, useRef } from 'react';
import { Screen } from '../types';
import { APP_COLORS, MOCK_STORIES } from '../constants';
import { X, Heart, Send } from 'lucide-react';

interface Props {
  push: (screen: Screen, props?: Record<string, any>) => void;
  pop: () => void;
  initialStoryId?: string;
}

export default function StoryViewerScreen({ pop, initialStoryId }: Props) {
  const startIndex = MOCK_STORIES.findIndex(s => s.id.toString() === initialStoryId?.toString());
  const [currentStoryIndex, setCurrentStoryIndex] = useState(startIndex >= 0 ? startIndex : 0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  const currentStory = MOCK_STORIES[currentStoryIndex];
  const currentMedia = currentStory?.media[currentMediaIndex];

  useEffect(() => {
    if (isPaused) return;
    
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          handleNext();
          return 100;
        }
        return p + 1; // 100 steps, 40ms each = 4 seconds per media
      });
    }, 40);
    return () => clearInterval(interval);
  }, [currentStoryIndex, currentMediaIndex, isPaused]);

  const handleNext = () => {
    if (currentMediaIndex < currentStory.media.length - 1) {
      // Next media in current story
      setCurrentMediaIndex(currentMediaIndex + 1);
    } else if (currentStoryIndex < MOCK_STORIES.length - 1) {
      // Next story
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentMediaIndex(0);
    } else {
      // End of all stories
      pop();
    }
  };

  const handlePrev = () => {
    if (currentMediaIndex > 0) {
      // Prev media in current story
      setCurrentMediaIndex(currentMediaIndex - 1);
    } else if (currentStoryIndex > 0) {
      // Prev story
      setCurrentStoryIndex(currentStoryIndex - 1);
      setCurrentMediaIndex(MOCK_STORIES[currentStoryIndex - 1].media.length - 1);
    } else {
      // Beginning of first story
      setProgress(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;
    
    if (diff > 80) {
      pop();
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
    setIsPaused(false);
  };

  if (!currentStory || !currentMedia) return null;

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>

      {/* Progress Bars */}
      <div style={{
        display: 'flex',
        gap: 4,
        padding: '50px 10px 10px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }}>
        {currentStory.media.map((_, idx) => (
          <div key={idx} style={{
            flex: 1,
            height: 3,
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: '#fff',
              width: `${idx < currentMediaIndex ? 100 : idx === currentMediaIndex ? progress : 0}%`,
              transition: idx === currentMediaIndex && !isPaused ? 'width 0.04s linear' : 'none'
            }} />
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 60,
        left: 15,
        right: 15,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={currentStory.avatar} alt="" style={{ width: 36, height: 36, borderRadius: 18, border: '1px solid #fff' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 14, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              {currentStory.name}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              {currentStory.timeAgo}
            </span>
          </div>
        </div>
        <div onClick={pop} style={{ cursor: 'pointer', padding: 5 }}>
          <X size={24} color="#fff" />
        </div>
      </div>

      {/* Image & Tap/Swipe Areas */}
      <div 
        style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img 
          src={currentMedia} 
          alt="Story" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        
        {/* Left Tap (Prev) - 40% */}
        <div 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '40%', zIndex: 5 }}
        />
        
        {/* Right Tap (Next) - 60% */}
        <div 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '60%', zIndex: 5 }}
        />
      </div>

      {/* Bottom Action Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px 15px 30px',
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        zIndex: 10
      }}>
        <div style={{
          flex: 1,
          height: 44,
          borderRadius: 22,
          border: '1px solid rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 15px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <input 
            type="text" 
            placeholder="Reply..." 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              outline: 'none',
              fontSize: 15
            }}
          />
        </div>
        <Heart size={28} color="#fff" style={{ cursor: 'pointer' }} />
        <Send size={28} color="#fff" style={{ cursor: 'pointer', transform: 'rotate(45deg)', marginTop: -4 }} />
      </div>
    </div>
  );
}
