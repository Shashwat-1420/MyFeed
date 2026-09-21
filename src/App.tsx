import React from 'react';
import { useSavedFeedStore } from './store/useSavedFeedStore';
import { MobileFrame } from './components/common/MobileFrame';
import { BottomTabBar } from './components/navigation/BottomTabBar';

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
  const { currentScreen, currentTab } = useSavedFeedStore();

  const renderViewContent = () => {
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
    }
  };

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {renderViewContent()}
        {currentScreen === 'tabs' && <BottomTabBar />}
      </div>
    </MobileFrame>
  );
};

export default App;
