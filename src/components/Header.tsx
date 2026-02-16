import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Search } from 'lucide-react';
import { useState } from 'react';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t(translations.home.pt, translations.home.en) },
    { path: '/category/crypto', label: t(translations.crypto.pt, translations.crypto.en) },
    { path: '/category/macro_global', label: t(translations.macro_global.pt, translations.macro_global.en) },
    { path: '/category/central_banks', label: t(translations.central_banks.pt, translations.central_banks.en) },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyber-green/20 bg-cyber-black/95 backdrop-blur supports-[backdrop-filter]:bg-cyber-black/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold cyber-title">
              <span className="text-white">Leo</span>
              <span className="text-cyber-green">.Blog</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-cyber-green",
                  location.pathname === item.path
                    ? "text-cyber-green"
                    : "text-gray-400"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Link
              to="/search"
              className="p-2 text-gray-400 hover:text-cyber-green transition-colors"
              aria-label={t(translations.search.pt, translations.search.en)}
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-cyber-green/30 rounded hover:bg-cyber-green/10 transition-colors"
            >
              <Globe className="h-4 w-4 text-cyber-green" />
              <span className="uppercase text-gray-300">{language}</span>
            </button>

            {/* Main Site Link */}
            <a
              href="https://leoschlanger.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block cyber-button text-sm"
            >
              {t(translations.mainSite.pt, translations.mainSite.en)}
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-cyber-green"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-cyber-green/20">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors hover:text-cyber-green",
                  location.pathname === item.path
                    ? "text-cyber-green"
                    : "text-gray-400"
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://leoschlanger.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2 text-sm text-cyber-green hover:underline"
            >
              {t(translations.mainSite.pt, translations.mainSite.en)}
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
