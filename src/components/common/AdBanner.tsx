import React from 'react';
import { Sparkles } from 'lucide-react';

export const AdBanner: React.FC = () => {
  return (
    <div className="w-full my-3 px-1">
      <div className="text-[10px] text-muted uppercase tracking-widest font-mono font-semibold mb-1 flex items-center gap-1">
        <span>Sponsored Partner</span>
        <span className="text-[9px] px-1 bg-panel text-gold border border-[#F0B31C]/30 rounded">iQOO</span>
      </div>
      <div className="w-full h-[52px] bg-panel border border-[#F0B31C]/40 rounded-xl flex items-center justify-between px-3 relative overflow-hidden group hover:border-[#F0B31C] transition-all shadow-glow">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FFCB14] to-[#F0B31C] flex items-center justify-center text-black font-bold text-xs shadow-sm">
            <Sparkles className="w-4 h-4 text-black stroke-[3]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-display font-bold uppercase tracking-wide text-ink group-hover:text-gold transition-colors">
              iQOO 2026 Hackathon Finale
            </span>
            <span className="text-[10px] text-muted font-mono">
              ₹40,00,000 Grand Prize Pool
            </span>
          </div>
        </div>
        <button className="text-[10px] font-display font-bold uppercase tracking-wider bg-[#F0B31C] text-black px-2.5 py-1 rounded-lg hover:bg-[#FFCB14] transition-all active:scale-95 glow-iqoo">
          Explore
        </button>
      </div>
    </div>
  );
};
