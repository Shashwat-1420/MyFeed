import React from 'react';
import { Sparkles } from 'lucide-react';

export const AdBanner: React.FC = () => {
  return (
    <div className="w-full my-3 px-1">
      <div className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
        <span>Advertisement</span>
        <span className="text-[9px] px-1 bg-[#242424] text-[#9A9A9A] rounded">AdMob</span>
      </div>
      <div className="w-full h-[52px] bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl flex items-center justify-between px-3 relative overflow-hidden group hover:border-[#7C6EF6]/40 transition-colors">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C6EF6] to-[#EC4899] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#F2F2F2] group-hover:text-[#7C6EF6] transition-colors">
              Upgrade to SavedFeed Pro
            </span>
            <span className="text-[11px] text-[#9A9A9A]">
              Unlimited saves, AI summaries & zero ads
            </span>
          </div>
        </div>
        <button className="text-[11px] font-semibold bg-[#7C6EF6] text-white px-2.5 py-1 rounded-lg hover:bg-[#9585F8] transition-all active:scale-95">
          Remove Ads
        </button>
      </div>
    </div>
  );
};
