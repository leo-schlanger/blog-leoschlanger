/**
 * Pós-build: gera HTML estático por rota, sitemap e RSS a partir do Supabase.
 *
 * Por que: o GitHub Pages responde 404 para qualquer rota da SPA sem arquivo
 * correspondente, e crawlers de prévia (WhatsApp, LinkedIn, Telegram) não
 * executam JavaScript. Com um .html por rota (`/post/x` → `post/x.html`),
 * cada página responde 200 com título, descrição, Open Graph e conteúdo.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { isValidSlug } from '../src/lib/postgrest';
import { fetchAllPublishedPosts, postDate, type PublishedPost } from './lib/posts';
import { STATIC_ROUTES } from './lib/site';
import {
  buildCategoryBody,
  buildCategoryMeta,
  buildPostBody,
  buildPostMeta,
  buildStaticBody,
  buildStaticMeta,
  renderPage,
  type Lang,
} from './lib/html';
import { buildPostSitemapEntries, buildRss, buildSitemaps, type SitemapEntry } from './lib/feeds';

const DIST = resolve('dist');
const CATEGORY_PATTERN = /^[a-z0-9_]+$/;
const CATEGORY_PAGE_POSTS = 50;

function write(relativePath: string, content: string): void {
  const target = join(DIST, relativePath);
  // Defesa extra: nada fora de dist/
  if (!target.startsWith(DIST)) throw new Error(`Caminho fora de dist: ${relativePath}`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content, 'utf-8');
}

async function main(): Promise<void> {
  const template = readFileSync(join(DIST, 'index.html'), 'utf-8');
  const now = new Date();
  const today = now.toISOString();

  const fetched = await fetchAllPublishedPosts();
  if (fetched === null) {
    if (process.env.CI) {
      throw new Error('VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY ausentes no CI: abortando para não publicar sitemap vazio.');
    }
    console.warn('⚠ Sem credenciais do Supabase: gerando apenas páginas estáticas.');
  }

  // Slugs inválidos viram nomes de arquivo: descartados com aviso
  const posts: PublishedPost[] = [];
  const skipped: PublishedPost[] = [];
  for (const post of fetched ?? []) {
    if (isValidSlug(post.slug_pt) && isValidSlug(post.slug_en) && CATEGORY_PATTERN.test(post.category)) {
      posts.push(post);
    } else {
      skipped.push(post);
    }
  }
  if (skipped.length > 0) {
    console.warn(`⚠ ${skipped.length} post(s) ignorado(s) por slug/categoria inválidos. Exemplos:`);
    for (const post of skipped.slice(0, 15)) {
      console.warn('  ' + JSON.stringify({ id: post.id, slug_pt: post.slug_pt, slug_en: post.slug_en, category: post.category }));
    }
  }

  // Páginas fixas
  for (const route of STATIC_ROUTES) {
    write(`${route.path.slice(1)}.html`, renderPage(template, buildStaticMeta(route), buildStaticBody(route)));
  }

  // Posts: um arquivo por slug/idioma. Slugs repetidos entre posts: vale o mais recente.
  const written = new Set<string>();
  for (const post of posts) {
    const variants: Array<[Lang, string]> = [['pt', post.slug_pt], ['en', post.slug_en]];
    for (const [lang, slug] of variants) {
      if (written.has(slug)) continue;
      written.add(slug);
      write(`post/${slug}.html`, renderPage(template, buildPostMeta(post, lang), buildPostBody(post, lang)));
    }
  }

  // Categorias
  const byCategory = new Map<string, PublishedPost[]>();
  for (const post of posts) {
    const list = byCategory.get(post.category) ?? [];
    list.push(post);
    byCategory.set(post.category, list);
  }
  for (const [category, list] of byCategory) {
    write(
      `category/${category}.html`,
      renderPage(template, buildCategoryMeta(category), buildCategoryBody(category, list.slice(0, CATEGORY_PAGE_POSTS)))
    );
  }

  // Sitemap
  const latest = posts[0] ? postDate(posts[0]) : today;
  const entries: SitemapEntry[] = [
    { path: '/', lastmod: latest, changefreq: 'hourly', priority: '1.0' },
    ...STATIC_ROUTES.filter(r => !r.noindex).map(r => ({
      path: r.path,
      lastmod: r.changefreq === 'daily' ? today : undefined,
      changefreq: r.changefreq,
      priority: r.priority,
    })),
    ...[...byCategory].map(([category, list]) => ({
      path: `/category/${category}`,
      lastmod: postDate(list[0]),
      changefreq: 'hourly',
      priority: '0.6',
    })),
    ...buildPostSitemapEntries(posts),
  ];
  for (const [name, content] of buildSitemaps(entries, now)) {
    write(name, content);
  }

  write('rss.xml', buildRss(posts, now));

  console.log(
    `✓ Pré-renderização: ${STATIC_ROUTES.length} páginas fixas, ${written.size} páginas de post, `
    + `${byCategory.size} categorias, ${entries.length} URLs no sitemap.`
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
