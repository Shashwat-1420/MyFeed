import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { SaveCard } from '../components/saves/SaveCard';
import { EmptyState } from '../components/common/EmptyState';
import { AdBanner } from '../components/common/AdBanner';
import { CATEGORY_LIST } from '../lib/categories';
import { Category } from '../types/savedfeed';
import { Search, RefreshCw, Star } from 'lucide-react-native';
import { useThemeColors } from '../lib/theme';

export const InboxView: React.FC = () => {
  const { saves, categoryFilter, setCategoryFilter, setTab, setScreen } = useSavedFeedStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const c = useThemeColors();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const filteredSaves = saves.filter((s) => {
    if (s.is_archived) return false;
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'favourites') return s.is_favourite;
    return s.category === categoryFilter;
  });

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Bar */}
        <View className="flex-row items-center justify-between mb-3 pt-1">
          <Text className="text-xl font-display font-bold uppercase tracking-wider text-gold">
            Inbox
          </Text>
          <Pressable
            onPress={handleRefresh}
            className="p-2 rounded-xl bg-panel border border-gold/30 active:opacity-70"
          >
            <RefreshCw size={16} color={isRefreshing ? c.gold : c.muted} />
          </Pressable>
        </View>

        {/* Search trigger bar */}
        <Pressable
          onPress={() => setTab('search')}
          className="w-full h-11 bg-panel border border-gold/30 rounded-xl px-3.5 flex-row items-center gap-2.5 mb-3 active:opacity-80"
        >
          <Search size={16} color={c.gold} />
          <Text className="text-xs text-muted">Search your saves...</Text>
        </Pressable>

        {/* Category filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 pb-3 mb-2"
        >
          {/* All chip */}
          <Pressable
            onPress={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full shrink-0 ${
              categoryFilter === 'all'
                ? 'bg-gold-fill shadow-glow'
                : 'bg-panel border border-gold/30'
            }`}
          >
            <Text
              className={`text-xs font-display font-bold uppercase tracking-wider ${
                categoryFilter === 'all' ? 'text-black' : 'text-muted'
              }`}
            >
              All ({saves.filter((s) => !s.is_archived).length})
            </Text>
          </Pressable>

          {/* Favourites chip */}
          <Pressable
            onPress={() => setCategoryFilter('favourites')}
            className={`px-3 py-1.5 rounded-full shrink-0 flex-row items-center gap-1 ${
              categoryFilter === 'favourites'
                ? 'bg-gold-fill shadow-glow'
                : 'bg-panel border border-gold/30'
            }`}
          >
            <Star
              size={12}
              color={categoryFilter === 'favourites' ? '#000000' : c.muted}
              fill={categoryFilter === 'favourites' ? '#000000' : 'none'}
            />
            <Text
              className={`text-xs font-display font-bold uppercase tracking-wider ${
                categoryFilter === 'favourites' ? 'text-black' : 'text-muted'
              }`}
            >
              Favourites
            </Text>
          </Pressable>

          {/* Category chips */}
          {CATEGORY_LIST.map((cat) => {
            const count = saves.filter((s) => !s.is_archived && s.category === cat.id).length;
            const isActive = categoryFilter === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setCategoryFilter(cat.id as Category)}
                className={`px-3 py-1.5 rounded-full shrink-0 flex-row items-center gap-1 ${
                  isActive ? 'bg-gold-fill shadow-glow' : 'bg-panel border border-gold/30'
                }`}
              >
                <Text className="text-xs">{cat.emoji}</Text>
                <Text
                  className={`text-xs font-display font-bold uppercase tracking-wider ${
                    isActive ? 'text-black' : 'text-muted'
                  }`}
                >
                  {cat.label}
                </Text>
                {count > 0 && (
                  <Text
                    className={`text-[10px] font-mono ${
                      isActive ? 'text-black' : 'text-muted'
                    }`}
                  >
                    ({count})
                  </Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Save Cards List */}
        {filteredSaves.length > 0 ? (
          <View className="gap-3">
            {filteredSaves.map((item) => (
              <SaveCard key={item.id} save={item} />
            ))}
          </View>
        ) : (
          <EmptyState type="inbox_empty" onCtaClick={() => setScreen('new_save')} />
        )}

        <AdBanner />
      </ScrollView>
    </View>
  );
};