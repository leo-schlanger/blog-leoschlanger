/**
 * Alguns posts chegam do pipeline com a tradução incompleta (ex.: `slug_en`
 * vazio). Cada campo ausente em um idioma usa o valor do outro, para que
 * links, títulos e páginas nunca fiquem vazios.
 */
const BILINGUAL_FIELDS = ['title', 'slug', 'summary', 'content'] as const;

type Bilingual = {
  [K in (typeof BILINGUAL_FIELDS)[number] as `${K}_pt` | `${K}_en`]: string;
};

export function fillMissingTranslations<T extends Bilingual>(post: T): T {
  const filled = { ...post };
  for (const field of BILINGUAL_FIELDS) {
    const pt = `${field}_pt` as const;
    const en = `${field}_en` as const;
    const ptValue = (post[pt] ?? '').trim();
    const enValue = (post[en] ?? '').trim();
    (filled as Bilingual)[pt] = ptValue || enValue;
    (filled as Bilingual)[en] = enValue || ptValue;
  }
  return filled;
}
