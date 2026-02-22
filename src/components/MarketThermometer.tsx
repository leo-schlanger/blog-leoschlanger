import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Activity,
  DollarSign,
  BarChart3,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

const DATA_URL = 'https://raw.githubusercontent.com/leo-schlanger/market-thermo-cron/main/data/thermometer.json';

interface ThermometerData {
  dashboard: {
    fearGreed: {
      value: number;
      classification: string;
      signal: string;
    } | null;
    vix: {
      value: number;
      zone: string;
      signal: string;
    } | null;
    dxy: {
      value: number;
      zone: string;
      impact: string;
    } | null;
    bitcoin: {
      symbol: string;
      price: number;
      priceFormatted: string;
      change24h: number;
      changeFormatted: string;
      sentiment: string;
    } | null;
  };
  crypto: {
    BTC: { price: number; priceFormatted: string; change24h: number; changeFormatted: string } | null;
    ETH: { price: number; priceFormatted: string; change24h: number; changeFormatted: string } | null;
    SOL: { price: number; priceFormatted: string; change24h: number; changeFormatted: string } | null;
    global: {
      totalMarketCapFormatted: string;
      btcDominance: string;
      marketCapChange24h: string;
    } | null;
  };
  alerts: Array<{
    level: string;
    type: string;
    title: string;
    message: string;
  }>;
  meta: {
    timestamp: string;
    updatedAt: string;
    nextUpdate: string;
  };
}

function getFearGreedColor(value: number): string {
  if (value <= 25) return 'text-red-500';
  if (value <= 45) return 'text-orange-500';
  if (value <= 55) return 'text-yellow-500';
  if (value <= 75) return 'text-lime-500';
  return 'text-green-500';
}

function getFearGreedBg(value: number): string {
  if (value <= 25) return 'bg-red-500';
  if (value <= 45) return 'bg-orange-500';
  if (value <= 55) return 'bg-yellow-500';
  if (value <= 75) return 'bg-lime-500';
  return 'bg-green-500';
}

function getVixColor(zone: string): string {
  switch (zone) {
    case 'LOW': return 'text-green-500';
    case 'NORMAL': return 'text-lime-500';
    case 'ELEVATED': return 'text-orange-500';
    case 'EXTREME': return 'text-red-500';
    default: return 'text-gray-400';
  }
}

function getDxyColor(zone: string): string {
  switch (zone) {
    case 'WEAK': return 'text-green-500';
    case 'NEUTRAL': return 'text-yellow-500';
    case 'STRONG': return 'text-red-500';
    default: return 'text-gray-400';
  }
}

function ChangeIndicator({ value }: { value: number }) {
  if (value > 0) {
    return <TrendingUp className="w-4 h-4 text-green-500" />;
  } else if (value < 0) {
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  }
  return <Minus className="w-4 h-4 text-gray-400" />;
}

function LoadingSkeleton() {
  return (
    <Card className="cyber-card border-cyber-green/30">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-48 bg-cyber-green/10" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 bg-cyber-green/10 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 bg-cyber-green/10 rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function MarketThermometer() {
  const [data, setData] = useState<ThermometerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(DATA_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch data');
      const json = await response.json();
      setData(json);
      setLastFetch(new Date());
      setError(null);
    } catch (err) {
      setError('Unable to load market data');
      console.error('MarketThermometer error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return <LoadingSkeleton />;
  }

  if (error && !data) {
    return (
      <Card className="cyber-card border-red-500/30">
        <CardContent className="py-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 cyber-button text-sm"
          >
            Try Again
          </button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { dashboard, crypto, alerts, meta } = data;

  return (
    <TooltipProvider>
      <Card className="cyber-card border-cyber-green/30 overflow-hidden">
        {/* Header */}
        <CardHeader className="pb-2 border-b border-cyber-green/20">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-cyber-green">
              <Activity className="w-5 h-5" />
              Market Thermometer
            </CardTitle>
            <div className="flex items-center gap-3">
              {alerts.length > 0 && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {alerts.length}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="bg-cyber-dark border-cyber-green/30 max-w-xs">
                    {alerts.map((alert, i) => (
                      <p key={i} className="text-sm text-gray-300">
                        <span className="text-red-400 font-medium">{alert.title}:</span> {alert.message}
                      </p>
                    ))}
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={fetchData}
                    disabled={loading}
                    className="p-1.5 rounded-md hover:bg-cyber-green/10 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-cyber-green/70 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-cyber-dark border-cyber-green/30">
                  <p className="text-xs text-gray-400">
                    Updated: {meta.updatedAt}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Main Indicators Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Fear & Greed */}
            {dashboard.fearGreed && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-cyber-black/50 rounded-lg p-3 border border-cyber-green/10 hover:border-cyber-green/30 transition-colors cursor-help">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Fear & Greed</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${dashboard.fearGreed.signal === 'BUY' ? 'border-green-500/50 text-green-400' : dashboard.fearGreed.signal === 'SELL' ? 'border-red-500/50 text-red-400' : 'border-gray-500/50 text-gray-400'}`}
                      >
                        {dashboard.fearGreed.signal}
                      </Badge>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className={`text-2xl font-bold ${getFearGreedColor(dashboard.fearGreed.value)}`}>
                        {dashboard.fearGreed.value}
                      </span>
                      <span className="text-xs text-gray-500 pb-1">/100</span>
                    </div>
                    <Progress
                      value={dashboard.fearGreed.value}
                      className="h-1.5 mt-2 bg-cyber-dark"
                    />
                    <p className="text-xs text-gray-400 mt-1">{dashboard.fearGreed.classification}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-cyber-dark border-cyber-green/30">
                  <p className="text-sm">Crypto market sentiment indicator</p>
                  <p className="text-xs text-gray-400">0 = Extreme Fear, 100 = Extreme Greed</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Bitcoin */}
            {dashboard.bitcoin && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-cyber-black/50 rounded-lg p-3 border border-cyber-green/10 hover:border-cyber-green/30 transition-colors cursor-help">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Bitcoin</span>
                      <ChangeIndicator value={dashboard.bitcoin.change24h} />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {dashboard.bitcoin.priceFormatted}
                    </div>
                    <p className={`text-sm mt-1 ${dashboard.bitcoin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {dashboard.bitcoin.changeFormatted}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-cyber-dark border-cyber-green/30">
                  <p className="text-sm">24h price change</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* VIX */}
            {dashboard.vix && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-cyber-black/50 rounded-lg p-3 border border-cyber-green/10 hover:border-cyber-green/30 transition-colors cursor-help">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">VIX</span>
                      <BarChart3 className={`w-4 h-4 ${getVixColor(dashboard.vix.zone)}`} />
                    </div>
                    <div className={`text-2xl font-bold ${getVixColor(dashboard.vix.zone)}`}>
                      {dashboard.vix.value.toFixed(1)}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{dashboard.vix.zone}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-cyber-dark border-cyber-green/30">
                  <p className="text-sm">Volatility Index (Fear Gauge)</p>
                  <p className="text-xs text-gray-400">&lt;15 Low, 15-20 Normal, &gt;20 Elevated, &gt;30 Extreme</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* DXY */}
            {dashboard.dxy && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-cyber-black/50 rounded-lg p-3 border border-cyber-green/10 hover:border-cyber-green/30 transition-colors cursor-help">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wider">DXY</span>
                      <DollarSign className={`w-4 h-4 ${getDxyColor(dashboard.dxy.zone)}`} />
                    </div>
                    <div className={`text-2xl font-bold ${getDxyColor(dashboard.dxy.zone)}`}>
                      {dashboard.dxy.value.toFixed(1)}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{dashboard.dxy.zone}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-cyber-dark border-cyber-green/30">
                  <p className="text-sm">US Dollar Index</p>
                  <p className="text-xs text-gray-400">{dashboard.dxy.impact}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Crypto Prices Row */}
          <div className="grid grid-cols-3 gap-2">
            {['BTC', 'ETH', 'SOL'].map((symbol) => {
              const coin = crypto[symbol as keyof typeof crypto];
              if (!coin || typeof coin !== 'object' || !('price' in coin)) return null;
              return (
                <div
                  key={symbol}
                  className="bg-cyber-black/30 rounded-lg p-2.5 border border-cyber-green/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">{symbol}</span>
                    <ChangeIndicator value={coin.change24h} />
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    {coin.priceFormatted}
                  </div>
                  <div className={`text-xs ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.changeFormatted}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Market Cap */}
          {crypto.global && (
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-cyber-green/10">
              <div className="flex items-center gap-4">
                <span>
                  Market Cap: <span className="text-gray-300">{crypto.global.totalMarketCapFormatted}</span>
                </span>
                <span>
                  BTC Dom: <span className="text-gray-300">{crypto.global.btcDominance}%</span>
                </span>
              </div>
              <a
                href="https://github.com/leo-schlanger/market-thermo-cron"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-cyber-green/60 hover:text-cyber-green transition-colors"
              >
                <span>Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

export default MarketThermometer;
