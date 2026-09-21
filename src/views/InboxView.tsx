import React, { useState } from 'react';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { SaveCard } from '../components/saves/SaveCard';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { EmptyState } from '../components/common/EmptyState';
import { AdBanner } from '../components/common/AdBanner';
import { CATEGORY_LIST } from '../lib/categories';
import { Category } from '../types/savedfeed';
import { Search, RefreshCw, Star, Filter } from 'lucide-react';

export const InboxView: React.FC = () => {
  const { saves, categoryFilter, setCategoryFilter, setTab, setScreen } = useSavedFeedStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Filter saves based on active chip
  const filteredSaves = saves.filter((s) => {
    if (s.is_archived) return false;
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'favourites') return s.is_favourite;
    return s.category === categoryFilter;
  });

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#0D0D0D] text-[#F2F2F2] animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-3 pt-1">
        <h1 className="text-xl font-bold text-[#F2F2F2]">Inbox</h1>
        <button
          onClick={handleRefresh}
          className={`p-2 rounded-xl bg-[#1A1A1A] border border-[#2E2E2E] text-[#9A9A9A] hover:text-white transition-all ${
            isRefreshing ? 'animate-spin text-[#7C6EF6]' : ''
          }`}
          title="Pull to refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search trigger bar */}
      <div
        onClick={() => setTab('search')}
        className="w-full h-11 bg-[#1A1A1A] border border-[#2E2E2E] hover:border-[#7C6EF6]/40 rounded-xl px-3.5 flex items-center space-x-2.5 text-xs text-[#5A5A5A] cursor-pointer mb-3 transition-colors shadow-sm"
      >
        <Search className="w-4 h-4 text-[#5A5A5A]" />
        <span>Search your saves...</span>
      </div>

      {/* Category filter chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
        {/* All chip */}
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
            categoryFilter === 'all'
              ? 'bg-[#7C6EF6] text-white shadow-glow'
              : 'bg-[#1A1A1A] border border-[#2E2E2E] text-[#9A9A9A] hover:text-white'
          }`}
        >
          All ({saves.filter((s) => !s.is_archived).length})
        </button>

        {/* Favourites chip */}
        <button
          onClick={() => setCategoryFilter('favourites')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 flex items-center space-x-1 transition-all ${
            categoryFilter === 'favourites'
              ? 'bg-[#FBBF24] text-black shadow-md'
              : 'bg-[#1A1A1A] border border-[#2E2E2E] text-[#9A9A9A] hover:text-white'
          }`}
        >
          <Star className="w-3 h-3 fill-current" />
          <span>Favourites</span>
        </button>

        {/* 14 Category chips */}
        {CATEGORY_LIST.map((cat) => {
          const count = saves.filter((s) => !s.is_archived && s.category === cat.id).length;
          const isActive = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as Category)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 flex items-center space-x-1 transition-all ${
                isActive
                  ? 'bg-[#7C6EF6] text-white shadow-glow'
                  : 'bg-[#1A1A1A] border border-[#2E2E2E] text-[#9A9A9A] hover:text-white'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {count > 0 && <span className="text-[10px] opacity-75">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Save Cards List */}
      <div className="flex-1 space-y-3 min-h-[300px]">
        {filteredSaves.length > 0 ? (
          filteredSaves.map((item) => <SaveCard key={item.id} save={item} />)
        ) : (
          <EmptyState type="inbox_empty" onCtaClick={() => setScreen('new_save')} />
        )}
      </div>

      <AdBanner />
    </div>
  );
};
