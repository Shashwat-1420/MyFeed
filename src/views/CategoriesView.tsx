import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { CATEGORY_LIST } from '../lib/categories';
import { Category } from '../types/savedfeed';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '../lib/theme';

export const CategoriesView: React.FC = () => {
  const { saves, setCategoryFilter, setTab } = useSavedFeedStore();
  const c = useThemeColors();

  const activeSaves = saves.filter((s) => !s.is_archived);
  const activeCategoriesCount = CATEGORY_LIST.filter(
    (cat) => activeSaves.filter((s) => s.category === cat.id).length > 0
  ).length;

  const handleCategoryClick = (catId: Category) => {
    setCategoryFilter(catId);
    setTab('inbox');
  };

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-4 pt-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl font-display font-bold uppercase tracking-wide text-gold">
              Categories
            </Text>
            <View className="bg-chip px-2 py-0.5 rounded border border-gold/30">
              <Text className="text-xs font-mono text-muted lowercase">City Battles</Text>
            </View>
          </View>
          <Text className="text-xs text-muted">
            {activeSaves.length} saves across {activeCategoriesCount} active categories
          </Text>
        </View>

        {/* 2-Column Grid (RN has no CSS grid → flex-wrap) */}
        <View className="flex-row flex-wrap gap-3">
          {CATEGORY_LIST.map((cat) => {
            const count = activeSaves.filter((s) => s.category === cat.id).length;
            const isEmpty = count === 0;
            const Icon = cat.icon;

            return (
              <Pressable
                key={cat.id}
                onPress={() => handleCategoryClick(cat.id as Category)}
                style={{ width: '48%', opacity: isEmpty ? 0.5 : 1 }}
                className="border-l-4 border-y border-r border-gold/20 rounded-card p-3.5 flex-col justify-between h-[110px] active:opacity-80 shadow-card"
              >
                <View className="flex-row items-center justify-between">
                  <Icon size={22} color={c.gold} />
                  <ChevronRight size={16} color={c.dim} />
                </View>

                <View>
                  <Text
                    numberOfLines={1}
                    className="text-xs font-display font-bold uppercase tracking-wider text-ink"
                  >
                    {cat.label}
                  </Text>
                  <Text className="text-[11px] text-muted font-mono">
                    {count > 0 ? `${count} save${count > 1 ? 's' : ''}` : 'No saves yet'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};