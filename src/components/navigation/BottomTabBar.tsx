import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSavedFeedStore, TabName } from '../../store/useSavedFeedStore';
import { Home, Inbox, LayoutGrid, Search, Plus } from 'lucide-react-native';
import { useThemeColors } from '../../lib/theme';

export const BottomTabBar: React.FC = () => {
  const { currentTab, setTab, setScreen } = useSavedFeedStore();
  const c = useThemeColors();

  const tabs: Array<{ id: TabName; label: string; Icon: typeof Home }> = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'inbox', label: 'Inbox', Icon: Inbox },
    { id: 'categories', label: 'Categories', Icon: LayoutGrid },
    { id: 'search', label: 'Search', Icon: Search },
  ];

  return (
    <View className="relative">
      {/* Floating Action Button (FAB) on Inbox & Home */}
      {(currentTab === 'inbox' || currentTab === 'home') && (
        <Pressable
          onPress={() => setScreen('new_save')}
          accessibilityLabel="Add new save"
          className="absolute -top-6 right-5 w-14 h-14 rounded-full bg-gold-fill items-center justify-center shadow-fab z-30 active:opacity-90"
        >
          <Plus size={28} color="#000000" strokeWidth={3} />
        </Pressable>
      )}

      {/* Nav bar frame */}
      <View className="h-[64px] bg-panel/95 border-t border-gold/30 px-3 flex-row items-center justify-around z-20">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const { Icon } = tab;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setTab(tab.id)}
              style={
                isActive
                  ? {
                      backgroundColor: 'rgba(255,200,0,0.20)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,200,0,0.40)',
                    }
                  : undefined
              }
              className="flex-row items-center gap-2 px-3.5 py-2 rounded-xl active:opacity-80"
            >
              <Icon size={20} color={isActive ? c.gold : c.dim} />
              {isActive && (
                <Text className="text-xs font-display tracking-wider font-bold uppercase text-gold">
                  {tab.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};