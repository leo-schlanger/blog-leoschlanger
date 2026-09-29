export const BASE_URL = 'https://blog.leoschlanger.com';
export const SITE_NAME = 'Leo.Blog';
export const AUTHOR = 'Leo Schlanger';
export const AUTHOR_URL = 'https://leoschlanger.com';
export const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
export const LOGO_IMAGE = `${BASE_URL}/icon-512.png`;

export interface StaticRoute {
  path: string;
  title: string;
  description: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
  /** Rotas pessoais (sem conteúdo público) não entram no sitemap. */
  noindex?: boolean;
}

/**
 * Páginas fixas da SPA. Cada uma vira um HTML próprio para responder 200
 * (o GitHub Pages devolve 404 para rotas sem arquivo) com meta tags corretas.
 */
export const STATIC_ROUTES: StaticRoute[] = [
  {
    path: '/briefing',
    title: 'Briefing Diário',
    description: 'Resumo diário do mercado: Fear & Greed, Bitcoin, VIX, dólar e as notícias mais recentes.',
    changefreq: 'daily',
    priority: '0.8',
  },
  {
    path: '/tools',
    title: 'Ferramentas de Trading',
    description: 'Gráficos, calendário econômico e termômetro de mercado para acompanhar cripto e macro.',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    path: '/about',
    title: 'Sobre',
    description: 'Sobre o Leo.Blog e Leo Schlanger: notícias de cripto e macroeconomia em português e inglês.',
    changefreq: 'monthly',
    priority: '0.5',
  },
  {
    path: '/privacy',
    title: 'Política de Privacidade',
    description: 'Como o Leo.Blog trata dados pessoais, cookies e serviços de terceiros (LGPD).',
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    path: '/terms',
    title: 'Termos de Uso',
    description: 'Termos de uso do Leo.Blog. O conteúdo é informativo e não constitui recomendação de investimento.',
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    path: '/saved',
    title: 'Salvos',
    description: 'Seus artigos salvos e histórico de leitura.',
    changefreq: 'yearly',
    priority: '0.1',
    noindex: true,
  },
];
