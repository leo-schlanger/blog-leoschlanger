import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DATA_URL = 'https://raw.githubusercontent.com/leo-schlanger/market-thermo-cron/main/data/thermometer.json';

interface CryptoPrice {
  symbol: string;
  price: string;
  change: number;
  changeFormatted: string;
}

export function PriceTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(DATA_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const data = await res.json();

        const cryptoPrices: CryptoPrice[] = [];

        if (data.crypto?.BTC) {
          cryptoPrices.push({
            symbol: 'BTC',
            price: data.crypto.BTC.priceFormatted,
            change: data.crypto.BTC.change24h,
            changeFormatted: data.crypto.BTC.changeFormatted,
          });
        }

        if (data.crypto?.ETH) {
          cryptoPrices.push({
            symbol: 'ETH',
            price: data.crypto.ETH.priceFormatted,
            change: data.crypto.ETH.change24h,
            changeFormatted: data.crypto.ETH.changeFormatted,
          });
        }

        if (data.crypto?.SOL) {
          cryptoPrices.push({
            symbol: 'SOL',
            price: data.crypto.SOL.priceFormatted,
            change: data.crypto.SOL.change24h,
            changeFormatted: data.crypto.SOL.changeFormatted,
          });
        }

        if (data.dashboard?.vix) {
          cryptoPrices.push({
            symbol: 'VIX',
            price: data.dashboard.vix.value.toFixed(1),
            change: 0,
            changeFormatted: data.dashboard.vix.zone,
          });
        }

        if (data.dashboard?.dxy) {
          cryptoPrices.push({
            symbol: 'DXY',
            price: data.dashboard.dxy.value.toFixed(2),
            change: 0,
            changeFormatted: data.dashboard.dxy.zone,
          });
        }

        setPrices(cryptoPrices);
      } catch {
        // Silently fail - ticker is not critical
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || prices.length === 0) {
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
              {item.symbol === 'VIX' || item.symbol === 'DXY' ? (
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
