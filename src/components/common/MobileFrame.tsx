import React, { useState, useEffect } from 'react';
import { useSavedFeedStore } from '../../store/useSavedFeedStore';
import { SimulatedNotificationBanner } from './SimulatedNotificationBanner';
import {
  Smartphone,
  Moon,
  Sun,
  Bell,
  Share2,
  RotateCcw,
  Wifi,
  Battery,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const {
    isMobileFramed,
    toggleMobileFrame,
    darkMode,
    toggleDarkMode,
    triggerSimulatedPush,
    simulateShareIntent,
    resetMockData,
  } = useSavedFeedStore();

  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center p-0 md:p-6 select-none font-['Inter_Tight',sans-serif]">
      {/* Top Reviewer Toolbar */}
      <header className="w-full max-w-[440px] mb-3 px-3.5 py-2.5 bg-panel/90 backdrop-blur-md border border-[#F0B31C]/30 rounded-2xl flex items-center justify-between text-xs shadow-glow hidden md:flex">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-[#F0B31C]/20 border border-[#F0B31C]/40 flex items-center justify-center text-gold">
            <Smartphone className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display tracking-wider text-gold font-bold text-xs uppercase">iQOO HACKATHON</span>
            <span className="text-[9px] text-muted font-mono tracking-tight">MYFEED · CITY BATTLES ⚡</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={triggerSimulatedPush}
            title="Simulate Push Nudge Notification"
            className="p-1.5 rounded-lg bg-chip hover:bg-[#F0B31C]/30 text-gold border border-[#F0B31C]/20 transition-all flex items-center gap-1"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline font-semibold">Nudge</span>
          </button>

          <button
            onClick={() => simulateShareIntent()}
            title="Simulate Share Intent from Instagram"
            className="p-1.5 rounded-lg bg-chip hover:bg-gold/30 text-gold border border-gold/20 transition-all flex items-center gap-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline font-semibold">Share</span>
          </button>

          <button
            onClick={toggleDarkMode}
            title="Toggle Dark / Light Mode"
            className="p-1.5 rounded-lg bg-chip hover:bg-edge text-muted hover:text-gold border border-white/5 transition-all"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleMobileFrame}
            title="Toggle Device Frame"
            className="p-1.5 rounded-lg bg-chip hover:bg-edge text-muted hover:text-gold border border-white/5 transition-all"
          >
            {isMobileFramed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={resetMockData}
            title="Reset Mock Data"
            className="p-1.5 rounded-lg bg-chip hover:bg-edge text-muted hover:text-gold border border-white/5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          isMobileFramed
            ? 'max-w-[390px] h-[844px] rounded-[48px] border-[10px] border-[#181926] shadow-[0_0_60px_rgba(240,179,28,0.25)] overflow-hidden bg-canvas'
            : 'max-w-[430px] min-h-screen md:min-h-[844px] rounded-none md:rounded-3xl border-0 md:border border-[#F0B31C]/30 bg-canvas overflow-hidden'
        }`}
      >
        {/* Simulated Top Status Bar */}
        <div className="h-11 bg-transparent text-ink flex items-center justify-between px-6 pt-2 shrink-0 z-40 select-none">
          <span className="text-xs font-semibold tracking-tight">{currentTime}</span>
          {/* Dynamic Island / Notch */}
          <div className="w-24 h-4 bg-black rounded-full mx-auto hidden sm:block border border-[#1A1A1A]" />
          <div className="flex items-center space-x-1.5 text-xs text-muted">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Global Push Banner Overlay */}
        <SimulatedNotificationBanner />

        {/* Viewport Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative no-scrollbar">
          {children}
        </main>

        {/* Simulated iOS / Android Home Indicator */}
        <div className="h-4 bg-transparent flex items-center justify-center shrink-0 z-40">
          <div className="w-32 h-1 bg-[#4A4A4A] rounded-full" />
        </div>
      </div>
    </div>
  );
};
