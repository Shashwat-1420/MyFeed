import React, { useState } from 'react';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { BottomSheetModal } from '../components/common/BottomSheetModal';
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Cpu,
  Mail,
  Lock,
  Download,
  Trash2,
  ChevronRight,
  Flame,
  Bookmark,
  CheckCircle,
  Shield,
  FileText,
  Star,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    profile,
    saves,
    darkMode,
    toggleDarkMode,
    setTab,
    setScreen,
    activeAiProvider,
    activeAiModel,
  } = useSavedFeedStore();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const totalSaves = saves.length;
  const reviewedSaves = saves.reduce((acc, s) => acc + s.resurface_count, 0);

  // Handle Export Saves JSON
  const handleExportSaves = () => {
    setIsExporting(true);
    const jsonStr = JSON.stringify(saves, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SavedFeed_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setIsExporting(false), 500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0D0D0D] text-[#F2F2F2] animate-fadeIn p-4 overflow-y-auto pb-10 no-scrollbar">
      {/* Top Nav Bar */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <button
          onClick={() => setTab('home')}
          className="flex items-center space-x-1 text-xs text-[#9A9A9A] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
        <span className="text-sm font-semibold text-[#F2F2F2]">Settings & Profile</span>
        <div className="w-8" />
      </div>

      {/* Profile Header */}
      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-4 text-center mb-5 shadow-card">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#7C6EF6] mx-auto mb-3 shadow-glow">
          <img
            src={profile.avatar_url || 'https://picsum.photos/seed/user/200/200'}
            alt={profile.display_name || 'Avatar'}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-base font-bold text-[#F2F2F2]">{profile.display_name || 'Arjun'}</h2>
        <p className="text-xs text-[#9A9A9A] mb-4">@{profile.username}</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 border-t border-[#2E2E2E] pt-3">
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-[#7C6EF6]">{totalSaves}</span>
            <span className="text-[10px] text-[#9A9A9A]">Total Saves</span>
          </div>
          <div className="flex flex-col items-center border-x border-[#2E2E2E]">
            <span className="text-base font-bold text-[#4ADE80]">{reviewedSaves}</span>
            <span className="text-[10px] text-[#9A9A9A]">Reviewed</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-[#FBBF24] flex items-center gap-0.5">
              <Flame className="w-3.5 h-3.5 fill-current" /> {profile.streak_days}
            </span>
            <span className="text-[10px] text-[#9A9A9A]">Streak</span>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4 text-xs">
        {/* Preferences */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A] px-1 block mb-1.5">
            Preferences
          </span>
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl divide-y divide-[#2E2E2E] overflow-hidden">
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center space-x-2.5">
                {darkMode ? <Moon className="w-4 h-4 text-[#7C6EF6]" /> : <Sun className="w-4 h-4 text-[#FBBF24]" />}
                <span className="font-medium text-[#F2F2F2]">Dark Mode</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-11 h-6 rounded-full p-1 transition-colors ${
                  darkMode ? 'bg-[#7C6EF6]' : 'bg-[#2E2E2E]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center space-x-2.5">
                <Bell className="w-4 h-4 text-[#7C6EF6]" />
                <span className="font-medium text-[#F2F2F2]">Daily Nudge Time</span>
              </div>
              <span className="text-xs font-semibold text-[#7C6EF6] bg-[#7C6EF6]/15 px-2.5 py-1 rounded-md">
                {profile.daily_nudge_time} AM
              </span>
            </div>
          </div>
        </div>

        {/* AI Settings */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A] px-1 block mb-1.5">
            AI System Config
          </span>
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl overflow-hidden">
            <div
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-[#222222] transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <Cpu className="w-4 h-4 text-[#8B5CF6]" />
                <div className="flex flex-col">
                  <span className="font-medium text-[#F2F2F2]">Pluggable AI Model</span>
                  <span className="text-[10px] text-[#9A9A9A]">Provider: {activeAiProvider}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5A5A5A]" />
            </div>
          </div>
        </div>

        {/* Account */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A] px-1 block mb-1.5">
            Account & Data
          </span>
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl divide-y divide-[#2E2E2E] overflow-hidden">
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#9A9A9A]" />
                <span className="font-medium text-[#F2F2F2]">Email</span>
              </div>
              <span className="text-[11px] text-[#9A9A9A]">{profile.email}</span>
            </div>

            <button
              onClick={handleExportSaves}
              className="w-full flex items-center justify-between p-3.5 text-left hover:bg-[#222222] transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <Download className="w-4 h-4 text-[#4ADE80]" />
                <span className="font-medium text-[#F2F2F2]">
                  {isExporting ? 'Exporting JSON...' : 'Export My Saves (JSON)'}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5A5A5A]" />
            </button>
          </div>
        </div>

        {/* About */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A] px-1 block mb-1.5">
            About SavedFeed
          </span>
          <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl divide-y divide-[#2E2E2E] overflow-hidden">
            <div className="flex items-center justify-between p-3.5">
              <span className="font-medium text-[#9A9A9A]">App Version</span>
              <span className="font-mono text-xs text-[#7C6EF6]">v1.0.0-prototype</span>
            </div>
            <div className="flex items-center justify-between p-3.5">
              <span className="font-medium text-[#9A9A9A]">Privacy Policy</span>
              <Shield className="w-4 h-4 text-[#5A5A5A]" />
            </div>
          </div>
        </div>
      </div>

      {/* AI Config Info Bottom Sheet */}
      <BottomSheetModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="Pluggable AI System Settings"
      >
        <div className="space-y-3 text-xs">
          <p className="text-[#9A9A9A] leading-relaxed">
            SavedFeed uses a <strong className="text-white">pluggable AI adapter system</strong>. The active AI provider and model are stored in the server-side <code className="bg-[#242424] text-[#7C6EF6] px-1 py-0.5 rounded">app_config</code> database table.
          </p>
          <div className="bg-[#242424] border border-[#2E2E2E] rounded-xl p-3 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#5A5A5A]">Active Provider:</span>
              <span className="text-[#4ADE80]">anthropic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A5A5A]">Categorization Model:</span>
              <span className="text-[#7C6EF6]">{activeAiModel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5A5A5A]">Embeddings Model:</span>
              <span className="text-[#FBBF24]">text-embedding-3-small</span>
            </div>
          </div>
          <p className="text-[11px] text-[#5A5A5A]">
            The app administrator can switch AI models dynamically without redeploying client code.
          </p>
        </div>
      </BottomSheetModal>
    </div>
  );
};
