import { useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function GiscusComments() {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous instance
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'leo-schlanger/blog-leoschlanger');
    script.setAttribute('data-repo-id', '');
    script.setAttribute('data-category', 'Comments');
    script.setAttribute('data-category-id', '');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'dark_dimmed');
    script.setAttribute('data-lang', language === 'pt' ? 'pt' : 'en');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    containerRef.current.appendChild(script);
  }, [language]);

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
