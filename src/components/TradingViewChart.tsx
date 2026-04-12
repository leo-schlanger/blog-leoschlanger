import { useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface TradingViewChartProps {
  symbol: string;
  height?: number;
}

export function TradingViewChart({ symbol, height = 220 }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    widgetContainer.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: '100%',
      height: '100%',
      locale: language === 'pt' ? 'br' : 'en',
      dateRange: '1M',
      colorTheme: 'dark',
      isTransparent: true,
      autosize: true,
      largeChartUrl: '',
      noTimeScale: false,
      chartOnly: false,
    });

    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, language]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="rounded-lg overflow-hidden border border-cyber-green/20"
    />
  );
}
