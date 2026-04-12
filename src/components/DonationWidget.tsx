import { useState } from 'react';
import { Heart, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const CRYPTO_ADDRESSES = [
  { symbol: 'BTC', address: '' },
  { symbol: 'ETH', address: '' },
  { symbol: 'SOL', address: '' },
];

// Only show crypto section if at least one address is configured
const hasCryptoAddresses = CRYPTO_ADDRESSES.some(c => c.address.length > 0);

export function DonationWidget() {
  const { t } = useLanguage();
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);

  const copyAddress = (symbol: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedSymbol(symbol);
    setTimeout(() => setCopiedSymbol(null), 2000);
  };

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
        {t('Doar via PayPal', 'Donate via PayPal')}
      </a>

      {hasCryptoAddresses && (
        <div className="mt-4 pt-4 border-t border-cyber-green/10 space-y-2">
          <p className="text-cyber-green/60 text-xs font-medium tracking-wider mb-2">
            {t('OU ENVIE CRYPTO', 'OR SEND CRYPTO')}
          </p>
          {CRYPTO_ADDRESSES.filter(c => c.address.length > 0).map(({ symbol, address }) => (
            <button
              key={symbol}
              onClick={() => copyAddress(symbol, address)}
              className="w-full flex items-center justify-between gap-2 p-2 rounded bg-cyber-dark/80 border border-cyber-green/10 hover:border-cyber-green/30 transition-colors text-left group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-cyber-green text-xs font-bold w-8">{symbol}</span>
                <span className="text-gray-500 text-xs truncate">{address}</span>
              </div>
              {copiedSymbol === symbol ? (
                <Check className="w-3.5 h-3.5 text-cyber-green shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyber-green shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
