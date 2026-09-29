import type { MouseEvent } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useSentimentVote, type Sentiment } from '@/hooks/useSentimentVote';
import { useLanguage } from '@/hooks/useLanguage';

interface SentimentVoteProps {
  postId: number;
  compact?: boolean;
}

/**
 * Marcação pessoal de viés (bullish/bearish) para a notícia.
 * O voto fica salvo só neste navegador — por isso não há percentuais.
 */
export function SentimentVote({ postId, compact = false }: SentimentVoteProps) {
  const { vote, getVote } = useSentimentVote();
  const { t } = useLanguage();
  const userVote = getVote(postId);

  const handle = (sentiment: Sentiment) => (e: MouseEvent) => {
    // Os cards são links: o clique no voto não deve navegar
    e.preventDefault();
    e.stopPropagation();
    vote(postId, sentiment);
  };

  const bullishLabel = t('Minha leitura: bullish', 'My take: bullish');
  const bearishLabel = t('Minha leitura: bearish', 'My take: bearish');

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handle('bullish')}
          className={`p-1 rounded transition-all ${
            userVote === 'bullish'
              ? 'text-cyber-green bg-cyber-green/20'
              : 'text-gray-500 hover:text-cyber-green hover:bg-cyber-green/10'
          }`}
          aria-label={bullishLabel}
          aria-pressed={userVote === 'bullish'}
          title={bullishLabel}
        >
          <TrendingUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handle('bearish')}
          className={`p-1 rounded transition-all ${
            userVote === 'bearish'
              ? 'text-red-400 bg-red-500/20'
              : 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
          }`}
          aria-label={bearishLabel}
          aria-pressed={userVote === 'bearish'}
          title={bearishLabel}
        >
          <TrendingDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-gray-500 text-sm">{t('Sua leitura:', 'Your take:')}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={handle('bullish')}
          aria-pressed={userVote === 'bullish'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
            userVote === 'bullish'
              ? 'border-cyber-green/50 bg-cyber-green/10 text-cyber-green'
              : 'border-cyber-green/20 text-gray-400 hover:border-cyber-green/40 hover:text-cyber-green'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Bullish</span>
        </button>
        <button
          onClick={handle('bearish')}
          aria-pressed={userVote === 'bearish'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
            userVote === 'bearish'
              ? 'border-red-500/50 bg-red-500/10 text-red-400'
              : 'border-cyber-green/20 text-gray-400 hover:border-red-500/40 hover:text-red-400'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm font-medium">Bearish</span>
        </button>
      </div>
      <span className="text-gray-600 text-xs">
        {t('Salvo só neste navegador', 'Saved only in this browser')}
      </span>
    </div>
  );
}
