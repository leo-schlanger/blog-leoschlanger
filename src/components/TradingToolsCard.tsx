import { Link } from 'react-router-dom';
import { TrendingUp, Activity, Calendar, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function TradingToolsCard() {
  const { t } = useLanguage();

  return (
    <Link to="/tools" className="block">
      <div className="cyber-card p-5 hover:border-cyber-green/50 transition-colors group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyber-green" />
            <span className="text-cyber-green font-semibold tracking-wide text-sm">
              TRADING TOOLS
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-cyber-green/40 group-hover:text-cyber-green group-hover:translate-x-0.5 transition-all" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-dark/80 border border-cyber-green/10">
            <Activity className="w-4 h-4 text-cyber-green/70" />
            <div>
              <p className="text-white text-sm font-medium">
                {t('Termômetro de Mercado', 'Market Thermometer')}
              </p>
              <p className="text-cyber-green/50 text-xs">
                {t('Fear & Greed, VIX, DXY, Crypto', 'Fear & Greed, VIX, DXY, Crypto')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-cyber-dark/80 border border-cyber-green/10">
            <Calendar className="w-4 h-4 text-cyber-green/70" />
            <div>
              <p className="text-white text-sm font-medium">
                {t('Calendário Econômico', 'Economic Calendar')}
              </p>
              <p className="text-cyber-green/50 text-xs">
                {t('Eventos e indicadores globais', 'Global events and indicators')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-cyber-green/10">
          <span className="text-cyber-green text-xs font-medium group-hover:underline">
            {t('Acessar ferramentas', 'Access tools')} →
          </span>
        </div>
      </div>
    </Link>
  );
}
