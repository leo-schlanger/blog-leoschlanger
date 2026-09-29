import { createClient } from '@supabase/supabase-js';

export interface PublishedPost {
  id: number;
  title_pt: string;
  title_en: string;
  slug_pt: string;
  slug_en: string;
  summary_pt: string;
  summary_en: string;
  content_pt: string;
  content_en: string;
  image_url: string | null;
  source_url: string;
  source_name: string;
  category: string;
  tags: string[];
  published_at: string | null;
  created_at: string;
}

const COLUMNS = [
  'id', 'title_pt', 'title_en', 'slug_pt', 'slug_en', 'summary_pt', 'summary_en',
  'content_pt', 'content_en', 'image_url', 'source_url', 'source_name',
  'category', 'tags', 'published_at', 'created_at',
].join(',');

/**
 * O PostgREST do Supabase limita cada resposta (max-rows, padrão 1000).
 * O loop avança pelo número de linhas recebidas e só para numa página
 * vazia, então funciona mesmo se o limite do servidor for menor.
 */
const PAGE_SIZE = 1000;

export function parseTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags.filter((t): t is string => typeof t === 'string');
  if (typeof tags !== 'string' || !tags) return [];
  try {
    const parsed: unknown = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === 'string') : [];
  } catch {
    return [];
  }
}

/** Data de referência do post (publicação, ou criação como fallback). */
export function postDate(post: Pick<PublishedPost, 'published_at' | 'created_at'>): string {
  return post.published_at || post.created_at;
}

/**
 * Todos os posts publicados, mais recentes primeiro, paginando até o fim.
 * Retorna `null` quando não há credenciais (build local sem .env).
 */
export async function fetchAllPublishedPosts(): Promise<PublishedPost[] | null> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const posts: PublishedPost[] = [];

  for (let offset = 0; ; ) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(COLUMNS)
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('id', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      throw new Error(`Supabase query failed at offset ${offset}: ${error.message}`);
    }

    const rows = (data ?? []) as unknown as Array<Omit<PublishedPost, 'tags'> & { tags: unknown }>;
    for (const row of rows) {
      posts.push({ ...row, tags: parseTags(row.tags) });
    }
    if (rows.length === 0) break;
    offset += rows.length;
  }

  return posts;
}
