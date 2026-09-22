import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { BottomSheetModal } from '../components/common/BottomSheetModal';
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Cpu,
  Mail,
  Download,
  ChevronRight,
  Flame,
  Shield,
} from 'lucide-react-native';
import { useThemeColors } from '../lib/theme';

export const ProfileView: React.FC = () => {
  const {
    profile,
    saves,
    darkMode,
    toggleDarkMode,
    setTab,
    activeAiProvider,
    activeAiModel,
  } = useSavedFeedStore();
  const c = useThemeColors();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const totalSaves = saves.length;
  const reviewedSaves = saves.reduce((acc, s) => acc + s.resurface_count, 0);

  /*
   * Web build wrote a Blob + <a download>. On Android we hand the JSON to the
   * OS share sheet instead, which is the native equivalent of "export".
   */
  const handleExportSaves = async () => {
    setIsExporting(true);
    try {
      const jsonStr = JSON.stringify(saves, null, 2);
      await Share.share({ message: jsonStr, title: 'SavedFeed Backup' });
    } catch {
      // user dismissed the share sheet
    }
    setTimeout(() => setIsExporting(false), 500);
  };

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Nav Bar */}
        <View className="flex-row items-center justify-between mb-4 pt-1">
          <Pressable onPress={() => setTab('home')} className="flex-row items-center gap-1 active:opacity-70">
            <ArrowLeft size={16} color={c.muted} />
            <Text className="text-xs text-muted">Back to Home</Text>
          </Pressable>
          <Text className="text-sm font-display font-bold uppercase tracking-wider text-gold">
            Settings & Profile
          </Text>
          <View className="w-8" />
        </View>

        {/* Profile Header */}
        <View className="bg-panel border border-gold/30 rounded-2xl p-4 items-center mb-5 shadow-card">
          <View className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold mb-3 shadow-glow-lg">
            <Image
              source={{ uri: profile.avatar_url || 'https://picsum.photos/seed/user/200/200' }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
          <Text className="text-base font-display font-bold uppercase tracking-wider text-ink">
            {profile.display_name || 'Arjun'}
          </Text>
          <Text className="text-xs text-muted font-mono mb-4">@{profile.username}</Text>

          {/* Stats Row */}
          <View className="flex-row border-t border-gold/20 pt-3 w-full">
            <View className="flex-1 items-center">
              <Text className="text-base font-display font-bold text-gold">{totalSaves}</Text>
              <Text className="text-[10px] text-muted uppercase font-display">Total Saves</Text>
            </View>
            <View className="flex-1 items-center border-x border-gold/20">
              <Text className="text-base font-display font-bold text-[#10B981]">{reviewedSaves}</Text>
              <Text className="text-[10px] text-muted uppercase font-display">Reviewed</Text>
            </View>
            <View className="flex-1 items-center">
              <View className="flex-row items-center gap-0.5">
                <Flame size={14} color={c.gold} fill={c.gold} />
                <Text className="text-base font-display font-bold text-gold">{profile.streak_days}</Text>
              </View>
              <Text className="text-[10px] text-muted uppercase font-display">Streak</Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        <View className="gap-4">
          {/* Preferences */}
          <View>
            <Text className="text-[10px] font-display font-bold uppercase tracking-widest text-gold px-1 mb-1.5">
              Preferences
            </Text>
            <View className="bg-panel border border-gold/20 rounded-xl overflow-hidden">
              <View className="flex-row items-center justify-between p-3.5 border-b border-gold/15">
                <View className="flex-row items-center gap-2.5">
                  {darkMode ? <Moon size={16} color={c.gold} /> : <Sun size={16} color={c.gold} />}
                  <Text className="font-medium text-ink text-xs">Dark Mode</Text>
                </View>
                <Pressable
                  onPress={toggleDarkMode}
                  className={`w-11 h-6 rounded-full p-1 ${darkMode ? 'bg-gold-fill' : 'bg-chip'}`}
                >
                  <View
                    className={`w-4 h-4 rounded-full bg-black ${
                      darkMode ? 'self-end' : 'self-start'
                    }`}
                  />
                </Pressable>
              </View>

              <View className="flex-row items-center justify-between p-3.5">
                <View className="flex-row items-center gap-2.5">
                  <Bell size={16} color={c.gold} />
                  <Text className="font-medium text-ink text-xs">Daily Nudge Time</Text>
                </View>
                <View className="bg-gold/20 border border-gold/30 px-2.5 py-1 rounded-md">
                  <Text className="text-xs font-mono font-bold text-gold">
                    {profile.daily_nudge_time} AM
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* AI Settings */}
          <View>
            <Text className="text-[10px] font-display font-bold uppercase tracking-widest text-gold px-1 mb-1.5">
              On-Device AI Config
            </Text>
            <View className="bg-panel border border-gold/20 rounded-xl overflow-hidden">
              <Pressable
                onPress={() => setIsAiModalOpen(true)}
                className="flex-row items-center justify-between p-3.5 active:bg-chip"
              >
                <View className="flex-row items-center gap-2.5 flex-1">
                  <Cpu size={16} color={c.gold} />
                  <View className="flex-1">
                    <Text className="font-medium text-ink text-xs">Local AI Model</Text>
                    <Text className="text-[10px] text-muted font-mono">
                      Provider: {activeAiProvider}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={16} color={c.dim} />
              </Pressable>
            </View>
          </View>

          {/* Account */}
          <View>
            <Text className="text-[10px] font-display font-bold uppercase tracking-widest text-muted px-1 mb-1.5">
              Account & Data
            </Text>
            <View className="bg-panel border border-gold/20 rounded-xl overflow-hidden">
              <View className="flex-row items-center justify-between p-3.5 border-b border-gold/15">
                <View className="flex-row items-center gap-2.5">
                  <Mail size={16} color={c.muted} />
                  <Text className="font-medium text-ink text-xs">Email</Text>
                </View>
                <Text className="text-[11px] text-muted font-mono">{profile.email}</Text>
              </View>

              <Pressable
                onPress={handleExportSaves}
                className="w-full flex-row items-center justify-between p-3.5 active:bg-chip"
              >
                <View className="flex-row items-center gap-2.5">
                  <Download size={16} color="#10B981" />
                  <Text className="font-medium text-ink text-xs">
                    {isExporting ? 'Exporting JSON...' : 'Export My Saves (JSON)'}
                  </Text>
                </View>
                <ChevronRight size={16} color={c.dim} />
              </Pressable>
            </View>
          </View>

          {/* About */}
          <View>
            <Text className="text-[10px] font-display font-bold uppercase tracking-widest text-muted px-1 mb-1.5">
              About MyFeed
            </Text>
            <View className="bg-panel border border-gold/20 rounded-xl overflow-hidden">
              <View className="flex-row items-center justify-between p-3.5 border-b border-gold/15">
                <Text className="font-medium text-muted text-xs">App Version</Text>
                <Text className="font-mono text-xs text-gold">v1.0.0-iqoo-hackathon</Text>
              </View>
              <View className="flex-row items-center justify-between p-3.5">
                <Text className="font-medium text-muted text-xs">Privacy Policy</Text>
                <Shield size={16} color={c.dim} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* AI Config Info Bottom Sheet */}
      <BottomSheetModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="On-Device AI Settings"
      >
        <View className="gap-3">
          <Text className="text-xs text-muted leading-relaxed">
            MyFeed categorises saves with an{' '}
            <Text className="text-ink font-bold">on-device local model</Text> — posts never leave your
            phone. The keyword fallback in{' '}
            <Text className="text-gold font-mono">aiAdapter.ts</Text> keeps things working if the model
            isn't loaded yet.
          </Text>
          <View className="bg-chip border border-edge rounded-xl p-3 gap-1.5">
            <View className="flex-row justify-between">
              <Text className="text-[11px] text-dim font-mono">Runtime:</Text>
              <Text className="text-[11px] font-mono text-[#4ADE80]">executorch</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[11px] text-dim font-mono">Categorization Model:</Text>
              <Text className="text-[11px] font-mono text-gold">{activeAiModel}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[11px] text-dim font-mono">Fallback:</Text>
              <Text className="text-[11px] font-mono text-[#FBBF24]">keyword classifier</Text>
            </View>
          </View>
          <Text className="text-[11px] text-dim">
            Phase C wires the real on-device inference; this panel reports the active configuration.
          </Text>
        </View>
      </BottomSheetModal>
    </View>
  );
};