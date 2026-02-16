import { Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage, translations } from '@/hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const categories = [
    { path: '/category/crypto', label: t(translations.crypto.pt, translations.crypto.en) },
    { path: '/category/macro_global', label: t(translations.macro_global.pt, translations.macro_global.en) },
    { path: '/category/central_banks', label: t(translations.central_banks.pt, translations.central_banks.en) },
    { path: '/category/commodities', label: t(translations.commodities.pt, translations.commodities.en) },
  ];

  return (
    <footer className="border-t border-cyber-green/20 bg-cyber-dark/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold">
                <span className="text-white">Leo</span>
                <span className="text-cyber-green">.Blog</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm max-w-md">
              {t(
                'Notícias e análises sobre criptomoedas, economia global e mercados financeiros.',
                'News and analysis on cryptocurrencies, global economy and financial markets.'
              )}
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://github.com/leo-schlanger"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyber-green transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/leo-schlanger"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyber-green transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/leo_schlanger"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyber-green transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t(translations.categories.pt, translations.categories.en)}
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.path}>
                  <Link
                    to={cat.path}
                    className="text-gray-400 hover:text-cyber-green text-sm transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://leoschlanger.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyber-green text-sm transition-colors"
                >
                  {t(translations.mainSite.pt, translations.mainSite.en)}
                </a>
              </li>
              <li>
                <a
                  href="https://leoschlanger.com/#/projects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyber-green text-sm transition-colors"
                >
                  {t('Projetos', 'Projects')}
                </a>
              </li>
              <li>
                <a
                  href="https://leoschlanger.com/#/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyber-green text-sm transition-colors"
                >
                  {t('Contato', 'Contact')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cyber-green/10 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {currentYear} Leo Schlanger. {t('Todos os direitos reservados.', 'All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  );
}
