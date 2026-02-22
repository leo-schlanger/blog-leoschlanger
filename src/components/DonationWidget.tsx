import { Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function DonationWidget() {
  const { t } = useLanguage();

  return (
    <div className="cyber-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-5 h-5 text-cyber-green" />
        <span className="text-cyber-green font-semibold text-sm tracking-wide">
          {t('APOIE O PROJETO', 'SUPPORT THE PROJECT')}
        </span>
      </div>

      <p className="text-gray-400 text-sm mb-4">
        {t(
          'Gostou do conteúdo? Ajude a manter o projeto ativo.',
          'Enjoyed the content? Help keep the project active.'
        )}
      </p>

      <a
        href="https://www.paypal.com/donate/?hosted_button_id=UAB9LYC87EVBC"
        target="_blank"
        rel="noopener noreferrer"
        className="cyber-button w-full flex items-center justify-center gap-2 text-sm"
      >
        <Heart className="w-4 h-4" />
        {t('Fazer uma doação', 'Make a donation')}
      </a>
    </div>
  );
}
