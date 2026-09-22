import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { ResurfaceCard } from '../components/saves/ResurfaceCard';
import { SaveCard } from '../components/saves/SaveCard';
import { AdBanner } from '../components/common/AdBanner';
import { EmptyState } from '../components/common/EmptyState';
import { isDueForResurface } from '../lib/resurface';
import { Flame, Clock, Sparkles } from 'lucide-react-native';
import { useThemeColors } from '../lib/theme';

export const HomeView: React.FC = () => {
  const { saves, profile, setScreen, setTab } = useSavedFeedStore();
  const c = useThemeColors();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const dueItems = saves.filter((s) => !s.is_archived && isDueForResurface(s.next_resurface_at));
  const recentItems = saves.filter((s) => !s.is_archived).slice(0, 5);

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="p-4 pb-8"
      showsVerticalScrollIndicator={false}
    >
      {/* iQOO Hackathon Edition Banner — flat panel scrim replaces the web gradient */}
      <View className="w-full mb-4 p-3 rounded-2xl bg-panel border border-gold/40 flex-row items-center justify-between shadow-glow">
        <View className="flex-row items-center gap-2.5 flex-1">
          <View className="w-8 h-8 rounded-xl bg-gold-fill items-center justify-center">
            <Text className="text-black font-display font-bold text-sm">⚡</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="font-display tracking-widest text-gold font-bold text-xs uppercase">
                iQOO Hackathon 2026
              </Text>
              <View className="bg-gold/30 px-1.5 py-0.5 rounded">
                <Text className="text-[9px] text-gold font-mono">FINALS</Text>
              </View>
            </View>
            <Text className="text-[10px] text-muted font-mono">
              India's Biggest Phone-First Hackathon
            </Text>
          </View>
        </View>
      </View>

      {/* Header Area */}
      <View className="flex-row items-center justify-between mb-5 pt-1">
        <View className="flex-1">
          <Text className="text-xl font-bold text-ink font-display tracking-wide">
            {getGreeting()}, {profile.display_name || 'Arjun'} ⚡
          </Text>
          <Text className="text-xs text-muted font-medium">{formattedDate}</Text>
        </View>

        <View className="flex-row items-center gap-2">
          {/* Streak badge */}
          <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-gold/20 border border-gold/50">
            <Flame size={14} color={c.gold} fill={c.gold} />
            <Text className="text-gold text-xs font-display font-bold uppercase tracking-wider">
              {profile.streak_days}-Day Streak
            </Text>
          </View>

          {/* Avatar button */}
          <Pressable
            onPress={() => setScreen('profile')}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold shadow-glow active:opacity-80"
          >
            <Image
              source={{ uri: profile.avatar_url || 'https://picsum.photos/seed/user/100/100' }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </Pressable>
        </View>
      </View>

      {/* Review Today Section */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-2.5">
          <View className="flex-row items-center gap-1.5">
            <Clock size={14} color={c.gold} />
            <Text className="text-[11px] font-display font-bold uppercase tracking-widest text-gold">
              Review Today
            </Text>
          </View>
          {dueItems.length > 0 ? (
            <View className="bg-gold/20 border border-gold/40 px-2 py-0.5 rounded-full">
              <Text className="text-xs font-display font-bold uppercase text-gold">
                {dueItems.length} Due
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-1">
              <Sparkles size={12} color={c.gold} />
              <Text className="text-xs font-semibold text-[#10B981]">All clear</Text>
            </View>
          )}
        </View>

        {dueItems.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 pb-2"
          >
            {dueItems.map((item) => (
              <ResurfaceCard key={item.id} save={item} />
            ))}
          </ScrollView>
        ) : (
          <View className="bg-panel border border-gold/20 rounded-card p-4 items-center">
            <EmptyState type="home_all_reviewed" />
          </View>
        )}
      </View>

      {/* Recently Saved Section */}
      <View className="flex-1 mb-4">
        <View className="flex-row items-center justify-between mb-2.5">
          <Text className="text-[11px] font-display font-bold uppercase tracking-widest text-muted">
            Recently Saved
          </Text>
          <Pressable onPress={() => setTab('inbox')} className="active:opacity-70">
            <Text className="text-xs text-gold font-display font-bold uppercase tracking-wider">
              See all →
            </Text>
          </Pressable>
        </View>

        {recentItems.length > 0 ? (
          <View className="gap-3">
            {recentItems.map((item) => (
              <SaveCard key={item.id} save={item} />
            ))}
          </View>
        ) : (
          <EmptyState type="home_no_saves" onCtaClick={() => setScreen('new_save')} />
        )}
      </View>

      {/* AdMob Banner at bottom */}
      <AdBanner />
    </ScrollView>
  );
};