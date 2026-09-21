import React, { useState } from 'react';
import { SaveItem } from '../../types/savedfeed';
import { CategoryBadge } from '../common/CategoryBadge';
import { formatRelativeDaysAgo } from '../../lib/resurface';
import { useSavedFeedStore } from '../../store/useSavedFeedStore';
import { Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResurfaceCardProps {
  save: SaveItem;
}

export const ResurfaceCard: React.FC<ResurfaceCardProps> = ({ save }) => {
  const { markReviewed, skipResurface, setScreen } = useSavedFeedStore();
  const [swipeState, setSwipeState] = useState<'idle' | 'reviewed' | 'skipped'>('idle');

  const handleReviewed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSwipeState('reviewed');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4ADE80', '#7C6EF6', '#FBBF24'],
      });
    } catch {
      // fallback
    }

    setTimeout(() => {
      markReviewed(save.id);
    }, 300);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSwipeState('skipped');
    setTimeout(() => {
      skipResurface(save.id);
    }, 300);
  };

  return (
    <div
      onClick={() => setScreen('save_detail', save.id)}
      className={`w-[260px] h-[165px] bg-[#1A1A1A] border border-[#2E2E2E] hover:border-[#7C6EF6]/40 rounded-card flex flex-col justify-between overflow-hidden shrink-0 shadow-card cursor-pointer transition-all duration-300 relative group select-none ${
        swipeState === 'reviewed'
          ? 'translate-x-[200px] opacity-0 scale-90 border-[#4ADE80]'
          : swipeState === 'skipped'
          ? '-translate-x-[200px] opacity-0 scale-90 border-[#5A5A5A]'
          : 'hover:-translate-y-1'
      }`}
    >
      {/* Top thumbnail 80px */}
      <div className="h-[75px] w-full relative bg-[#242424] overflow-hidden">
        <img
          src={save.image_url || 'https://picsum.photos/seed/resurface/400/200'}
          alt={save.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/30" />
        <div className="absolute top-2 left-2 z-10">
          <CategoryBadge category={save.category} size="sm" />
        </div>
      </div>

      {/* Middle info */}
      <div className="px-3 pt-1 flex-1 flex flex-col justify-between">
        <h4 className="text-xs font-semibold text-[#F2F2F2] line-clamp-2 leading-tight group-hover:text-[#7C6EF6] transition-colors">
          {save.title}
        </h4>
        <div className="text-[10px] text-[#9A9A9A] flex items-center justify-between pb-1">
          <span className="truncate">{save.domain}</span>
          <span>•</span>
          <span>{formatRelativeDaysAgo(save.created_at)}</span>
        </div>
      </div>

      {/* Bottom actions bar */}
      <div className="h-[36px] border-t border-[#2E2E2E] bg-[#141414] grid grid-cols-2 divide-x divide-[#2E2E2E]">
        <button
          onClick={handleReviewed}
          className="flex items-center justify-center space-x-1 text-[11px] font-semibold text-[#4ADE80] hover:bg-[#4ADE80]/10 transition-colors active:scale-95"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Reviewed</span>
        </button>
        <button
          onClick={handleSkip}
          className="flex items-center justify-center space-x-1 text-[11px] font-medium text-[#9A9A9A] hover:bg-[#242424] hover:text-white transition-colors active:scale-95"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
