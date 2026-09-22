import React from 'react';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { CATEGORY_LIST } from '../lib/categories';
import { Category } from '../types/savedfeed';
import { ChevronRight } from 'lucide-react';

export const CategoriesView: React.FC = () => {
  const { saves, setCategoryFilter, setTab } = useSavedFeedStore();

  const activeSaves = saves.filter((s) => !s.is_archived);
  const activeCategoriesCount = CATEGORY_LIST.filter(
    (cat) => activeSaves.filter((s) => s.category === cat.id).length > 0
  ).length;

  const handleCategoryClick = (catId: Category) => {
    setCategoryFilter(catId);
    setTab('inbox');
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#08080C] text-[#F2F2F6] animate-fadeIn">
      {/* Header */}
      <div className="mb-4 pt-1">
        <h1 className="text-xl font-display font-bold uppercase tracking-wide text-[#F0B31C] flex items-center gap-2">
          <span>Categories</span>
          <span className="text-xs font-mono text-[#A0A2B0] font-normal lowercase bg-[#1A1C2B] px-2 py-0.5 rounded border border-[#F0B31C]/30">City Battles</span>
        </h1>
        <p className="text-xs text-[#A0A2B0]">
          {activeSaves.length} saves across {activeCategoriesCount} active categories
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pb-4 no-scrollbar">
        {CATEGORY_LIST.map((cat) => {
          const count = activeSaves.filter((s) => s.category === cat.id).length;
          const isEmpty = count === 0;

          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id as Category)}
              style={{
                backgroundColor: `${cat.color}15`,
                borderLeftColor: cat.color,
              }}
              className={`border-l-4 border-y border-r border-[#F0B31C]/20 rounded-card p-3.5 flex flex-col justify-between h-[110px] cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-card group ${
                isEmpty ? 'opacity-50 hover:opacity-75' : 'hover:border-[#F0B31C]/50 hover:shadow-glow'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
                <ChevronRight className="w-4 h-4 text-[#626478] group-hover:text-[#F0B31C] transition-colors" />
              </div>

              <div>
                <h3 className="text-xs font-display font-bold uppercase tracking-wider text-[#F2F2F6] truncate">{cat.label}</h3>
                <span className="text-[11px] text-[#A0A2B0] font-mono">
                  {count > 0 ? `${count} save${count > 1 ? 's' : ''}` : 'No saves yet'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
