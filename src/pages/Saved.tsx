import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bookmark, History, Loader2, Trash2, ArrowLeft } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { SEO } from '@/components/SEO';
import { getPostsByIds } from '@/lib/supabase';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useReadingHistory } from '@/hooks/useReadingHistory';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { formatDate } from '@/lib/utils';

export function Saved() {
  const { language, t } = useLanguage();
  const { bookmarkedIds } = useBookmarks();
  const { history, clearHistory } = useReadingHistory();

  const sortedIds = [...bookmarkedIds].sort((a, b) => a - b);
  const { data: savedPosts, isLoading, isError, refetch } = useQuery({
    queryKey: ['saved-posts', sortedIds],
    queryFn: () => getPostsByIds(sortedIds),
    enabled: sortedIds.length > 0,
  });

  const locale = language === 'pt' ? 'pt-BR' : 'en-US';

  return (
    <>
      <SEO
        title={t(translations.saved.pt, translations.saved.en)}
        url="/saved"
        noindex
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyber-green mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {t(translations.backToHome.pt, translations.backToHome.en)}
        </Link>

        <section aria-labelledby="saved-heading" className="mb-16">
          <h1 id="saved-heading" className="flex items-center gap-3 text-3xl font-bold text-white mb-2">
            <Bookmark className="h-7 w-7 text-cyber-green" />
            {t('Artigos salvos', 'Saved articles')}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {t(
              'Salvos apenas neste navegador.',
              'Stored only in this browser.'
            )}
          </p>

          {sortedIds.length === 0 ? (
            <p className="text-gray-400 py-8">
              {t(
                'Nenhum artigo salvo ainda. Use o ícone de marcador nos artigos para guardá-los aqui.',
                'No saved articles yet. Use the bookmark icon on articles to keep them here.'
              )}
            </p>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyber-green" />
            </div>
          ) : isError ? (
            <div className="py-8">
              <p className="text-red-400 mb-4">
                {t('Não foi possível carregar os artigos salvos.', 'Could not load saved articles.')}
              </p>
              <button onClick={() => refetch()} className="cyber-button">
                {t('Tentar novamente', 'Try again')}
              </button>
            </div>
          ) : savedPosts && savedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 py-8">
              {t(
                'Os artigos salvos não estão mais disponíveis.',
                'The saved articles are no longer available.'
              )}
            </p>
          )}
        </section>

        <section aria-labelledby="history-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="history-heading" className="flex items-center gap-3 text-xl font-bold text-white">
              <History className="h-5 w-5 text-cyber-green" />
              {t(translations.continueReading.pt, translations.continueReading.en)}
            </h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {t('Limpar histórico', 'Clear history')}
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-gray-400">
              {t('Você ainda não leu nenhum artigo.', "You haven't read any articles yet.")}
            </p>
          ) : (
            <ul className="divide-y divide-cyber-green/10 border border-cyber-green/10 rounded-lg">
              {history.map(item => (
                <li key={item.id}>
                  <Link
                    to={`/post/${item.slug}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-cyber-green/5 transition-colors"
                  >
                    <span className="text-gray-200 hover:text-cyber-green line-clamp-1">{item.title}</span>
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(new Date(item.timestamp), locale)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
