import { Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ImpactBadgeProps {
  score: number;
  compact?: boolean;
}

function getImpactLevel(score: number): { label: { pt: string; en: string }; color: string } {
  if (score >= 8) return { label: { pt: 'Crítico', en: 'Critical' }, color: 'text-red-400 bg-red-500/15 border-red-500/30' };
  if (score >= 6) return { label: { pt: 'Alto', en: 'High' }, color: 'text-orange-400 bg-orange-500/15 border-orange-500/30' };
  if (score >= 4) return { label: { pt: 'Médio', en: 'Medium' }, color: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30' };
  return { label: { pt: 'Baixo', en: 'Low' }, color: 'text-cyber-green/70 bg-cyber-green/10 border-cyber-green/20' };
}

export function ImpactBadge({ score, compact = false }: ImpactBadgeProps) {
  const { t } = useLanguage();
  const { label, color } = getImpactLevel(score);

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-xs rounded border ${color}`}>
        <Zap className="w-2.5 h-2.5" />
        {t(label.pt, label.en)}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border ${color}`}>
      <Zap className="w-3 h-3" />
      {t('Impacto:', 'Impact:')} {t(label.pt, label.en)}
    </span>
  );
}
