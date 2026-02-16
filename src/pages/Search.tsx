import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { BlogCard } from '@/components/BlogCard';
import { searchPosts } from '@/lib/supabase';
import { useLanguage, translations } from '@/hooks/useLanguage';

export function Search() {
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { language, t } = useLanguage();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['search', searchTerm, language],
    queryFn: () => searchPosts(searchTerm, language),
    enabled: searchTerm.length >= 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setSearchTerm(query.trim());
    }
  };

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute inset-0 bg-cyber-gradient" />

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            {t(translations.search.pt, translations.search.en)}
          </h1>

          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(translations.searchPlaceholder.pt, translations.searchPlaceholder.en)}
                className="w-full px-6 py-4 pl-14 bg-cyber-dark border border-cyber-green/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-green focus:ring-1 focus:ring-cyber-green"
              />
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 cyber-button py-2 px-4"
              >
                {t('Buscar', 'Search')}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-12">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyber-green" />
          </div>
        )}

        {!isLoading && searchTerm && posts && (
          <>
            <p className="text-gray-400 mb-8">
              {posts.length} {t('resultados para', 'results for')} "{searchTerm}"
            </p>

            {posts.length > 0 ? (
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
          </>
        )}

        {!searchTerm && (
          <p className="text-gray-400 text-center py-12">
            {t('Digite pelo menos 2 caracteres para buscar', 'Enter at least 2 characters to search')}
          </p>
        )}
      </section>
    </div>
  );
}
