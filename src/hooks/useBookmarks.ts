import { useCallback } from 'react';
import { createPersistentStore, usePersistentStore } from '@/lib/storage';

const bookmarksStore = createPersistentStore<number[]>(
  'blog-bookmarks',
  [],
  (value): value is number[] =>
    Array.isArray(value) && value.every(v => typeof v === 'number')
);

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = usePersistentStore(bookmarksStore);

  const isBookmarked = useCallback(
    (id: number) => bookmarkedIds.includes(id),
    [bookmarkedIds]
  );

  const toggleBookmark = useCallback((id: number) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, [setBookmarkedIds]);

  return { bookmarkedIds, isBookmarked, toggleBookmark };
}
