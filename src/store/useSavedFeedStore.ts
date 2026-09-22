import { create } from 'zustand';
import { SaveItem, Category, UserProfile } from '../types/savedfeed';
import { MOCK_SAVES } from '../data/mockSaves';
import { calculateNextResurface, isDueForResurface } from '../lib/resurface';

export type TabName = 'home' | 'inbox' | 'categories' | 'search';
export type ScreenName = 'onboarding' | 'signup' | 'tabs' | 'new_save' | 'save_detail' | 'profile';

interface NotificationState {
  id: string;
  title: string;
  saveId: string;
}

interface SavedFeedState {
  // Navigation
  currentTab: TabName;
  currentScreen: ScreenName;
  selectedSaveId: string | null;

  // Data & Filter
  saves: SaveItem[];
  categoryFilter: Category | 'all' | 'favourites';
  searchQuery: string;
  recentSearches: string[];

  // User & Settings
  profile: UserProfile;
  darkMode: boolean;
  activeAiProvider: string;
  activeAiModel: string;

  // On-device AI status
  localModelReady: boolean;
  localModelProgress: number;
  setLocalModelStatus: (ready: boolean, progress: number) => void;

  // Prototype Simulators
  notification: NotificationState | null;
  sharedUrlPayload: string | null;
  isSavingLoader: boolean;

  // Actions
  setTab: (tab: TabName) => void;
  setScreen: (screen: ScreenName, saveId?: string) => void;
  setSelectedSaveId: (id: string | null) => void;
  toggleDarkMode: () => void;

  // Save Operations
  addSave: (item: Omit<SaveItem, 'id' | 'created_at' | 'updated_at' | 'resurface_count' | 'times_viewed' | 'is_archived' | 'is_favourite' | 'next_resurface_at'> & { next_resurface_at?: string }) => SaveItem;
  updateSave: (id: string, updates: Partial<SaveItem>) => void;
  deleteSave: (id: string) => void;
  archiveSave: (id: string) => void;
  toggleFavourite: (id: string) => void;
  markReviewed: (id: string) => void;
  skipResurface: (id: string) => void;

  // Search & Filter
  setCategoryFilter: (filter: Category | 'all' | 'favourites') => void;
  setSearchQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Prototype Actions
  triggerSimulatedPush: () => void;
  dismissNotification: () => void;
  simulateShareIntent: (url?: string) => void;
  clearShareIntent: () => void;
  resetMockData: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_arjun',
  email: 'arjun.sharma@example.com',
  username: 'arjun_saves',
  display_name: 'Arjun',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  streak_days: 5,
  daily_nudge_time: '09:00',
  dark_mode: true,
};

export const useSavedFeedStore = create<SavedFeedState>((set, get) => ({
  currentTab: 'home',
  currentScreen: 'tabs',
  selectedSaveId: null,

  saves: MOCK_SAVES,
  categoryFilter: 'all',
  searchQuery: '',
  recentSearches: ['machine learning', 'figma', 'cs50', 'system design'],

  profile: DEFAULT_PROFILE,
  darkMode: true,
  activeAiProvider: 'On-device · ExecuTorch',
  activeAiModel: 'Qwen2.5-0.5B-Instruct (8da4w)',

  localModelReady: false,
  localModelProgress: 0,

  notification: null,
  sharedUrlPayload: null,
  isSavingLoader: false,

  setTab: (tab) => set({ currentTab: tab, currentScreen: 'tabs' }),
  setScreen: (screen, saveId) => set({ currentScreen: screen, selectedSaveId: saveId || get().selectedSaveId }),
  setSelectedSaveId: (id) => set({ selectedSaveId: id }),

  // Theme is applied by the root <View> in App.tsx via vars() (src/lib/theme.ts),
  // so this only flips the flag — no DOM/classList (that was web-only).
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  // Guarded so the ~100 download-progress ticks don't re-render needlessly.
  setLocalModelStatus: (ready, progress) =>
    set((state) =>
      state.localModelReady === ready && state.localModelProgress === progress
        ? state
        : { localModelReady: ready, localModelProgress: progress }
    ),

  addSave: (item) => {
    const newItem: SaveItem = {
      ...item,
      id: `save_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      next_resurface_at: calculateNextResurface(0).toISOString(),
      resurface_count: 0,
      times_viewed: 1,
      is_archived: false,
      is_favourite: false,
    };

    set((state) => ({
      saves: [newItem, ...state.saves],
    }));

    return newItem;
  },

  updateSave: (id, updates) =>
    set((state) => ({
      saves: state.saves.map((s) => (s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s)),
    })),

  deleteSave: (id) =>
    set((state) => ({
      saves: state.saves.filter((s) => s.id !== id),
    })),

  archiveSave: (id) =>
    set((state) => ({
      saves: state.saves.map((s) => (s.id === id ? { ...s, is_archived: true } : s)),
    })),

  toggleFavourite: (id) =>
    set((state) => ({
      saves: state.saves.map((s) => (s.id === id ? { ...s, is_favourite: !s.is_favourite } : s)),
    })),

  markReviewed: (id) => {
    set((state) => ({
      saves: state.saves.map((s) => {
        if (s.id !== id) return s;
        const nextCount = s.resurface_count + 1;
        const nextDate = calculateNextResurface(nextCount);
        return {
          ...s,
          resurface_count: nextCount,
          next_resurface_at: nextDate.toISOString(),
          times_viewed: s.times_viewed + 1,
        };
      }),
    }));
  },

  skipResurface: (id) => {
    set((state) => ({
      saves: state.saves.map((s) => {
        if (s.id !== id) return s;
        // Postpone by 3 days
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 3);
        return {
          ...s,
          next_resurface_at: nextDate.toISOString(),
        };
      }),
    }));
  },

  setCategoryFilter: (filter) => set({ categoryFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addRecentSearch: (query) =>
    set((state) => {
      if (!query.trim()) return state;
      const filtered = state.recentSearches.filter((q) => q.toLowerCase() !== query.toLowerCase());
      return { recentSearches: [query.trim(), ...filtered].slice(0, 5) };
    }),

  clearRecentSearches: () => set({ recentSearches: [] }),

  triggerSimulatedPush: () => {
    const dueItems = get().saves.filter((s) => !s.is_archived && isDueForResurface(s.next_resurface_at));
    const target = dueItems[0] || get().saves[0];
    if (target) {
      set({
        notification: {
          id: `notif_${Date.now()}`,
          title: target.title,
          saveId: target.id,
        },
      });
    }
  },

  dismissNotification: () => set({ notification: null }),

  simulateShareIntent: (url = 'https://instagram.com/p/C9x81Y_s9_savedfeed_demo') => {
    set({
      sharedUrlPayload: url,
      currentScreen: 'new_save',
    });
  },

  clearShareIntent: () => set({ sharedUrlPayload: null }),

  resetMockData: () => set({ saves: MOCK_SAVES }),
}));