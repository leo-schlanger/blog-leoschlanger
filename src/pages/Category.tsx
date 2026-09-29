import { useParams, Link } from 'react-router-dom';
import { Loader2, ChevronDown, ArrowLeft } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { SEO } from '@/components/SEO';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { usePaginatedPosts } from '@/hooks/usePaginatedPosts';

export function Category() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();

  const {
    posts: allPosts,
    total,
    isLoading,
    isError,
    refetch,
    hasNextPage: hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = usePaginatedPosts(language, { category: slug }, !!slug);

  const categoryLabel = slug && translations[slug as keyof typeof translations]
    ? t(
        (translations[slug as keyof typeof translations] as { pt: string; en: string }).pt,
        (translations[slug as keyof typeof translations] as { pt: string; en: string }).en
      )
    : slug || '';

  return (
    <>
      <SEO
        title={categoryLabel}
        description={t(
          `Notícias sobre ${categoryLabel} - Leo.Blog`,
          `${categoryLabel} news - Leo.Blog`
        )}
        url={`/category/${slug}`}
      />

      <div className="min-h-screen">
        <section className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-cyber-green mb-4 transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              {t(translations.backToHome.pt, translations.backToHome.en)}
            </Link>
            <h1 className="text-3xl font-bold text-white">
              {categoryLabel}
            </h1>
            {total > 0 && (
              <p className="text-gray-400 mt-2">
                {total} {t('notícias', 'news')}
              </p>
            )}
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[30vh]">
              <Loader2 className="h-8 w-8 animate-spin text-cyber-green" />
            </div>
          ) : allPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="cyber-button inline-flex items-center gap-2"
                  >
                    {isFetchingNextPage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    {t('Carregar mais', 'Load more')}
                  </button>
                </div>
              )}
            </>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">
                {t('Não foi possível carregar as notícias.', 'Could not load the news.')}
              </p>
              <button onClick={() => refetch()} className="cyber-button">
                {t('Tentar novamente', 'Try again')}
              </button>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">
              {t(translations.noResults.pt, translations.noResults.en)}
            </p>
          )}
        </section>
      </div>
    </>
  );
}
