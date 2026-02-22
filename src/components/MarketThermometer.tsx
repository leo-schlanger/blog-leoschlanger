import { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  RefreshCw,
} from 'lucide-react';

const DATA_URL = 'https://raw.githubusercontent.com/leo-schlanger/market-thermo-cron/main/data/thermometer.json';

interface ThermometerData {
  dashboard: {
    fearGreed: { value: number; classification: string; signal: string } | null;
    vix: { value: number; zone: string } | null;
    dxy: { value: number; zone: string; impact: string } | null;
    bitcoin: { price: number; priceFormatted: string; change24h: number; changeFormatted: string } | null;
  };
  crypto: {
    BTC: { priceFormatted: string; change24h: number; changeFormatted: string } | null;
    ETH: { priceFormatted: string; change24h: number; changeFormatted: string } | null;
    SOL: { priceFormatted: string; change24h: number; changeFormatted: string } | null;
    global: { totalMarketCapFormatted: string; btcDominance: string } | null;
  };
  alerts: Array<{ level: string; title: string; message: string }>;
  meta: { updatedAt: string };
}

function TrendIcon({ value }: { value: number }) {
  return value >= 0
    ? <TrendingUp className="w-4 h-4 text-cyber-green" />
    : <TrendingDown className="w-4 h-4 text-red-500" />;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1 bg-cyber-green/20 rounded-full overflow-hidden">
      <div
        className="h-full bg-cyber-green rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function MarketThermometer() {
  const [data, setData] = useState<ThermometerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error();
      setData(await res.json());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (error && !data) {
    return (
      <div className="cyber-card p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-red-500 text-sm mb-3">Failed to load data</p>
        <button onClick={fetchData} className="cyber-button text-xs">Retry</button>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="cyber-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-48 bg-cyber-green/20 rounded" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-cyber-green/10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { dashboard, crypto, alerts } = data;

  return (
    <div className="cyber-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-green/20">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyber-green" />
          <span className="text-cyber-green font-semibold tracking-wide">MARKET THERMOMETER</span>
        </div>
        <div className="flex items-center gap-3">
          {alerts.length > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-red-500/40 bg-red-500/10">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span className="text-red-500 text-xs font-medium">{alerts.length}</span>
            </div>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-1.5 rounded hover:bg-cyber-green/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-cyber-green/60 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Main Grid - Fear&Greed + Bitcoin */}
        <div className="grid grid-cols-2 gap-3">
          {/* Fear & Greed */}
          {dashboard.fearGreed && (
            <div className="bg-cyber-dark/80 border border-cyber-green/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-cyber-green/70 text-xs font-medium tracking-wider">FEAR & GREED</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                  dashboard.fearGreed.signal === 'BUY'
                    ? 'text-cyber-green border-cyber-green/40 bg-cyber-green/10'
                    : dashboard.fearGreed.signal === 'SELL'
                    ? 'text-red-500 border-red-500/40 bg-red-500/10'
                    : 'text-cyber-green/60 border-cyber-green/20'
                }`}>
                  {dashboard.fearGreed.signal}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-3xl font-bold ${
                  dashboard.fearGreed.value <= 25 ? 'text-red-500' :
                  dashboard.fearGreed.value <= 45 ? 'text-orange-400' :
                  dashboard.fearGreed.value <= 55 ? 'text-yellow-400' :
                  'text-cyber-green'
                }`}>
                  {dashboard.fearGreed.value}
                </span>
                <span className="text-cyber-green/40 text-sm">/100</span>
              </div>
              <ProgressBar value={dashboard.fearGreed.value} />
              <p className="text-cyber-green/50 text-xs mt-2">{dashboard.fearGreed.classification}</p>
            </div>
          )}

          {/* Bitcoin */}
          {dashboard.bitcoin && (
            <div className="bg-cyber-dark/80 border border-cyber-green/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-cyber-green/70 text-xs font-medium tracking-wider">BITCOIN</span>
                <TrendIcon value={dashboard.bitcoin.change24h} />
              </div>
              <p className={`text-3xl font-bold ${dashboard.bitcoin.change24h >= 0 ? 'text-cyber-green' : 'text-red-500'}`}>
                {dashboard.bitcoin.priceFormatted}
              </p>
              <p className={`text-sm mt-1 ${dashboard.bitcoin.change24h >= 0 ? 'text-cyber-green/70' : 'text-red-500/80'}`}>
                {dashboard.bitcoin.changeFormatted}
              </p>
            </div>
          )}
        </div>

        {/* VIX + DXY */}
        <div className="grid grid-cols-2 gap-3">
          {/* VIX */}
          {dashboard.vix && (
            <div className="bg-cyber-dark/80 border border-cyber-green/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyber-green/70 text-xs font-medium tracking-wider">VIX</span>
                <span className={`text-xs font-medium ${
                  dashboard.vix.zone === 'EXTREME' ? 'text-red-500' :
                  dashboard.vix.zone === 'ELEVATED' ? 'text-orange-400' :
                  'text-cyber-green/70'
                }`}>
                  {dashboard.vix.zone}
                </span>
              </div>
              <p className={`text-3xl font-bold ${
                dashboard.vix.zone === 'EXTREME' ? 'text-red-500' :
                dashboard.vix.zone === 'ELEVATED' ? 'text-orange-400' :
                'text-cyber-green'
              }`}>
                {dashboard.vix.value.toFixed(1)}
              </p>
              <p className="text-cyber-green/50 text-xs mt-1">Volatility Index</p>
            </div>
          )}

          {/* DXY */}
          {dashboard.dxy && (
            <div className="bg-cyber-dark/80 border border-cyber-green/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-cyber-green/70 text-xs font-medium tracking-wider">DXY</span>
                <span className={`text-xs font-medium ${
                  dashboard.dxy.zone === 'STRONG' ? 'text-red-500' :
                  dashboard.dxy.zone === 'WEAK' ? 'text-cyber-green' :
                  'text-cyber-green/70'
                }`}>
                  {dashboard.dxy.zone}
                </span>
              </div>
              <p className={`text-3xl font-bold ${
                dashboard.dxy.zone === 'STRONG' ? 'text-red-500' : 'text-cyber-green'
              }`}>
                {dashboard.dxy.value.toFixed(1)}
              </p>
              <p className="text-cyber-green/50 text-xs mt-1">Dollar Index</p>
            </div>
          )}
        </div>

        {/* Crypto Row */}
        <div className="grid grid-cols-3 gap-3">
          {(['BTC', 'ETH', 'SOL'] as const).map((symbol) => {
            const coin = crypto[symbol];
            if (!coin) return null;
            return (
              <div key={symbol} className="bg-cyber-dark/80 border border-cyber-green/20 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-cyber-green/70 text-xs font-medium">{symbol}</span>
                  <TrendIcon value={coin.change24h} />
                </div>
                <p className={`text-lg font-bold ${coin.change24h >= 0 ? 'text-cyber-green' : 'text-red-500'}`}>
                  {coin.priceFormatted}
                </p>
                <p className={`text-xs ${coin.change24h >= 0 ? 'text-cyber-green/60' : 'text-red-500/70'}`}>
                  {coin.changeFormatted}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {crypto.global && (
          <div className="flex items-center justify-between text-xs text-cyber-green/50 pt-2 border-t border-cyber-green/10">
            <span>MCap: <span className="text-cyber-green/70">{crypto.global.totalMarketCapFormatted}</span></span>
            <span>BTC Dom: <span className="text-cyber-green/70">{crypto.global.btcDominance}%</span></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketThermometer;
