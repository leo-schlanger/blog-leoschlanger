import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ChevronDown, X, Hash } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { HeroPost } from '@/components/HeroPost';
import { CategoryTabs } from '@/components/CategoryTabs';
import { PriceTicker } from '@/components/PriceTicker';
import { Sidebar } from '@/components/Sidebar';
import { SEO } from '@/components/SEO';
import { getCategoryCounts } from '@/lib/supabase';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { usePaginatedPosts } from '@/hooks/usePaginatedPosts';
import { POST_CATEGORIES } from '@/lib/constants';
import { MarketAlertBanner } from '@/components/MarketAlertBanner';

export function Home() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const tag = searchParams.get('tag')?.trim() || null;

  const {
    posts,
    total,
    isLoading,
    isError,
    refetch,
    hasNextPage: hasMore,
    fetchNextPage,
    isFetchingNextPage,
  } = usePaginatedPosts(language, {
    category: selectedCategory ?? undefined,
    tag: tag ?? undefined,
  });

  const { data: categoryCounts } = useQuery({
    queryKey: ['category-counts'],
    queryFn: () => getCategoryCounts(POST_CATEGORIES),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Com filtro de tag a lista vira resultado de busca: sem destaque.
  const heroPost = tag ? undefined : posts[0];
  const gridPosts = tag ? posts : posts.slice(1);

  const clearTag = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('tag');
      return next;
    });
  };

  return (
    <>
      <SEO url="/" noindex={!!tag} />

      <div className="min-h-screen">
        {/* Price Ticker */}
        <PriceTicker />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="h-64 lg:h-96 rounded-xl bg-cyber-dark border border-cyber-green/20 animate-pulse" />
          ) : heroPost ? (
            <HeroPost post={heroPost} />
          ) : null}
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 pb-16">
          {/* Market Alerts */}
          <MarketAlertBanner />

          {/* Category Tabs */}
          <div className="mb-8">
            <CategoryTabs
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              counts={categoryCounts}
            />
            {tag && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-gray-500 text-sm">{t('Filtrando por tag:', 'Filtering by tag:')}</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-cyber-green/10 border border-cyber-green/30 rounded text-cyber-green">
                  <Hash className="h-3.5 w-3.5" />
                  {tag}
                  <button
                    onClick={clearTag}
                    className="ml-1 p-0.5 rounded hover:bg-cyber-green/20 transition-colors"
                    aria-label={t('Remover filtro de tag', 'Clear tag filter')}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            {/* News Grid */}
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {t(translations.latestNews.pt, translations.latestNews.en)}
                </h2>
                {total > 0 && (
                  <span className="text-gray-500 text-sm">
                    {total} {t('notícias', 'news')}
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center min-h-[30vh]">
                  <Loader2 className="h-8 w-8 animate-spin text-cyber-green" />
                </div>
              ) : gridPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gridPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Load More */}
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
            </div>

            {/* Sidebar - Hidden on mobile, shown at bottom */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>
          </div>

          {/* Mobile Sidebar */}
          <div className="lg:hidden mt-12">
            <Sidebar />
          </div>
        </section>
      </div>
    </>
  );
}
