import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { getBlogPosts, type BlogPost } from '@/lib/supabase';
import { useLanguage, translations } from '@/hooks/useLanguage';

export function Home() {
  const { language, t } = useLanguage();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', language],
    queryFn: () => getBlogPosts(language, 20),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-cyber-green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading posts</p>
      </div>
    );
  }

  const featuredPost = posts?.[0];
  const otherPosts = posts?.slice(1) || [];

  return (
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

      {/* Featured Post */}
      {featuredPost && (
        <section className="container mx-auto px-4 -mt-8 relative z-20">
          <BlogCard post={featuredPost} featured />
        </section>
      )}

      {/* Latest Posts */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">
          {t(translations.latestNews.pt, translations.latestNews.en)}
        </h2>

        {otherPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">
            {t(translations.noResults.pt, translations.noResults.en)}
          </p>
        )}
      </section>
    </div>
  );
}
