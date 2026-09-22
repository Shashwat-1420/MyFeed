import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSavedFeedStore } from '../../store/useSavedFeedStore';
import { BookOpen, Bell } from 'lucide-react-native';

export const SimulatedNotificationBanner: React.FC = () => {
  const { notification, dismissNotification, setScreen } = useSavedFeedStore();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dismissNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, dismissNotification]);

  if (!notification) return null;

  return (
    <View className="absolute top-2 left-3 right-3 z-50">
      <Pressable
        onPress={() => {
          setScreen('save_detail', notification.saveId);
          dismissNotification();
        }}
        className="bg-panel border-2 border-gold rounded-2xl p-3 shadow-glow-lg flex-row items-center justify-between active:opacity-90"
      >
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-9 h-9 rounded-xl bg-gold-fill items-center justify-center shrink-0">
            <BookOpen size={20} color="#000000" strokeWidth={2.5} />
          </View>
          <View className="flex-col pr-2 flex-1">
            <View className="flex-row items-center gap-1.5">
              <Bell size={14} color="#FFC800" />
              <Text className="text-xs font-display font-bold uppercase tracking-wider text-gold">
                Daily Resurface Nudge
              </Text>
            </View>
            <Text numberOfLines={1} className="text-xs font-medium text-ink">
              {notification.title}
            </Text>
          </View>
        </View>
        <View className="bg-gold-fill px-2.5 py-1 rounded-lg shrink-0">
          <Text className="text-[10px] text-black font-display font-bold uppercase">Tap to View</Text>
        </View>
      </Pressable>
    </View>
  );
};