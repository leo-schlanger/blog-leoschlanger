import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ChevronDown, ArrowLeft } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { SEO } from '@/components/SEO';
import { getBlogPosts, type BlogPost } from '@/lib/supabase';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { POSTS_PER_PAGE } from '@/lib/constants';

export function Category() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPage(1);
    setAllPosts([]);
  }, [slug, language]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['category-posts', language, page, slug],
    queryFn: () => getBlogPosts(language, POSTS_PER_PAGE, page, slug),
    enabled: !!slug,
  });

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

  const categoryLabel = slug && translations[slug as keyof typeof translations]
    ? t(
        (translations[slug as keyof typeof translations] as { pt: string; en: string }).pt,
        (translations[slug as keyof typeof translations] as { pt: string; en: string }).en
      )
    : slug || '';

  const hasMore = data?.hasMore ?? false;

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
            {data && (
              <p className="text-gray-400 mt-2">
                {data.total} {t('notícias', 'news')}
              </p>
            )}
          </div>

          {/* Posts Grid */}
          {isLoading && page === 1 ? (
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
                    onClick={() => setPage(prev => prev + 1)}
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
        </section>
      </div>
    </>
  );
}
