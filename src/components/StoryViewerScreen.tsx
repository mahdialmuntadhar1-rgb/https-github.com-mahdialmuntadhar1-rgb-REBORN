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
    <div className="fixed inset-0 bg-black z-[1000] flex flex-col animate-[fadeIn_0.2s_ease-out]">
      {/* Progress Bars */}
      <div className="flex gap-1 pt-[50px] px-2.5 pb-2.5 absolute top-0 left-0 right-0 z-10">
        {currentStory.media.map((_, idx) => (
          <div key={idx} className="flex-1 h-[3px] bg-white/30 rounded-[2px] overflow-hidden">
            <div 
              className="h-full bg-white"
              style={{
                width: `${idx < currentMediaIndex ? 100 : idx === currentMediaIndex ? progress : 0}%`,
                transition: idx === currentMediaIndex && !isPaused ? 'width 0.04s linear' : 'none'
              }} 
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-[60px] left-[15px] right-[15px] flex justify-between items-center z-10">
        <div className="flex items-center gap-2.5">
          <img src={currentStory.avatar} alt="" className="w-9 h-9 rounded-full border border-white" />
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm drop-shadow-md">
              {currentStory.name}
            </span>
            <span className="text-white/80 text-xs drop-shadow-md">
              {currentStory.timeAgo}
            </span>
          </div>
        </div>
        <div onClick={pop} className="cursor-pointer p-1.5">
          <X size={24} className="text-white" />
        </div>
      </div>

      {/* Image & Tap/Swipe Areas */}
      <div 
        className="flex-1 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img 
          src={currentMedia} 
          alt="Story" 
          className="w-full h-full object-cover" 
        />
        
        {/* Left Tap (Prev) - 40% */}
        <div 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="absolute top-0 bottom-0 left-0 w-[40%] z-10"
        />
        
        {/* Right Tap (Next) - 60% */}
        <div 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="absolute top-0 bottom-0 right-0 w-[60%] z-10"
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 pt-5 px-[15px] pb-[30px] flex items-center gap-[15px] bg-gradient-to-t from-black/80 to-transparent z-10">
        <div className="flex-1 h-11 rounded-full border border-white/40 flex items-center px-[15px] bg-black/20 backdrop-blur-md">
          <input 
            type="text" 
            placeholder="Reply..." 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            className="flex-1 bg-transparent border-none text-white outline-none text-[15px] placeholder:text-white/60"
          />
        </div>
        <Heart size={28} className="text-white cursor-pointer" />
        <Send size={28} className="text-white cursor-pointer rotate-45 -mt-1" />
      </div>
    </div>
  );
}
