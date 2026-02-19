import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { Pagination } from '@/components/Pagination';
import { SEO } from '@/components/SEO';
import { getBlogPosts } from '@/lib/supabase';
import { useLanguage, translations } from '@/hooks/useLanguage';

const POSTS_PER_PAGE = 9;

export function Category() {
  const { category } = useParams<{ category: string }>();
  const { language, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['posts', language, category, currentPage],
    queryFn: () => getBlogPosts(language, POSTS_PER_PAGE, currentPage, category),
    enabled: !!category,
  });

  const totalPages = data ? Math.ceil(data.total / POSTS_PER_PAGE) : 0;

  const categoryLabel = translations[category as keyof typeof translations]
    ? t(
      (translations[category as keyof typeof translations] as { pt: string; en: string }).pt,
      (translations[category as keyof typeof translations] as { pt: string; en: string }).en
    )
    : category;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title={categoryLabel}
        description={t(
          `Notícias sobre ${categoryLabel} - Criptomoedas e economia global`,
          `News about ${categoryLabel} - Cryptocurrencies and global economy`
        )}
        url={`/category/${category}`}
      />

      <div className="min-h-screen">
        {/* Header */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-20" />
          <div className="absolute inset-0 bg-cyber-gradient" />

          <div className="container mx-auto px-4 relative z-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-cyber-green mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t(translations.backToHome.pt, translations.backToHome.en)}
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="text-white">{t('Categoria: ', 'Category: ')}</span>
              <span className="cyber-title">{categoryLabel}</span>
            </h1>

            {data && (
              <p className="text-gray-400 mt-4">
                {data.total} {t('notícias', 'news')}
              </p>
            )}
          </div>
        </section>

        {/* Posts Grid */}
        <section className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[30vh]">
              <Loader2 className="h-8 w-8 animate-spin text-cyber-green" />
            </div>
          ) : data && data.posts.length > 0 ? (
            <div className="flex flex-col gap-8">
              {data.total > POSTS_PER_PAGE && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
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
