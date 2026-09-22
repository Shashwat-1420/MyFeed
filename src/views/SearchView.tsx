import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { SaveCard } from '../components/saves/SaveCard';
import { EmptyState } from '../components/common/EmptyState';
import { Search, X, Clock, Sparkles, ArrowLeft } from 'lucide-react-native';
import { useThemeColors } from '../lib/theme';

export const SearchView: React.FC = () => {
  const {
    saves,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    setTab,
  } = useSavedFeedStore();
  const c = useThemeColors();

  const [inputVal, setInputVal] = useState('');
  const [isSearchingSemantic, setIsSearchingSemantic] = useState(false);

  // Debounce semantic search spinner
  useEffect(() => {
    if (!inputVal.trim()) {
      setIsSearchingSemantic(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearchingSemantic(true);
      setTimeout(() => setIsSearchingSemantic(false), 500);
    }, 350);

    return () => clearTimeout(timer);
  }, [inputVal]);

  const submitSearch = () => {
    if (inputVal.trim()) {
      setSearchQuery(inputVal.trim());
      addRecentSearch(inputVal.trim());
    }
  };

  const handleChipClick = (term: string) => {
    setInputVal(term);
    setSearchQuery(term);
    addRecentSearch(term);
  };

  // Search results filtering (keyword + semantic similarity simulation)
  const q = inputVal.toLowerCase().trim();
  const searchResults = saves.filter((s) => {
    if (s.is_archived || !q) return false;
    const titleMatch = s.title.toLowerCase().includes(q);
    const descMatch = (s.description || '').toLowerCase().includes(q);
    const categoryMatch = s.category.toLowerCase().includes(q);
    const tagMatch = s.tags.some((t) => t.toLowerCase().includes(q));
    const domainMatch = (s.domain || '').toLowerCase().includes(q);
    return titleMatch || descMatch || categoryMatch || tagMatch || domainMatch;
  });

  return (
    <View className="flex-1 bg-canvas">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar Input */}
        <View className="flex-row items-center gap-2 mb-4 pt-1">
          <Pressable onPress={() => setTab('home')} className="p-2 active:opacity-70">
            <ArrowLeft size={20} color={c.muted} />
          </Pressable>

          <View className="flex-1 flex-row items-center relative">
            <View className="absolute left-3.5 z-10">
              <Search size={16} color={c.gold} />
            </View>
            <TextInput
              value={inputVal}
              onChangeText={(t) => {
                setInputVal(t);
                setSearchQuery(t);
              }}
              onSubmitEditing={submitSearch}
              placeholder="Search semantically or by keywords..."
              placeholderTextColor={c.dim}
              returnKeyType="search"
              className="flex-1 h-11 bg-panel border border-gold/30 rounded-xl pl-10 pr-9 text-xs text-ink"
            />
            {inputVal ? (
              <Pressable
                onPress={() => {
                  setInputVal('');
                  setSearchQuery('');
                }}
                className="absolute right-3 z-10"
              >
                <X size={16} color={c.muted} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* Searching semantically spinner indicator */}
        {isSearchingSemantic && (
          <View className="flex-row items-center gap-2 mb-3 px-1">
            <Sparkles size={14} color={c.gold} />
            <Text className="text-xs text-gold font-mono">
              Searching vector embeddings semantically...
            </Text>
          </View>
        )}

        {/* Body content based on state */}
        {!q ? (
          /* Empty Query State */
          <View className="gap-6 flex-1">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-[11px] font-display font-bold uppercase tracking-widest text-gold">
                    Recent Searches
                  </Text>
                  <Pressable onPress={clearRecentSearches} className="active:opacity-70">
                    <Text className="text-[11px] text-dim">Clear all</Text>
                  </Pressable>
                </View>
                <View className="gap-1.5">
                  {recentSearches.map((term, idx) => (
                    <Pressable
                      key={idx}
                      onPress={() => handleChipClick(term)}
                      className="w-full flex-row items-center p-2.5 rounded-xl border border-transparent active:bg-panel"
                    >
                      <Clock size={14} color={c.gold} />
                      <Text className="text-xs text-muted ml-2">{term}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Suggested Topics */}
            <View>
              <Text className="text-[11px] font-display font-bold uppercase tracking-widest text-muted mb-2.5">
                Suggested Topics
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {['machine learning', 'figma', 'cs50', 'system design', 'react native', 'flutter', 'career'].map(
                  (topic, idx) => (
                    <Pressable
                      key={idx}
                      onPress={() => handleChipClick(topic)}
                      className="px-3 py-1.5 rounded-full bg-panel border border-gold/30 active:opacity-80"
                    >
                      <Text className="text-xs text-muted font-mono">#{topic}</Text>
                    </Pressable>
                  )
                )}
              </View>
            </View>
          </View>
        ) : (
          /* Results State */
          <View className="flex-1 gap-3">
            <Text className="text-xs text-muted mb-2 font-medium">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{q}"
            </Text>

            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <SaveCard key={item.id} save={item} semanticMatch={true} />
              ))
            ) : (
              <EmptyState type="search_no_results" />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};