import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Sparkles } from 'lucide-react-native';

export const AdBanner: React.FC = () => {
  return (
    <View className="w-full my-3 px-1">
      <View className="flex-row items-center gap-1 mb-1">
        <Text className="text-[10px] text-muted uppercase tracking-widest font-mono font-semibold">
          Sponsored Partner
        </Text>
        <View className="bg-panel px-1 border border-gold/30 rounded">
          <Text className="text-[9px] text-gold font-mono">iQOO</Text>
        </View>
      </View>
      <View className="w-full h-[52px] bg-panel border border-gold/40 rounded-xl flex-row items-center justify-between px-3 shadow-glow">
        <View className="flex-row items-center gap-2.5">
          <View className="w-8 h-8 rounded-lg bg-gold-fill items-center justify-center">
            <Sparkles size={16} color="#000000" strokeWidth={3} />
          </View>
          <View className="flex-col">
            <Text className="text-xs font-display font-bold uppercase tracking-wide text-ink">
              iQOO 2026 Hackathon Finale
            </Text>
            <Text className="text-[10px] text-muted font-mono">₹40,00,000 Grand Prize Pool</Text>
          </View>
        </View>
        <Pressable className="bg-gold-fill active:opacity-80 px-2.5 py-1 rounded-lg">
          <Text className="text-[10px] font-display font-bold uppercase tracking-wider text-black">
            Explore
          </Text>
        </Pressable>
      </View>
    </View>
  );
};