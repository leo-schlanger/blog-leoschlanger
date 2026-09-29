import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  base: '/',
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Leo.Blog - Crypto & Macro News',
        short_name: 'Leo.Blog',
        description: 'Notícias e análises sobre criptomoedas, economia global e mercados financeiros.',
        lang: 'pt-BR',
        theme_color: '#00ff9d',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait-primary',
        categories: ['news', 'finance', 'business'],
        start_url: '/',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Só o shell da SPA: as páginas pré-renderizadas (post/, category/)
        // são geradas depois do build e não devem entrar no precache.
        globPatterns: ['**/*.{js,css,svg,ico,woff2}', 'index.html', 'icon-*.png'],
        navigateFallback: '/index.html',
        // Feeds e sitemap precisam vir sempre da rede
        navigateFallbackDenylist: [/\.xml$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'market-data',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 10, // 10 minutes
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
