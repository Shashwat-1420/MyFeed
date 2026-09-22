import React, { useState } from 'react';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { formatRelativeDaysAgo, getResurfaceIntervalDays } from '../lib/resurface';
import { BottomSheetModal } from '../components/common/BottomSheetModal';
import {
  ArrowLeft,
  Star,
  Globe,
  ExternalLink,
  Check,
  Archive,
  Trash2,
  Clock,
  Sparkles,
} from 'lucide-react-native';
import { celebrate } from '../lib/confetti';
import { useThemeColors } from '../lib/theme';

export const SaveDetailView: React.FC = () => {
  const {
    selectedSaveId,
    saves,
    setTab,
    toggleFavourite,
    markReviewed,
    archiveSave,
    deleteSave,
  } = useSavedFeedStore();
  const c = useThemeColors();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isFillingReviewed, setIsFillingReviewed] = useState(false);

  const save = saves.find((s) => s.id === selectedSaveId) || saves[0];

  if (!save) {
    return (
      <View className="flex-1 p-6 items-center">
        <Text className="text-xs text-muted">
          Save not found.{' '}
          <Text onPress={() => setTab('inbox')} className="text-gold underline">
            Go back to Inbox
          </Text>
        </Text>
      </View>
    );
  }

  const nextDays = save.interval_days ?? getResurfaceIntervalDays(save.resurface_count);
  const easeFactor = save.easiness ?? 2.5;

  const handleMarkReviewed = () => {
    setIsFillingReviewed(true);

    try {
      celebrate({ particleCount: 45, spread: 60, origin: { y: 0.8 }, colors: ['#4ADE80', '#FFC800'] });
    } catch {
      // fallback
    }

    setTimeout(() => {
      markReviewed(save.id);
      setIsFillingReviewed(false);
    }, 400);
  };

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView className="flex-1" contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        {/* Hero Header Image */}
        <View className="w-full h-[220px] relative bg-panel border-b border-gold/30">
          <Image
            source={{ uri: save.image_url || 'https://picsum.photos/seed/detail/600/400' }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {/* flat scrim replaces the web gradient */}
          <View className="absolute inset-0 bg-black/40" />

          {/* Floating Top Nav buttons */}
          <View className="absolute top-3 left-3 right-3 flex-row items-center justify-between">
            <Pressable
              onPress={() => setTab('inbox')}
              className="w-9 h-9 rounded-full bg-black/70 border border-gold/30 items-center justify-center active:opacity-70"
            >
              <ArrowLeft size={20} color={c.goldFill} />
            </Pressable>

            <Pressable
              onPress={() => toggleFavourite(save.id)}
              className="w-9 h-9 rounded-full bg-black/70 border border-gold/30 items-center justify-center active:opacity-70"
            >
              <Star
                size={20}
                color={save.is_favourite ? c.goldFill : '#FFFFFF'}
                fill={save.is_favourite ? c.goldFill : 'none'}
              />
            </Pressable>
          </View>
        </View>

        {/* Main Content Area */}
        <View className="flex-1 px-5 pt-3 gap-4">
          {/* Domain & Category */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 flex-1">
              <View className="bg-panel px-2 py-0.5 rounded flex-row items-center border border-gold/30">
                <Globe size={12} color={c.gold} />
                <Text className="text-[11px] text-gold font-mono ml-1">{save.domain || 'web'}</Text>
              </View>
              <Text className="text-xs text-dim">•</Text>
              <Text className="text-xs text-muted">
                Saved {formatRelativeDaysAgo(save.created_at)}
              </Text>
            </View>

            <CategoryBadge category={save.category} size="md" />
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-ink leading-snug">{save.title}</Text>

          {/* Tags row */}
          {save.tags && save.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-1.5 pt-1">
              {save.tags.map((tag, idx) => (
                <View key={idx} className="bg-panel border border-gold/20 px-2.5 py-1 rounded-md">
                  <Text className="text-xs text-muted font-mono">#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View className="h-px bg-gold/20 my-1" />

          {/* Description */}
          <Text className="text-xs text-muted leading-relaxed">
            {save.description || 'No additional description provided for this save item.'}
          </Text>

          {/* External Link button */}
          {save.url && (
            <Pressable
              onPress={() => Linking.openURL(save.url as string).catch(() => {})}
              className="w-full py-2.5 rounded-xl border border-gold flex-row items-center justify-center gap-2 shadow-glow active:opacity-80"
            >
              <Text className="text-gold text-xs font-display font-bold uppercase tracking-wider">
                Open Original Source
              </Text>
              <ExternalLink size={14} color={c.gold} />
            </Pressable>
          )}

          {/* Spaced Repetition Resurface Status Bar */}
          <View className="bg-panel border border-gold/30 rounded-2xl p-3.5 gap-2 mt-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <Clock size={16} color={c.gold} />
                <Text className="text-xs text-gold font-display font-bold uppercase tracking-wider">
                  Spaced Repetition
                </Text>
              </View>
              <Text className="text-[11px] text-muted font-mono">
                Resurfaced {save.resurface_count} times
              </Text>
            </View>

            {/* Progress dots bar */}
            <View className="flex-row items-center gap-1.5 pt-1">
              {[1, 3, 7, 14, 30, 60].map((interval, idx) => {
                const isCompleted = idx < save.resurface_count;
                return (
                  <View
                    key={idx}
                    style={{ backgroundColor: isCompleted ? '#FFC800' : c.chip }}
                    className="flex-1 h-2 rounded-full"
                  />
                );
              })}
            </View>

            <Text className="text-[11px] text-dim pt-1">
              Next resurface interval:{' '}
              <Text className="text-gold font-semibold">{nextDays} days</Text>
            </Text>
            <Text className="text-[11px] text-dim">
              Ease factor:{' '}
              <Text className="text-gold font-semibold">{easeFactor.toFixed(2)}</Text>
              {'  ·  '}SM-2
            </Text>
          </View>

          {/* Mark as Reviewed Button */}
          <Pressable
            onPress={handleMarkReviewed}
            disabled={isFillingReviewed}
            style={{ backgroundColor: isFillingReviewed ? '#10B981' : '#FFC800' }}
            className="w-full h-[52px] rounded-xl flex-row items-center justify-center gap-2 shadow-glow-lg active:opacity-80"
          >
            {isFillingReviewed ? (
              <>
                <Sparkles size={16} color="#000000" />
                <Text className="text-xs font-display font-bold uppercase tracking-wider text-black">
                  Updating interval...
                </Text>
              </>
            ) : (
              <>
                <Check size={16} color="#000000" strokeWidth={3} />
                <Text className="text-xs font-display font-bold uppercase tracking-wider text-black">
                  Mark as Reviewed Today
                </Text>
              </>
            )}
          </Pressable>

          {/* Danger zone actions */}
          <View className="pt-4 flex-row items-center justify-around border-t border-gold/20">
            <Pressable
              onPress={() => setIsArchiveModalOpen(true)}
              className="flex-row items-center gap-1 active:opacity-70"
            >
              <Archive size={14} color={c.muted} />
              <Text className="text-xs text-muted">Archive Save</Text>
            </Pressable>
            <Pressable
              onPress={() => setIsDeleteModalOpen(true)}
              className="flex-row items-center gap-1 active:opacity-70"
            >
              <Trash2 size={14} color={c.danger} />
              <Text className="text-xs" style={{ color: c.danger }}>
                Delete Save
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Delete Bottom Sheet */}
      <BottomSheetModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete this save?"
      >
        <View className="gap-4">
          <Text className="text-xs text-muted">
            Are you sure you want to delete <Text className="text-ink font-bold">"{save.title}"</Text>? This
            action cannot be undone.
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-3 rounded-xl border border-edge items-center active:opacity-70"
            >
              <Text className="text-xs font-semibold text-muted">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                deleteSave(save.id);
                setIsDeleteModalOpen(false);
                setTab('inbox');
              }}
              className="flex-1 py-3 rounded-xl bg-[#F87171] items-center active:opacity-80"
            >
              <Text className="text-xs font-semibold text-white">Delete</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetModal>

      {/* Confirm Archive Bottom Sheet */}
      <BottomSheetModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        title="Archive this save?"
      >
        <View className="gap-4">
          <Text className="text-xs text-muted">
            Archiving moves this save out of your active inbox. You can unarchive it anytime.
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setIsArchiveModalOpen(false)}
              className="flex-1 py-3 rounded-xl border border-edge items-center active:opacity-70"
            >
              <Text className="text-xs font-semibold text-muted">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                archiveSave(save.id);
                setIsArchiveModalOpen(false);
                setTab('inbox');
              }}
              className="flex-1 py-3 rounded-xl bg-gold-fill items-center active:opacity-80"
            >
              <Text className="text-xs font-semibold text-black">Archive</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetModal>
    </View>
  );
};