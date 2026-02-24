import { createClient } from '@supabase/supabase-js';
import { POSTS_PER_PAGE, SEARCH_QUERY_LIMIT } from '@/lib/constants';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock data.');
}

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

export async function getBlogPosts(
  language: 'pt' | 'en' = 'pt',
  limit: number = POSTS_PER_PAGE,
  page: number = 1,
  category?: string
): Promise<PaginatedResult> {
  const offset = (page - 1) * limit;

  if (!supabase) {
    const mockPosts = getMockPosts(language, 50);
    const filtered = category ? mockPosts.filter(p => p.category === category) : mockPosts;
    return {
      posts: filtered.slice(offset, offset + limit),
      total: filtered.length,
      hasMore: offset + limit < filtered.length
    };
  }

  // Query com contagem total
  let query = supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], total: 0, hasMore: false };
  }

  const posts = (data || []).map(post => ({
    ...post,
    tags: parseTags(post.tags)
  }));

  return {
    posts,
    total: count || 0,
    hasMore: offset + limit < (count || 0)
  };
}

function parseTags(tags: string | string[] | null): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string,
  language: 'pt' | 'en' = 'pt'
): Promise<BlogPost | null> {
  if (!supabase) {
    return getMockPosts(language, 10).find(p =>
      p.slug_pt === slug || p.slug_en === slug
    ) || null;
  }

  // Buscar em ambos os campos de slug para suportar troca de idioma
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .or(`slug_pt.eq.${slug},slug_en.eq.${slug}`)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching post:', error);
    return null;
  }

  // Parse tags de JSON string para array
  return data ? { ...data, tags: parseTags(data.tags) } : null;
}

export async function getCategories(): Promise<string[]> {
  if (!supabase) {
    return ['crypto', 'macro_global', 'central_banks', 'commodities'];
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('category')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  const categories = [...new Set(data?.map(d => d.category) || [])];
  return categories;
}

export async function searchPosts(
  query: string,
  language: 'pt' | 'en' = 'pt'
): Promise<BlogPost[]> {
  if (!supabase) {
    return getMockPosts(language, 10).filter(p =>
      p.title_pt.toLowerCase().includes(query.toLowerCase()) ||
      p.title_en.toLowerCase().includes(query.toLowerCase())
    );
  }

  const titleField = language === 'pt' ? 'title_pt' : 'title_en';
  const contentField = language === 'pt' ? 'content_pt' : 'content_en';

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .or(`${titleField}.ilike.%${query}%,${contentField}.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(SEARCH_QUERY_LIMIT);

  if (error) {
    console.error('Error searching posts:', error);
    return [];
  }

  return data || [];
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
