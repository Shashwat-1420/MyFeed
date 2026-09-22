import React, { useState } from 'react';
import { SaveItem } from '../../types/savedfeed';
import { CategoryBadge } from '../common/CategoryBadge';
import { formatRelativeDaysAgo } from '../../lib/resurface';
import { useSavedFeedStore } from '../../store/useSavedFeedStore';
import { BottomSheetModal } from '../common/BottomSheetModal';
import { Star, Archive, Trash2, Globe, ExternalLink } from 'lucide-react';

interface SaveCardProps {
  save: SaveItem;
  showCategory?: boolean;
  semanticMatch?: boolean;
}

export const SaveCard: React.FC<SaveCardProps> = ({
  save,
  showCategory = true,
  semanticMatch = false,
}) => {
  const { setScreen, toggleFavourite, archiveSave, deleteSave } = useSavedFeedStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = () => {
    setScreen('save_detail', save.id);
  };

  const handleLongPress = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsMenuOpen(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        onContextMenu={handleLongPress}
        className={`w-full bg-panel/90 hover:bg-chip border border-[#F0B31C]/20 hover:border-[#F0B31C]/50 rounded-card p-3.5 transition-all duration-200 cursor-pointer shadow-card group active:scale-[0.99] relative overflow-hidden mb-3 ${
          isDeleting ? 'opacity-0 scale-95 transition-all duration-300' : ''
        }`}
      >
        {/* Semantic search match indicator */}
        {semanticMatch && (
          <div className="text-[10px] text-gold font-mono font-semibold flex items-center gap-1 mb-1">
            <span>⚡ AI Semantic Match</span>
          </div>
        )}

        <div className="flex items-start space-x-3">
          {/* Thumbnail */}
          <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-canvas shrink-0 border border-[#F0B31C]/20">
            <img
              src={save.image_url || 'https://picsum.photos/seed/save/200/200'}
              alt={save.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          {/* Right details column */}
          <div className="flex-1 min-w-0 flex flex-col justify-between h-[72px]">
            <div>
              <div className="flex items-center justify-between mb-1">
                {showCategory && <CategoryBadge category={save.category} size="sm" />}
                {save.is_favourite && (
                  <Star className="w-3.5 h-3.5 fill-[#F0B31C] text-gold shrink-0" />
                )}
              </div>
              <h4 className="text-xs font-semibold text-ink line-clamp-2 leading-snug group-hover:text-gold transition-colors">
                {save.title}
              </h4>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted pt-1">
              <div className="flex items-center space-x-1.5 truncate">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-chip text-[10px] text-gold font-mono border border-[#F0B31C]/20">
                  <Globe className="w-2.5 h-2.5 mr-1" />
                  {save.domain || 'web'}
                </span>
                <span>•</span>
                <span>{formatRelativeDaysAgo(save.created_at)}</span>
              </div>

              {/* Tags preview */}
              {save.tags && save.tags.length > 0 && (
                <div className="flex items-center space-x-1 shrink-0">
                  <span className="text-[10px] bg-chip text-muted px-1.5 py-0.5 rounded border border-white/5 font-mono">
                    #{save.tags[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Long-press / Menu Context Sheet */}
      <BottomSheetModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title="Save Options"
      >
        <div className="space-y-1">
          <button
            onClick={() => {
              toggleFavourite(save.id);
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-chip text-xs font-medium text-ink transition-colors"
          >
            <Star
              className={`w-4 h-4 ${
                save.is_favourite ? 'fill-[#FBBF24] text-[#FBBF24]' : 'text-muted'
              }`}
            />
            <span>{save.is_favourite ? 'Remove from Favourites' : 'Add to Favourites'}</span>
          </button>

          <button
            onClick={() => {
              window.open(save.url || '#', '_blank');
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-chip text-xs font-medium text-ink transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-muted" />
            <span>Open Original Link</span>
          </button>

          <button
            onClick={() => {
              archiveSave(save.id);
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-chip text-xs font-medium text-ink transition-colors"
          >
            <Archive className="w-4 h-4 text-muted" />
            <span>Archive Save</span>
          </button>

          <button
            onClick={() => {
              setIsDeleting(true);
              setTimeout(() => {
                deleteSave(save.id);
              }, 200);
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-[#F87171]/10 text-xs font-medium text-[#F87171] transition-colors"
          >
            <Trash2 className="w-4 h-4 text-[#F87171]" />
            <span>Delete Save</span>
          </button>
        </div>
      </BottomSheetModal>
    </>
  );
};
