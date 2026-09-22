import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SaveItem } from '../../types/savedfeed';
import { CategoryBadge } from '../common/CategoryBadge';
import { formatRelativeDaysAgo } from '../../lib/resurface';
import { useSavedFeedStore } from '../../store/useSavedFeedStore';
import { Check, ArrowRight } from 'lucide-react-native';
import { celebrate } from '../../lib/confetti';
import { useThemeColors } from '../../lib/theme';

interface ResurfaceCardProps {
  save: SaveItem;
}

export const ResurfaceCard: React.FC<ResurfaceCardProps> = ({ save }) => {
  const { markReviewed, skipResurface, setScreen } = useSavedFeedStore();
  const [swipeState, setSwipeState] = useState<'idle' | 'reviewed' | 'skipped'>('idle');
  const c = useThemeColors();

  const handleReviewed = () => {
    setSwipeState('reviewed');

    // Celebration (no-op shim on native, see src/lib/confetti.ts)
    try {
      celebrate({ particleCount: 40, spread: 60, origin: { y: 0.7 }, colors: ['#4ADE80', '#FFC800', '#FBBF24'] });
    } catch {
      // fallback
    }

    setTimeout(() => {
      markReviewed(save.id);
    }, 300);
  };

  const handleSkip = () => {
    setSwipeState('skipped');
    setTimeout(() => {
      skipResurface(save.id);
    }, 300);
  };

  return (
    <Pressable
      onPress={() => setScreen('save_detail', save.id)}
      style={{
        opacity: swipeState === 'idle' ? 1 : 0,
        borderColor:
          swipeState === 'reviewed'
            ? '#FFC800'
            : swipeState === 'skipped'
            ? '#2E2E2E'
            : 'rgba(255,200,0,0.30)',
      }}
      className="w-[260px] h-[165px] bg-panel/90 border rounded-card flex-col justify-between overflow-hidden shrink-0 shadow-card"
    >
      {/* Top thumbnail 75px */}
      <View className="h-[75px] w-full relative bg-canvas overflow-hidden">
        <Image
          source={{ uri: save.image_url || 'https://picsum.photos/seed/resurface/400/200' }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {/* gradient overlay replaced with a flat scrim (RN has no CSS gradients) */}
        <View className="absolute inset-0 bg-black/30" />
        <View className="absolute top-2 left-2">
          <CategoryBadge category={save.category} size="sm" />
        </View>
      </View>

      {/* Middle info */}
      <View className="px-3 pt-1 flex-1 flex-col justify-between">
        <Text numberOfLines={2} className="text-xs font-semibold text-ink leading-tight">
          {save.title}
        </Text>
        <View className="flex-row items-center justify-between pb-1">
          <Text numberOfLines={1} className="text-[10px] font-mono text-gold flex-1">
            {save.domain}
          </Text>
          <Text className="text-[10px] text-muted px-1">•</Text>
          <Text className="text-[10px] text-muted">{formatRelativeDaysAgo(save.created_at)}</Text>
        </View>
      </View>

      {/* Bottom actions bar */}
      <View className="h-[36px] border-t border-gold/20 bg-canvas flex-row">
        <Pressable
          onPress={handleReviewed}
          className="flex-1 flex-row items-center justify-center gap-1 border-r border-gold/20 active:bg-gold/20"
        >
          <Check size={14} color={c.gold} strokeWidth={3} />
          <Text className="text-[11px] font-display font-bold uppercase tracking-wider text-gold">
            Reviewed
          </Text>
        </Pressable>
        <Pressable
          onPress={handleSkip}
          className="flex-1 flex-row items-center justify-center gap-1 active:bg-chip"
        >
          <Text className="text-[11px] font-medium text-muted">Skip</Text>
          <ArrowRight size={14} color={c.muted} />
        </Pressable>
      </View>
    </Pressable>
  );
};