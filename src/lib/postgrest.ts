/**
 * Helpers para montar filtros PostgREST com entrada do usuário.
 *
 * Valores interpolados em `.or()` são interpretados pela gramática do
 * PostgREST: vírgulas, parênteses, aspas e barras quebram o filtro (e
 * permitem injetar condições). Tudo que vem da URL ou do input passa aqui.
 */

/**
 * Só letras minúsculas ASCII, dígitos e hífen: nada que o PostgREST
 * interprete (`,` `.` `(` `)` `"` `:`) nem que forme caminho de arquivo.
 * Hífens repetidos ou nas pontas são aceitos: o pipeline corta slugs
 * longos em 100 caracteres e pode deixar um hífen no final.
 */
const SLUG_PATTERN = /^[a-z0-9-]+$/;

/** Slug seguro para filtros PostgREST e nomes de arquivo. */
export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 300 && SLUG_PATTERN.test(slug);
}

/**
 * Normaliza um termo de busca livre: mantém letras (com acento), números,
 * espaço e pontuação inofensiva; remove curingas de LIKE (% _ *) e
 * caracteres reservados do PostgREST.
 */
export function sanitizeSearchTerm(query: string): string {
  return query
    .replace(/[^\p{L}\p{N}\s.$'-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);
}

/**
 * Monta um valor `ilike` seguro para uso dentro de `.or()`.
 * O termo deve ter passado por `sanitizeSearchTerm`; as aspas duplas
 * protegem espaços e pontos na gramática do PostgREST.
 */
export function ilikeContains(term: string): string {
  return `"%${term}%"`;
}

const TAG_PATTERN = /^[\p{L}\p{N} ._'$-]{1,50}$/u;

/**
 * Padrão `ilike` que encontra uma tag dentro da coluna `tags` (TEXT com
 * JSON gerado por `json.dumps` do Python, ex.: `["fed", "bitcoin"]`).
 *
 * - Reproduz o `ensure_ascii` do Python: não-ASCII vira `\uXXXX`.
 * - Escapa `\`, `%` e `_`, que são especiais em LIKE.
 * - Inclui as aspas para casar a tag inteira, não um trecho de outra.
 *
 * Retorna `null` para tags com caracteres fora do permitido.
 */
export function tagContainsPattern(tag: string): string | null {
  const trimmed = tag.trim();
  if (!TAG_PATTERN.test(trimmed)) return null;

  const pythonJson = JSON.stringify(trimmed).replace(
    /[\u0080-\uffff]/g,
    ch => `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`
  );
  const likeEscaped = pythonJson.replace(/[\\%_]/g, ch => `\\${ch}`);
  return `%${likeEscaped}%`;
}
