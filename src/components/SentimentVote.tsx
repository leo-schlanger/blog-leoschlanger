import { TrendingUp, TrendingDown } from 'lucide-react';
import { useSentimentVote } from '@/hooks/useSentimentVote';
import { useLanguage } from '@/hooks/useLanguage';

interface SentimentVoteProps {
  postId: number;
  compact?: boolean;
}

export function SentimentVote({ postId, compact = false }: SentimentVoteProps) {
  const { vote, getVote, getCounts } = useSentimentVote();
  const { t } = useLanguage();
  const userVote = getVote(postId);
  const counts = getCounts(postId);
  const total = counts.bullish + counts.bearish;
  const bullishPct = total > 0 ? Math.round((counts.bullish / total) * 100) : 50;

  if (compact) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); vote(postId, 'bullish'); }}
          className={`p-1 rounded transition-all ${
            userVote === 'bullish'
              ? 'text-cyber-green bg-cyber-green/20'
              : 'text-gray-500 hover:text-cyber-green hover:bg-cyber-green/10'
          }`}
          aria-label={t('Bullish', 'Bullish')}
        >
          <TrendingUp className="w-3.5 h-3.5" />
        </button>
        {total > 0 && (
          <span className={`text-xs font-medium ${bullishPct >= 50 ? 'text-cyber-green' : 'text-red-400'}`}>
            {bullishPct}%
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); vote(postId, 'bearish'); }}
          className={`p-1 rounded transition-all ${
            userVote === 'bearish'
              ? 'text-red-400 bg-red-500/20'
              : 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
          }`}
          aria-label={t('Bearish', 'Bearish')}
        >
          <TrendingDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-500 text-sm">{t('Sentimento:', 'Sentiment:')}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => vote(postId, 'bullish')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
            userVote === 'bullish'
              ? 'border-cyber-green/50 bg-cyber-green/10 text-cyber-green'
              : 'border-cyber-green/20 text-gray-400 hover:border-cyber-green/40 hover:text-cyber-green'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Bullish</span>
          {total > 0 && <span className="text-xs opacity-70">{bullishPct}%</span>}
        </button>
        <button
          onClick={() => vote(postId, 'bearish')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
            userVote === 'bearish'
              ? 'border-red-500/50 bg-red-500/10 text-red-400'
              : 'border-cyber-green/20 text-gray-400 hover:border-red-500/40 hover:text-red-400'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm font-medium">Bearish</span>
          {total > 0 && <span className="text-xs opacity-70">{100 - bullishPct}%</span>}
        </button>
      </div>
    </div>
  );
}
