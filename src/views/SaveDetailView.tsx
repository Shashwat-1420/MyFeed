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
    <div className="flex-1 flex flex-col bg-[#0D0D0D] text-[#F2F2F2] animate-fadeIn pb-8">
      {/* Hero Header Image */}
      <div className="w-full h-[220px] relative bg-[#1A1A1A] shrink-0">
        <img
          src={save.image_url || 'https://picsum.photos/seed/detail/600/400'}
          alt={save.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-black/50" />

        {/* Floating Top Nav buttons */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <button
            onClick={() => setTab('inbox')}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/80 transition-colors shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => toggleFavourite(save.id)}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white hover:bg-black/80 transition-colors shadow-md"
          >
            <Star
              className={`w-5 h-5 ${
                save.is_favourite ? 'fill-[#FBBF24] text-[#FBBF24]' : 'text-white'
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
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#242424] text-[11px] text-[#9A9A9A] font-mono border border-[#2E2E2E]">
              <Globe className="w-3 h-3 mr-1" />
              {save.domain || 'web'}
            </span>
            <span className="text-xs text-[#5A5A5A]">•</span>
            <span className="text-xs text-[#9A9A9A]">
              Saved {formatRelativeDaysAgo(save.created_at)}
            </span>
          </div>

          <CategoryBadge category={save.category} size="md" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-[#F2F2F2] leading-snug">{save.title}</h1>

        {/* Tags row */}
        {save.tags && save.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {save.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#1A1A1A] border border-[#2E2E2E] text-[#9A9A9A] px-2.5 py-1 rounded-md font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <hr className="border-[#2E2E2E] my-3" />

        {/* Description */}
        <div className="text-xs text-[#9A9A9A] leading-relaxed space-y-2">
          <p>{save.description || 'No additional description provided for this save item.'}</p>
        </div>

        {/* External Link button */}
        {save.url && (
          <a
            href={save.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl border border-[#7C6EF6] text-[#7C6EF6] hover:bg-[#7C6EF6]/10 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
          >
            <span>Open Original Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Spaced Repetition Resurface Status Bar */}
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-2xl p-3.5 space-y-2 mt-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1.5 text-[#7C6EF6] font-semibold">
              <Clock className="w-4 h-4" />
              <span>Spaced Repetition Schedule</span>
            </div>
            <span className="text-[11px] text-[#9A9A9A]">
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
                    isCompleted ? 'bg-[#4ADE80]' : 'bg-[#2E2E2E]'
                  }`}
                />
              );
            })}
          </div>

          <p className="text-[11px] text-[#5A5A5A] pt-1">
            Next resurface interval: <span className="text-[#9A9A9A] font-semibold">{nextDays} days</span>
          </p>
        </div>

        {/* Mark as Reviewed Button */}
        <button
          onClick={handleMarkReviewed}
          disabled={isFillingReviewed}
          className={`w-full h-[52px] rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all relative overflow-hidden ${
            isFillingReviewed
              ? 'bg-[#4ADE80] text-black scale-98'
              : 'bg-[#7C6EF6] hover:bg-[#9585F8] text-white shadow-glow active:scale-95'
          }`}
        >
          {isFillingReviewed ? (
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Updating interval...
            </span>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Mark as Reviewed Today</span>
            </>
          )}
        </button>

        {/* Danger zone actions */}
        <div className="pt-4 flex items-center justify-around text-xs border-t border-[#2E2E2E]/60">
          <button
            onClick={() => setIsArchiveModalOpen(true)}
            className="text-[#9A9A9A] hover:text-white flex items-center space-x-1 transition-colors"
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
