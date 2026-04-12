import { useState, useEffect, useCallback } from 'react';

const VOTES_KEY = 'blog-sentiment-votes';
const COUNTS_KEY = 'blog-sentiment-counts';

type Vote = 'bullish' | 'bearish';

interface VoteCounts {
  bullish: number;
  bearish: number;
}

function getStoredVotes(): Record<number, Vote> {
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY) || '{}');
  } catch {
    return {};
  }
}

function getStoredCounts(): Record<number, VoteCounts> {
  try {
    return JSON.parse(localStorage.getItem(COUNTS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function useSentimentVote() {
  const [votes, setVotes] = useState<Record<number, Vote>>(getStoredVotes);
  const [counts, setCounts] = useState<Record<number, VoteCounts>>(getStoredCounts);

  useEffect(() => {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem(COUNTS_KEY, JSON.stringify(counts));
  }, [counts]);

  const vote = useCallback((postId: number, sentiment: Vote) => {
    setVotes(prev => {
      const existing = prev[postId];
      if (existing === sentiment) {
        // Remove vote
        const { [postId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [postId]: sentiment };
    });

    setCounts(prev => {
      const current = prev[postId] || { bullish: 0, bearish: 0 };
      const existing = votes[postId];

      const updated = { ...current };
      // Remove previous vote if any
      if (existing) {
        updated[existing] = Math.max(0, updated[existing] - 1);
      }
      // Add new vote (unless toggling off)
      if (existing !== sentiment) {
        updated[sentiment] = updated[sentiment] + 1;
      }

      return { ...prev, [postId]: updated };
    });
  }, [votes]);

  const getVote = useCallback((postId: number) => votes[postId] || null, [votes]);
  const getCounts = useCallback((postId: number) => counts[postId] || { bullish: 0, bearish: 0 }, [counts]);

  return { vote, getVote, getCounts };
}
