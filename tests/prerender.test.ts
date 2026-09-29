import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCategoryBody,
  buildPostBody,
  buildPostMeta,
  escapeHtml,
  renderMarkdown,
  renderPage,
  safeHttpUrl,
  safeJsonForScript,
  stripManagedHead,
  truncateText,
} from '../scripts/lib/html';
import { buildPostSitemapEntries, buildRss, buildSitemaps, escapeXml, SITEMAP_CHUNK_SIZE } from '../scripts/lib/feeds';
import { parseTags, type PublishedPost } from '../scripts/lib/posts';

const TEMPLATE = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <!-- SEO Crawling -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#00ff9d" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://blog.leoschlanger.com/" />
    <meta name="description" content="Padrão" />
    <meta property="og:title" content="Padrão" />
    <meta property="og:image:width" content="1200" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
    <title>Leo.Blog - Padrão</title>
    <script type="module" crossorigin src="/assets/index-abc.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

function makePost(overrides: Partial<PublishedPost> = {}): PublishedPost {
  return {
    id: 42,
    title_pt: 'Fed mantém juros <estáveis>',
    title_en: 'Fed holds rates <steady>',
    slug_pt: 'fed-mantem-juros',
    slug_en: 'fed-holds-rates',
    summary_pt: 'Resumo "PT" & mais',
    summary_en: 'Summary EN',
    content_pt: '## Contexto\n\nTexto com **negrito** e <script>alert(1)</script>.',
    content_en: '## Context\n\nText.',
    image_url: 'https://images.unsplash.com/photo-1?w=800',
    source_url: 'https://reuters.com/x',
    source_name: 'Reuters',
    category: 'central_banks',
    tags: ['fed', 'juros'],
    published_at: '2026-09-28T12:00:00Z',
    created_at: '2026-09-28T11:00:00Z',
    ...overrides,
  };
}

test('escapeHtml e escapeXml neutralizam marcação', () => {
  assert.equal(escapeHtml(`<a href="x">'&'</a>`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  assert.equal(escapeXml(`<"&'>`), '&lt;&quot;&amp;&apos;&gt;');
});

test('safeJsonForScript impede fechar a tag script', () => {
  const out = safeJsonForScript({ headline: '</script><script>alert(1)</script>' });
  assert.ok(!out.includes('</script>'));
  assert.deepEqual(JSON.parse(out), { headline: '</script><script>alert(1)</script>' });
});

test('safeHttpUrl aceita só http(s)', () => {
  assert.equal(safeHttpUrl('https://a.com/x'), 'https://a.com/x');
  assert.equal(safeHttpUrl('javascript:alert(1)'), null);
  assert.equal(safeHttpUrl('data:text/html,x'), null);
  assert.equal(safeHttpUrl('não é url'), null);
  assert.equal(safeHttpUrl(null), null);
});

test('truncateText corta com reticências e normaliza espaços', () => {
  assert.equal(truncateText('a  b\n c', 10), 'a b c');
  assert.equal(truncateText('abcdefghij', 5), 'abcd…');
});

test('parseTags aceita JSON em texto, array e lixo', () => {
  assert.deepEqual(parseTags('["fed", "btc"]'), ['fed', 'btc']);
  assert.deepEqual(parseTags(['a', 1, 'b']), ['a', 'b']);
  assert.deepEqual(parseTags('não-json'), []);
  assert.deepEqual(parseTags(null), []);
});

test('renderMarkdown não repassa HTML bruto', () => {
  const html = renderMarkdown('Olá <script>alert(1)</script> **mundo**');
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('<strong>mundo</strong>'));
});

test('stripManagedHead remove só as tags gerenciadas', () => {
  const out = stripManagedHead(TEMPLATE);
  assert.ok(!out.includes('<title>'));
  assert.ok(!out.includes('rel="canonical"'));
  assert.ok(!out.includes('name="description"'));
  assert.ok(!out.includes('og:title'));
  assert.ok(!out.includes('name="robots"'));
  assert.ok(!out.includes('twitter:card'));
  // Preservadas
  assert.ok(out.includes('name="viewport"'));
  assert.ok(out.includes('name="theme-color"'));
  assert.ok(out.includes('rel="icon"'));
  assert.ok(out.includes('application/rss+xml'));
  assert.ok(out.includes('/assets/index-abc.js'));
});

test('página de post: meta tags, hreflang, idioma e corpo', () => {
  const post = makePost();
  const html = renderPage(TEMPLATE, buildPostMeta(post, 'pt'), buildPostBody(post, 'pt'));

  assert.ok(html.includes('<html lang="pt-BR">'));
  assert.equal(html.match(/<title>/g)?.length, 1);
  assert.ok(html.includes('<title>Fed mantém juros &lt;estáveis&gt; | Leo.Blog</title>'));
  assert.equal(html.match(/rel="canonical"/g)?.length, 1);
  assert.ok(html.includes('<link rel="canonical" href="https://blog.leoschlanger.com/post/fed-mantem-juros" />'));
  assert.ok(html.includes('hreflang="en" href="https://blog.leoschlanger.com/post/fed-holds-rates"'));
  assert.ok(html.includes('hreflang="x-default" href="https://blog.leoschlanger.com/post/fed-mantem-juros"'));
  assert.ok(html.includes('<meta property="og:type" content="article" />'));
  assert.ok(html.includes('content="Resumo &quot;PT&quot; &amp; mais"'));
  assert.ok(html.includes('https://images.unsplash.com/photo-1?w=800'));
  assert.equal(html.match(/property="article:tag"/g)?.length, 2);
  assert.equal(html.match(/og:image:width/g), null, 'dimensão do og:image padrão não pode vazar para o post');
  assert.ok(html.includes('"@type":"NewsArticle"'));
  // Corpo
  assert.ok(html.includes('<div id="root"><div class="container'));
  assert.ok(html.includes('<h2>Contexto</h2>'));
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.ok(html.includes('href="https://reuters.com/x"'));
});

test('página de post em inglês usa slug, idioma e locale EN', () => {
  const post = makePost();
  const html = renderPage(TEMPLATE, buildPostMeta(post, 'en'), buildPostBody(post, 'en'));
  assert.ok(html.includes('<html lang="en">'));
  assert.ok(html.includes('<link rel="canonical" href="https://blog.leoschlanger.com/post/fed-holds-rates" />'));
  assert.ok(html.includes('<meta property="og:locale" content="en_US" />'));
  assert.ok(html.includes('Central Banks'));
});

test('fonte com protocolo perigoso não vira link', () => {
  const post = makePost({ source_url: 'javascript:alert(1)' });
  const body = buildPostBody(post, 'pt');
  assert.ok(!body.includes('javascript:'));
});

test('renderPage falha com template inesperado', () => {
  assert.throws(() => renderPage('<html></html>', buildPostMeta(makePost(), 'pt'), ''));
});

test('página de categoria lista links para os posts', () => {
  const body = buildCategoryBody('crypto', [makePost()]);
  assert.ok(body.includes('<h1 class="text-3xl font-bold text-white mb-8">Cripto</h1>'));
  assert.ok(body.includes('href="/post/fed-mantem-juros"'));
});

test('sitemap: entradas PT/EN com alternates e sem duplicar slug igual', () => {
  const entries = buildPostSitemapEntries([
    makePost(),
    makePost({ id: 43, slug_pt: 'mesmo', slug_en: 'mesmo' }),
  ]);
  assert.equal(entries.length, 3);
  const [file] = buildSitemaps(entries).values();
  assert.ok(file.includes('<loc>https://blog.leoschlanger.com/post/fed-holds-rates</loc>'));
  assert.ok(file.includes('<lastmod>2026-09-28</lastmod>'));
  assert.ok(file.includes('hreflang="pt-BR" href="https://blog.leoschlanger.com/post/fed-mantem-juros"'));
});

test('sitemap acima do limite vira índice + partes', () => {
  const entries = Array.from({ length: SITEMAP_CHUNK_SIZE + 1 }, (_, i) => ({
    path: `/post/p-${i}`,
    lastmod: '2026-09-28T00:00:00Z',
  }));
  const files = buildSitemaps(entries, new Date('2026-09-29T00:00:00Z'));
  assert.deepEqual([...files.keys()].sort(), ['sitemap-1.xml', 'sitemap-2.xml', 'sitemap.xml']);
  assert.ok(files.get('sitemap.xml')!.includes('<sitemapindex'));
  assert.ok(files.get('sitemap.xml')!.includes('https://blog.leoschlanger.com/sitemap-2.xml'));
  assert.equal(files.get('sitemap-2.xml')!.match(/<url>/g)?.length, 1);
});

test('RSS: itens escapados, limite e lastBuildDate do post mais recente', () => {
  const posts = Array.from({ length: 60 }, (_, i) => makePost({ id: i, slug_en: `p-${i}` }));
  const rss = buildRss(posts);
  assert.equal(rss.match(/<item>/g)?.length, 50);
  assert.ok(rss.includes('<title>Fed holds rates &lt;steady&gt;</title>'));
  assert.ok(rss.includes(`<lastBuildDate>${new Date('2026-09-28T12:00:00Z').toUTCString()}</lastBuildDate>`));
});

test('meta tags vêm antes dos scripts e comentários do template somem', () => {
  const html = renderPage(TEMPLATE, buildPostMeta(makePost(), 'pt'), '');
  assert.ok(html.indexOf('<title>') < html.indexOf('<script type="module"'));
  assert.ok(html.indexOf('name="viewport"') < html.indexOf('<title>'));
  assert.ok(!html.includes('<!--'));
});
