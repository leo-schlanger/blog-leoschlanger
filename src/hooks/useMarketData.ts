import { useQuery } from '@tanstack/react-query';
import { MARKET_DATA_URL, MARKET_REFRESH_INTERVAL } from '@/lib/constants';

interface CoinData {
  priceFormatted: string;
  change24h: number;
  changeFormatted: string;
}

export interface MarketAlert {
  level: string;
  title: string;
  message: string;
}

export interface MarketData {
  dashboard: {
    fearGreed: { value: number; classification: string; signal: string } | null;
    vix: { value: number | null; zone: string } | null;
    /** Índice amplo do dólar (FRED DTWEXBGS) — não é o DXY da ICE. */
    dxy: { value: number | null; zone: string; impact: string } | null;
    bitcoin: {
      price: number;
      priceFormatted: string;
      change24h: number;
      changeFormatted: string;
    } | null;
  };
  crypto?: {
    BTC: CoinData | null;
    ETH: CoinData | null;
    SOL: CoinData | null;
    global: { totalMarketCapFormatted: string; btcDominance: string } | null;
  };
  alerts: MarketAlert[];
  meta: { updatedAt: string };
}

async function fetchMarketData(): Promise<MarketData> {
  const res = await fetch(MARKET_DATA_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Market data request failed: ${res.status}`);
  return res.json();
}

/**
 * Fonte única dos dados de mercado. Todos os componentes compartilham a
 * mesma query, então a página faz um único request por intervalo.
 */
export function useMarketData() {
  return useQuery({
    queryKey: ['market-data'],
    queryFn: fetchMarketData,
    staleTime: MARKET_REFRESH_INTERVAL,
    refetchInterval: MARKET_REFRESH_INTERVAL,
  });
}
