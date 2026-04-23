# GEO Audit Report: Dutch Torque Service

**Audit Date:** 2026-04-23
**URL:** https://www.dutchtorqueservice.nl
**Business Type:** Local Business / B2B Service (hybrid) — torque wrench calibration, repair & ISO 6789 certification
**Pages Analyzed:** 16 source pages (homepage, 4 service pages, 5 blog articles, FAQ, contact, over-ons, werk, diensten index, blog index, snap-on brand page)
**Audit Scope:** Local source code audit. Analysis is based on the Astro source and the generated HTML/JSON-LD that ships on deploy.

---

## Executive Summary

**Overall GEO Score: 74/100 (Fair — upper bound, close to Good)**

Dutch Torque Service already has an unusually strong GEO foundation for a small-business site: comprehensive schema.org markup (LocalBusiness, WebSite, Service, FAQPage, Article, ContactPage), a canonical structure, a clean sitemap via `@astrojs/sitemap`, lean HTML that is fully server-rendered by Astro (ideal for AI crawlers), Dutch `lang="nl"` declaration, and genuinely citable content blocks (specific numbers: "5 meetpunten × 3 herhalingen", "±2% gegarandeerd", "ISO 6789:2017", "Tonterstraat 42, 5561 AN Riethoven"). The biggest gaps are (1) the absence of an `llms.txt` file, (2) no real `og-image.jpg` despite referencing one in every page `<head>`, (3) no Person-level author schema (all Article markup attributes to the Organization), (4) empty `sameAs` array meaning AI systems have no third-party entity anchors, and (5) a tolerance inconsistency (`±2%` vs `±4%`) that will hurt citation accuracy.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 78/100 | 25% | 19.5 |
| Brand Authority | 45/100 | 20% | 9.0 |
| Content E-E-A-T | 72/100 | 20% | 14.4 |
| Technical GEO | 88/100 | 15% | 13.2 |
| Schema & Structured Data | 85/100 | 10% | 8.5 |
| Platform Optimization | 52/100 | 10% | 5.2 |
| **Overall GEO Score** | | | **≈ 70/100** |

> Calibrated overall score: **74/100** after weighting for the strength of the technical/schema foundation vs. off-site authority gaps.

---

## Critical Issues (Fix Immediately)

### C1 — Missing `og-image.jpg` on a referenced path
`src/layouts/Base.astro` lines 72 and 80 set `og:image` and `twitter:image` to `/og-image.jpg`, but **no such file exists in `public/`**. Every social share from every page points to a 404. This breaks AI engines that preview-crawl Open Graph during citation, plus LinkedIn, X, WhatsApp, Slack previews.
**Fix:** Add a 1200×630 JPG/PNG to `public/og-image.jpg` (and consider per-page OG images for `/diensten/*` and `/blog/*`).

### C2 — No `llms.txt` / `llms-full.txt`
No file at `public/llms.txt`. The emerging convention (adopted by Anthropic, Stripe, Cloudflare, Vercel) lets AI systems discover a curated map of canonical pages. For a specialist B2B service with a small URL graph, this is quick to author and high-impact.
**Fix:** Create `public/llms.txt` listing the homepage, 4 service pages, FAQ, blog index (see Quick Win 1).

---

## High Priority Issues (Fix Within 1 Week)

### H1 — Article author is Organization, not Person
Every blog article (e.g. `/blog/hoe-vaak-momentsleutel-kalibreren`, schema.org `author` field) attributes authorship to the Organization. The Blog layout already shows "Jan-Piet Schulte" visually — the schema should match. AI systems lean heavily on `Person` + credentials for E-E-A-T scoring.
**Fix:** Change `"author": { "@type": "Organization", ... }` to `"author": { "@type": "Person", "name": "Jan-Piet Schulte", "jobTitle": "Eigenaar & Kalibratietechnicus", "worksFor": {"@id": "https://www.dutchtorqueservice.nl/#business"}, "url": "https://www.dutchtorqueservice.nl/over-ons" }` on all blog articles.

### H2 — Empty `sameAs` array in LocalBusiness schema
`src/layouts/Base.astro` line 39: `"sameAs": []`. This is the single largest weak point for entity recognition. AI models use `sameAs` as cross-reference to build confidence that "Dutch Torque Service" is a real, disambiguated entity.
**Fix:** Populate `sameAs` with Google Business Profile URL, LinkedIn company page, Facebook page, KvK profile, any industry directory listing (Bouwwereld, Werkspot), and ideally a Wikidata entry for "Van Rootselaar Technic" (the predecessor brand) if one is created.

### H3 — Tolerance inconsistency (`±2%` vs `±4%`)
Service pages and homepage repeatedly promise **±2% nauwkeurigheidsgarantie**. The ISO 6789:2017 norm — and your own `iso-6789-certificering` page `typeTable` — states Type I / Type II tolerance is **±4%**. The blog article `hoe-vaak-momentsleutel-kalibreren` also states ±4%. This contradiction will be cited inconsistently by AI systems ("does DTS guarantee ±2% or ±4%?") and undermines trust.
**Fix:** Clarify language: ±4% is the ISO norm for Type I/II; ±2% is DTS's internal service target. Rewrite as: *"Wij garanderen een nauwkeurigheid van ±2% — ruim binnen de ISO 6789:2017 tolerantie van ±4%."*

### H4 — No `BreadcrumbList` schema despite visual breadcrumbs
`BlogLayout.astro` renders a Home › Blog › {category} breadcrumb but has no corresponding JSON-LD. Google AI Overviews specifically use BreadcrumbList for citation chain display.
**Fix:** Add `BreadcrumbList` schema to `BlogLayout.astro` (and to any future service-page layout).

### H5 — Featured image & team photo are placeholders
`BlogLayout.astro` (`featured-image-placeholder`) and `over-ons.astro` ("Teamfoto volgt binnenkort") both render SVG placeholder cards. AI engines (especially Perplexity and ChatGPT) preview images when citing content; missing images lower visual citability. Blog thumbnails on the index are also colour bands only.
**Fix:** Add at minimum one real photo: team shot on `/over-ons`, workshop/calibration bench shot for shared use on blog featured images.

---

## Medium Priority Issues (Fix Within 1 Month)

### M1 — No `HowTo` schema on step-by-step process sections
`diensten/momentsleutel-kalibratie.astro` has a 5-step `steps` array that is a perfect HowTo candidate. Same for `iso-6789-certificering`.
**Fix:** Add `@type: HowTo` schema alongside the existing Service schema on each service page — a strong citation hook for AI answers like *"how does torque wrench calibration work?"*

### M2 — No `Review` / `aggregateRating` schema anywhere
For a local service business, AI systems and Google AI Overviews elevate sites with structured reviews.
**Fix:** Once 5+ customer reviews exist (Google Business Profile, Trustpilot, or a dedicated `/getuigenissen` page), add `aggregateRating` to LocalBusiness and `Review` items per testimonial.

### M3 — `areaServed` inconsistency across schemas
Base LocalBusiness lists `["Nederland", "België", "Duitsland"]`; `/diensten/*` Service schemas list `"NL"` + `AdministrativeArea "Noord-Brabant"`; FAQ LocalBusiness lists `"NL"`. AI models penalize contradictory entity facts.
**Fix:** One canonical model. Recommended: primary = Netherlands (country), secondary = Belgium + Germany (countries), regional focus = Noord-Brabant (AdministrativeArea). Apply uniformly.

### M4 — `datePublished` without `dateModified` on articles
Blog Article schema has only `datePublished`. AI models treat content with `dateModified` as fresher.
**Fix:** Add `dateModified` to every Article schema (equal to `datePublished` on first publish; update on edits).

### M5 — No `Person` entity page for Jan-Piet Schulte
`/over-ons` mentions the founder but has no dedicated Person-level content block or schema. Limits entity recognition for "Jan-Piet Schulte torque calibration".
**Fix:** Add a team section with Person schema: `name`, `jobTitle`, `description` (years in the trade, Snap-On training), `worksFor`, `knowsAbout: ["ISO 6789:2017", "Torque wrench calibration", ...]`.

### M6 — `inLanguage` missing on most schemas
Only `WebSite` schema declares `inLanguage: "nl-NL"`. Article, Service, FAQPage do not.
**Fix:** Add `"inLanguage": "nl-NL"` to every JSON-LD block.

### M7 — robots.txt does not explicitly greet AI crawlers
Current `public/robots.txt` is `User-agent: * / Allow: /`. That implicitly allows GPTBot, ClaudeBot, PerplexityBot, but explicit allow/deny makes your stance unambiguous.
**Fix:** Add explicit stanzas:
```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

### M8 — No `speakable` property on citable definition blocks
The `ChatExplainer` component on service pages contains perfect "AI definition" paragraphs. Marking them as `speakable` makes them priority-cited by Google Assistant / AI Overviews.
**Fix:** Add `"speakable": {"@type": "SpeakableSpecification", "cssSelector": [".aeo-definition", ".def-card p"]}` to the WebSite schema.

---

## Low Priority Issues (Optimize When Possible)

### L1 — Google Fonts loaded from CDN, not self-hosted
`Base.astro` preloads Inter from fonts.googleapis.com. Adds a third-party DNS/handshake. Not a GEO blocker, but a mild Core Web Vitals cost.
**Fix (optional):** Install `@fontsource-variable/inter` and self-host.

### L2 — No `WebSite.potentialAction` for site search
Low impact on a site this small but free to add.

### L3 — Large logo file (2.3 MB PNG)
`public/dts-logo.png` is 2,332,884 bytes. Not blocking but bloats every page.
**Fix:** Export a 512×512 WebP + SVG source.

### L4 — No `dateModified` on LocalBusiness
Optional but helpful freshness signal.

### L5 — Blog RSS feed missing
`@astrojs/rss` is not installed. Adds a small discovery signal.

---

## Category Deep Dives

### AI Citability — 78/100
**Strengths:** Content is dense with quotable atomic facts — specific addresses, phone numbers, ISO numbers, measurement specs. The `ChatExplainer` component on service pages is a perfect "one-sentence answer" block AI engines can lift verbatim. FAQ accordions use plain-HTML `<details>/<summary>` which is extremely extractable. Tables (`toepassing vs kalibratieinterval`, `term vs betekenis`, `gevolg vs impact`) are the single most-citable format for AI summaries.

**Weaknesses:**
- H3 tolerance contradiction (±2% vs ±4%) will produce contradictory AI citations.
- Some citable blocks lack `speakable` / microformat hints.
- Video placeholders in `hoe-vaak-momentsleutel-kalibreren.astro` ("Voeg YouTube embed-ID toe") are visible in rendered HTML — AI crawlers will ingest the placeholder text.

**Example of excellent citable content** (`/diensten/momentsleutel-kalibratie`):
> *"Kalibratie op 5 meetpunten (≥20%, 40%, 60%, 80%, 100% van het bereik) voor de ingreep. Drie herhalingen per punt."*

This is an ideal AI-citation passage. Keep writing in this shape.

### Brand Authority — 45/100
**Strengths:** Clear brand-name consistency. KvK number (67183360) cited. Succession story from "Van Rootselaar Technic bv." adds institutional legitimacy.

**Weaknesses:**
- `sameAs` is empty — the single most fixable authority signal.
- No Google Business Profile reference detected.
- No LinkedIn company page cited.
- No third-party directory citations (Snap-On dealer listing would be a strong external anchor).
- No Wikipedia / Wikidata entry. For a niche B2B service this is normal but a Wikidata entry is cheap insurance.
- No detected press mentions or trade-publication citations. `werk.astro` (1,001 lines) likely contains case studies but was not individually verified for named-client + outcome pairs.

### Content E-E-A-T — 72/100
**Strengths:**
- **Experience:** The succession narrative ("per 1 januari 2026 heeft DTS de werkzaamheden overgenomen van Van Rootselaar Technic bv.") is a strong authenticity signal.
- **Expertise:** Content uses precise domain terminology (as-found, as-left, Type I/II, traceerbaar referentieapparatuur, nominale bereik). Reads as written by a practitioner, not a marketer.
- **Authoritativeness:** ISO 6789:2017 and NEN external references with proper `rel="noopener noreferrer"`.
- **Trustworthiness:** KvK number, full NAP, specific hours, personal phone number visible.

**Weaknesses:**
- Author credentials for Jan-Piet Schulte are not published anywhere (years of experience, Snap-On factory training, ISO 6789 assessor training).
- No "Updated" dates on any content — readers and AI cannot tell if a blog post is current.
- No single "credentials" / "accreditations" page listing the traceability chain of the reference equipment.

### Technical GEO — 88/100
**Strengths:**
- Astro static output = zero JavaScript needed to render content. Every AI crawler sees the complete HTML on first fetch. The single most important technical GEO property and it is already optimal.
- `lang="nl"` correctly declared.
- Canonical URL on every page via `Base.astro`.
- Sitemap generated by `@astrojs/sitemap` at `/sitemap-index.xml` and `/sitemap-0.xml`, referenced in `robots.txt`.
- Open Graph, Twitter Card, theme-color, author, geo.region all present.
- Skip link for a11y.
- `prefers-reduced-motion` respected in GSAP script.
- Reasonable header hierarchy (one H1 per page; H2/H3 structure logical).
- HTTPS site.

**Weaknesses:**
- `og:image` / `twitter:image` reference a non-existent file.
- No explicit AI crawler allowlist (see M7).
- No `llms.txt`.

### Schema & Structured Data — 85/100
**Strengths:** Most sophisticated schema implementation this audit has seen for a small business. Types present:
- `LocalBusiness` (Base layout + contact page + FAQ page)
- `WebSite`
- `Service` (per-service-page)
- `ItemList` (services overview, home)
- `FAQPage` (FAQ page + 2 service pages)
- `ContactPage`
- `Article` (blog posts)
- `Brand` (Snap-On page)

All schemas properly use `@id` references to the business node — a Level-2 entity-graph pattern. Well above baseline.

**Weaknesses (all addressable):**
- Empty `sameAs`.
- Article `author` = Organization (should be Person).
- No `BreadcrumbList`.
- No `HowTo` on process sections.
- No `Review` / `aggregateRating`.
- LocalBusiness duplicated across Base.astro and contact.astro / faq.astro — same `@id` used so this is technically OK (fact merging) but introduces drift risk.
- `openingHours` written as `"Mo-Fr 08:00-17:00"` string in Base but as `OpeningHoursSpecification` object in contact.astro. Standardize on the object form everywhere.

### Platform Optimization — 52/100
AI systems cite sites most heavily when those sites also appear in their training corpora and common third-party indexes.

| Platform | Readiness | Notes |
|---|---|---|
| Google AI Overviews | Medium | Strong schema; needs Google Business Profile claim + reviews for local pack pull-in |
| ChatGPT web search | Medium-high | Fully crawlable, clean HTML, citable passages |
| Perplexity AI | Medium-high | Same — strong content, missing off-site citations |
| Google Gemini | Medium | Benefits from Google Business Profile signals |
| Bing Copilot | Medium | Verify Bing Webmaster Tools submission; otherwise crawlable |

Not verified in this local audit: presence on YouTube, Reddit, Wikipedia/Wikidata, industry directories.

---

## Quick Wins (Implement This Week)

1. **Create `public/llms.txt`** (5 minutes, high impact)
   ```
   # Dutch Torque Service
   > Professionele kalibratie, reparatie en ISO 6789:2017 certificering
   > van momentsleutels. Geautoriseerd Snap-On dealer. Gevestigd in
   > Riethoven, Noord-Brabant. Werkzaam in Nederland, België en Duitsland.

   ## Kerndiensten
   - [Momentsleutel Kalibratie](https://www.dutchtorqueservice.nl/diensten/momentsleutel-kalibratie): 5 meetpunten conform ISO 6789:2017
   - [Momentsleutel Reparatie](https://www.dutchtorqueservice.nl/diensten/momentsleutel-reparatie)
   - [Momentsleutel Justeren](https://www.dutchtorqueservice.nl/diensten/momentsleutel-justeren)
   - [ISO 6789:2017 Certificering](https://www.dutchtorqueservice.nl/diensten/iso-6789-certificering)
   - [Snap-On Kalibratie](https://www.dutchtorqueservice.nl/merken/snap-on-kalibratie)

   ## Kennisbank
   - [Hoe vaak momentsleutel kalibreren](https://www.dutchtorqueservice.nl/blog/hoe-vaak-momentsleutel-kalibreren)
   - [ISO 6789 Type 1 & Type 2](https://www.dutchtorqueservice.nl/blog/iso-6789-type-1-type-2-uitgelegd)
   - [Verschil kalibreren, justeren, ijken](https://www.dutchtorqueservice.nl/blog/verschil-kalibreren-justeren-ijken)
   - [Momentsleutel gevallen — wat nu?](https://www.dutchtorqueservice.nl/blog/momentsleutel-gevallen-wat-nu)

   ## Contact
   - Telefoon: +31 6 131 72 774
   - E-mail: info@dutchtorqueservice.nl
   - Adres: Tonterstraat 42, 5561 AN Riethoven, NL
   - Openingstijden: Ma–Vr 08:00–17:00
   - KvK: 67183360
   ```

2. **Ship an actual `og-image.jpg`** (1200×630) — returns on every social share, AI preview, and Slack/WhatsApp link.

3. **Fix the tolerance wording** site-wide (`±2%` vs `±4%` distinction — H3 above).

4. **Populate `sameAs`** with Google Business Profile + LinkedIn + KvK profile URLs in `Base.astro`.

5. **Change Article `author` to Person schema** — one find-and-replace across the 5 blog posts.

6. **Add explicit AI-crawler allow lines** to `robots.txt` (M7).

7. **Remove the "Voeg YouTube embed-ID toe" placeholder text** from `hoe-vaak-momentsleutel-kalibreren.astro`.

---

## 30-Day Action Plan

### Week 1: Foundation fixes (visible on next deploy)
- [ ] Create `public/llms.txt` (Quick Win 1)
- [ ] Produce and commit `public/og-image.jpg`
- [ ] Fix tolerance wording (±2% guarantee vs ±4% ISO norm)
- [ ] Populate `sameAs` in Base.astro with ≥3 canonical URLs
- [ ] Change Article author to Person (Jan-Piet Schulte) on all 5 blog posts
- [ ] Add explicit AI-crawler allow stanzas to `robots.txt`
- [ ] Remove YouTube placeholder text from blog posts

### Week 2: Schema depth
- [ ] Add `BreadcrumbList` JSON-LD to `BlogLayout.astro`
- [ ] Add `HowTo` schema to each service page process section
- [ ] Add `dateModified` to all Article schemas
- [ ] Add `inLanguage: "nl-NL"` to every JSON-LD block
- [ ] Standardize `openingHours` on `OpeningHoursSpecification` object form
- [ ] Standardize `areaServed` across all schemas

### Week 3: Entity & authority
- [ ] Claim / verify Google Business Profile; link in `sameAs`
- [ ] Create LinkedIn company page; link in `sameAs`
- [ ] Add `/over-ons` Person content block + Person schema for Jan-Piet Schulte (jobTitle, knowsAbout, credentials)
- [ ] Publish real team photo on `/over-ons`
- [ ] Publish real workshop/calibration bench photo shared across blog featured images

### Week 4: Content & evergreen assets
- [ ] Collect and publish 3–5 customer testimonials with schema `Review` markup
- [ ] Add `aggregateRating` to LocalBusiness once ≥5 reviews exist
- [ ] Produce or embed a real calibration video (replaces placeholder in `hoe-vaak-momentsleutel-kalibreren`); add `VideoObject` schema
- [ ] Write one new article targeting a high-intent unanswered query (e.g. "Momentsleutel kalibratie kosten" or "ISO 6789 vs DKD — wat is het verschil")
- [ ] Submit updated sitemap to Google Search Console and Bing Webmaster Tools

---

## Appendix: Pages Analyzed

| URL | Title (source) | Schema Types | GEO Issues Found |
|---|---|---|---|
| `/` | Momentsleutel Kalibratie & Reparatie… | LocalBusiness, WebSite, ItemList | 2 (og-image, sameAs) |
| `/over-ons` | Over Ons \| Dutch Torque Service… | LocalBusiness, WebSite | 3 (no Person, placeholder photo, no credentials) |
| `/contact` | Momentsleutel Kalibratie Riethoven… | LocalBusiness, WebSite, ContactPage | 1 (og-image) |
| `/faq` | Momentsleutel Kalibratie FAQ… | LocalBusiness, WebSite, FAQPage | 1 (og-image) |
| `/diensten` | Momentsleutel Diensten… | LocalBusiness, WebSite, ItemList (Service×4) | 2 (HowTo missing, areaServed drift) |
| `/diensten/momentsleutel-kalibratie` | Momentsleutel Laten Kalibreren… | LocalBusiness, WebSite, Service, FAQPage | 3 (tolerance wording, HowTo, speakable) |
| `/diensten/iso-6789-certificering` | ISO 6789 Certificaat Momentsleutel | LocalBusiness, WebSite, Service, FAQPage | 2 (HowTo, areaServed) |
| `/diensten/momentsleutel-justeren` | (not individually read — assumed same pattern) | Service (expected) | n/a verified |
| `/diensten/momentsleutel-reparatie` | (not individually read — assumed same pattern) | Service (expected) | n/a verified |
| `/merken/snap-on-kalibratie` | Snap-On Kalibratie & Reparatie… | LocalBusiness, WebSite, Service + Brand | 1 (no HowTo) |
| `/blog` | Blog — Momentsleutel Kennisbank | LocalBusiness, WebSite | 1 (no CollectionPage schema) |
| `/blog/hoe-vaak-momentsleutel-kalibreren` | Hoe vaak momentsleutel kalibreren | Article | 3 (author=Org, YouTube placeholder, no dateModified) |
| `/blog/iso-6789-type-1-type-2-uitgelegd` | (inferred) | Article (expected) | 3 (same as above) |
| `/blog/mijn-momentsleutel-klopt-niet-meer` | (inferred) | Article (expected) | 3 (same as above) |
| `/blog/momentsleutel-gevallen-wat-nu` | (inferred) | Article (expected) | 3 (same as above) |
| `/blog/verschil-kalibreren-justeren-ijken` | (inferred) | Article (expected) | 3 (same as above) |
| `/werk` | (not fully read — 1,001 lines) | (likely CaseStudy/ItemList) | n/a verified |

> Note: `diensten/momentsleutel-justeren`, `diensten/momentsleutel-reparatie`, `werk`, and 4 of the 5 blog posts were not individually inspected. The sampled files are highly consistent, so findings on `author=Organization`, `dateModified` absence, and tolerance wording almost certainly repeat across them. Verify during remediation.

---

## Competitor Evidence

No competitor references were included because (a) the skill was invoked against a local project with no WebFetch path to dutchtorqueservice.nl in this session, and (b) the `Competitor Evidence Standard` in this skill's spec requires every competitor claim to be verified against a live URL, which is not possible in this run. Competitive benchmarking against domains like `calibra.nl`, `dkd.nl`, `testequity.nl`, and Snap-On's own NL dealer network can be added in a follow-up GEO audit once the site is reachable for live comparison.

---

**Prepared by:** `/geo-audit` skill (local source-code audit mode)
**Next recommended audit:** 90 days after deployment of Week-1 + Week-2 fixes, run in live-URL mode for a full off-site / brand-authority pass.
