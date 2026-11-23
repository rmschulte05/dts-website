// Repeatable built-site audit for the DTS Astro output.
// Run after `npm run build`: node scripts/audit-dist.mjs
//
// Fails with exit code 1 on broken internal links, heading/title/meta errors,
// canonical or JSON-LD problems, sitemap mismatches and inline scripts.

import { readFile, readdir, stat } from 'node:fs/promises';
import { basename, join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url);
const SITE = 'https://www.dutchtorqueservice.nl';

const failures = [];
const fail = (page, message) => failures.push(`${page}: ${message}`);

const decode = (s) => s
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');

const textLength = (s) => [...decode(s)].length;
const normalize = (s) => decode(s).replace(/\s+/g, ' ').trim();

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

function pagePath(file) {
  const rel = relative(DIST.pathname, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
}

function targetExists(href) {
  const raw = href.split('#')[0].split('?')[0];
  if (!raw.startsWith('/') || raw.startsWith('//')) return true;
  if (raw === '/') return true;
  const clean = raw.replace(/\/+$/, '');
  // Ignore real files (images, PDFs, XML, the manifest, etc.).
  if (/\.[a-z0-9]+$/i.test(clean)) return true;
  const base = clean.replace(/^\//, '');
  return fileExists(join(DIST.pathname, base, 'index.html'))
    || fileExists(join(DIST.pathname, base + '.html'));
}

const fileExists = async (p) => {
  try { return (await stat(p)).isFile(); } catch { return false; }
};

const files = await walk(DIST.pathname);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const sitemapFiles = files.filter((f) => /^sitemap.*\.xml$/.test(basename(f)) && basename(f) !== 'sitemap-index.xml');

let linkCount = 0;
let sitemapCount = 0;
const sitemapUrls = new Set();
for (const file of sitemapFiles) {
  const xml = await readFile(file, 'utf8');
  if (!xml.includes('<urlset')) continue;
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    sitemapUrls.add(m[1].trim());
  }
}
sitemapCount = sitemapUrls.size;

const titles = new Map();
const descriptions = new Map();
const indexable = [];

for (const file of htmlFiles) {
  const path = pagePath(file);
  const is404 = path === '/404.html';
  const html = await readFile(file, 'utf8');
  const robots = html.match(/<meta name="robots" content="([^"]*)"/i)?.[1] ?? 'index, follow';
  const isIndexable = !is404 && !/noindex/i.test(robots);

  // 1. Internal links
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    linkCount += 1;
    if (!(await targetExists(href))) fail(path, `broken internal link ${href}`);
  }

  // 2. Exactly one H1
  const h1s = [...html.matchAll(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi)];
  if (h1s.length !== 1) fail(path, `${h1s.length} <h1> elements`);

  // 3. Title and description length
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
  const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? '';
  if (!title) fail(path, 'missing <title>');
  else if (textLength(title) > 60) fail(path, `title is ${textLength(title)} characters`);
  if (!description) fail(path, 'missing meta description');
  else if (textLength(description) > 160) fail(path, `meta description is ${textLength(description)} characters`);

  // 4. Duplicate titles/descriptions across indexable pages
  if (isIndexable) {
    indexable.push(path);
    const t = normalize(title);
    const d = normalize(description);
    if (titles.has(t)) fail(path, `duplicate title (also ${titles.get(t)})`);
    else titles.set(t, path);
    if (descriptions.has(d)) fail(path, `duplicate meta description (also ${descriptions.get(d)})`);
    else descriptions.set(d, path);
  }

  // 5. Canonical matches the page's own absolute URL (homepage is tolerant)
  if (!is404) {
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] ?? '';
    if (!canonical) fail(path, 'missing canonical');
    else {
      const expected = path === '/' ? `${SITE}/` : `${SITE}${path}`;
      const ok = path === '/'
        ? canonical === SITE || canonical === `${SITE}/`
        : canonical === expected;
      if (!ok) fail(path, `canonical ${canonical} does not match ${expected}`);
    }
  }

  // 6. Every JSON-LD block parses
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(m[1]); } catch (e) { fail(path, `invalid JSON-LD: ${e.message}`); }
  }

  // 9. No executable inline scripts
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    const type = attrs.match(/type="([^"]*)"/i)?.[1]?.toLowerCase() ?? '';
    if (/\bsrc=/.test(attrs)) continue;
    if (type === 'application/ld+json') continue;
    fail(path, 'executable inline <script> without src');
  }
}

// 7. Sitemap count equals the number of indexable HTML pages
if (sitemapCount !== indexable.length) {
  fail('/sitemap', `${sitemapCount} URLs but ${indexable.length} indexable HTML pages`);
}

// 8. Indexable pages present in the sitemap; no non-404 noindex pages
for (const path of indexable) {
  if (!sitemapUrls.has(`${SITE}${path}`)) fail(path, 'indexable page missing from sitemap');
}
for (const file of htmlFiles) {
  const path = pagePath(file);
  if (path === '/404.html') continue;
  const html = await readFile(file, 'utf8');
  const robots = html.match(/<meta name="robots" content="([^"]*)"/i)?.[1] ?? '';
  if (/noindex/i.test(robots)) fail(path, `noindex page other than 404 (${robots})`);
}

console.log(`Pages checked: ${htmlFiles.length}`);
console.log(`Internal links checked: ${linkCount}`);
console.log(`Sitemap URLs: ${sitemapCount}; indexable pages: ${indexable.length}`);
console.log(`Failures: ${failures.length}`);
if (failures.length) {
  for (const f of failures) console.log(` - ${f}`);
  process.exitCode = 1;
} else {
  console.log('Audit passed.');
}
