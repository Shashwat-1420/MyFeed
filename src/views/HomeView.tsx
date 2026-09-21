import React from 'react';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { ResurfaceCard } from '../components/saves/ResurfaceCard';
import { SaveCard } from '../components/saves/SaveCard';
import { AdBanner } from '../components/common/AdBanner';
import { EmptyState } from '../components/common/EmptyState';
import { isDueForResurface } from '../lib/resurface';
import { Flame, Clock, Sparkles } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { saves, profile, setScreen, setTab } = useSavedFeedStore();

  // Dynamic greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Formatted date string
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  // Filter items due for resurfacing today
  const dueItems = saves.filter((s) => !s.is_archived && isDueForResurface(s.next_resurface_at));

  // Top 5 recently saved items
  const recentItems = saves.filter((s) => !s.is_archived).slice(0, 5);

  return (
    <div className="flex-1 flex flex-col p-4 bg-[#0D0D0D] text-[#F2F2F2] animate-fadeIn">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-5 pt-1">
        <div>
          <h1 className="text-xl font-bold text-[#F2F2F2] flex items-center gap-1.5">
            <span>{getGreeting()}, {profile.display_name || 'Arjun'}</span>
            <span className="animate-pulse">👋</span>
          </h1>
          <p className="text-xs text-[#9A9A9A] font-medium">{formattedDate}</p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Streak badge */}
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/30 text-[#FBBF24] text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-[#FBBF24]" />
            <span>{profile.streak_days}-day streak</span>
          </div>

          {/* Avatar button */}
          <button
            onClick={() => setScreen('profile')}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#7C6EF6] shadow-md hover:scale-105 transition-transform active:scale-95"
          >
            <img
              src={profile.avatar_url || 'https://picsum.photos/seed/user/100/100'}
              alt={profile.display_name || 'Profile'}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Review Today Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-[#7C6EF6]" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9A]">
              Review Today
            </span>
          </div>
          {dueItems.length > 0 ? (
            <span className="text-xs font-semibold text-[#7C6EF6] bg-[#7C6EF6]/15 px-2 py-0.5 rounded-full">
              {dueItems.length} due
            </span>
          ) : (
            <span className="text-xs font-semibold text-[#4ADE80] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> All clear
            </span>
          )}
        </div>

        {dueItems.length > 0 ? (
          <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {dueItems.map((item) => (
              <ResurfaceCard key={item.id} save={item} />
            ))}
          </div>
        ) : (
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-card p-4 text-center">
            <EmptyState type="home_all_reviewed" />
          </div>
        )}
      </section>

      {/* Recently Saved Section */}
      <section className="flex-1 mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9A]">
            Recently Saved
          </span>
          <button
            onClick={() => setTab('inbox')}
            className="text-xs text-[#7C6EF6] hover:text-[#9585F8] font-semibold transition-colors"
          >
            See all →
          </button>
        </div>

        {recentItems.length > 0 ? (
          <div className="space-y-3">
            {recentItems.map((item) => (
              <SaveCard key={item.id} save={item} />
            ))}
          </div>
        ) : (
          <EmptyState type="home_no_saves" onCtaClick={() => setScreen('new_save')} />
        )}
      </section>

      {/* AdMob Banner at bottom */}
      <AdBanner />
    </div>
  );
};
