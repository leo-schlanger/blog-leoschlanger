import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Loader2, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchPosts, type BlogPost } from '@/lib/supabase';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { formatDate } from '@/lib/utils';
import { getPostImage } from '@/lib/defaultImages';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { language, t } = useLanguage();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery, language],
    queryFn: () => searchPosts(debouncedQuery, language),
    enabled: debouncedQuery.length >= 2,
  });

  const handleClose = () => {
    setQuery('');
    setDebouncedQuery('');
    onClose();
  };

  const handleResultClick = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-cyber-black/90 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-cyber-dark border border-cyber-green/30 rounded-xl shadow-2xl shadow-cyber-green/10 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center border-b border-cyber-green/20">
          <Search className="w-5 h-5 text-cyber-green/60 ml-4" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(translations.searchPlaceholder.pt, translations.searchPlaceholder.en)}
            className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={handleClose}
            className="p-4 text-gray-500 hover:text-cyber-green transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-8 text-center text-gray-500">
              {t(
                'Digite pelo menos 2 caracteres para buscar',
                'Enter at least 2 characters to search'
              )}
            </div>
          ) : isLoading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-cyber-green animate-spin" />
            </div>
          ) : results && results.length > 0 ? (
            <div className="divide-y divide-cyber-green/10">
              {results.slice(0, 10).map((post) => (
                <SearchResult
                  key={post.id}
                  post={post}
                  language={language}
                  onClick={handleResultClick}
                />
              ))}
              {results.length > 10 && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {t(
                    `Mostrando 10 de ${results.length} resultados`,
                    `Showing 10 of ${results.length} results`
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              {t(translations.noResults.pt, translations.noResults.en)}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-cyber-green/10 px-4 py-2 text-xs text-gray-600 flex items-center justify-between">
          <span>
            <kbd className="px-1.5 py-0.5 bg-cyber-green/10 rounded text-cyber-green/60">ESC</kbd>
            {' '}{t('para fechar', 'to close')}
          </span>
          <span className="text-cyber-green/40">
            {t('Busca em tempo real', 'Real-time search')}
          </span>
        </div>
      </div>
    </div>
  );
}

function SearchResult({
  post,
  language,
  onClick,
}: {
  post: BlogPost;
  language: 'pt' | 'en';
  onClick: () => void;
}) {
  const { t } = useLanguage();
  const title = language === 'pt' ? post.title_pt : post.title_en;
  const summary = language === 'pt' ? post.summary_pt : post.summary_en;
  const slug = language === 'pt' ? post.slug_pt : post.slug_en;
  const imageUrl = getPostImage(post.image_url, post.category, post.id);

  const categoryLabel = translations[post.category as keyof typeof translations]
    ? t(
        (translations[post.category as keyof typeof translations] as { pt: string; en: string }).pt,
        (translations[post.category as keyof typeof translations] as { pt: string; en: string }).en
      )
    : post.category;

  return (
    <Link
      to={`/post/${slug}`}
      onClick={onClick}
      className="flex gap-4 p-4 hover:bg-cyber-green/5 transition-colors"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-cyber-green/70 font-medium">
            {categoryLabel}
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.published_at || post.created_at, language === 'pt' ? 'pt-BR' : 'en-US')}
          </span>
        </div>
        <h4 className="text-white font-medium line-clamp-1 mb-1">
          {title}
        </h4>
        <p className="text-gray-500 text-sm line-clamp-1">
          {summary}
        </p>
      </div>
    </Link>
  );
}
