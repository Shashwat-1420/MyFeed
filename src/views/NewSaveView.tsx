import React, { useState, useEffect } from 'react';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { fetchUrlMetadata, ScrapedMetadata } from '../lib/scraper';
import { processSaveWithAI } from '../lib/aiAdapter';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { CATEGORY_LIST } from '../lib/categories';
import { Category, PlatformSource } from '../types/savedfeed';
import { ArrowLeft, Sparkles, Link as LinkIcon, FileText, Check, Globe, Instagram, Youtube, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const NewSaveView: React.FC = () => {
  const { setScreen, setTab, addSave, sharedUrlPayload, clearShareIntent } = useSavedFeedStore();

  const [mode, setMode] = useState<'link' | 'note'>('link');
  const [urlInput, setUrlInput] = useState(sharedUrlPayload || '');
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformSource>('web');

  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFlickingSuccess, setIsFlickingSuccess] = useState(false);

  // Scraped preview state
  const [preview, setPreview] = useState<ScrapedMetadata | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('uncategorized');
  const [tags, setTags] = useState<string[]>([]);
  const [noteContent, setNoteContent] = useState('');

  // Auto-detect platform icon as user types URL
  useEffect(() => {
    const lower = urlInput.toLowerCase();
    if (lower.includes('instagram.com')) setDetectedPlatform('instagram');
    else if (lower.includes('youtube.com') || lower.includes('youtu.be')) setDetectedPlatform('youtube');
    else if (lower.includes('reddit.com')) setDetectedPlatform('reddit');
    else if (lower.includes('twitter.com') || lower.includes('x.com')) setDetectedPlatform('twitter');
    else setDetectedPlatform('web');
  }, [urlInput]);

  // Handle Fetch Preview button tap
  const handleFetchPreview = async () => {
    if (!urlInput.trim()) return;
    setIsFetchingMetadata(true);
    setIsProcessingAi(true);

    try {
      const meta = await fetchUrlMetadata(urlInput);
      setPreview(meta);
      setTitle(meta.title);
      setDescription(meta.description);
      setIsFetchingMetadata(false);

      // Call AI adapter to categorize and tag
      const aiResult = await processSaveWithAI({
        url: urlInput,
        title: meta.title,
        description: meta.description,
      });

      setCategory(aiResult.category);
      setTags(aiResult.tags);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingMetadata(false);
      setIsProcessingAi(false);
    }
  };

  // If shared via intent, auto fetch on mount
  useEffect(() => {
    if (sharedUrlPayload) {
      handleFetchPreview();
    }
  }, [sharedUrlPayload]);

  // Handle Save Submission
  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      addSave({
        user_id: 'usr_arjun',
        url: mode === 'link' ? urlInput : null,
        title: title || (mode === 'note' ? noteContent.slice(0, 40) : 'Saved Item'),
        description: description || (mode === 'note' ? noteContent : null),
        image_url: preview?.image_url || 'https://picsum.photos/seed/save/600/340',
        domain: preview?.domain || (mode === 'note' ? 'manual' : 'web'),
        source_platform: detectedPlatform,
        category: category,
        tags: tags.length > 0 ? tags : ['saved'],
      });

      setIsFlickingSuccess(true);

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7C6EF6', '#4ADE80', '#FBBF24'],
        });
      } catch {
        // fallback
      }

      setTimeout(() => {
        clearShareIntent();
        setTab('inbox');
      }, 400);
    }, 500);
  };

  return (
    <div
      className={`flex-1 flex flex-col p-4 bg-[#08080C] text-[#F2F2F6] animate-fadeIn ${
        isFlickingSuccess ? 'animate-flick-up' : ''
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <button
          onClick={() => {
            clearShareIntent();
            setTab('inbox');
          }}
          className="flex items-center space-x-1 text-xs text-[#A0A2B0] hover:text-[#F0B31C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-sm font-display font-bold uppercase tracking-wider text-[#F0B31C]">
          {sharedUrlPayload ? 'Shared Link Receiver' : 'New Save'}
        </span>
        <button
          onClick={handleSave}
          disabled={isSaving || (mode === 'link' && !title) || (mode === 'note' && !noteContent)}
          className={`text-xs font-display font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all ${
            (mode === 'link' && title) || (mode === 'note' && noteContent)
              ? 'bg-[#F0B31C] text-black hover:bg-[#FFCB14] shadow-glow cursor-pointer'
              : 'bg-[#12131C] text-[#626478] cursor-not-allowed border border-[#F0B31C]/10'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Share Intent Banner if active */}
      {sharedUrlPayload && (
        <div className="bg-[#F0B31C]/20 border border-[#F0B31C]/40 rounded-xl p-2.5 mb-3 flex items-center space-x-2 text-xs text-[#F0B31C] font-mono">
          <Share2 className="w-4 h-4 shrink-0 text-[#F0B31C]" />
          <span>Captured via Android Share Intent from social app</span>
        </div>
      )}

      {/* Mode toggle bar */}
      <div className="grid grid-cols-2 bg-[#12131C] border border-[#F0B31C]/30 rounded-xl p-1 mb-4">
        <button
          onClick={() => setMode('link')}
          className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
            mode === 'link' ? 'bg-[#F0B31C] text-black shadow-glow' : 'text-[#A0A2B0] hover:text-[#F2F2F6]'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Save Link</span>
        </button>
        <button
          onClick={() => setMode('note')}
          className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-display font-bold uppercase tracking-wider transition-all ${
            mode === 'note' ? 'bg-[#F0B31C] text-black shadow-glow' : 'text-[#A0A2B0] hover:text-[#F2F2F6]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Quick Note</span>
        </button>
      </div>

      {/* Mode content */}
      <div className="flex-1 space-y-4">
        {mode === 'link' ? (
          <>
            {/* Input area */}
            <div>
              <label className="block text-[11px] font-display font-bold uppercase tracking-widest text-[#F0B31C] mb-1.5">
                Paste URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://instagram.com/p/..."
                  className="w-full bg-[#12131C] border border-[#F0B31C]/30 focus:border-[#F0B31C] focus:shadow-glow rounded-xl px-3.5 py-3 text-xs text-[#F2F2F6] outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Platform indicator icons */}
            <div className="flex items-center space-x-2 text-xs text-[#626478]">
              <span className="text-[10px] font-mono">Detected:</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  detectedPlatform === 'instagram'
                    ? 'bg-[#EC4899]/20 text-[#EC4899]'
                    : detectedPlatform === 'youtube'
                    ? 'bg-[#EF4444]/20 text-[#EF4444]'
                    : detectedPlatform === 'reddit'
                    ? 'bg-[#F97316]/20 text-[#F97316]'
                    : detectedPlatform === 'twitter'
                    ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                    : 'bg-[#12131C] text-[#F0B31C] border border-[#F0B31C]/30'
                }`}
              >
                {detectedPlatform}
              </span>
            </div>

            {/* Fetch preview button */}
            {urlInput && !preview && (
              <button
                onClick={handleFetchPreview}
                disabled={isFetchingMetadata}
                className="w-full py-2.5 rounded-xl border border-[#F0B31C] text-[#F0B31C] hover:bg-[#F0B31C]/20 text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-glow"
              >
                {isFetchingMetadata ? (
                  <span>Fetching metadata & running AI...</span>
                ) : (
                  <>
                    <span>Fetch Preview & Categorize</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#F0B31C]" />
                  </>
                )}
              </button>
            )}

            {/* Shimmer loader while fetching */}
            {isFetchingMetadata && (
              <div className="space-y-3 pt-2">
                <SkeletonLoader height="160px" borderRadius="16px" />
                <SkeletonLoader height="20px" width="80%" />
                <SkeletonLoader height="14px" width="50%" />
              </div>
            )}

            {/* Preview card after fetch */}
            {preview && !isFetchingMetadata && (
              <div className="bg-[#12131C] border border-[#F0B31C]/30 rounded-card p-3.5 space-y-3 animate-fadeIn shadow-card">
                <div className="w-full h-[160px] rounded-xl overflow-hidden bg-[#08080C] relative border border-[#F0B31C]/20">
                  <img src={preview.image_url} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2">
                    {isProcessingAi ? (
                      <span className="text-[10px] bg-black/80 text-[#F0B31C] px-2 py-1 rounded-full backdrop-blur-md flex items-center gap-1 font-mono">
                        <Sparkles className="w-3 h-3 text-[#F0B31C] animate-spin" /> Analysing...
                      </span>
                    ) : (
                      <CategoryBadge category={category} size="sm" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#A0A2B0] font-mono font-semibold uppercase">Title (Tap to edit)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-[#F2F2F6] border-b border-[#F0B31C]/30 focus:border-[#F0B31C] outline-none pt-0.5"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#A0A2B0] font-mono font-semibold uppercase">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-transparent text-xs text-[#A0A2B0] border-b border-[#F0B31C]/30 focus:border-[#F0B31C] outline-none resize-none pt-0.5"
                  />
                </div>

                {/* AI Tags */}
                <div>
                  <label className="text-[10px] text-[#F0B31C] font-mono font-semibold uppercase block mb-1">
                    AI Auto-Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="text-[11px] bg-[#08080C] text-[#F0B31C] border border-[#F0B31C]/30 px-2 py-0.5 rounded-md font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Manual Note Mode */
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-display font-bold uppercase tracking-widest text-[#F0B31C] mb-1.5">
                Note Content
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Type your notes, ideas, or quick thoughts..."
                rows={5}
                className="w-full bg-[#12131C] border border-[#F0B31C]/30 focus:border-[#F0B31C] rounded-xl p-3 text-xs text-[#F2F2F6] outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-display font-bold uppercase tracking-widest text-[#F0B31C] mb-1.5">
                Select Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-[#12131C] border border-[#F0B31C]/30 text-xs text-[#F2F2F6] rounded-xl p-3 outline-none font-mono"
              >
                {CATEGORY_LIST.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Full width save action button */}
      <button
        onClick={handleSave}
        disabled={isSaving || (mode === 'link' && !title) || (mode === 'note' && !noteContent)}
        className={`w-full h-[52px] font-display font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center space-x-2 transition-all mt-4 ${
          (mode === 'link' && title) || (mode === 'note' && noteContent)
            ? 'bg-[#F0B31C] hover:bg-[#FFCB14] text-black shadow-glow-lg active:scale-95 cursor-pointer'
            : 'bg-[#12131C] text-[#626478] border border-[#F0B31C]/20 cursor-not-allowed'
        }`}
      >
        {isSaving ? (
          <span>Saving to MyFeed...</span>
        ) : (
          <>
            <span>Save to MyFeed</span>
            <Check className="w-4 h-4 stroke-[3]" />
          </>
        )}
      </button>
    </div>
  );
};
