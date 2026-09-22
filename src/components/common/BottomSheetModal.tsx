import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { X } from 'lucide-react-native';
import { useThemeColors } from '../../lib/theme';

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/*
 * Ported from the web `fixed inset-0` overlay to React Native's <Modal>:
 * native gives us the dark backdrop, a slide-up animation, and — importantly —
 * correct Android hardware-back handling via `onRequestClose`.
 */
export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const c = useThemeColors();

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 justify-end">
        {/* Dark overlay backdrop */}
        <Pressable onPress={onClose} className="absolute inset-0 bg-black/70" />

        {/* Sheet panel */}
        <View className="bg-panel border-t border-gold/40 rounded-t-[24px] px-5 pt-3 pb-8 shadow-sheet max-h-[85%]">
          {/* Drag handle pill */}
          <View className="w-10 h-1.5 bg-gold/40 rounded-full self-center mb-4" />

          {/* Title bar */}
          {title && (
            <View className="flex-row items-center justify-between pb-3 mb-3 border-b border-gold/20">
              <Text className="text-base font-display font-bold uppercase tracking-wider text-gold">
                {title}
              </Text>
              <Pressable
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-chip border border-gold/30 items-center justify-center active:opacity-70"
              >
                <X size={16} color={c.muted} />
              </Pressable>
            </View>
          )}

          {/* Sheet content */}
          <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
};