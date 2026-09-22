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
    <div className="flex-1 flex flex-col p-4 bg-canvas text-ink animate-fadeIn">
      {/* iQOO Hackathon Edition Banner */}
      <div className="w-full mb-4 p-3 rounded-2xl bg-gradient-to-r from-[#F0B31C]/20 via-panel to-canvas border border-[#F0B31C]/40 flex items-center justify-between glow-iqoo relative overflow-hidden">
        <div className="flex items-center space-x-2.5 z-10">
          <div className="w-8 h-8 rounded-xl bg-[#F0B31C] flex items-center justify-center text-black font-display font-bold text-sm shadow-md">
            ⚡
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display tracking-widest text-gold font-bold text-xs uppercase">iQOO HACKATHON 2026</span>
              <span className="text-[9px] bg-[#F0B31C]/30 text-gold px-1.5 py-0.5 rounded font-mono">FINALS</span>
            </div>
            <p className="text-[10px] text-muted font-mono">India's Biggest Phone-First Hackathon</p>
          </div>
        </div>
        <div className="text-right z-10">
          <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider block">QUEST FOR OVERCOME</span>
        </div>
      </div>

      {/* Header Area */}
      <div className="flex items-center justify-between mb-5 pt-1">
        <div>
          <h1 className="text-xl font-bold text-ink flex items-center gap-1.5 font-display tracking-wide">
            <span>{getGreeting()}, {profile.display_name || 'Arjun'}</span>
            <span className="animate-pulse">⚡</span>
          </h1>
          <p className="text-xs text-muted font-medium">{formattedDate}</p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Streak badge */}
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#F0B31C]/20 border border-[#F0B31C]/50 text-gold text-xs font-display font-bold uppercase tracking-wider glow-iqoo">
            <Flame className="w-3.5 h-3.5 fill-[#F0B31C]" />
            <span>{profile.streak_days}-DAY STREAK</span>
          </div>

          {/* Avatar button */}
          <button
            onClick={() => setScreen('profile')}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#F0B31C] shadow-glow hover:scale-105 transition-transform active:scale-95"
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
            <Clock className="w-3.5 h-3.5 text-gold" />
            <span className="text-[11px] font-display font-bold uppercase tracking-widest text-gold">
              Review Today
            </span>
          </div>
          {dueItems.length > 0 ? (
            <span className="text-xs font-display font-bold uppercase text-gold bg-[#F0B31C]/20 border border-[#F0B31C]/40 px-2 py-0.5 rounded-full">
              {dueItems.length} DUE
            </span>
          ) : (
            <span className="text-xs font-semibold text-[#10B981] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold" /> All clear
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
          <div className="bg-panel border border-[#F0B31C]/20 rounded-card p-4 text-center">
            <EmptyState type="home_all_reviewed" />
          </div>
        )}
      </section>

      {/* Recently Saved Section */}
      <section className="flex-1 mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-display font-bold uppercase tracking-widest text-muted">
            Recently Saved
          </span>
          <button
            onClick={() => setTab('inbox')}
            className="text-xs text-gold hover:text-gold font-display font-bold uppercase tracking-wider transition-colors"
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
