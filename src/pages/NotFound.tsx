import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { useLanguage, translations } from '@/hooks/useLanguage';

export function NotFound() {
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title={t('Página não encontrada', 'Page not found')}
        description={t(
          'A página que você está procurando não existe.',
          'The page you are looking for does not exist.'
        )}
      />

      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-cyber-green mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">
            {t(translations.notFound.pt, translations.notFound.en)}
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {t(
              'A página que você está procurando não existe ou foi movida.',
              'The page you are looking for does not exist or has been moved.'
            )}
          </p>
          <Link to="/" className="cyber-button inline-flex items-center gap-2">
            <Home className="h-4 w-4" />
            {t(translations.backToHome.pt, translations.backToHome.en)}
          </Link>
        </div>
      </div>
    </>
  );
}
