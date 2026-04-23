import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.dutchtorqueservice.nl',
  // Astro 6 native prefetch — nav targets are fetched on hover so
  // subsequent navigations feel instant without blowing the bandwidth budget.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      lastmod: new Date(),
      priority: 0.8,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
