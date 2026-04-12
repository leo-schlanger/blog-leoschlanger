import { Github, Linkedin, Twitter, ExternalLink, Code2, TrendingUp, Globe } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useLanguage } from '@/hooks/useLanguage';

export function About() {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title={t('Sobre', 'About')}
        description={t(
          'Sobre Leo Schlanger — desenvolvedor e entusiasta de criptomoedas e mercados financeiros.',
          'About Leo Schlanger — developer and cryptocurrency and financial markets enthusiast.'
        )}
        url="/about"
      />

      <div className="min-h-screen">
        <section className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero */}
          <div className="cyber-card p-8 md:p-12 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src="https://github.com/leo-schlanger.png"
                alt="Leo Schlanger"
                className="w-32 h-32 rounded-full border-2 border-cyber-green/50 shadow-[0_0_20px_rgba(0,255,157,0.3)]"
              />
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">Leo Schlanger</h1>
                <p className="text-cyber-green font-medium mb-4">
                  {t('Desenvolvedor & Entusiasta de Mercados', 'Developer & Market Enthusiast')}
                </p>
                <p className="text-gray-400 leading-relaxed">
                  {t(
                    'Desenvolvedor de software apaixonado por tecnologia, criptomoedas e mercados financeiros. Este blog é um projeto pessoal para compartilhar notícias e análises sobre o mundo cripto e a macroeconomia global.',
                    'Software developer passionate about technology, cryptocurrencies, and financial markets. This blog is a personal project to share news and analysis about the crypto world and global macroeconomics.'
                  )}
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-8 pt-8 border-t border-cyber-green/20">
              <a
                href="https://github.com/leo-schlanger"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-green/20 text-gray-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/leo-schlanger"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-green/20 text-gray-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/5 transition-all"
              >
                <Linkedin className="w-4 h-4" />
                <span className="text-sm">LinkedIn</span>
              </a>
              <a
                href="https://twitter.com/leo_schlanger"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-green/20 text-gray-400 hover:text-cyber-green hover:border-cyber-green/40 hover:bg-cyber-green/5 transition-all"
              >
                <Twitter className="w-4 h-4" />
                <span className="text-sm">Twitter/X</span>
              </a>
              <a
                href="https://leoschlanger.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyber-green/20 text-gray-400 hover:text-cyber-green hover:border-cyber-green/40 hover:bg-cyber-green/5 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm">Portfolio</span>
              </a>
            </div>
          </div>

          {/* What this blog covers */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="cyber-card p-6">
              <TrendingUp className="w-8 h-8 text-cyber-green mb-4" />
              <h3 className="text-white font-bold mb-2">
                {t('Cripto & DeFi', 'Crypto & DeFi')}
              </h3>
              <p className="text-gray-400 text-sm">
                {t(
                  'Notícias sobre Bitcoin, Ethereum, altcoins, protocolos DeFi e o ecossistema Web3.',
                  'News about Bitcoin, Ethereum, altcoins, DeFi protocols, and the Web3 ecosystem.'
                )}
              </p>
            </div>
            <div className="cyber-card p-6">
              <Globe className="w-8 h-8 text-cyber-green mb-4" />
              <h3 className="text-white font-bold mb-2">
                {t('Macro Global', 'Global Macro')}
              </h3>
              <p className="text-gray-400 text-sm">
                {t(
                  'Análises sobre política monetária, bancos centrais, commodities e tendências econômicas globais.',
                  'Analysis on monetary policy, central banks, commodities, and global economic trends.'
                )}
              </p>
            </div>
            <div className="cyber-card p-6">
              <Code2 className="w-8 h-8 text-cyber-green mb-4" />
              <h3 className="text-white font-bold mb-2">
                {t('Open Source', 'Open Source')}
              </h3>
              <p className="text-gray-400 text-sm">
                {t(
                  'Este blog é open source. Todo o código está disponível no GitHub para estudo e contribuição.',
                  'This blog is open source. All code is available on GitHub for study and contribution.'
                )}
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-6 bg-cyber-dark/50 rounded-lg border border-cyber-green/10 text-center">
            <p className="text-gray-500 text-sm">
              {t(
                'O conteúdo deste blog é apenas informativo e não constitui recomendação de investimento.',
                'The content of this blog is for informational purposes only and does not constitute investment advice.'
              )}
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
