import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end animate-fadeIn">
      {/* Dark overlay backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Sheet panel */}
      <div
        className="relative w-full bg-[#12131C] border-t border-[#F0B31C]/40 rounded-t-[24px] px-5 pt-3 pb-8 shadow-sheet z-10 transform transition-transform duration-300 ease-out max-h-[85vh] overflow-y-auto glow-iqoo"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle pill */}
        <div className="w-10 h-1.5 bg-[#F0B31C]/40 rounded-full mx-auto mb-4 cursor-grab active:cursor-grabbing" />

        {/* Title bar */}
        {title && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F0B31C]/20">
            <h3 className="text-base font-display font-bold uppercase tracking-wider text-[#F0B31C]">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1A1C2B] border border-[#F0B31C]/30 flex items-center justify-center text-[#A0A2B0] hover:text-[#F0B31C] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sheet content */}
        <div>{children}</div>
      </div>
    </div>
  );
};
