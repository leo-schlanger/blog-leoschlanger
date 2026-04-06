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
}

const SITE_NAME = 'Leo.Blog';
const DEFAULT_IMAGE = 'https://github.com/leo-schlanger.png';
const BASE_URL = 'https://blog.leoschlanger.com';
const AUTHOR_URL = 'https://leoschlanger.com';
const TWITTER_HANDLE = '@leo_schlanger';

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
}: SEOProps) {
  const { language, t } = useLanguage();

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
  const alternateHreflang = language === 'pt' ? 'en' : 'pt-BR';

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

    const setLink = (rel: string, href: string, extra?: Record<string, string>) => {
      const selector = extra
        ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
        : `link[rel="${rel}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        if (extra) {
          Object.entries(extra).forEach(([k, v]) => element!.setAttribute(k, v));
        }
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

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:site', TWITTER_HANDLE);
    setMeta('twitter:creator', TWITTER_HANDLE);
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', finalDescription);
    setMeta('twitter:image', image);
    setMeta('twitter:image:alt', title || defaultTitle);

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
      tags.forEach((tag, index) => {
        setMeta(`article:tag:${index}`, tag, true);
      });
    }

    // Canonical URL
    setLink('canonical', finalUrl);

    // Hreflang alternate links
    setLink('alternate', finalUrl, { hreflang: hreflangCode });
    setLink('alternate', finalUrl, { hreflang: alternateHreflang });
    setLink('alternate', finalUrl, { hreflang: 'x-default' });

    // Language
    document.documentElement.lang = hreflangCode;

  }, [fullTitle, finalDescription, image, finalUrl, type, publishedAt, modifiedAt, author, tags, language, category, noindex, locale, alternateLocale, hreflangCode, alternateHreflang, defaultTitle, title]);

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
            url: DEFAULT_IMAGE,
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
            'https://twitter.com/leo_schlanger',
            'https://github.com/leo-schlanger',
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
