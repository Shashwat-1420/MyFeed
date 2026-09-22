import React from 'react';
import { useSavedFeedStore, TabName } from '../../store/useSavedFeedStore';
import { Home, Inbox, LayoutGrid, Search, Plus } from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const { currentTab, setTab, setScreen } = useSavedFeedStore();

  const tabs: Array<{ id: TabName; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-5 h-5" /> },
    { id: 'categories', label: 'Categories', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
  ];

  return (
    <div className="relative">
      {/* Floating Action Button (FAB) on Inbox & Home */}
      {(currentTab === 'inbox' || currentTab === 'home') && (
        <button
          onClick={() => setScreen('new_save')}
          aria-label="Add new save"
          className="absolute -top-6 right-5 w-14 h-14 rounded-full bg-[#F0B31C] hover:bg-[#FFCB14] text-black font-bold flex items-center justify-center shadow-fab glow-iqoo transition-all duration-200 active:scale-90 hover:scale-105 z-30 group"
        >
          <Plus className="w-7 h-7 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}

      {/* Nav bar frame */}
      <nav className="h-[64px] bg-panel/95 backdrop-blur-lg border-t border-[#F0B31C]/30 px-3 flex items-center justify-around z-20">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#F0B31C]/20 text-gold border border-[#F0B31C]/40 font-semibold scale-105 glow-iqoo'
                  : 'text-dim hover:text-ink active:scale-95'
              }`}
            >
              <div className={isActive ? 'text-gold' : 'text-dim'}>{tab.icon}</div>
              {isActive && <span className="text-xs font-display tracking-wider font-bold uppercase">{tab.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
