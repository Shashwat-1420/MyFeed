import React, { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { SaveItem } from '../../types/savedfeed';
import { CategoryBadge } from '../common/CategoryBadge';
import { SaveThumbnail } from '../common/SaveThumbnail';
import { formatRelativeDaysAgo } from '../../lib/resurface';
import { useSavedFeedStore } from '../../store/useSavedFeedStore';
import { BottomSheetModal } from '../common/BottomSheetModal';
import { Star, Archive, Trash2, Globe, ExternalLink, Sparkles } from 'lucide-react-native';
import { useThemeColors } from '../../lib/theme';

interface SaveCardProps {
  save: SaveItem;
  showCategory?: boolean;
  semanticMatch?: boolean;
}

export const SaveCard: React.FC<SaveCardProps> = ({
  save,
  showCategory = true,
  semanticMatch = false,
}) => {
  const { setScreen, toggleFavourite, archiveSave, deleteSave } = useSavedFeedStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const c = useThemeColors();

  const openOriginal = () => {
    if (save.url) Linking.openURL(save.url).catch(() => {});
    setIsMenuOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setScreen('save_detail', save.id)}
        onLongPress={() => setIsMenuOpen(true)}
        style={{ opacity: isDeleting ? 0 : 1 }}
        className="w-full bg-panel/90 border border-gold/20 rounded-card p-3.5 shadow-card relative overflow-hidden mb-3 active:opacity-90"
      >
        {/* Semantic search match indicator */}
        {semanticMatch && (
          <View className="flex-row items-center gap-1 mb-1">
            <Sparkles size={10} color={c.gold} />
            <Text className="text-[10px] text-gold font-mono font-semibold">AI Semantic Match</Text>
          </View>
        )}

        <View className="flex-row items-start gap-3">
          {/* Thumbnail */}
          <View className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-canvas shrink-0 border border-gold/20">
            <SaveThumbnail uri={save.image_url} label={save.domain} letterSize={22} />
          </View>

          {/* Right details column */}
          <View className="flex-1 min-w-0 flex-col justify-between h-[72px]">
            <View>
              <View className="flex-row items-center justify-between mb-1">
                {showCategory && <CategoryBadge category={save.category} size="sm" />}
                {save.is_favourite && <Star size={14} color={c.gold} fill={c.gold} />}
              </View>
              <Text numberOfLines={2} className="text-xs font-semibold text-ink leading-snug">
                {save.title}
              </Text>
            </View>

            <View className="flex-row items-center justify-between pt-1">
              <View className="flex-row items-center gap-1.5 flex-1">
                <View className="flex-row items-center px-1.5 py-0.5 rounded bg-chip border border-gold/20">
                  <Globe size={10} color={c.gold} />
                  <Text className="text-[10px] text-gold font-mono ml-1" numberOfLines={1}>
                    {save.domain || 'web'}
                  </Text>
                </View>
                <Text className="text-[11px] text-muted">•</Text>
                <Text className="text-[11px] text-muted">{formatRelativeDaysAgo(save.created_at)}</Text>
              </View>

              {/* Tags preview */}
              {save.tags && save.tags.length > 0 && (
                <View className="bg-chip px-1.5 py-0.5 rounded border border-white/5">
                  <Text className="text-[10px] text-muted font-mono">#{save.tags[0]}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>

      {/* Long-press / Menu Context Sheet */}
      <BottomSheetModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="Save Options">
        <View className="gap-1">
          <Pressable
            onPress={() => {
              toggleFavourite(save.id);
              setIsMenuOpen(false);
            }}
            className="w-full flex-row items-center gap-3 px-4 py-3 rounded-xl active:bg-chip"
          >
            <Star
              size={16}
              color={save.is_favourite ? '#FFC800' : c.muted}
              fill={save.is_favourite ? '#FFC800' : 'none'}
            />
            <Text className="text-xs font-medium text-ink">
              {save.is_favourite ? 'Remove from Favourites' : 'Add to Favourites'}
            </Text>
          </Pressable>

          <Pressable onPress={openOriginal} className="w-full flex-row items-center gap-3 px-4 py-3 rounded-xl active:bg-chip">
            <ExternalLink size={16} color={c.muted} />
            <Text className="text-xs font-medium text-ink">Open Original Link</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              archiveSave(save.id);
              setIsMenuOpen(false);
            }}
            className="w-full flex-row items-center gap-3 px-4 py-3 rounded-xl active:bg-chip"
          >
            <Archive size={16} color={c.muted} />
            <Text className="text-xs font-medium text-ink">Archive Save</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setIsDeleting(true);
              setTimeout(() => {
                deleteSave(save.id);
              }, 200);
              setIsMenuOpen(false);
            }}
            className="w-full flex-row items-center gap-3 px-4 py-3 rounded-xl active:opacity-70"
          >
            <Trash2 size={16} color={c.danger} />
            <Text className="text-xs font-medium" style={{ color: c.danger }}>
              Delete Save
            </Text>
          </Pressable>
        </View>
      </BottomSheetModal>
    </>
  );
};