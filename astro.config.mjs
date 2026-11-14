import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Content last-changed dates from /workspace/seo/LEDGER.md (not the build clock).
// Privacy is new as of this technical pass (2026-11-13).
const lastmodByPath = {
  '/': '2026-11-03',
  '/blog/': '2026-11-03',
  '/blog/hoe-vaak-momentsleutel-kalibreren/': '2026-11-13',
  '/blog/iso-6789-type-1-type-2-uitgelegd/': '2026-11-13',
  '/blog/mijn-momentsleutel-klopt-niet-meer/': '2026-11-03',
  '/blog/momentsleutel-gevallen-wat-nu/': '2026-11-03',
  '/blog/verschil-kalibreren-justeren-ijken/': '2026-11-13',
  '/contact/': '2026-11-03',
  '/diensten/': '2026-11-03',
  '/diensten/iso-6789-certificering/': '2026-11-13',
  '/diensten/momentsleutel-justeren/': '2026-11-03',
  '/diensten/momentsleutel-kalibratie/': '2026-11-13',
  '/diensten/momentsleutel-reparatie/': '2026-11-03',
  '/faq/': '2026-11-13',
  '/over-ons/': '2026-11-03',
  '/werk/': '2026-11-03',
  '/privacy/': '2026-11-13',
  '/blog/momentsleutel-opsturen-voor-kalibratie/': '2026-11-14',
};

// Internal links in page bodies were written without a trailing slash, which
// costs a 301 hop on Cloudflare Pages. Normalise them in the built HTML so page
// copy (inside 90-day ledger windows) stays untouched.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
function addSlash(path) {
  const m = path.match(/^([^?#]*)([?#].*)?$/);
  let p = m[1]; const rest = m[2] ?? '';
  if (p === '' || p.endsWith('/')) return path;
  const last = p.split('/').pop();
  if (last.includes('.')) return path; // files: /favicon.svg, /_astro/x.css
  return p + '/' + rest;
}
const trailingSlashLinks = {
  name: 'dts-trailing-slash-links',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const root = fileURLToPath(dir);
      async function walk(d) {
        for (const e of await readdir(d, { withFileTypes: true })) {
          const f = join(d, e.name);
          if (e.isDirectory()) await walk(f);
          else if (e.name.endsWith('.html')) {
            const html = await readFile(f, 'utf8');
            const out = html
              .replace(/href=(["'])(\/(?!\/)[^"']*)\1/g, (_, q, u) => `href=${q}${addSlash(u)}${q}`)
              .replace(/"(https:\/\/www\.dutchtorqueservice\.nl\/[^"\s]*)"/g, (_, u) => `"https://www.dutchtorqueservice.nl${addSlash(u.slice('https://www.dutchtorqueservice.nl'.length))}"`);
            if (out !== html) await writeFile(f, out);
          }
        }
      }
      await walk(root);
    },
  },
};

export default defineConfig({
  site: 'https://www.dutchtorqueservice.nl',
  trailingSlash: 'always',
  // Astro 6 native prefetch — nav targets are fetched on hover so
  // subsequent navigations feel instant without blowing the bandwidth budget.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    trailingSlashLinks,
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const lastmod = lastmodByPath[path];
        if (lastmod) item.lastmod = lastmod;
        if (path === '/') item.priority = 1.0;
        else if (path.startsWith('/diensten')) item.priority = 0.9;
        else if (path === '/privacy/') {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
