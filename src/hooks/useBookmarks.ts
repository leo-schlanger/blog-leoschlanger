import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'blog-bookmarks';

function getStored(): number[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(getStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const isBookmarked = useCallback(
    (id: number) => bookmarkedIds.includes(id),
    [bookmarkedIds]
  );

  const toggleBookmark = useCallback((id: number) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  return { bookmarkedIds, isBookmarked, toggleBookmark };
}
