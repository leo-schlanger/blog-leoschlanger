import { Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function DonationSection() {
    const { t } = useLanguage();
    const paypalUrl = "https://www.paypal.com/donate/?hosted_button_id=UAB9LYC87EVBC";

    return (
        <section className="container mx-auto px-4 py-16">
            <div className="relative overflow-hidden rounded-2xl bg-cyber-dark border border-cyber-green/30 p-8 md:p-12">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-cyber-green/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-cyber-green/5 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-green/10 border border-cyber-green/20 text-cyber-green text-sm font-medium mb-4">
                            <Heart className="h-4 w-4 fill-cyber-green" />
                            {t('Apoie o meu trabalho', 'Support my work')}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {t('Gostou do conteúdo? Contribua!', 'Liked the content? Contribute!')}
                        </h2>
                        <p className="text-gray-400 text-lg">
                            {t(
                                'Sua doação me ajuda a manter este projeto independente ativo e a continuar trazendo análises de qualidade sobre o mercado.',
                                'Your donation helps me keep this independent project active and continue bringing quality market analysis.'
                            )}
                        </p>
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-center gap-4">
                        <a
                            href={paypalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-cyber-black transition-all duration-300 bg-cyber-green rounded-xl hover:bg-cyber-green/90 active:scale-95 shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_40px_rgba(0,255,157,0.6)]"
                        >
                            <div className="flex items-center gap-3">
                                <svg
                                    className="h-6 w-auto fill-[#003087]"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M20.067 8.478c.492.288.756.764.756 1.417 0 1.25-.916 2.417-2.333 2.417h-3.333L14 18.333c-.083.417-.417.667-.833.667H10l.667-3.333-.5-.167H7.167L8.667 8.333c.083-.417.417-.667.833-.667H13.5c1.167 0 2.083.333 2.667.812zm-3.334 1.5c0-.417-.333-.667-.833-.667h-2.167l-.666 3.333h2.167c.5 0 .833-.25.833-.667l.666-2zm-3.333 6.666l.5-2.5h-1.667l-.5 2.5h1.667z" />
                                    <path d="M12 1h-7.5c-.8 0-1.5.7-1.7 1.4L1 14.2c-.1.3 0 .6.3.8h3.3l1-5.7c.1-.8.9-1.4 1.7-1.4h3.5c3.2 0 5.8-1.3 6.6-4.5.4-1.8.1-3.4-1-4.4C15.4 1.4 13.8 1 12 1z" opacity=".25" />
                                </svg>
                                <span className="text-lg">{t('Fazer uma doação', 'Make a donation')}</span>
                            </div>
                        </a>
                        <p className="text-gray-500 text-xs italic">
                            {t('Processado com segurança pelo PayPal', 'Securely processed by PayPal')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
