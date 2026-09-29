import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  tags?: string[];
  category?: string;
  noindex?: boolean;
  /** Idioma do conteúdo da página (padrão: idioma da interface). */
  contentLanguage?: 'pt' | 'en';
  /** Caminhos equivalentes em cada idioma (ex.: slugs PT/EN de um post). */
  alternates?: { pt: string; en: string };
}

const SITE_NAME = 'Leo.Blog';
const DEFAULT_IMAGE = 'https://blog.leoschlanger.com/og-image.png';
const LOGO_IMAGE = 'https://blog.leoschlanger.com/icon-512.png';
const BASE_URL = 'https://blog.leoschlanger.com';
const AUTHOR_URL = 'https://leoschlanger.com';

export function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  publishedAt,
  modifiedAt,
  author = 'Leo Schlanger',
  tags = [],
  category,
  noindex = false,
  contentLanguage,
  alternates,
}: SEOProps) {
  const { language: uiLanguage, t } = useLanguage();
  const language = contentLanguage ?? uiLanguage;

  const defaultTitle = t(
    'Noticias Cripto & Macro',
    'Crypto & Macro News'
  );

  const defaultDescription = t(
    'Blog de noticias sobre criptomoedas, economia global, bancos centrais e mercados financeiros.',
    'News blog about cryptocurrencies, global economy, central banks and financial markets.'
  );

  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - ${defaultTitle}`;
  const finalDescription = description || defaultDescription;
  const finalUrl = url ? `${BASE_URL}${url}` : BASE_URL;
  const locale = language === 'pt' ? 'pt_BR' : 'en_US';
  const alternateLocale = language === 'pt' ? 'en_US' : 'pt_BR';
  const hreflangCode = language === 'pt' ? 'pt-BR' : 'en';
  const altPt = `${BASE_URL}${alternates?.pt ?? url ?? ''}`;
  const altEn = `${BASE_URL}${alternates?.en ?? url ?? ''}`;

  // Meta tags
  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const setLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]:not([hreflang])`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        if (hreflang) element.setAttribute('hreflang', hreflang);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Robots
    setMeta('robots', noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // Basic meta
    setMeta('description', finalDescription);
    setMeta('author', author);
    if (tags.length > 0) {
      setMeta('keywords', tags.join(', '));
    }

    // Open Graph
    setMeta('og:type', type, true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', finalDescription, true);
    setMeta('og:image', image, true);
    setMeta('og:image:alt', title || defaultTitle, true);
    setMeta('og:url', finalUrl, true);
    setMeta('og:locale', locale, true);
    setMeta('og:locale:alternate', alternateLocale, true);

    // Twitter/X Card (uses OG tags as fallback for most fields)
    setMeta('twitter:card', 'summary_large_image');

    // Article-specific
    if (type === 'article') {
      if (publishedAt) {
        setMeta('article:published_time', publishedAt, true);
      }
      if (modifiedAt || publishedAt) {
        setMeta('article:modified_time', modifiedAt || publishedAt!, true);
      }
      setMeta('article:author', author, true);
      if (category) {
        setMeta('article:section', category, true);
      }
      document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
      tags.forEach(tag => {
        const element = document.createElement('meta');
        element.setAttribute('property', 'article:tag');
        element.setAttribute('content', tag);
        document.head.appendChild(element);
      });
    }

    // Canonical URL
    setLink('canonical', finalUrl);

    // Hreflang: cada idioma aponta para a sua própria URL
    setLink('alternate', altPt, 'pt-BR');
    setLink('alternate', altEn, 'en');
    setLink('alternate', altPt, 'x-default');

    // Language
    document.documentElement.lang = hreflangCode;

  }, [fullTitle, finalDescription, image, finalUrl, type, publishedAt, modifiedAt, author, tags, category, noindex, locale, alternateLocale, hreflangCode, altPt, altEn, defaultTitle, title]);

  // JSON-LD Structured Data
  useEffect(() => {
    // Remove all existing SEO scripts
    document.querySelectorAll('script[data-seo="true"]').forEach(el => el.remove());

    const scripts: object[] = [];

    if (type === 'article') {
      // NewsArticle schema
      scripts.push({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: title,
        description: finalDescription,
        image: image,
        datePublished: publishedAt,
        dateModified: modifiedAt || publishedAt,
        author: [{
          '@type': 'Person',
          name: author,
          url: AUTHOR_URL,
        }],
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: LOGO_IMAGE,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': finalUrl,
        },
        ...(category && { articleSection: category }),
        ...(tags.length > 0 && { keywords: tags.join(', ') }),
        inLanguage: hreflangCode,
        isAccessibleForFree: true,
      });

      // BreadcrumbList for articles
      scripts.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: title,
            item: finalUrl,
          },
        ],
      });
    } else {
      // WebSite schema for homepage
      scripts.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        description: finalDescription,
        url: BASE_URL,
        inLanguage: ['pt-BR', 'en'],
        publisher: {
          '@type': 'Person',
          name: author,
          url: AUTHOR_URL,
          sameAs: [
            'https://github.com/leo-schlanger',
            'https://linkedin.com/in/leo-schlanger',
          ],
        },
      });
    }

    // Inject all scripts
    scripts.forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'true');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll('script[data-seo="true"]').forEach(el => el.remove());
    };
  }, [title, finalDescription, image, finalUrl, type, publishedAt, modifiedAt, author, tags, category, hreflangCode]);

  return null;
}
