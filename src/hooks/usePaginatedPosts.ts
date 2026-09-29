import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getBlogPosts, type BlogPost, type PostFilters } from '@/lib/supabase';
import { POSTS_PER_PAGE } from '@/lib/constants';

/**
 * Lista paginada ("carregar mais") de posts publicados.
 * Mudar idioma ou filtros troca a queryKey e reinicia na página 1.
 */
export function usePaginatedPosts(
  language: 'pt' | 'en',
  filters: PostFilters,
  enabled = true
) {
  const { category, tag } = filters;

  const query = useInfiniteQuery({
    queryKey: ['posts', language, category ?? null, tag ?? null],
    queryFn: ({ pageParam }) =>
      getBlogPosts(language, POSTS_PER_PAGE, pageParam, { category, tag }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
    enabled,
  });

  const posts = useMemo<BlogPost[]>(() => {
    const seen = new Set<number>();
    const result: BlogPost[] = [];
    for (const page of query.data?.pages ?? []) {
      for (const post of page.posts) {
        if (!seen.has(post.id)) {
          seen.add(post.id);
          result.push(post);
        }
      }
    }
    return result;
  }, [query.data]);

  const total = query.data?.pages[0]?.total ?? 0;

  return { ...query, posts, total };
}
