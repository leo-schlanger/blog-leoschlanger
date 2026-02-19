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
                            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold transition-all duration-300 bg-[#FFC439] rounded-full hover:bg-[#ffb300] active:scale-95 shadow-lg"
                        >
                            <div className="flex items-center gap-2">
                                <svg
                                    className="h-6 w-auto"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill="#003087"
                                        d="M17.271 2.407C16.5 1.4 15 1 13 1H5.8c-.4 0-.8.3-.9.7l-3.3 16.6c0 .2 0 .4.2.5h3.6l.8-4.1h2.1c3.5 0 5.4-1.6 6.1-4.7.4-2 .2-3.6-1.1-4.6z"
                                    />
                                    <path
                                        fill="#009CDE"
                                        d="M17.271 2.407C16.5 1.4 15 1 13 1H10.5l-2.6 13.1c.1-.1.2-.1.3-.1h2.1c3.5 0 5.4-1.6 6.1-4.7.4-2 .2-3.6-1.1-4.6l1.9-1.3z"
                                    />
                                    <path
                                        fill="#012169"
                                        d="M8.8 8.1l-1.9 9.5-.4 2.1c0 .2.2.3.4.3h3.3c.4 0 .7-.3.8-.7l.9-4.8c.1-.4.4-.7.8-.7h.9c3.1 0 4.7-1.4 5.3-4.1.2-1.2.1-2.2-.4-3-1 2.7-2.9 4-6.1 4H8.8z"
                                    />
                                </svg>
                                <span className="text-[#003087] text-lg font-extrabold uppercase tracking-tight">{t('Doar agora', 'Donate now')}</span>
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
