import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useMarketData } from '@/hooks/useMarketData';

export function MarketAlertBanner() {
  const { t } = useLanguage();
  const { data } = useMarketData();
  const alerts = data?.alerts ?? [];
  const [dismissed, setDismissed] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem('dismissed-alerts') || '[]');
    } catch {
      return [];
    }
  });

  const dismiss = (title: string) => {
    const updated = [...dismissed, title];
    setDismissed(updated);
    try {
      sessionStorage.setItem('dismissed-alerts', JSON.stringify(updated));
    } catch {
      // Storage indisponível (modo privado); o estado em memória basta
    }
  };

  const visibleAlerts = alerts.filter(a => !dismissed.includes(a.title));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.title}
          role="alert"
          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border ${
            alert.level === 'critical'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : alert.level === 'warning'
              ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
              : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <span className="font-medium text-sm">{alert.title}</span>
              <span className="text-sm opacity-80 ml-2">{alert.message}</span>
            </div>
          </div>
          <button
            onClick={() => dismiss(alert.title)}
            className="p-1 rounded hover:bg-white/10 transition-colors shrink-0"
            aria-label={t('Fechar alerta', 'Close alert')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
