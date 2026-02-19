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
                            {t('Apoie o nosso trabalho', 'Support our work')}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {t('Ajude a manter o projeto vivo', 'Help keep the project alive')}
                        </h2>
                        <p className="text-gray-400 text-lg">
                            {t(
                                'Sua doação nos ajuda a continuar trazendo análises independentes e de qualidade sobre o mercado de criptomoedas e macroeconomia global.',
                                'Your donation helps us continue bringing independent, quality analysis on the cryptocurrency market and global macroeconomics.'
                            )}
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        <a
                            href={paypalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-cyber-black transition-all duration-200 bg-cyber-green rounded-xl hover:bg-cyber-green/90 active:scale-95 shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)]"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                                    alt="PayPal"
                                    className="h-6 filter brightness-0"
                                />
                                <span>{t('Fazer uma doação', 'Make a donation')}</span>
                            </div>
                        </a>
                        <p className="text-gray-500 text-xs mt-4 text-center">
                            {t('Processado com segurança pelo PayPal', 'Securely processed by PayPal')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
