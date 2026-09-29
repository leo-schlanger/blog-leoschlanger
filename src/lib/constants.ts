/**
 * Constantes centralizadas do blog.
 * Altere aqui para impactar toda a aplicação de forma consistente.
 */

/**
 * Posts por página na Home.
 * O 1º post vira HeroPost, os demais vão para o grid de 2 colunas.
 * Use sempre (POSTS_PER_PAGE - 1) divisível por 2 para não gerar gaps no grid.
 * Exemplos válidos: 3, 5, 7, 9 ...
 */
export const POSTS_PER_PAGE = 7;

/**
 * Categorias exibidas nas abas da Home (ordem de exibição).
 */
export const POST_CATEGORIES = ['crypto', 'macro_global', 'central_banks', 'commodities'] as const;

/**
 * Rótulos das categorias por idioma (usados na UI e na pré-renderização).
 */
export const CATEGORY_LABELS: Record<string, { pt: string; en: string }> = {
  crypto: { pt: 'Cripto', en: 'Crypto' },
  macro_global: { pt: 'Macro Global', en: 'Global Macro' },
  central_banks: { pt: 'Bancos Centrais', en: 'Central Banks' },
  commodities: { pt: 'Commodities', en: 'Commodities' },
};

/**
 * Limite máximo de resultados exibidos na busca (SearchModal).
 */
export const SEARCH_RESULTS_LIMIT = 10;

/**
 * Limite de resultados retornados pelo Supabase na busca full-text.
 * Deve ser >= SEARCH_RESULTS_LIMIT para garantir que sempre
 * haja resultados suficientes para exibição.
 */
export const SEARCH_QUERY_LIMIT = 20;

/**
 * URL do JSON de dados de mercado (thermometer).
 * Consumido exclusivamente via hook useMarketData.
 */
export const MARKET_DATA_URL = 'https://raw.githubusercontent.com/leo-schlanger/market-thermo-cron/main/data/thermometer.json';

/**
 * Intervalo de atualização dos dados de mercado em milissegundos (5 minutos).
 */
export const MARKET_REFRESH_INTERVAL = 5 * 60 * 1000;

/**
 * Rótulo do índice do dólar. O campo `dxy` do thermometer vem da série
 * FRED DTWEXBGS (índice amplo, base jan/2006 = 100), que NÃO é o DXY da ICE
 * (~20 pontos abaixo). Exibir como "DXY" induz leitura errada.
 */
export const USD_INDEX_LABEL = 'USD Broad';

/**
 * Configuração do Giscus (comentários via GitHub Discussions).
 * Enquanto os IDs estiverem vazios o bloco de comentários não é renderizado.
 * Obtenha os valores em https://giscus.app após habilitar Discussions no repo.
 */
export const GISCUS_CONFIG = {
  repo: 'leo-schlanger/blog-leoschlanger',
  repoId: '',
  category: 'Comments',
  categoryId: '',
};
