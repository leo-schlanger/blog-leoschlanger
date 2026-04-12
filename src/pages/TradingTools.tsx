import { Activity, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { MarketThermometer } from '@/components/MarketThermometer';
import { EconomicCalendar } from '@/components/EconomicCalendar';
import { TradingViewChart } from '@/components/TradingViewChart';
import { SEO } from '@/components/SEO';
import { useLanguage } from '@/hooks/useLanguage';

export function TradingTools() {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title={t('Trading Tools', 'Trading Tools')}
        description={t(
          'Ferramentas essenciais para traders: termômetro de mercado e calendário econômico.',
          'Essential tools for traders: market thermometer and economic calendar.'
        )}
        url="/tools"
      />

      <div className="min-h-screen">
        <section className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-cyber-green/10 border border-cyber-green/30">
              <TrendingUp className="w-6 h-6 text-cyber-green" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {t('Trading Tools', 'Trading Tools')}
              </h1>
              <p className="text-gray-400 text-sm">
                {t(
                  'Dados de mercado e eventos econômicos em tempo real',
                  'Real-time market data and economic events'
                )}
              </p>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Market Thermometer */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-cyber-green/70" />
                <h2 className="text-sm font-medium text-cyber-green/70 tracking-wider">
                  {t('TERMÔMETRO DE MERCADO', 'MARKET THERMOMETER')}
                </h2>
              </div>
              <MarketThermometer />
            </div>

            {/* Economic Calendar */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-cyber-green/70" />
                <h2 className="text-sm font-medium text-cyber-green/70 tracking-wider">
                  {t('CALENDÁRIO ECONÔMICO', 'ECONOMIC CALENDAR')}
                </h2>
              </div>
              <EconomicCalendar defaultHeight={500} expandedHeight={700} />
            </div>
          </div>

          {/* Interactive Charts */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-cyber-green/70" />
              <h2 className="text-sm font-medium text-cyber-green/70 tracking-wider">
                {t('GRÁFICOS INTERATIVOS', 'INTERACTIVE CHARTS')}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <TradingViewChart symbol="BINANCE:BTCUSDT" height={220} />
              <TradingViewChart symbol="BINANCE:ETHUSDT" height={220} />
              <TradingViewChart symbol="BINANCE:SOLUSDT" height={220} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
