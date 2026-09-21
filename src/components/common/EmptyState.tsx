import React from 'react';
import { Bookmark, Sparkles, Inbox, Search, FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  type: 'home_no_saves' | 'home_all_reviewed' | 'inbox_empty' | 'search_no_results' | 'category_empty';
  onCtaClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onCtaClick }) => {
  const configs = {
    home_no_saves: {
      icon: <Bookmark className="w-12 h-12 text-[#7C6EF6]" />,
      heading: 'Nothing saved yet',
      subtext: "Save your first link from Instagram, YouTube, or Reddit and we'll take it from here.",
      cta: 'Save something →',
    },
    home_all_reviewed: {
      icon: <Sparkles className="w-12 h-12 text-[#4ADE80]" />,
      heading: "You're all caught up ✓",
      subtext: 'Great job! You have reviewed all your scheduled saves for today.',
      cta: undefined,
    },
    inbox_empty: {
      icon: <Inbox className="w-12 h-12 text-[#7C6EF6]" />,
      heading: 'Your inbox is empty',
      subtext: 'Share any post from Instagram, YouTube, or Reddit to start building your second brain.',
      cta: 'Save a link →',
    },
    search_no_results: {
      icon: <Search className="w-12 h-12 text-[#5A5A5A]" />,
      heading: 'Nothing found',
      subtext: 'Try searching with different keywords, or save more content first.',
      cta: undefined,
    },
    category_empty: {
      icon: <FolderOpen className="w-12 h-12 text-[#5A5A5A]" />,
      heading: 'No saves here yet',
      subtext: 'When you save something in this category, it will show up here automatically.',
      cta: undefined,
    },
  };

  const config = configs[type];

  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center animate-fadeIn">
      <div className="w-20 h-20 rounded-2xl bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center mb-4 shadow-card">
        {config.icon}
      </div>
      <h3 className="text-lg font-semibold text-[#F2F2F2] mb-1.5">{config.heading}</h3>
      <p className="text-xs text-[#9A9A9A] max-w-[260px] leading-relaxed mb-5">{config.subtext}</p>
      {config.cta && (
        <button
          onClick={onCtaClick}
          className="bg-[#7C6EF6] hover:bg-[#9585F8] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-glow transition-all active:scale-95"
        >
          {config.cta}
        </button>
      )}
    </div>
  );
};
