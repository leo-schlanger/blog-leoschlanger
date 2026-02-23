import { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Globe, Settings2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const DEFAULT_COUNTRIES = ['us', 'eu', 'jp', 'gb', 'cn', 'br'];

const IMPORTANCE_FILTERS = {
  all: '-1,0,1',
  mediumHigh: '0,1',
  highOnly: '1',
};

interface EconomicCalendarProps {
  defaultHeight?: number;
  expandedHeight?: number;
}

export function EconomicCalendar({
  defaultHeight = 400,
  expandedHeight = 600
}: EconomicCalendarProps) {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [importance, setImportance] = useState<keyof typeof IMPORTANCE_FILTERS>('mediumHigh');
  const [showSettings, setShowSettings] = useState(false);

  const locale = language === 'pt' ? 'br' : 'en';
  const currentHeight = isExpanded ? expandedHeight : defaultHeight;

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
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: 'dark',
      isTransparent: true,
      width: '100%',
      height: '100%',
      locale: locale,
      importanceFilter: IMPORTANCE_FILTERS[importance],
      countryFilter: DEFAULT_COUNTRIES.join(','),
    });

    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [locale, importance, isExpanded]);

  const importanceLabels = {
    all: { pt: 'Todos', en: 'All' },
    mediumHigh: { pt: 'Médio/Alto', en: 'Medium/High' },
    highOnly: { pt: 'Alto Impacto', en: 'High Impact' },
  };

  return (
    <div className="cyber-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cyber-green/20">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyber-green" />
          <span className="text-cyber-green font-semibold tracking-wide text-sm">
            {t('CALENDÁRIO ECONÔMICO', 'ECONOMIC CALENDAR')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded transition-colors ${
              showSettings
                ? 'bg-cyber-green/20 text-cyber-green'
                : 'hover:bg-cyber-green/10 text-cyber-green/60'
            }`}
            title={t('Configurações', 'Settings')}
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded hover:bg-cyber-green/10 transition-colors text-cyber-green/60"
            title={isExpanded ? t('Recolher', 'Collapse') : t('Expandir', 'Expand')}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-5 py-3 border-b border-cyber-green/20 bg-cyber-dark/50">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-3.5 h-3.5 text-cyber-green/70" />
            <span className="text-cyber-green/70 text-xs font-medium tracking-wider">
              {t('FILTRO DE IMPACTO', 'IMPACT FILTER')}
            </span>
          </div>
          <div className="flex gap-2">
            {(Object.keys(IMPORTANCE_FILTERS) as Array<keyof typeof IMPORTANCE_FILTERS>).map((key) => (
              <button
                key={key}
                onClick={() => setImportance(key)}
                className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                  importance === key
                    ? 'bg-cyber-green/20 border-cyber-green/50 text-cyber-green'
                    : 'border-cyber-green/20 text-cyber-green/60 hover:border-cyber-green/40 hover:text-cyber-green/80'
                }`}
              >
                {t(importanceLabels[key].pt, importanceLabels[key].en)}
              </button>
            ))}
          </div>
          <p className="text-cyber-green/40 text-xs mt-2">
            {t(
              'US, EU, JP, GB, CN, BR',
              'US, EU, JP, GB, CN, BR'
            )}
          </p>
        </div>
      )}

      {/* Widget Container */}
      <div
        ref={containerRef}
        className="transition-all duration-300 ease-in-out"
        style={{ height: currentHeight }}
      />

      {/* Footer Legend */}
      <div className="px-5 py-3 border-t border-cyber-green/10 bg-cyber-dark/30">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-cyber-green/50">{t('Alto', 'High')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              <span className="text-cyber-green/50">{t('Médio', 'Medium')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              <span className="text-cyber-green/50">{t('Baixo', 'Low')}</span>
            </div>
          </div>
          <span className="text-cyber-green/30">TradingView</span>
        </div>
      </div>
    </div>
  );
}

export default EconomicCalendar;
