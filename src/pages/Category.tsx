import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { getBlogPosts } from '@/lib/supabase';
import { useLanguage, translations } from '@/hooks/useLanguage';

export function Category() {
  const { category } = useParams<{ category: string }>();
  const { language, t } = useLanguage();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', language, category],
    queryFn: () => getBlogPosts(language, 50, 0, category),
    enabled: !!category,
  });

  const categoryLabel = translations[category as keyof typeof translations]
    ? t(
        (translations[category as keyof typeof translations] as { pt: string; en: string }).pt,
        (translations[category as keyof typeof translations] as { pt: string; en: string }).en
      )
    : category;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-cyber-green" />
      </div>
    );
  }

  return (
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

          <p className="text-gray-400 mt-4">
            {posts?.length || 0} {t('notícias', 'news')}
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="container mx-auto px-4 py-12">
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-12">
            {t(translations.noResults.pt, translations.noResults.en)}
          </p>
        )}
      </section>
    </div>
  );
}
