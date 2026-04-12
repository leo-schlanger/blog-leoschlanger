import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const BASE_URL = 'https://blog.leoschlanger.com';

async function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/tools', changefreq: 'weekly', priority: '0.7' },
    { loc: '/about', changefreq: 'monthly', priority: '0.5' },
    { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
    { loc: '/terms', changefreq: 'yearly', priority: '0.3' },
  ];

  let postUrls = '';

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug_pt, slug_en, published_at, category')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (posts) {
      // Category pages
      const categories = [...new Set(posts.map(p => p.category))];
      for (const cat of categories) {
        postUrls += `
  <url>
    <loc>${BASE_URL}/category/${cat}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`;
      }

      // Individual post pages
      for (const post of posts) {
        const lastmod = post.published_at
          ? new Date(post.published_at).toISOString().split('T')[0]
          : today;

        // PT slug
        postUrls += `
  <url>
    <loc>${BASE_URL}/post/${post.slug_pt}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${BASE_URL}/post/${post.slug_pt}" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/post/${post.slug_en}" />
  </url>`;

        // EN slug (if different)
        if (post.slug_en !== post.slug_pt) {
          postUrls += `
  <url>
    <loc>${BASE_URL}/post/${post.slug_en}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${BASE_URL}/post/${post.slug_pt}" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/post/${post.slug_en}" />
  </url>`;
        }
      }
    }
  }

  const staticUrls = staticPages
    .map(
      p => `
  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${BASE_URL}${p.loc}" />
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${p.loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${p.loc}" />
  </url>`
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${staticUrls}${postUrls}
</urlset>
`;

  writeFileSync(resolve('dist/sitemap.xml'), sitemap, 'utf-8');
  console.log(`Sitemap generated with ${staticPages.length} static pages${postUrls ? ' + dynamic posts' : ''}`);
}

generateSitemap().catch(console.error);
