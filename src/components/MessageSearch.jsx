import React, { useRef, useEffect } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';

export default function MessageSearch({
  query,
  onQueryChange,
  resultCount,
  currentIndex,
  onPrev,
  onNext,
  onClose,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="msg-search-panel" role="search" aria-label="Search messages">
      <div className="msg-search-input-wrap">
        <Search size={16} color="var(--text-muted)" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search messages…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Message search input"
          id="msg-search-input"
        />
      </div>

      {query.trim() && (
        <div className="msg-search-nav" aria-live="polite">
          <span className="msg-search-count">
            {resultCount === 0 ? (
              <span className="no-results">No results</span>
            ) : (
              `${currentIndex + 1} / ${resultCount}`
            )}
          </span>
          <button
            className="icon-btn"
            onClick={onPrev}
            disabled={resultCount === 0}
            aria-label="Previous match"
            id="search-prev-btn"
          >
            <ChevronUp size={18} />
          </button>
          <button
            className="icon-btn"
            onClick={onNext}
            disabled={resultCount === 0}
            aria-label="Next match"
            id="search-next-btn"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      )}

      <button className="icon-btn" onClick={onClose} aria-label="Close search" id="close-search-btn">
        <X size={18} />
      </button>
    </div>
  );
}
