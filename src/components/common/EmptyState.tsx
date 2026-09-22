import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Bookmark, Sparkles, Inbox, Search, FolderOpen } from 'lucide-react-native';
import { useThemeColors } from '../../lib/theme';

interface EmptyStateProps {
  type: 'home_no_saves' | 'home_all_reviewed' | 'inbox_empty' | 'search_no_results' | 'category_empty';
  onCtaClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onCtaClick }) => {
  const c = useThemeColors();

  const configs = {
    home_no_saves: {
      Icon: Bookmark,
      iconColor: c.gold,
      heading: 'Nothing saved yet',
      subtext: "Save your first link from Instagram, YouTube, or Reddit and we'll take it from here.",
      cta: 'Save something →',
    },
    home_all_reviewed: {
      Icon: Sparkles,
      iconColor: c.gold,
      heading: "You're all caught up",
      subtext: 'Great job! You have reviewed all your scheduled saves for today.',
      cta: undefined,
    },
    inbox_empty: {
      Icon: Inbox,
      iconColor: c.gold,
      heading: 'Your inbox is empty',
      subtext: 'Share any post from Instagram, YouTube, or Reddit to start building your second brain.',
      cta: 'Save a link →',
    },
    search_no_results: {
      Icon: Search,
      iconColor: c.dim,
      heading: 'Nothing found',
      subtext: 'Try searching with different keywords, or save more content first.',
      cta: undefined,
    },
    category_empty: {
      Icon: FolderOpen,
      iconColor: c.dim,
      heading: 'No saves here yet',
      subtext: 'When you save something in this category, it will show up here automatically.',
      cta: undefined,
    },
  };

  const config = configs[type];
  const { Icon } = config;

  return (
    <View className="flex-col items-center justify-center py-10 px-6">
      <View className="w-20 h-20 rounded-2xl bg-panel border border-gold/30 items-center justify-center mb-4 shadow-card">
        <Icon size={44} color={config.iconColor} />
      </View>
      <Text className="text-lg font-display font-bold uppercase tracking-wider text-gold mb-1.5 text-center">
        {config.heading}
      </Text>
      <Text className="text-xs text-muted max-w-[260px] leading-relaxed mb-5 text-center">
        {config.subtext}
      </Text>
      {config.cta && (
        <Pressable
          onPress={onCtaClick}
          className="bg-gold-fill active:opacity-80 px-5 py-2.5 rounded-xl shadow-glow"
        >
          <Text className="text-black text-xs font-display font-bold uppercase tracking-wider">
            {config.cta}
          </Text>
        </Pressable>
      )}
    </View>
  );
};