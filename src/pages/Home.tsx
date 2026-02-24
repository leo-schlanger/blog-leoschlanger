import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ChevronDown } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { HeroPost } from '@/components/HeroPost';
import { CategoryTabs } from '@/components/CategoryTabs';
import { PriceTicker } from '@/components/PriceTicker';
import { Sidebar } from '@/components/Sidebar';
import { SEO } from '@/components/SEO';
import { getBlogPosts } from '@/lib/supabase';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { POSTS_PER_PAGE } from '@/lib/constants';

export function Home() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<any[]>([]);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
    setAllPosts([]);
  }, [selectedCategory, language]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['posts', language, page, selectedCategory],
    queryFn: () => getBlogPosts(language, POSTS_PER_PAGE, page, selectedCategory || undefined),
  });

  // Accumulate posts for infinite scroll effect
  useEffect(() => {
    if (data?.posts) {
      if (page === 1) {
        setAllPosts(data.posts);
      } else {
        setAllPosts(prev => {
          const newPosts = data.posts.filter(
            post => !prev.some(p => p.id === post.id)
          );
          return [...prev, ...newPosts];
        });
      }
    }
  }, [data, page]);

  // Fetch category counts
  const { data: allData } = useQuery({
    queryKey: ['posts-counts', language],
    queryFn: async () => {
      const categories = ['crypto', 'macro_global', 'central_banks', 'commodities'];
      const counts: Record<string, number> = {};
      for (const cat of categories) {
        const result = await getBlogPosts(language, 1, 1, cat);
        counts[cat] = result.total;
      }
      return counts;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const heroPost = allPosts[0];
  const gridPosts = allPosts.slice(1);
  const hasMore = data?.hasMore ?? false;

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <>
      <SEO url="/" />

      <div className="min-h-screen">
        {/* Price Ticker */}
        <PriceTicker />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8">
          {isLoading && page === 1 ? (
            <div className="h-64 lg:h-96 rounded-xl bg-cyber-dark border border-cyber-green/20 animate-pulse" />
          ) : heroPost ? (
            <HeroPost post={heroPost} />
          ) : null}
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 pb-16">
          {/* Category Tabs */}
          <div className="mb-8">
            <CategoryTabs
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              counts={allData}
            />
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
                {data && data.total > 0 && (
                  <span className="text-gray-500 text-sm">
                    {data.total} {t('notícias', 'news')}
                  </span>
                )}
              </div>

              {isLoading && page === 1 ? (
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
                        onClick={handleLoadMore}
                        disabled={isFetching}
                        className="cyber-button inline-flex items-center gap-2"
                      >
                        {isFetching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                        {t('Carregar mais', 'Load more')}
                      </button>
                    </div>
                  )}
                </>
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
