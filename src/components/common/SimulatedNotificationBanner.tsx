import React, { useEffect } from 'react';
import { useSavedFeedStore } from '../../store/useSavedFeedStore';
import { BookOpen, Bell } from 'lucide-react';

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
    <div className="fixed top-2 left-3 right-3 z-50 animate-bounceIn">
      <div
        onClick={() => {
          setScreen('save_detail', notification.saveId);
          dismissNotification();
        }}
        className="bg-panel border-2 border-[#F0B31C] rounded-2xl p-3 shadow-glow-lg flex items-center justify-between cursor-pointer hover:bg-chip transition-all"
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#F0B31C] flex items-center justify-center text-black font-bold shrink-0 shadow-md">
            <BookOpen className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col pr-2">
            <div className="flex items-center space-x-1.5 text-xs font-display font-bold uppercase tracking-wider text-gold">
              <Bell className="w-3.5 h-3.5" />
              <span>Daily Resurface Nudge</span>
            </div>
            <span className="text-xs font-medium text-ink line-clamp-1">
              📚 {notification.title}
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-[#F0B31C] text-black font-display font-bold uppercase px-2.5 py-1 rounded-lg shrink-0 glow-iqoo">
          TAP TO VIEW
        </span>
      </div>
    </div>
  );
};
