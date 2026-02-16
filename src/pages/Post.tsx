import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, ArrowLeft, ExternalLink, Share2 } from 'lucide-react';
import { getBlogPostBySlug } from '@/lib/supabase';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { formatDate, getReadingTime } from '@/lib/utils';

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug, language],
    queryFn: () => getBlogPostBySlug(slug!, language),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-cyber-dark rounded w-3/4" />
            <div className="h-4 bg-cyber-dark rounded w-1/4" />
            <div className="h-64 bg-cyber-dark rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-cyber-dark rounded" />
              <div className="h-4 bg-cyber-dark rounded" />
              <div className="h-4 bg-cyber-dark rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          {t(translations.notFound.pt, translations.notFound.en)}
        </h1>
        <Link to="/" className="cyber-button inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t(translations.backToHome.pt, translations.backToHome.en)}
        </Link>
      </div>
    );
  }

  const title = language === 'pt' ? post.title_pt : post.title_en;
  const content = language === 'pt' ? post.content_pt : post.content_en;
  const summary = language === 'pt' ? post.summary_pt : post.summary_en;

  const readingTime = getReadingTime(content);
  const categoryLabel = translations[post.category as keyof typeof translations]
    ? t(
        (translations[post.category as keyof typeof translations] as { pt: string; en: string }).pt,
        (translations[post.category as keyof typeof translations] as { pt: string; en: string }).en
      )
    : post.category;

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('Link copiado!', 'Link copied!'));
    }
  };

  return (
    <article className="min-h-screen">
      {/* Header */}
      <header className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="absolute inset-0 bg-cyber-gradient" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-cyber-green mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t(translations.backToHome.pt, translations.backToHome.en)}
            </Link>

            {/* Category */}
            <Link
              to={`/category/${post.category}`}
              className="inline-block px-3 py-1 text-sm font-medium bg-cyber-green/10 text-cyber-green rounded mb-4"
            >
              {categoryLabel}
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {title}
            </h1>

            {/* Summary */}
            <p className="text-xl text-gray-400 mb-8">
              {summary}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {formatDate(post.published_at || post.created_at, language === 'pt' ? 'pt-BR' : 'en-US')}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {readingTime} {t(translations.readingTime.pt, translations.readingTime.en)}
              </span>
              <button
                onClick={sharePost}
                className="flex items-center gap-2 hover:text-cyber-green transition-colors"
              >
                <Share2 className="h-5 w-5" />
                {t('Compartilhar', 'Share')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.image_url && (
        <div className="container mx-auto px-4 -mt-8 relative z-20">
          <div className="max-w-4xl mx-auto">
            <img
              src={post.image_url}
              alt={title}
              className="w-full h-64 md:h-96 object-cover rounded-lg border border-cyber-green/20"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="prose-cyber">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-cyber-green/20">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-cyber-dark border border-cyber-green/20 rounded text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source */}
          <div className="mt-8 p-4 bg-cyber-dark/50 rounded-lg border border-cyber-green/10">
            <p className="text-sm text-gray-500">
              {t(translations.source.pt, translations.source.en)}:{' '}
              <a
                href={post.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber-green hover:underline inline-flex items-center gap-1"
              >
                {post.source_name}
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
