import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostImage } from '../../src/lib/defaultImages';
import { CATEGORY_LABELS } from '../../src/lib/constants';
import { AUTHOR, AUTHOR_URL, BASE_URL, DEFAULT_IMAGE, LOGO_IMAGE, SITE_NAME, type StaticRoute } from './site';
import { postDate, type PublishedPost } from './posts';

export type Lang = 'pt' | 'en';

export interface PageMeta {
  lang: Lang;
  title: string;
  description: string;
  /** Caminho absoluto a partir da raiz (ex.: `/post/slug`). */
  path: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  /** Caminhos equivalentes por idioma, para hreflang. */
  alternates?: { pt: string; en: string };
  article?: {
    publishedTime: string;
    section?: string;
    tags: string[];
  };
  jsonLd?: object[];
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** JSON seguro dentro de <script>: impede fechar a tag com `</script>`. */
export function safeJsonForScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/** Só aceita links http(s); qualquer outra coisa vira `null`. */
export function safeHttpUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null;
  } catch {
    return null;
  }
}

export function truncateText(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + '…';
}

const MANAGED_META = /^(description|keywords|author|robots|googlebot|og:.+|twitter:.+|article:.+)$/;

/**
 * Remove do template as tags que cada página redefine (título, descrição,
 * canonical, Open Graph...). O restante do <head> (scripts, CSS, ícones,
 * manifest) é preservado.
 */
export function stripManagedHead(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->\s*/g, '')
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+(?:name|property)="([^"]+)"[^>]*>\s*/gi, (tag, key: string) =>
      MANAGED_META.test(key) ? '' : tag
    )
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '');
}

export function buildHead(meta: PageMeta): string {
  const url = `${BASE_URL}${meta.path}`;
  const fullTitle = meta.title.includes(SITE_NAME) ? meta.title : `${meta.title} | ${SITE_NAME}`;
  const image = meta.image ?? DEFAULT_IMAGE;
  const locale = meta.lang === 'pt' ? 'pt_BR' : 'en_US';
  const altLocale = meta.lang === 'pt' ? 'en_US' : 'pt_BR';
  const robots = meta.noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const tags: string[] = [
    `<title>${escapeHtml(fullTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="author" content="${escapeHtml(AUTHOR)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
  ];

  if (meta.alternates) {
    const pt = escapeHtml(`${BASE_URL}${meta.alternates.pt}`);
    const en = escapeHtml(`${BASE_URL}${meta.alternates.en}`);
    tags.push(
      `<link rel="alternate" hreflang="pt-BR" href="${pt}" />`,
      `<link rel="alternate" hreflang="en" href="${en}" />`,
      `<link rel="alternate" hreflang="x-default" href="${pt}" />`,
    );
  }

  tags.push(
    `<meta property="og:type" content="${meta.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(meta.imageAlt ?? meta.title)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:locale" content="${locale}" />`,
    `<meta property="og:locale:alternate" content="${altLocale}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  );

  if (meta.article) {
    tags.push(`<meta property="article:published_time" content="${escapeHtml(meta.article.publishedTime)}" />`);
    tags.push(`<meta property="article:author" content="${escapeHtml(AUTHOR)}" />`);
    if (meta.article.section) {
      tags.push(`<meta property="article:section" content="${escapeHtml(meta.article.section)}" />`);
    }
    for (const tag of meta.article.tags) {
      tags.push(`<meta property="article:tag" content="${escapeHtml(tag)}" />`);
    }
  }

  // data-seo="true": o componente SEO substitui estes blocos na navegação
  for (const data of meta.jsonLd ?? []) {
    tags.push(`<script type="application/ld+json" data-seo="true">${safeJsonForScript(data)}</script>`);
  }

  return tags.map(tag => `    ${tag}`).join('\n');
}

/** Aplica meta tags e corpo pré-renderizado ao index.html gerado pelo Vite. */
export function renderPage(template: string, meta: PageMeta, bodyHtml: string): string {
  if (!template.includes('<div id="root"></div>') || !template.includes('</head>')) {
    throw new Error('Template inesperado: faltam </head> ou <div id="root"></div>');
  }
  const htmlLang = meta.lang === 'pt' ? 'pt-BR' : 'en';

  const stripped = stripManagedHead(template)
    .replace(/<html lang="[^"]*">/, `<html lang="${htmlLang}">`);

  // Meta tags logo após o viewport: alguns scrapers de prévia leem só o
  // início do documento.
  const viewport = stripped.match(/<meta name="viewport"[^>]*>\n?/);
  const withHead = viewport
    ? stripped.replace(viewport[0], `${viewport[0]}${buildHead(meta)}\n`)
    : stripped.replace('</head>', `${buildHead(meta)}\n  </head>`);

  return withHead.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
}

export function renderMarkdown(content: string): string {
  // react-markdown ignora HTML bruto por padrão: o conteúdo não injeta tags
  return renderToStaticMarkup(createElement(Markdown, { remarkPlugins: [remarkGfm] }, content));
}

function categoryLabel(category: string, lang: Lang): string {
  return CATEGORY_LABELS[category]?.[lang] ?? category;
}

function formatDate(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function postFields(post: PublishedPost, lang: Lang) {
  return {
    slug: lang === 'pt' ? post.slug_pt : post.slug_en,
    title: lang === 'pt' ? post.title_pt : post.title_en,
    summary: lang === 'pt' ? post.summary_pt : post.summary_en,
    content: lang === 'pt' ? post.content_pt : post.content_en,
  };
}

export function buildPostMeta(post: PublishedPost, lang: Lang): PageMeta {
  const { slug, title, summary } = postFields(post, lang);
  const path = `/post/${slug}`;
  const image = getPostImage(post.image_url, post.category, post.id);
  const published = postDate(post);
  const section = categoryLabel(post.category, lang);
  const description = truncateText(summary || title, 300);

  return {
    lang,
    title,
    description,
    path,
    image,
    imageAlt: title,
    type: 'article',
    alternates: { pt: `/post/${post.slug_pt}`, en: `/post/${post.slug_en}` },
    article: { publishedTime: published, section, tags: post.tags },
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: truncateText(title, 110),
        description,
        image: [image],
        datePublished: published,
        dateModified: published,
        author: [{ '@type': 'Person', name: AUTHOR, url: AUTHOR_URL }],
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: { '@type': 'ImageObject', url: LOGO_IMAGE },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}${path}` },
        articleSection: section,
        ...(post.tags.length > 0 && { keywords: post.tags.join(', ') }),
        inLanguage: lang === 'pt' ? 'pt-BR' : 'en',
        isAccessibleForFree: true,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: section, item: `${BASE_URL}/category/${post.category}` },
          { '@type': 'ListItem', position: 3, name: title, item: `${BASE_URL}${path}` },
        ],
      },
    ],
  };
}

/**
 * Corpo estático do post. O React substitui este conteúdo ao montar;
 * ele existe para buscadores e prévias que não executam JavaScript.
 */
export function buildPostBody(post: PublishedPost, lang: Lang): string {
  const { title, summary, content } = postFields(post, lang);
  const published = postDate(post);
  const section = categoryLabel(post.category, lang);
  const source = safeHttpUrl(post.source_url);
  const sourceLabel = lang === 'pt' ? 'Fonte' : 'Source';

  return [
    '<div class="container mx-auto px-4 py-12"><article class="max-w-3xl mx-auto">',
    `<nav class="text-sm text-gray-500 mb-6"><a href="/">${SITE_NAME}</a> › <a href="/category/${escapeHtml(post.category)}">${escapeHtml(section)}</a></nav>`,
    `<h1 class="text-3xl md:text-5xl font-bold text-white mb-6">${escapeHtml(title)}</h1>`,
    summary ? `<p class="text-xl text-gray-400 mb-8">${escapeHtml(summary)}</p>` : '',
    `<p class="text-gray-500 mb-8"><time datetime="${escapeHtml(published)}">${escapeHtml(formatDate(published, lang))}</time></p>`,
    `<div class="prose-cyber">${renderMarkdown(content || '')}</div>`,
    source
      ? `<p class="mt-8 text-sm text-gray-500">${sourceLabel}: <a href="${escapeHtml(source)}" rel="noopener noreferrer nofollow">${escapeHtml(post.source_name || source)}</a></p>`
      : '',
    '</article></div>',
  ].join('');
}

export function buildStaticMeta(route: StaticRoute): PageMeta {
  return {
    lang: 'pt',
    title: route.title,
    description: route.description,
    path: route.path,
    noindex: route.noindex,
  };
}

export function buildStaticBody(route: StaticRoute): string {
  return [
    '<div class="container mx-auto px-4 py-12"><div class="max-w-3xl mx-auto">',
    `<h1 class="text-3xl font-bold text-white mb-4">${escapeHtml(route.title)}</h1>`,
    `<p class="text-gray-400">${escapeHtml(route.description)}</p>`,
    '</div></div>',
  ].join('');
}

export function buildCategoryMeta(category: string): PageMeta {
  const label = categoryLabel(category, 'pt');
  return {
    lang: 'pt',
    title: label,
    description: `Notícias e análises sobre ${label} — ${SITE_NAME}`,
    path: `/category/${category}`,
  };
}

/** Lista das notícias mais recentes da categoria, com links rastreáveis. */
export function buildCategoryBody(category: string, posts: PublishedPost[]): string {
  const label = categoryLabel(category, 'pt');
  const items = posts
    .map(post => {
      const { slug, title, summary } = postFields(post, 'pt');
      return `<li class="mb-6"><h2 class="text-xl font-bold text-white"><a href="/post/${escapeHtml(slug)}">${escapeHtml(title)}</a></h2>`
        + (summary ? `<p class="text-gray-400">${escapeHtml(truncateText(summary, 200))}</p>` : '')
        + '</li>';
    })
    .join('');

  return [
    '<div class="container mx-auto px-4 py-8">',
    `<h1 class="text-3xl font-bold text-white mb-8">${escapeHtml(label)}</h1>`,
    `<ul>${items}</ul>`,
    '</div>',
  ].join('');
}
