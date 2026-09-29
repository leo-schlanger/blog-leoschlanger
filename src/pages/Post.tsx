import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, ArrowLeft, ExternalLink, Share2, Heart, Check } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/supabase';
import { SEO } from '@/components/SEO';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { formatDate, getReadingTime, slugify } from '@/lib/utils';
import { getPostImage } from '@/lib/defaultImages';
import { PostImage } from '@/components/PostImage';
import { ReadingProgress } from '@/components/ReadingProgress';
import { SocialShare } from '@/components/SocialShare';
import { TableOfContents } from '@/components/TableOfContents';
import { RelatedPosts } from '@/components/RelatedPosts';
import { GiscusComments } from '@/components/GiscusComments';
import { BookmarkButton } from '@/components/BookmarkButton';
import { SentimentVote } from '@/components/SentimentVote';
import { useReadingHistory } from '@/hooks/useReadingHistory';

/** Texto puro dos filhos de um heading renderizado pelo react-markdown. */
function nodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return nodeText((node.props as { children?: ReactNode }).children);
  }
  return '';
}

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [showCopied, setShowCopied] = useState(false);
  const { addToHistory } = useReadingHistory();

  const { data: post, isLoading, isError, refetch } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => getBlogPostBySlug(slug!, language),
    enabled: !!slug,
  });

  // A URL define o idioma do conteúdo: cada slug é uma página indexável
  // no seu idioma (coerente com o HTML pré-renderizado e o hreflang).
  const contentLanguage: 'pt' | 'en' =
    post && slug === post.slug_en && slug !== post.slug_pt
      ? 'en'
      : post && slug === post.slug_pt
        ? 'pt'
        : language;

  // Troca de idioma na interface leva ao slug equivalente do post.
  const previousLanguage = useRef(language);
  useEffect(() => {
    if (previousLanguage.current === language) return;
    previousLanguage.current = language;
    if (!post) return;
    const target = language === 'pt' ? post.slug_pt : post.slug_en;
    if (target && target !== slug) {
      navigate(`/post/${target}`, { replace: true });
    }
  }, [language, post, slug, navigate]);

  // Track reading history
  useEffect(() => {
    if (post) {
      const title = contentLanguage === 'pt' ? post.title_pt : post.title_en;
      const postSlug = contentLanguage === 'pt' ? post.slug_pt : post.slug_en;
      addToHistory({ id: post.id, slug: postSlug, title, category: post.category });
    }
  }, [post, contentLanguage, addToHistory]);

  // Fetch related posts
  const { data: relatedPosts } = useQuery({
    queryKey: ['related-posts', post?.id, post?.category],
    queryFn: () => getRelatedPosts(post!.id, post!.category, contentLanguage),
    enabled: !!post,
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

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          {t('Não foi possível carregar o artigo.', 'Could not load the article.')}
        </h1>
        <button onClick={() => refetch()} className="cyber-button inline-flex items-center gap-2">
          {t('Tentar novamente', 'Try again')}
        </button>
      </div>
    );
  }

  if (!post) {
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

  const title = contentLanguage === 'pt' ? post.title_pt : post.title_en;
  const content = contentLanguage === 'pt' ? post.content_pt : post.content_en;
  const summary = contentLanguage === 'pt' ? post.summary_pt : post.summary_en;

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
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const currentSlug = contentLanguage === 'pt' ? post.slug_pt : post.slug_en;
  const postUrl = `https://blog.leoschlanger.com/post/${currentSlug}`;

  return (
    <>
      <ReadingProgress />

      <SEO
        title={title}
        description={summary}
        image={getPostImage(post.image_url, post.category, post.id)}
        url={`/post/${currentSlug}`}
        type="article"
        publishedAt={post.published_at || post.created_at}
        modifiedAt={post.created_at}
        category={categoryLabel}
        tags={post.tags}
        contentLanguage={contentLanguage}
        alternates={{ pt: `/post/${post.slug_pt}`, en: `/post/${post.slug_en}` }}
      />

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

              {/* Category Badge */}
              <Link
                to={`/category/${post.category}`}
                className="inline-block px-3 py-1 text-sm font-medium bg-cyber-green/10 text-cyber-green rounded mb-4 hover:bg-cyber-green/20 transition-colors"
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
              <div className="flex flex-wrap items-center gap-4 text-gray-500">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {formatDate(post.published_at || post.created_at, contentLanguage === 'pt' ? 'pt-BR' : 'en-US')}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {readingTime} {t(translations.readingTime.pt, translations.readingTime.en)}
                </span>
                <button
                  onClick={sharePost}
                  className="flex items-center gap-2 hover:text-cyber-green transition-colors"
                >
                  {showCopied ? (
                    <Check className="h-5 w-5 text-cyber-green" />
                  ) : (
                    <Share2 className="h-5 w-5" />
                  )}
                  {showCopied
                    ? t('Link copiado!', 'Link copied!')
                    : t('Compartilhar', 'Share')}
                </button>
                <BookmarkButton postId={post.id} />
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="container mx-auto px-4 -mt-8 relative z-20">
          <div className="max-w-4xl mx-auto">
            <PostImage
              src={getPostImage(post.image_url, post.category, post.id)}
              alt={title}
              category={post.category}
              postId={post.id}
              className="w-full h-64 md:h-96 object-cover rounded-lg border border-cyber-green/20"
            />
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Table of Contents */}
            <TableOfContents content={content} />

            {/* Article Content */}
            <div className="prose-cyber" lang={contentLanguage === 'pt' ? 'pt-BR' : 'en'}>
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children, node: _node, ...props }) => (
                    <h2 id={slugify(nodeText(children))} {...props}>{children}</h2>
                  ),
                  h3: ({ children, node: _node, ...props }) => (
                    <h3 id={slugify(nodeText(children))} {...props}>{children}</h3>
                  ),
                  a: ({ href, children, node: _node, ...props }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
                  ),
                }}
              >
                {content}
              </Markdown>
            </div>

            {/* Tags - Clickable */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-cyber-green/20">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 text-sm bg-cyber-dark border border-cyber-green/20 rounded text-gray-400 hover:text-cyber-green hover:border-cyber-green/40 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Sentiment Vote + Social Share */}
            <div className="mt-8 pt-6 border-t border-cyber-green/10 space-y-4">
              <SentimentVote postId={post.id} />
              <SocialShare title={title} url={postUrl} />
            </div>

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

            {/* Donation CTA */}
            <div className="mt-12 p-6 bg-cyber-dark rounded-xl border border-cyber-green/20 text-center">
              <Heart className="w-8 h-8 text-cyber-green mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {t('Gostou do conteúdo?', 'Enjoyed the content?')}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {t(
                  'Ajude a manter o projeto ativo com uma doação.',
                  'Help keep the project active with a donation.'
                )}
              </p>
              <a
                href="https://www.paypal.com/donate/?hosted_button_id=UAB9LYC87EVBC"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-button inline-flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                {t('Fazer uma doação', 'Make a donation')}
              </a>
            </div>

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <RelatedPosts posts={relatedPosts} />
            )}

            {/* Comments */}
            <GiscusComments term={`post-${post.id}`} />
          </div>
        </div>
      </article>
    </>
  );
}
