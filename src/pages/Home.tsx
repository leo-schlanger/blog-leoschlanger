import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { Pagination } from '@/components/Pagination';
import { SEO } from '@/components/SEO';
import { getBlogPosts } from '@/lib/supabase';
import { useLanguage, translations } from '@/hooks/useLanguage';

const POSTS_PER_PAGE = 9;

export function Home() {
  const { language, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', language, currentPage],
    queryFn: () => getBlogPosts(language, POSTS_PER_PAGE, currentPage),
  });

  const totalPages = data ? Math.ceil(data.total / POSTS_PER_PAGE) : 0;
  const posts = data?.posts || [];
  const featuredPost = currentPage === 1 && posts.length > 0 ? posts[0] : null;
  const otherPosts = currentPage === 1 && posts.length > 0 ? posts.slice(1) : posts;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO url="/" />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-30" />
          <div className="absolute inset-0 bg-cyber-gradient" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="text-white">{t('Notícias ', 'News ')}</span>
                <span className="cyber-title">{t('Cripto & Macro', 'Crypto & Macro')}</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                {t(
                  'Análises e notícias sobre criptomoedas, economia global, bancos centrais e mercados financeiros.',
                  'Analysis and news on cryptocurrencies, global economy, central banks and financial markets.'
                )}
              </p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <Loader2 className="h-8 w-8 animate-spin text-cyber-green" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{t('Erro ao carregar posts', 'Error loading posts')}</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="container mx-auto px-4 -mt-8 relative z-20">
                <BlogCard post={featuredPost} featured />
              </section>
            )}

            {/* Latest Posts */}
            <section className="container mx-auto px-4 py-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {t(translations.latestNews.pt, translations.latestNews.en)}
                </h2>
                {data && data.total > 0 && (
                  <span className="text-gray-500 text-sm">
                    {data.total} {t('notícias', 'news')}
                  </span>
                )}
              </div>

              {otherPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  {t(translations.noResults.pt, translations.noResults.en)}
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
