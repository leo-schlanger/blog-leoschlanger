import { Briefcase, ExternalLink, LineChart, Shield, Server } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function RecommendedToolsCard() {
    const { t } = useLanguage();

    return (
        <div className="cyber-card p-5 border border-cyber-green/20">
            <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-cyber-green" />
                <span className="text-cyber-green font-semibold tracking-wide text-sm">
                    {t('TOOLS I USE', 'TOOLS I USE')}
                </span>
            </div>

            <div className="space-y-3">
                {/* Hyperliquid */}
                <a
                    href="https://app.hyperliquid.xyz/join/VIPERDEGEN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-cyber-dark/80 border border-cyber-green/10 hover:border-cyber-green/50 hover:bg-cyber-green/5 transition-all group"
                >
                    <LineChart className="w-4 h-4 text-cyber-green/70 group-hover:text-cyber-green" />
                    <div className="flex-1">
                        <p className="text-white text-sm font-medium group-hover:text-cyber-green transition-colors">
                            Hyperliquid
                        </p>
                        <p className="text-cyber-green/50 text-xs">Perpetual DEX (0 fees)</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-cyber-green/30 group-hover:text-cyber-green/70 opacity-0 group-hover:opacity-100 transition-all" />
                </a>

                {/* Ledger */}
                <a
                    href="https://shop.ledger.com/pages/referral-program?referral_code=KF0GQ36T7KJXH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-cyber-dark/80 border border-cyber-green/10 hover:border-cyber-green/50 hover:bg-cyber-green/5 transition-all group"
                >
                    <Shield className="w-4 h-4 text-cyber-green/70 group-hover:text-cyber-green" />
                    <div className="flex-1">
                        <p className="text-white text-sm font-medium group-hover:text-cyber-green transition-colors">
                            Ledger
                        </p>
                        <p className="text-cyber-green/50 text-xs">Hardware Wallet</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-cyber-green/30 group-hover:text-cyber-green/70 opacity-0 group-hover:opacity-100 transition-all" />
                </a>

                {/* Hostinger */}
                <a
                    href="https://hostinger.com.br?REFERRALCODE=5ZNLEOSCHMIR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-cyber-dark/80 border border-cyber-green/10 hover:border-cyber-green/50 hover:bg-cyber-green/5 transition-all group"
                >
                    <Server className="w-4 h-4 text-cyber-green/70 group-hover:text-cyber-green" />
                    <div className="flex-1">
                        <p className="text-white text-sm font-medium group-hover:text-cyber-green transition-colors">
                            Hostinger
                        </p>
                        <p className="text-cyber-green/50 text-xs">Web Hosting</p>
                    </div>
                    <ExternalLink className="w-3 h-3 text-cyber-green/30 group-hover:text-cyber-green/70 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
            </div>
        </div>
    );
}
