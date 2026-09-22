import '../global.css';

import React, { useEffect, useRef } from 'react';
import { BackHandler, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useShareIntent } from 'expo-share-intent';
import * as Notifications from 'expo-notifications';

import { useSavedFeedStore } from './store/useSavedFeedStore';
import { themeVars } from './lib/theme';
import { useLocalModel } from './lib/localModel';
import { syncResurfaceReminder } from './lib/notifications';
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

/*
 * Share de-dupe. `hasShareIntent` can flap true/false around a single share and
 * `shareIntent` is a fresh object each render, so naive handling re-fires
 * `simulateShareIntent` in a loop (store write -> re-render -> ...), which
 * starves the JS thread. We ignore an identical URL seen within a short window,
 * while still allowing the same link to be shared again later.
 */
let lastHandledShareUrl = '';
let lastHandledShareAt = 0;
const SHARE_DEDUPE_MS = 5000;

export const App: React.FC = () => {
  const { currentScreen, currentTab, darkMode } = useSavedFeedStore();

  /*
   * Share-to-app (Phase C #1). The Android share sheet delivers a URL/text here
   * (filters configured in app.json). We route it into the existing
   * sharedUrlPayload -> new_save flow, which already auto-fetches metadata and
   * runs categorization.
   */
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent();
  const simulateShareIntent = useSavedFeedStore((s) => s.simulateShareIntent);

  const shareIntentRef = useRef(shareIntent);
  shareIntentRef.current = shareIntent;

  /*
   * On-device AI: loads the local LLM once at startup (downloading it on first
   * run) and publishes readiness + progress to the store for the UI.
   */
  const localModel = useLocalModel();
  const setLocalModelStatus = useSavedFeedStore((s) => s.setLocalModelStatus);
  const localModelProgress = Math.round(localModel.downloadProgress ?? 0);

  useEffect(() => {
    setLocalModelStatus(Boolean(localModel.isReady), localModelProgress);
  }, [localModel.isReady, localModelProgress, setLocalModelStatus]);

  /*
   * Anki-style reminders (Phase C #3): keep a single daily local notification in
   * sync with the save list so its text reflects the current due count.
   */
  const saves = useSavedFeedStore((s) => s.saves);
  const nudgeTime = useSavedFeedStore((s) => s.profile.daily_nudge_time);

  useEffect(() => {
    syncResurfaceReminder(saves, nudgeTime).catch(() => {
      // notifications are best-effort; never block the UI on them
    });
  }, [saves, nudgeTime]);

  // Tapping a reminder opens the app on Home.
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(() => {
      useSavedFeedStore.getState().setTab('home');
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!hasShareIntent) return;

    const intent = shareIntentRef.current;
    const incoming = (intent?.webUrl || intent?.text || '').trim();
    const now = Date.now();
    const isNewShare =
      !!incoming && !(incoming === lastHandledShareUrl && now - lastHandledShareAt < SHARE_DEDUPE_MS);

    if (isNewShare) {
      lastHandledShareUrl = incoming;
      lastHandledShareAt = now;
      simulateShareIntent(incoming);
    }

    // Always acknowledge the intent so `hasShareIntent` flips back to false and
    // the native module stops re-emitting it.
    resetShareIntent();
  }, [hasShareIntent, resetShareIntent, simulateShareIntent]);

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