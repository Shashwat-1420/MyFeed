import React, { useState, useEffect } from 'react';
import { useSavedFeedStore } from '../store/useSavedFeedStore';
import { SaveCard } from '../components/saves/SaveCard';
import { EmptyState } from '../components/common/EmptyState';
import { Search, X, Clock, Sparkles, ArrowLeft } from 'lucide-react';

export const SearchView: React.FC = () => {
  const {
    saves,
    searchQuery,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    setCategoryFilter,
    setTab,
  } = useSavedFeedStore();

  const [inputVal, setInputVal] = useState(searchQuery);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="flex-1 flex flex-col p-4 bg-[#0D0D0D] text-[#F2F2F2] animate-fadeIn">
      {/* Search Bar Input */}
      <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 mb-4 pt-1">
        <button
          type="button"
          onClick={() => setTab('home')}
          className="p-2 text-[#9A9A9A] hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 text-[#5A5A5A] absolute left-3.5" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setSearchQuery(e.target.value);
            }}
            placeholder="Search semantically or by keywords..."
            autoFocus
            className="w-full h-11 bg-[#1A1A1A] border border-[#2E2E2E] focus:border-[#7C6EF6] rounded-xl pl-10 pr-9 text-xs text-[#F2F2F2] outline-none transition-colors"
          />
          {inputVal && (
            <button
              type="button"
              onClick={() => {
                setInputVal('');
                setSearchQuery('');
              }}
              className="absolute right-3 text-[#5A5A5A] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Searching semantically spinner indicator */}
      {isSearchingSemantic && (
        <div className="flex items-center space-x-2 text-xs text-[#8B5CF6] mb-3 px-1 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Searching vector embeddings semantically...</span>
        </div>
      )}

      {/* Body content based on state */}
      {!q ? (
        /* Empty Query State */
        <div className="space-y-6 flex-1">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9A]">
                  Recent Searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-[11px] text-[#5A5A5A] hover:text-white"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1.5">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(term)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1A1A1A] text-xs text-[#9A9A9A] hover:text-white transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-[#5A5A5A]" />
                      <span>{term}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Topics */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9A] block mb-2.5">
              Suggested Topics
            </span>
            <div className="flex flex-wrap gap-2">
              {['machine learning', 'figma', 'cs50', 'system design', 'react native', 'flutter', 'career'].map(
                (topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(topic)}
                    className="px-3 py-1.5 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] text-xs text-[#9A9A9A] hover:text-white hover:border-[#7C6EF6] transition-all"
                  >
                    #{topic}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Results State */
        <div className="flex-1 space-y-3">
          <div className="text-xs text-[#9A9A9A] mb-2 font-medium">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{q}"
          </div>

          {searchResults.length > 0 ? (
            searchResults.map((item) => (
              <SaveCard key={item.id} save={item} semanticMatch={true} />
            ))
          ) : (
            <EmptyState type="search_no_results" />
          )}
        </div>
      )}
    </div>
  );
};
