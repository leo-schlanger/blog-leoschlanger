import { Link } from 'react-router-dom';
import { Search, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { SearchModal } from './SearchModal';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-cyber-green/20 bg-cyber-black/95 backdrop-blur supports-[backdrop-filter]:bg-cyber-black/80">
        <div className="container mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">
                <span className="text-white">Leo</span>
                <span className="text-cyber-green">.Blog</span>
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-400 hover:text-cyber-green transition-colors rounded-lg hover:bg-cyber-green/10"
                aria-label={t(translations.search.pt, translations.search.en)}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Language Switch */}
              <button
                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-sm border border-cyber-green/30 rounded-lg hover:bg-cyber-green/10 transition-colors"
              >
                <Globe className="h-4 w-4 text-cyber-green" />
                <span className="uppercase text-gray-300 text-xs font-medium">{language}</span>
              </button>

              {/* Main Site Link */}
              <a
                href="https://leoschlanger.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block cyber-button text-xs py-1.5 px-3"
              >
                {t(translations.mainSite.pt, translations.mainSite.en)}
              </a>
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
