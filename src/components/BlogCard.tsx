import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { formatDate, getReadingTime } from '@/lib/utils';
import { getPostImage } from '@/lib/defaultImages';
import { PostImage } from '@/components/PostImage';
import { ImpactBadge } from '@/components/ImpactBadge';
import { SentimentVote } from '@/components/SentimentVote';
import { BookmarkButton } from '@/components/BookmarkButton';
import type { BlogPost } from '@/lib/supabase';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const { language, t } = useLanguage();
  const [showTldr, setShowTldr] = useState(false);

  const title = language === 'pt' ? post.title_pt : post.title_en;
  const summary = language === 'pt' ? post.summary_pt : post.summary_en;
  const content = language === 'pt' ? post.content_pt : post.content_en;
  const slug = language === 'pt' ? post.slug_pt : post.slug_en;

  const readingTime = getReadingTime(content);
  const imageUrl = getPostImage(post.image_url, post.category, post.id);
  const categoryLabel = translations[post.category as keyof typeof translations]
    ? t(
        (translations[post.category as keyof typeof translations] as { pt: string; en: string }).pt,
        (translations[post.category as keyof typeof translations] as { pt: string; en: string }).en
      )
    : post.category;

  if (featured) {
    return (
      <article className="cyber-card group">
        <Link to={`/post/${slug}`} className="block">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-64 md:h-full overflow-hidden rounded-l-md">
              <PostImage
                src={imageUrl}
                alt={title}
                category={post.category}
                postId={post.id}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/80 to-transparent" />
            </div>
            <div className="p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-cyber-green/10 text-cyber-green rounded">
                  {categoryLabel}
                </span>
                <ImpactBadge score={post.priority_score} compact />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-cyber-green transition-colors">
                {title}
              </h2>
              <p className="text-gray-400 mb-6 line-clamp-3">{summary}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.published_at || post.created_at, language === 'pt' ? 'pt-BR' : 'en-US')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readingTime} {t(translations.readingTime.pt, translations.readingTime.en)}
                </span>
              </div>
              <div className="mt-6 flex items-center gap-2 text-cyber-green font-medium group-hover:gap-4 transition-all">
                {t(translations.readMore.pt, translations.readMore.en)}
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="cyber-card group h-full flex flex-col">
      <Link to={`/post/${slug}`} className="block flex-1 flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-t-md">
          <PostImage
            src={imageUrl}
            alt={title}
            category={post.category}
            postId={post.id}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/60 to-transparent" />

          {/* Category + Impact Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2 py-1 text-xs font-medium bg-cyber-black/80 text-cyber-green rounded">
              {categoryLabel}
            </span>
            <ImpactBadge score={post.priority_score} compact />
          </div>

          {/* Bookmark */}
          <div className="absolute top-3 right-3">
            <BookmarkButton postId={post.id} size="sm" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyber-green transition-colors line-clamp-2">
            {title}
          </h3>

          <p className="text-gray-400 text-sm mb-3 line-clamp-2 flex-1">
            {summary}
          </p>

          {/* Meta + Sentiment */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.published_at || post.created_at, language === 'pt' ? 'pt-BR' : 'en-US')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min
              </span>
            </div>
            <SentimentVote postId={post.id} compact />
          </div>
        </div>
      </Link>

      {/* TL;DR Expandable */}
      <div className="px-5 pb-4 pt-0">
        <button
          onClick={() => setShowTldr(!showTldr)}
          className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-cyber-green/60 hover:text-cyber-green border-t border-cyber-green/10 transition-colors"
        >
          TL;DR
          {showTldr ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        {showTldr && (
          <p className="text-gray-400 text-xs mt-2 leading-relaxed">
            {summary}
          </p>
        )}
      </div>
    </article>
  );
}
