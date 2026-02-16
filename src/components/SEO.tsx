import { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  author?: string;
  tags?: string[];
}

const SITE_NAME = 'Leo.Blog';
const DEFAULT_IMAGE = 'https://github.com/leo-schlanger.png';
const BASE_URL = 'https://blog.leoschlanger.com';

export function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  publishedAt,
  author = 'Leo Schlanger',
  tags = []
}: SEOProps) {
  const { language, t } = useLanguage();

  const defaultTitle = t(
    'Notícias Cripto & Macro',
    'Crypto & Macro News'
  );

  const defaultDescription = t(
    'Blog de notícias sobre criptomoedas, economia global, bancos centrais e mercados financeiros.',
    'News blog about cryptocurrencies, global economy, central banks and financial markets.'
  );

  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - ${defaultTitle}`;
  const finalDescription = description || defaultDescription;
  const finalUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tag
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

    // Basic meta tags
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
    setMeta('og:url', finalUrl, true);
    setMeta('og:locale', language === 'pt' ? 'pt_BR' : 'en_US', true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:site', '@leo_schlanger');
    setMeta('twitter:creator', '@leo_schlanger');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', finalDescription);
    setMeta('twitter:image', image);

    // Article specific
    if (type === 'article' && publishedAt) {
      setMeta('article:published_time', publishedAt, true);
      setMeta('article:author', author, true);
      tags.forEach((tag, index) => {
        setMeta(`article:tag:${index}`, tag, true);
      });
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', finalUrl);

    // Language
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';

  }, [fullTitle, finalDescription, image, finalUrl, type, publishedAt, author, tags, language]);

  // JSON-LD Structured Data
  useEffect(() => {
    const existingScript = document.querySelector('script[data-seo="true"]');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = type === 'article' ? {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title,
      description: finalDescription,
      image: image,
      datePublished: publishedAt,
      author: {
        '@type': 'Person',
        name: author,
        url: 'https://leoschlanger.com'
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: DEFAULT_IMAGE
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': finalUrl
      }
    } : {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      description: finalDescription,
      url: BASE_URL,
      author: {
        '@type': 'Person',
        name: author,
        url: 'https://leoschlanger.com'
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [title, finalDescription, image, finalUrl, type, publishedAt, author]);

  return null;
}
