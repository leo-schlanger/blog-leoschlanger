import { useCallback } from 'react';
import { createPersistentStore, usePersistentStore } from '@/lib/storage';

const MAX_ITEMS = 20;

export interface ReadingHistoryItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  timestamp: number;
}

function isHistoryItem(value: unknown): value is ReadingHistoryItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'number'
    && typeof item.slug === 'string'
    && typeof item.title === 'string'
    && typeof item.category === 'string'
    && typeof item.timestamp === 'number';
}

const historyStore = createPersistentStore<ReadingHistoryItem[]>(
  'blog-reading-history',
  [],
  (value): value is ReadingHistoryItem[] => Array.isArray(value) && value.every(isHistoryItem)
);

export function useReadingHistory() {
  const [history, setHistory] = usePersistentStore(historyStore);

  const addToHistory = useCallback((item: Omit<ReadingHistoryItem, 'timestamp'>) => {
    setHistory(prev => {
      // Mesmo post no topo com os mesmos dados: evita escrita e re-render
      const [first] = prev;
      if (first && first.id === item.id && first.slug === item.slug && first.title === item.title) {
        return prev;
      }
      const filtered = prev.filter(h => h.id !== item.id);
      return [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
    });
  }, [setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return { history, addToHistory, clearHistory };
}
