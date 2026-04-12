import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const BASE_URL = 'https://blog.leoschlanger.com';
const SITE_NAME = 'Leo.Blog';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generateRss() {
  let items = '';

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);

    if (posts) {
      for (const post of posts) {
        const pubDate = new Date(post.published_at || post.created_at).toUTCString();
        items += `
    <item>
      <title>${escapeXml(post.title_en)}</title>
      <link>${BASE_URL}/post/${post.slug_en}</link>
      <guid isPermaLink="true">${BASE_URL}/post/${post.slug_en}</guid>
      <description>${escapeXml(post.summary_en)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <source url="${escapeXml(post.source_url)}">${escapeXml(post.source_name)}</source>
    </item>`;
      }
    }
  }

  const buildDate = new Date().toUTCString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} - Crypto &amp; Macro News</title>
    <link>${BASE_URL}</link>
    <description>News and analysis on cryptocurrencies, global economy, central banks and financial markets.</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>https://github.com/leo-schlanger.png</url>
      <title>${SITE_NAME}</title>
      <link>${BASE_URL}</link>
    </image>${items}
  </channel>
</rss>
`;

  writeFileSync(resolve('dist/rss.xml'), rss, 'utf-8');
  console.log(`RSS feed generated with ${items ? 'posts' : 'no posts (no Supabase credentials)'}`);
}

generateRss().catch(console.error);
