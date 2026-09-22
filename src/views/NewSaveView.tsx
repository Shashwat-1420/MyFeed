import React, { useState, useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { fetchUrlMetadata, ScrapedMetadata } from '../lib/scraper';
import { processSaveWithAI } from '../lib/aiAdapter';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { SaveThumbnail } from '../components/common/SaveThumbnail';
import { CATEGORY_LIST } from '../lib/categories';
import { Category, PlatformSource } from '../types/savedfeed';
import { ArrowLeft, Sparkles, Link as LinkIcon, FileText, Check, Share2, Cpu } from 'lucide-react-native';
import { celebrate } from '../lib/confetti';
import { useThemeColors } from '../lib/theme';

export const NewSaveView: React.FC = () => {
  const { setScreen, setTab, addSave, sharedUrlPayload, sharedTitlePayload, clearShareIntent } = useSavedFeedStore();
  const c = useThemeColors();

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
  const [aiEngine, setAiEngine] = useState<string>('');
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
      const meta = await fetchUrlMetadata(urlInput, sharedTitlePayload);
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
      setAiEngine(aiResult.engine ?? '');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedUrlPayload]);

  // Handle Save Submission
  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      addSave({
        user_id: 'usr_pranav',
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
        celebrate({ particleCount: 50, spread: 70, origin: { y: 0.6 }, colors: ['#FFC800'] });
      } catch {
        // fallback
      }

      setTimeout(() => {
        clearShareIntent();
        setTab('inbox');
      }, 400);
    }, 500);
  };

  const canSave = (mode === 'link' && !!title) || (mode === 'note' && !!noteContent);

  return (
    <ScrollView
      style={{ opacity: isFlickingSuccess ? 0 : 1 }}
      className="flex-1 bg-canvas"
      contentContainerClassName="p-4 pb-10"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Top Bar */}
      <View className="flex-row items-center justify-between mb-4 pt-1">
        <Pressable
          onPress={() => {
            clearShareIntent();
            setTab('inbox');
          }}
          className="flex-row items-center gap-1 active:opacity-70"
        >
          <ArrowLeft size={16} color={c.muted} />
          <Text className="text-xs text-muted">Back</Text>
        </Pressable>
        <Text className="text-sm font-display font-bold uppercase tracking-wider text-gold">
          {sharedUrlPayload ? 'Shared Link Receiver' : 'New Save'}
        </Text>
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          style={{ opacity: canSave ? 1 : 0.45 }}
          className="px-3.5 py-1.5 rounded-full bg-gold-fill shadow-glow"
        >
          <Text className="text-xs font-display font-bold uppercase tracking-wider text-black">
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </Pressable>
      </View>

      {/* Share Intent Banner if active */}
      {sharedUrlPayload && (
        <View className="bg-gold/20 border border-gold/40 rounded-xl p-2.5 mb-3 flex-row items-center gap-2">
          <Share2 size={16} color={c.gold} />
          <Text className="text-xs text-gold font-mono flex-1">
            Captured via Android Share Intent from social app
          </Text>
        </View>
      )}

      {/* Mode toggle bar */}
      <View className="flex-row bg-panel border border-gold/30 rounded-xl p-1 mb-4">
        <Pressable
          onPress={() => setMode('link')}
          style={mode === 'link' ? { backgroundColor: '#FFC800' } : undefined}
          className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg"
        >
          <LinkIcon size={14} color={mode === 'link' ? '#000000' : c.muted} />
          <Text
            style={{ color: mode === 'link' ? '#000000' : c.muted }}
            className="text-xs font-display font-bold uppercase tracking-wider"
          >
            Save Link
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('note')}
          style={mode === 'note' ? { backgroundColor: '#FFC800' } : undefined}
          className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg"
        >
          <FileText size={14} color={mode === 'note' ? '#000000' : c.muted} />
          <Text
            style={{ color: mode === 'note' ? '#000000' : c.muted }}
            className="text-xs font-display font-bold uppercase tracking-wider"
          >
            Quick Note
          </Text>
        </Pressable>
      </View>

      {/* Mode content */}
      <View className="gap-4">
        {mode === 'link' ? (
          <>
            {/* Input area */}
            <View>
              <Text className="block text-[11px] font-display font-bold uppercase tracking-widest text-gold mb-1.5">
                Paste URL
              </Text>
              <TextInput
                value={urlInput}
                onChangeText={setUrlInput}
                placeholder="https://instagram.com/p/..."
                placeholderTextColor={c.dim}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                className="w-full bg-panel border border-gold/30 rounded-xl px-3.5 py-3 text-xs text-ink font-mono"
              />
            </View>

            {/* Platform indicator */}
            <View className="flex-row items-center gap-2">
              <Text className="text-[10px] font-mono text-dim">Detected:</Text>
              <View className="px-2 py-0.5 rounded bg-panel border border-gold/30">
                <Text className="text-[10px] font-mono font-bold uppercase text-gold">
                  {detectedPlatform}
                </Text>
              </View>
            </View>

            {/* Fetch preview button */}
            {!!urlInput && !preview && (
              <Pressable
                onPress={handleFetchPreview}
                disabled={isFetchingMetadata}
                className="w-full py-2.5 rounded-xl border border-gold flex-row items-center justify-center gap-2 shadow-glow active:opacity-80"
              >
                {isFetchingMetadata ? (
                  <Text className="text-gold text-xs font-display font-bold uppercase tracking-wider">
                    Fetching metadata & running AI...
                  </Text>
                ) : (
                  <>
                    <Text className="text-gold text-xs font-display font-bold uppercase tracking-wider">
                      Fetch Preview & Categorize
                    </Text>
                    <Sparkles size={14} color={c.gold} />
                  </>
                )}
              </Pressable>
            )}

            {/* Shimmer loader while fetching */}
            {isFetchingMetadata && (
              <View className="gap-3 pt-2">
                <SkeletonLoader height={160} borderRadius={16} />
                <SkeletonLoader height={20} width="80%" />
                <SkeletonLoader height={14} width="50%" />
              </View>
            )}

            {/* Preview card after fetch */}
            {preview && !isFetchingMetadata && (
              <View className="bg-panel border border-gold/30 rounded-card p-3.5 gap-3 shadow-card">
                <View className="w-full h-[160px] rounded-xl overflow-hidden bg-canvas relative border border-gold/20">
                  <SaveThumbnail uri={preview.image_url} label={preview.domain} letterSize={28} />
                  <View className="absolute top-2 left-2">
                    {isProcessingAi ? (
                      <View className="bg-black/80 px-2 py-1 rounded-full flex-row items-center gap-1">
                        <Sparkles size={12} color={c.gold} />
                        <Text className="text-[10px] text-gold font-mono">Analysing...</Text>
                      </View>
                    ) : (
                      <CategoryBadge category={category} size="sm" />
                    )}
                  </View>
                </View>

                <View>
                  <Text className="text-[10px] text-muted font-mono font-semibold uppercase">
                    Title (Tap to edit)
                  </Text>
                  <TextInput
                    value={title}
                    onChangeText={setTitle}
                    className="w-full text-sm font-semibold text-ink border-b border-gold/30 py-1"
                  />
                </View>

                <View>
                  <Text className="text-[10px] text-muted font-mono font-semibold uppercase">
                    Description
                  </Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    className="w-full text-xs text-muted border-b border-gold/30 py-1"
                  />
                </View>

                {/* AI Tags */}
                <View>
                  <Text className="text-[10px] text-gold font-mono font-semibold uppercase mb-1">
                    AI Auto-Tags
                  </Text>
                  <View className="flex-row flex-wrap gap-1.5">
                    {tags.map((tag, idx) => (
                      <View
                        key={idx}
                        className="bg-canvas border border-gold/30 px-2 py-0.5 rounded-md"
                      >
                        <Text className="text-[11px] text-gold font-mono">#{tag}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Which engine categorized this save */}
                  {!!aiEngine && (
                    <View className="flex-row items-center gap-1.5 mt-2">
                      <Cpu size={12} color={c.gold} />
                      <Text className="text-[10px] text-gold font-mono">
                        {aiEngine === 'on-device'
                          ? 'Categorized on-device · local model, offline'
                          : aiEngine === 'edge'
                          ? 'Categorized via edge function'
                          : 'Categorized with keyword fallback'}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </>
        ) : (
          /* Manual Note Mode */
          <View className="gap-4">
            <View>
              <Text className="block text-[11px] font-display font-bold uppercase tracking-widest text-gold mb-1.5">
                Note Content
              </Text>
              <TextInput
                value={noteContent}
                onChangeText={setNoteContent}
                placeholder="Type your notes, ideas, or quick thoughts..."
                placeholderTextColor={c.dim}
                multiline
                className="w-full bg-panel border border-gold/30 rounded-xl p-3 text-xs text-ink min-h-[120px]"
              />
            </View>

            <View>
              <Text className="block text-[11px] font-display font-bold uppercase tracking-widest text-gold mb-1.5">
                Select Category
              </Text>
              {/* RN has no <select> → inline chip picker */}
              <View className="flex-row flex-wrap gap-2">
                {CATEGORY_LIST.map((cat) => {
                  const isActive = category === cat.id;
                  const Icon = cat.icon;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => setCategory(cat.id as Category)}
                      style={
                        isActive
                          ? { backgroundColor: '#FFC800', borderWidth: 1, borderColor: '#FFC800' }
                          : { borderWidth: 1, borderColor: 'rgba(255,200,0,0.30)' }
                      }
                      className="px-3 py-2 rounded-xl bg-panel"
                    >
                      <View className="flex-row items-center gap-1.5">
                        <Icon size={12} color={isActive ? '#000000' : c.gold} />
                        <Text
                          style={{ color: isActive ? '#000000' : c.muted }}
                          className="text-xs font-mono"
                        >
                          {cat.label}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Full width save action button */}
      <Pressable
        onPress={handleSave}
        disabled={isSaving}
        style={{ opacity: canSave ? 1 : 0.45 }}
        className="w-full h-[52px] rounded-xl flex-row items-center justify-center gap-2 mt-4 bg-gold-fill shadow-glow-lg active:opacity-80"
      >
        {isSaving ? (
          <Text className="text-xs font-display font-bold uppercase tracking-wider text-black">
            Saving to MyFeed...
          </Text>
        ) : (
          <>
            <Text className="text-xs font-display font-bold uppercase tracking-wider text-black">
              Save to MyFeed
            </Text>
            <Check size={16} color="#000000" strokeWidth={3} />
          </>
        )}
      </Pressable>
    </ScrollView>
  );
};