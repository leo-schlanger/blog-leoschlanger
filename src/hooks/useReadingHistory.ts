import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'blog-reading-history';
const MAX_ITEMS = 20;

export interface ReadingHistoryItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  timestamp: number;
}

function getStored(): ReadingHistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useReadingHistory() {
  const [history, setHistory] = useState<ReadingHistoryItem[]>(getStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((item: Omit<ReadingHistoryItem, 'timestamp'>) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.id !== item.id);
      return [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
