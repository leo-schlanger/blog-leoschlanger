import { BASE_URL, LOGO_IMAGE, SITE_NAME } from './site';
import { postDate, type PublishedPost } from './posts';
import { safeHttpUrl } from './html';

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export interface SitemapEntry {
  path: string;
  /** Omitido quando não há data real de modificação. */
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  alternates?: { pt: string; en: string };
}

/** Limite do protocolo é 50.000 URLs por arquivo; mantemos folga. */
export const SITEMAP_CHUNK_SIZE = 45000;

function toDay(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function renderUrl(entry: SitemapEntry): string {
  const lines = [
    '  <url>',
    `    <loc>${escapeXml(BASE_URL + entry.path)}</loc>`,
  ];
  if (entry.lastmod) lines.push(`    <lastmod>${toDay(entry.lastmod)}</lastmod>`);
  if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  if (entry.priority) lines.push(`    <priority>${entry.priority}</priority>`);
  if (entry.alternates) {
    const pt = escapeXml(BASE_URL + entry.alternates.pt);
    const en = escapeXml(BASE_URL + entry.alternates.en);
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="pt-BR" href="${pt}" />`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${en}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${pt}" />`,
    );
  }
  lines.push('  </url>');
  return lines.join('\n');
}

function renderUrlset(entries: SitemapEntry[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries.map(renderUrl),
    '</urlset>',
    '',
  ].join('\n');
}

/**
 * Gera `sitemap.xml`. Acima do limite por arquivo, vira um índice que
 * aponta para `sitemap-1.xml`, `sitemap-2.xml`...
 * Retorna um mapa nome-do-arquivo → conteúdo.
 */
export function buildSitemaps(entries: SitemapEntry[], now: Date = new Date()): Map<string, string> {
  const files = new Map<string, string>();

  if (entries.length <= SITEMAP_CHUNK_SIZE) {
    files.set('sitemap.xml', renderUrlset(entries));
    return files;
  }

  const index: string[] = [];
  for (let i = 0; i * SITEMAP_CHUNK_SIZE < entries.length; i++) {
    const name = `sitemap-${i + 1}.xml`;
    files.set(name, renderUrlset(entries.slice(i * SITEMAP_CHUNK_SIZE, (i + 1) * SITEMAP_CHUNK_SIZE)));
    index.push(`  <sitemap>\n    <loc>${BASE_URL}/${name}</loc>\n    <lastmod>${toDay(now.toISOString())}</lastmod>\n  </sitemap>`);
  }

  files.set('sitemap.xml', [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...index,
    '</sitemapindex>',
    '',
  ].join('\n'));
  return files;
}

export function buildPostSitemapEntries(posts: PublishedPost[]): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const post of posts) {
    const alternates = { pt: `/post/${post.slug_pt}`, en: `/post/${post.slug_en}` };
    const base = { lastmod: postDate(post), changefreq: 'monthly', priority: '0.8', alternates };
    entries.push({ path: alternates.pt, ...base });
    if (post.slug_en !== post.slug_pt) {
      entries.push({ path: alternates.en, ...base });
    }
  }
  return entries;
}

export const RSS_ITEMS = 50;

export function buildRss(posts: PublishedPost[], now: Date = new Date()): string {
  const items = posts.slice(0, RSS_ITEMS).map(post => {
    const link = `${BASE_URL}/post/${post.slug_en}`;
    const source = safeHttpUrl(post.source_url);
    return [
      '    <item>',
      `      <title>${escapeXml(post.title_en)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
      `      <description>${escapeXml(post.summary_en || '')}</description>`,
      `      <pubDate>${new Date(postDate(post)).toUTCString()}</pubDate>`,
      `      <category>${escapeXml(post.category)}</category>`,
      source ? `      <source url="${escapeXml(source)}">${escapeXml(post.source_name || source)}</source>` : '',
      '    </item>',
    ].filter(Boolean).join('\n');
  });

  const lastBuild = posts[0] ? new Date(postDate(posts[0])) : now;

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${SITE_NAME} - Crypto &amp; Macro News</title>`,
    `    <link>${BASE_URL}</link>`,
    '    <description>News and analysis on cryptocurrencies, global economy, central banks and financial markets.</description>',
    '    <language>en</language>',
    `    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
    '    <image>',
    `      <url>${LOGO_IMAGE}</url>`,
    `      <title>${SITE_NAME}</title>`,
    `      <link>${BASE_URL}</link>`,
    '    </image>',
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
