import React, { useState } from 'react';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { formatRelativeDaysAgo, getResurfaceIntervalDays } from '../lib/resurface';
import { BottomSheetModal } from '../components/common/BottomSheetModal';
import {
  ArrowLeft,
  Star,
  Globe,
  ExternalLink,
  Check,
  Archive,
  Trash2,
  Clock,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SaveDetailView: React.FC = () => {
  const {
    selectedSaveId,
    saves,
    setTab,
    toggleFavourite,
    markReviewed,
    archiveSave,
    deleteSave,
  } = useSavedFeedStore();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isFillingReviewed, setIsFillingReviewed] = useState(false);

  const save = saves.find((s) => s.id === selectedSaveId) || saves[0];

  if (!save) {
    return (
      <div className="flex-1 p-6 text-center text-xs text-[#9A9A9A]">
        Save not found.{' '}
        <button onClick={() => setTab('inbox')} className="text-[#7C6EF6] underline">
          Go back to Inbox
        </button>
      </div>
    );
  }

  const nextDays = getResurfaceIntervalDays(save.resurface_count);

  const handleMarkReviewed = () => {
    setIsFillingReviewed(true);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#4ADE80', '#7C6EF6'],
      });
    } catch {
      // fallback
    }

    setTimeout(() => {
      markReviewed(save.id);
      setIsFillingReviewed(false);
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#08080C] text-[#F2F2F6] animate-fadeIn pb-8">
      {/* Hero Header Image */}
      <div className="w-full h-[220px] relative bg-[#12131C] shrink-0 border-b border-[#F0B31C]/30">
        <img
          src={save.image_url || 'https://picsum.photos/seed/detail/600/400'}
          alt={save.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-[#08080C]/40 to-black/60" />

        {/* Floating Top Nav buttons */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <button
            onClick={() => setTab('inbox')}
            className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-[#F0B31C]/30 flex items-center justify-center text-[#F0B31C] hover:bg-black transition-colors shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => toggleFavourite(save.id)}
            className="w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-[#F0B31C]/30 flex items-center justify-center text-[#F0B31C] hover:bg-black transition-colors shadow-md"
          >
            <Star
              className={`w-5 h-5 ${
                save.is_favourite ? 'fill-[#F0B31C] text-[#F0B31C]' : 'text-white'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-5 pt-1 space-y-4">
        {/* Domain & Category */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#12131C] text-[11px] text-[#F0B31C] font-mono border border-[#F0B31C]/30">
              <Globe className="w-3 h-3 mr-1" />
              {save.domain || 'web'}
            </span>
            <span className="text-xs text-[#626478]">•</span>
            <span className="text-xs text-[#A0A2B0]">
              Saved {formatRelativeDaysAgo(save.created_at)}
            </span>
          </div>

          <CategoryBadge category={save.category} size="md" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-[#F2F2F6] leading-snug">{save.title}</h1>

        {/* Tags row */}
        {save.tags && save.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {save.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#12131C] border border-[#F0B31C]/20 text-[#A0A2B0] px-2.5 py-1 rounded-md font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <hr className="border-[#F0B31C]/20 my-3" />

        {/* Description */}
        <div className="text-xs text-[#A0A2B0] leading-relaxed space-y-2">
          <p>{save.description || 'No additional description provided for this save item.'}</p>
        </div>

        {/* External Link button */}
        {save.url && (
          <a
            href={save.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl border border-[#F0B31C] text-[#F0B31C] hover:bg-[#F0B31C]/20 text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-glow"
          >
            <span>Open Original Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Spaced Repetition Resurface Status Bar */}
        <div className="bg-[#12131C] border border-[#F0B31C]/30 rounded-2xl p-3.5 space-y-2 mt-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 text-[#F0B31C] font-display font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Spaced Repetition Schedule</span>
            </div>
            <span className="text-[11px] text-[#A0A2B0] font-mono">
              Resurfaced {save.resurface_count} times
            </span>
          </div>

          {/* Progress dots bar */}
          <div className="flex items-center space-x-1.5 pt-1">
            {[1, 3, 7, 14, 30, 60].map((interval, idx) => {
              const isCompleted = idx < save.resurface_count;
              return (
                <div
                  key={idx}
                  title={`Interval ${interval} days`}
                  className={`flex-1 h-2 rounded-full transition-all ${
                    isCompleted ? 'bg-[#F0B31C] shadow-glow' : 'bg-[#1A1C2B]'
                  }`}
                />
              );
            })}
          </div>

          <p className="text-[11px] text-[#626478] pt-1">
            Next resurface interval: <span className="text-[#F0B31C] font-semibold">{nextDays} days</span>
          </p>
        </div>

        {/* Mark as Reviewed Button */}
        <button
          onClick={handleMarkReviewed}
          disabled={isFillingReviewed}
          className={`w-full h-[52px] rounded-xl font-display font-bold uppercase tracking-wider text-xs flex items-center justify-center space-x-2 transition-all relative overflow-hidden ${
            isFillingReviewed
              ? 'bg-[#10B981] text-black scale-98'
              : 'bg-[#F0B31C] hover:bg-[#FFCB14] text-black shadow-glow-lg active:scale-95'
          }`}
        >
          {isFillingReviewed ? (
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Updating interval...
            </span>
          ) : (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Mark as Reviewed Today</span>
            </>
          )}
        </button>

        {/* Danger zone actions */}
        <div className="pt-4 flex items-center justify-around text-xs border-t border-[#F0B31C]/20">
          <button
            onClick={() => setIsArchiveModalOpen(true)}
            className="text-[#A0A2B0] hover:text-[#F0B31C] flex items-center space-x-1 transition-colors"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archive Save</span>
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-[#F87171] hover:text-red-400 flex items-center space-x-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Save</span>
          </button>
        </div>
      </div>

      {/* Confirm Delete Bottom Sheet */}
      <BottomSheetModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete this save?"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#9A9A9A]">
            Are you sure you want to delete <strong className="text-white">"{save.title}"</strong>? This action cannot be undone.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="py-3 rounded-xl border border-[#2E2E2E] text-xs font-semibold text-[#9A9A9A] hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteSave(save.id);
                setIsDeleteModalOpen(false);
                setTab('inbox');
              }}
              className="py-3 rounded-xl bg-[#F87171] hover:bg-red-500 text-white text-xs font-semibold shadow-md"
            >
              Delete
            </button>
          </div>
        </div>
      </BottomSheetModal>

      {/* Confirm Archive Bottom Sheet */}
      <BottomSheetModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        title="Archive this save?"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#9A9A9A]">
            Archiving moves this save out of your active inbox. You can unarchive it anytime.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsArchiveModalOpen(false)}
              className="py-3 rounded-xl border border-[#2E2E2E] text-xs font-semibold text-[#9A9A9A] hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                archiveSave(save.id);
                setIsArchiveModalOpen(false);
                setTab('inbox');
              }}
              className="py-3 rounded-xl bg-[#7C6EF6] hover:bg-[#9585F8] text-white text-xs font-semibold shadow-md"
            >
              Archive
            </button>
          </div>
        </div>
      </BottomSheetModal>
    </div>
  );
};
