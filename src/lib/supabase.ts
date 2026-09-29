import { createClient } from '@supabase/supabase-js';
import { POSTS_PER_PAGE, SEARCH_QUERY_LIMIT } from '@/lib/constants';
import { fillMissingTranslations } from '@/lib/translation';
import { ilikeContains, isValidSlug, sanitizeSearchTerm, searchWords, tagContainsPattern } from '@/lib/postgrest';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Falls back to mock data when credentials are not configured

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface BlogPost {
  id: number;
  news_id: number;
  title_pt: string;
  title_en: string;
  slug_pt: string;
  slug_en: string;
  content_pt: string;
  content_en: string;
  summary_pt: string;
  summary_en: string;
  image_url: string | null;
  source_url: string;
  source_name: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  priority_score: number;
}

export interface PaginatedResult {
  posts: BlogPost[];
  total: number;
  hasMore: boolean;
}

export interface PostFilters {
  category?: string;
  tag?: string;
}

export async function getBlogPosts(
  language: 'pt' | 'en' = 'pt',
  limit: number = POSTS_PER_PAGE,
  page: number = 1,
  filters: PostFilters = {}
): Promise<PaginatedResult> {
  const offset = (page - 1) * limit;
  const { category } = filters;
  const tagPattern = filters.tag ? tagContainsPattern(filters.tag) : null;

  if (filters.tag && !tagPattern) {
    return { posts: [], total: 0, hasMore: false };
  }

  if (!supabase) {
    const mockPosts = getMockPosts(language, 50).filter(p =>
      (!category || p.category === category) &&
      (!filters.tag || p.tags.includes(filters.tag))
    );
    return {
      posts: mockPosts.slice(offset, offset + limit),
      total: mockPosts.length,
      hasMore: offset + limit < mockPosts.length
    };
  }

  let query = supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category', category);
  }
  if (tagPattern) {
    query = query.ilike('tags', tagPattern);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Error fetching posts: ${error.message}`);
  }

  return {
    posts: (data || []).map(normalizePost),
    total: count || 0,
    hasMore: offset + limit < (count || 0)
  };
}

/** Contagem de posts publicados por categoria, em paralelo e sem trazer linhas. */
export async function getCategoryCounts(
  categories: readonly string[]
): Promise<Record<string, number>> {
  if (!supabase) {
    const mockPosts = getMockPosts('pt', 50);
    return Object.fromEntries(
      categories.map(cat => [cat, mockPosts.filter(p => p.category === cat).length])
    );
  }

  const client = supabase;
  const results = await Promise.all(
    categories.map(async cat => {
      const { count, error } = await client
        .from('blog_posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .eq('category', cat);
      if (error) throw new Error(`Error counting ${cat}: ${error.message}`);
      return [cat, count ?? 0] as const;
    })
  );
  return Object.fromEntries(results);
}

function normalizePost(post: BlogPost & { tags: string | string[] | null }): BlogPost {
  return fillMissingTranslations({ ...post, tags: parseTags(post.tags) });
}

function parseTags(tags: string | string[] | null): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === 'string') : [];
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string,
  language: 'pt' | 'en' = 'pt'
): Promise<BlogPost | null> {
  if (!isValidSlug(slug)) return null;

  if (!supabase) {
    return getMockPosts(language, 10).find(p =>
      p.slug_pt === slug || p.slug_en === slug
    ) || null;
  }

  // Buscar em ambos os campos de slug para suportar troca de idioma.
  // isValidSlug garante que o slug não contém sintaxe PostgREST.
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .or(`slug_pt.eq.${slug},slug_en.eq.${slug}`)
    .eq('status', 'published')
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Error fetching post: ${error.message}`);
  }

  return data ? normalizePost(data) : null;
}

export async function searchPosts(
  query: string,
  language: 'pt' | 'en' = 'pt'
): Promise<BlogPost[]> {
  const term = sanitizeSearchTerm(query);
  if (term.length < 2) return [];

  if (!supabase) {
    const words = searchWords(term.toLowerCase());
    return getMockPosts(language, 10).filter(p => {
      const haystack = `${p.title_pt} ${p.title_en}`.toLowerCase();
      return words.length > 0 && words.every(w => haystack.includes(w));
    });
  }

  const titleField = language === 'pt' ? 'title_pt' : 'title_en';
  const contentField = language === 'pt' ? 'content_pt' : 'content_en';
  const words = searchWords(term);
  if (words.length === 0) return [];

  // Cada palavra deve aparecer no título ou no conteúdo; múltiplos
  // filtros `or` são combinados com AND pelo PostgREST.
  let request = supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published');
  for (const word of words) {
    const pattern = ilikeContains(word);
    request = request.or(`${titleField}.ilike.${pattern},${contentField}.ilike.${pattern}`);
  }

  const { data, error } = await request
    .order('published_at', { ascending: false })
    .limit(SEARCH_QUERY_LIMIT);

  if (error) {
    throw new Error(`Error searching posts: ${error.message}`);
  }

  return (data || []).map(normalizePost);
}

/** Posts publicados pelos IDs informados, mais recentes primeiro. */
export async function getPostsByIds(ids: number[]): Promise<BlogPost[]> {
  const validIds = ids.filter(id => Number.isInteger(id) && id > 0);
  if (validIds.length === 0) return [];

  if (!supabase) {
    return getMockPosts('pt', 50).filter(p => validIds.includes(p.id));
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .in('id', validIds)
    .order('published_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching saved posts: ${error.message}`);
  }

  return (data || []).map(normalizePost);
}

export async function getRelatedPosts(
  postId: number,
  category: string,
  language: 'pt' | 'en' = 'pt',
  limit: number = 3
): Promise<BlogPost[]> {
  if (!supabase) {
    return getMockPosts(language, limit + 1).filter(p => p.id !== postId).slice(0, limit);
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .neq('id', postId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Error fetching related posts: ${error.message}`);
  }

  return (data || []).map(normalizePost);
}

function getMockPosts(language: 'pt' | 'en', limit: number): BlogPost[] {
  const mockPosts: BlogPost[] = [
    {
      id: 1,
      news_id: 1,
      title_pt: 'Fed Mantém Taxas de Juros Estáveis em Decisão Aguardada',
      title_en: 'Fed Holds Interest Rates Steady in Awaited Decision',
      slug_pt: 'fed-mantem-taxas-juros-estaveis',
      slug_en: 'fed-holds-interest-rates-steady',
      content_pt: 'O Federal Reserve decidiu manter as taxas de juros estáveis na reunião de política monetária desta semana, em linha com as expectativas do mercado. A decisão reflete a postura cautelosa do banco central americano diante da inflação persistente...',
      content_en: 'The Federal Reserve decided to hold interest rates steady at this week\'s monetary policy meeting, in line with market expectations. The decision reflects the American central bank\'s cautious stance in the face of persistent inflation...',
      summary_pt: 'Federal Reserve mantém taxas inalteradas. Mercados reagem positivamente à decisão.',
      summary_en: 'Federal Reserve keeps rates unchanged. Markets react positively to the decision.',
      image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      source_url: 'https://example.com/fed-news',
      source_name: 'Reuters',
      category: 'central_banks',
      tags: ['fed', 'interest-rates', 'monetary-policy'],
      status: 'published',
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      priority_score: 5.0
    },
    {
      id: 2,
      news_id: 2,
      title_pt: 'Bitcoin Supera $100.000 Após Aprovação de ETF',
      title_en: 'Bitcoin Surpasses $100,000 After ETF Approval',
      slug_pt: 'bitcoin-supera-100000-apos-etf',
      slug_en: 'bitcoin-surpasses-100000-after-etf',
      content_pt: 'O Bitcoin atingiu um novo recorde histórico ao ultrapassar a marca de $100.000, impulsionado pela aprovação de novos ETFs spot nos Estados Unidos. O movimento representa um marco significativo para a adoção institucional...',
      content_en: 'Bitcoin reached a new all-time high by surpassing the $100,000 mark, driven by the approval of new spot ETFs in the United States. The movement represents a significant milestone for institutional adoption...',
      summary_pt: 'Bitcoin atinge recorde histórico com ETFs impulsionando demanda institucional.',
      summary_en: 'Bitcoin reaches all-time high with ETFs driving institutional demand.',
      image_url: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800',
      source_url: 'https://example.com/btc-news',
      source_name: 'CoinDesk',
      category: 'crypto',
      tags: ['bitcoin', 'etf', 'cryptocurrency'],
      status: 'published',
      published_at: new Date(Date.now() - 86400000).toISOString(),
      created_at: new Date(Date.now() - 86400000).toISOString(),
      priority_score: 6.0
    },
    {
      id: 3,
      news_id: 3,
      title_pt: 'BCE Sinaliza Possível Corte de Juros no Próximo Trimestre',
      title_en: 'ECB Signals Possible Rate Cut Next Quarter',
      slug_pt: 'bce-sinaliza-corte-juros-proximo-trimestre',
      slug_en: 'ecb-signals-rate-cut-next-quarter',
      content_pt: 'O Banco Central Europeu sinalizou que pode iniciar um ciclo de corte de juros no próximo trimestre, caso a inflação continue sua trajetória descendente. A presidente Christine Lagarde destacou que os dados recentes são encorajadores...',
      content_en: 'The European Central Bank signaled it may begin a rate-cutting cycle next quarter if inflation continues its downward trajectory. President Christine Lagarde highlighted that recent data is encouraging...',
      summary_pt: 'BCE indica possível flexibilização monetária com inflação em queda.',
      summary_en: 'ECB indicates possible monetary easing with falling inflation.',
      image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
      source_url: 'https://example.com/ecb-news',
      source_name: 'Bloomberg',
      category: 'central_banks',
      tags: ['ecb', 'europe', 'interest-rates'],
      status: 'published',
      published_at: new Date(Date.now() - 172800000).toISOString(),
      created_at: new Date(Date.now() - 172800000).toISOString(),
      priority_score: 4.5
    }
  ];

  return mockPosts.slice(0, limit);
}
