import { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { GISCUS_CONFIG } from '@/lib/constants';

interface GiscusCommentsProps {
  /**
   * Identificador estável da discussão. Usar o ID do post faz as versões
   * PT e EN (slugs diferentes) compartilharem os mesmos comentários.
   */
  term: string;
}

const isGiscusConfigured = Boolean(GISCUS_CONFIG.repoId && GISCUS_CONFIG.categoryId);

export function GiscusComments({ term }: GiscusCommentsProps) {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isGiscusConfigured) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', GISCUS_CONFIG.repo);
    script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId);
    script.setAttribute('data-category', GISCUS_CONFIG.category);
    script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId);
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', term);
    script.setAttribute('data-strict', '1');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'dark_dimmed');
    script.setAttribute('data-lang', language === 'pt' ? 'pt' : 'en');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [language, term]);

  if (!isGiscusConfigured) return null;

  return (
    <section className="mt-12 pt-8 border-t border-cyber-green/20">
      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-cyber-green" />
        {t('Comentários', 'Comments')}
      </h2>
      <div ref={containerRef} />
    </section>
  );
}
