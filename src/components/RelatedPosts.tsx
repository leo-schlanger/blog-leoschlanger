import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage, translations } from '@/hooks/useLanguage';
import { formatDate } from '@/lib/utils';
import { getPostImage } from '@/lib/defaultImages';
import { PostImage } from '@/components/PostImage';
import type { BlogPost } from '@/lib/supabase';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  const { language, t } = useLanguage();

  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-cyber-green/20">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <ArrowRight className="w-5 h-5 text-cyber-green" />
        {t('Leia também', 'Read also')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map(post => {
          const title = language === 'pt' ? post.title_pt : post.title_en;
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
              key={post.id}
              to={`/post/${slug}`}
              className="cyber-card group flex flex-col"
            >
              <div className="relative h-32 overflow-hidden rounded-t-md">
                <PostImage
                  src={imageUrl}
                  alt={title}
                  category={post.category}
                  postId={post.id}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/60 to-transparent" />
                <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium bg-cyber-black/80 text-cyber-green rounded">
                  {categoryLabel}
                </span>
              </div>
              <div className="p-4 flex-1">
                <h3 className="text-sm font-bold text-white group-hover:text-cyber-green transition-colors line-clamp-2">
                  {title}
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(post.published_at || post.created_at, language === 'pt' ? 'pt-BR' : 'en-US')}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
