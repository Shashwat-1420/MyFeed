import '../global.css';

import React, { useEffect } from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useSavedFeedStore } from './store/useSavedFeedStore';
import { themeVars } from './lib/theme';
import { BottomTabBar } from './components/navigation/BottomTabBar';
import { SimulatedNotificationBanner } from './components/common/SimulatedNotificationBanner';

import { OnboardingView } from './views/OnboardingView';
import { SignupView } from './views/SignupView';
import { HomeView } from './views/HomeView';
import { InboxView } from './views/InboxView';
import { CategoriesView } from './views/CategoriesView';
import { SearchView } from './views/SearchView';
import { NewSaveView } from './views/NewSaveView';
import { SaveDetailView } from './views/SaveDetailView';
import { ProfileView } from './views/ProfileView';

export const App: React.FC = () => {
  const { currentScreen, currentTab, darkMode } = useSavedFeedStore();

  // Android hardware back: unwind nested screens before letting the OS exit.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const s = useSavedFeedStore.getState();
      if (s.currentScreen === 'tabs') return false; // exit the app
      s.setTab(s.currentTab);
      return true;
    });
    return () => sub.remove();
  }, []);

  const renderTabs = () => {
    switch (currentTab) {
      case 'home':
        return <HomeView />;
      case 'inbox':
        return <InboxView />;
      case 'categories':
        return <CategoriesView />;
      case 'search':
        return <SearchView />;
      default:
        return <HomeView />;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingView />;
      case 'signup':
        return <SignupView />;
      case 'new_save':
        return <NewSaveView />;
      case 'save_detail':
        return <SaveDetailView />;
      case 'profile':
        return <ProfileView />;
      case 'tabs':
      default:
        return renderTabs();
    }
  };

  return (
    <SafeAreaProvider>
      {/* Theme CSS variables are injected here and cascade to every child */}
      <View style={themeVars(darkMode)} className="flex-1 bg-canvas">
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
          <View className="flex-1">{renderScreen()}</View>
          {currentScreen === 'tabs' && <BottomTabBar />}
        </SafeAreaView>
        <SimulatedNotificationBanner />
      </View>
    </SafeAreaProvider>
  );
};

export default App;