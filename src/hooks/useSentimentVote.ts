import { useCallback } from 'react';
import { createPersistentStore, usePersistentStore } from '@/lib/storage';

export type Sentiment = 'bullish' | 'bearish';

/**
 * Leitura pessoal (bullish/bearish) do usuário sobre cada notícia.
 * Fica apenas neste navegador: não existe agregação entre leitores, então
 * a UI não deve exibir percentuais ou contagens como se fossem coletivos.
 */
const votesStore = createPersistentStore<Record<string, Sentiment>>(
  'blog-sentiment-votes',
  {},
  (value): value is Record<string, Sentiment> =>
    !!value && typeof value === 'object' && !Array.isArray(value)
    && Object.values(value).every(v => v === 'bullish' || v === 'bearish')
);

export function useSentimentVote() {
  const [votes, setVotes] = usePersistentStore(votesStore);

  const vote = useCallback((postId: number, sentiment: Sentiment) => {
    setVotes(prev => {
      const next = { ...prev };
      if (next[postId] === sentiment) {
        delete next[postId];
      } else {
        next[postId] = sentiment;
      }
      return next;
    });
  }, [setVotes]);

  const getVote = useCallback(
    (postId: number): Sentiment | null => votes[postId] ?? null,
    [votes]
  );

  return { vote, getVote };
}
