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
 * Limite máximo de resultados exibidos na busca (SearchModal).
 */
export const SEARCH_RESULTS_LIMIT = 10;

/**
 * Limite de resultados retornados pelo Supabase na busca full-text.
 * Deve ser >= SEARCH_RESULTS_LIMIT para garantir que sempre
 * haja resultados suficientes para exibição.
 */
export const SEARCH_QUERY_LIMIT = 20;
