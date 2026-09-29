import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';
import { USD_INDEX_LABEL } from '@/lib/constants';

interface TickerItem {
  symbol: string;
  price: string;
  change: number;
  changeFormatted: string;
  kind: 'change' | 'zone';
}

export function PriceTicker() {
  const { data, isLoading: loading } = useMarketData();

  const prices = useMemo<TickerItem[]>(() => {
    if (!data) return [];
    const items: TickerItem[] = [];

    for (const symbol of ['BTC', 'ETH', 'SOL'] as const) {
      const coin = data.crypto?.[symbol];
      if (coin) {
        items.push({
          symbol,
          price: coin.priceFormatted,
          change: coin.change24h,
          changeFormatted: coin.changeFormatted,
          kind: 'change',
        });
      }
    }

    const { vix, dxy } = data.dashboard;
    if (vix?.value != null) {
      items.push({ symbol: 'VIX', price: vix.value.toFixed(1), change: 0, changeFormatted: vix.zone, kind: 'zone' });
    }
    if (dxy?.value != null) {
      items.push({ symbol: USD_INDEX_LABEL, price: dxy.value.toFixed(2), change: 0, changeFormatted: dxy.zone, kind: 'zone' });
    }

    return items;
  }, [data]);

  if (!loading && prices.length === 0) return null;

  if (loading) {
    return (
      <div className="bg-cyber-dark/80 border-b border-cyber-green/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-10 gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 w-8 bg-cyber-green/20 rounded animate-pulse" />
                <div className="h-3 w-16 bg-cyber-green/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cyber-dark/80 border-b border-cyber-green/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-10 gap-6 overflow-x-auto scrollbar-hide">
          {prices.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <span className="text-cyber-green font-semibold">{item.symbol}</span>
              <span className="text-white">{item.price}</span>
              {item.kind === 'zone' ? (
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  item.changeFormatted === 'EXTREME' || item.changeFormatted === 'STRONG'
                    ? 'text-red-400 bg-red-500/10'
                    : item.changeFormatted === 'ELEVATED'
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-cyber-green/70 bg-cyber-green/10'
                }`}>
                  {item.changeFormatted}
                </span>
              ) : (
                <span className={`flex items-center gap-0.5 text-xs ${
                  item.change >= 0 ? 'text-cyber-green' : 'text-red-400'
                }`}>
                  {item.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {item.changeFormatted}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
