import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { formatDate, getReadingTime } from '@/lib/utils';
import { getPostImage } from '@/lib/defaultImages';
import type { BlogPost } from '@/lib/supabase';

interface HeroPostProps {
  post: BlogPost;
}

export function HeroPost({ post }: HeroPostProps) {
  const { language, t } = useLanguage();

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

  return (
    <article className="group relative overflow-hidden rounded-xl border border-cyber-green/30 bg-cyber-dark">
      <Link to={`/post/${slug}`} className="block">
        <div className="grid lg:grid-cols-2">
          {/* Image */}
          <div className="relative h-64 lg:h-96 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-black/90 via-cyber-black/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-cyber-dark" />

            {/* Mobile overlay content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 lg:hidden">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-cyber-green/20 text-cyber-green rounded mb-3 w-fit backdrop-blur-sm">
                {categoryLabel}
              </span>
              <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                {title}
              </h2>
            </div>
          </div>

          {/* Content - Desktop */}
          <div className="hidden lg:flex flex-col justify-center p-8 lg:p-12">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-cyber-green/10 text-cyber-green rounded mb-4 w-fit">
              {categoryLabel}
            </span>

            <h2 className="text-3xl xl:text-4xl font-bold text-white mb-4 group-hover:text-cyber-green transition-colors line-clamp-3">
              {title}
            </h2>

            <p className="text-gray-400 text-lg mb-6 line-clamp-3">
              {summary}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at || post.created_at, language === 'pt' ? 'pt-BR' : 'en-US')}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readingTime} {t(translations.readingTime.pt, translations.readingTime.en)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-cyber-green font-semibold group-hover:gap-4 transition-all">
              {t(translations.readMore.pt, translations.readMore.en)}
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Mobile content below image */}
        <div className="lg:hidden p-5">
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {summary}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.published_at || post.created_at, language === 'pt' ? 'pt-BR' : 'en-US')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min
              </span>
            </div>
            <span className="text-cyber-green text-sm font-medium flex items-center gap-1">
              {t(translations.readMore.pt, translations.readMore.en)}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-cyber-green/5 blur-2xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </article>
  );
}
