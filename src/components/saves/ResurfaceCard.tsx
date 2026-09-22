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
      className={`w-[260px] h-[165px] bg-[#12131C]/90 border border-[#F0B31C]/30 hover:border-[#F0B31C] rounded-card flex flex-col justify-between overflow-hidden shrink-0 shadow-card cursor-pointer transition-all duration-300 relative group select-none ${
        swipeState === 'reviewed'
          ? 'translate-x-[200px] opacity-0 scale-90 border-[#F0B31C] glow-iqoo-lg'
          : swipeState === 'skipped'
          ? '-translate-x-[200px] opacity-0 scale-90 border-[#626478]'
          : 'hover:-translate-y-1 hover:shadow-glow'
      }`}
    >
      {/* Top thumbnail 75px */}
      <div className="h-[75px] w-full relative bg-[#08080C] overflow-hidden">
        <img
          src={save.image_url || 'https://picsum.photos/seed/resurface/400/200'}
          alt={save.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12131C] via-transparent to-black/40" />
        <div className="absolute top-2 left-2 z-10">
          <CategoryBadge category={save.category} size="sm" />
        </div>
      </div>

      {/* Middle info */}
      <div className="px-3 pt-1 flex-1 flex flex-col justify-between">
        <h4 className="text-xs font-semibold text-[#F2F2F6] line-clamp-2 leading-tight group-hover:text-[#F0B31C] transition-colors">
          {save.title}
        </h4>
        <div className="text-[10px] text-[#A0A2B0] flex items-center justify-between pb-1">
          <span className="truncate font-mono text-[#F0B31C]/80">{save.domain}</span>
          <span>•</span>
          <span>{formatRelativeDaysAgo(save.created_at)}</span>
        </div>
      </div>

      {/* Bottom actions bar */}
      <div className="h-[36px] border-t border-[#F0B31C]/20 bg-[#08080C] grid grid-cols-2 divide-x divide-[#F0B31C]/20">
        <button
          onClick={handleReviewed}
          className="flex items-center justify-center space-x-1 text-[11px] font-display font-bold uppercase tracking-wider text-[#F0B31C] hover:bg-[#F0B31C]/20 transition-all active:scale-95"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Reviewed</span>
        </button>
        <button
          onClick={handleSkip}
          className="flex items-center justify-center space-x-1 text-[11px] font-medium text-[#A0A2B0] hover:bg-[#1A1C2B] hover:text-[#F2F2F6] transition-colors active:scale-95"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
