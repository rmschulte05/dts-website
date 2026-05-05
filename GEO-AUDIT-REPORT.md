# GEO Audit Report: Dutch Torque Service

**Audit Date:** 2026-04-27
**URL Audited (live):** https://dutchtorqueservice.vercel.app
**Canonical Domain:** https://www.dutchtorqueservice.nl (not yet pointed at Vercel deployment)
**Business Type:** Local Business / B2B Service (hybrid) — torque wrench calibration, repair & ISO 6789:2017 certification
**Pages Analyzed:** 17 production routes (homepage, 4 service pages, 1 brand page, 5 blog articles, FAQ, contact, over-ons, werk, diensten index, blog index)
**Audit Mode:** Live URL audit via 5 specialized subagents (AI Visibility, Platform Optimization, Technical, E-E-A-T, Schema)

---

## Executive Summary

**Overall GEO Score: 64/100 (Fair)**

Dutch Torque Service ships an **unusually strong on-page foundation** for a small specialist B2B site: pure SSR (Astro static), full AI-crawler allowlist verified live (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, Applebot-Extended), well-curated `llms.txt`, comprehensive JSON-LD graph (LocalBusiness + WebSite + Person + Service + HowTo + FAQPage + Article + BreadcrumbList + AboutPage/ProfilePage + CollectionPage), and citable atomic content blocks (specific 5-point measurement protocol, ±2% guarantee disambiguated against ±4% ISO norm). Out-structures every verified NL competitor (`lacozaandam.com`, `mgservice.nl`, `zuidwestkeuringen.nl`, `machineskeuren.nl`) on technical depth.

**The single dominant remaining gap is off-site entity authority.** Live verification confirmed zero brand mentions across LinkedIn, Google Business Profile, Wikidata, Wikipedia, YouTube, Reddit, and industry directories. The site is technically excellent for AI ingestion; the brand is not yet a known entity AI models can anchor citations to.

Secondary gaps: duplicate `LocalBusiness` JSON-LD node on `/faq`, `speakable.cssSelector` array referencing classes that mostly don't exist in the rendered DOM, no surfaced "Laatst bijgewerkt" date for readers, no credentials block for Jan-Piet Schulte, missing security headers, oversized 242 KB logo asset.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---:|---:|---:|
| AI Citability | 78/100 | 25% | 19.50 |
| Brand Authority | 8/100 | 20% | 1.60 |
| Content E-E-A-T | 71/100 | 20% | 14.20 |
| Technical GEO | 84/100 | 15% | 12.60 |
| Schema & Structured Data | 87/100 | 10% | 8.70 |
| Platform Optimization | 70/100 | 10% | 7.00 |
| **Overall GEO Score** | | | **63.60 → 64/100** |

Compared to the previous 2026-04-23 source-code audit (74/100), the drop reflects more accurate live verification of off-site entity signals — the previous report estimated Brand Authority at 45 but was conservative; live checks confirmed 0 third-party citations.

---

## Critical Issues (Fix Immediately)

### C1 — Brand has zero entity recognition across all third-party platforms
- Verified absence on: LinkedIn (company page), Google Business Profile, Wikidata, Wikipedia, YouTube, Reddit, kvk.nl beyond the registry stub, Snap-On NL dealer locator (not surfaced in search).
- This is the single largest off-site GEO drag. AI models cannot anchor citations on the brand.
- **Fix (off-site, requires user action):**
  1. Create LinkedIn Company Page → add to `Organization.sameAs` and `llms.txt` Contact section.
  2. Claim/verify Google Business Profile at Tonterstraat 42, 5561 AN Riethoven → add `https://www.google.com/maps/place/?cid=…` to `sameAs` and add `hasMap` to `LocalBusiness` schema.
  3. Create Wikidata item (Q-item) — accepts SMEs with sourcing (KvK + ISO 6789 service description suffices); add to `sameAs`.
  4. Optional but high-leverage: 2–3 short YouTube clips of an actual ISO 6789 calibration run on the Snap-On rig (transcript-rich, embeddable on blog).

### C2 — Production domain `www.dutchtorqueservice.nl` is not yet pointed at the Vercel deployment
- Every `<link rel="canonical">`, `og:url`, sitemap entry, and JSON-LD `@id` references the production hostname; the actual deployed origin is `dutchtorqueservice.vercel.app`.
- Bing Copilot can't index reliably, AI crawlers de-duping by canonical may discard the Vercel content as a non-canonical preview, IndexNow can't ping.
- **Fix (off-site, requires user action):** in Vercel project settings add `www.dutchtorqueservice.nl` as a custom domain, update DNS at the registrar, then drop the IndexNow key file in `public/` and add `<meta name="msvalidate.01" content="…">` to `Base.astro`.

---

## High Priority Issues (Fix Within 1 Week)

### H1 — Duplicate `LocalBusiness` `@id` node on `/faq`
- `/faq` ships TWO LocalBusiness JSON-LD blocks both keyed `@id: https://www.dutchtorqueservice.nl/#business`. Base.astro already emits one for every page.
- JSON-LD requires `@id` uniqueness within a graph; duplicates can be merged unpredictably or one dropped.
- **Fix (in repo):** delete the inline `localBusinessSchema` and its `<script>` tag in `src/pages/faq.astro` — Base.astro covers it.

### H2 — `speakable.cssSelector` targets classes that do not exist in the DOM
- WebSite schema declares `speakable.cssSelector: [".aeo-definition", ".def-card p", ".sec-sub", ".hero-subtitle"]`.
- After live HTML audit: `.aeo-definition` and `.def-card` render zero times sitewide; only `.hero-subtitle` and `.sec-sub` actually render. Speakable currently signals AI assistants to read sections that don't exist on most pages.
- **Fix (in repo):** replace selectors in `Base.astro` with classes that actually render, and add `.article-lead` / `.faq-answer` classes to `BlogLayout.astro` and FAQ accordions.

### H3 — Sitewide missing `inLanguage: "nl-NL"` on most schema nodes
- Top-level `WebPage`/`Article`/`CollectionPage`/`Service`/`HowTo` carry `inLanguage`. `Person`, `ItemList`, `FAQPage`, `BreadcrumbList`, `ContactPage`, `AboutPage` mostly don't.
- AI crawlers use `inLanguage` for language routing.
- **Fix (in repo):** add `"inLanguage": "nl-NL"` to every node that lacks it.

### H4 — No visible "Laatst bijgewerkt" date for blog readers
- `dateModified` is set in JSON-LD but invisible to humans. Trust signal lost.
- **Fix (in repo):** render "Laatst bijgewerkt: {publishDate}" in `BlogLayout.astro` next to the byline.

### H5 — No credentials surfaced on `/over-ons` for Jan-Piet Schulte
- Page tells the succession story but does not list years in trade, Snap-On factory training, or any ISO assessor training.
- Verified competitor `zuidwestkeuringen.nl/momentsleutel-kalibreren/` already names operator Michäel Thoen + Koninklijke Metaalunie membership.
- **Fix (partial in repo, partial off-site):** add a credentials section scaffold + `Person.hasCredential` schema; user fills in actual training/years.

### H6 — Missing security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Live `curl -I` returns only `strict-transport-security`. AI-citable trust signal; some quality-scoring algorithms penalize sites without basic security headers.
- **Fix (in repo):** create `vercel.json` with a `headers` block.

---

## Medium Priority Issues (Fix Within 1 Month)

- **M1** — `sameAs` array contains only 1 URL (KvK). Expand to ≥5 entries once LinkedIn/GBP/Wikidata exist (depends on C1 above).
- **M2** — No `Review`/`aggregateRating` schema. Add once 5+ customer testimonials are collected.
- **M3** — Logo asset `dts-logo-2x.webp` is 242 KB — still ~10× larger than ideal for a logo. Re-export with `astro:assets` `<Image />` at correct dimensions, or convert to SVG.
- **M4** — `Cache-Control: public, max-age=0, must-revalidate` on static HTML. Add `s-maxage=3600, stale-while-revalidate=86400` for edge caching.
- **M5** — No `WebSite.potentialAction` `SearchAction`. Trivial add.
- **M6** — `HowTo` on `/diensten/momentsleutel-reparatie` and `/diensten/momentsleutel-justeren` missing `totalTime` (kalibratie has `PT1H`).
- **M7** — Real workshop / team photo still placeholders on `/over-ons` and `BlogLayout` featured-image slot.
- **M8** — No measurement-points / reference-equipment block on `/diensten/momentsleutel-kalibratie` body copy (the schema has it via HowTo, but body-text repetition increases AI citation odds).

## Low Priority Issues

- **L1** — No font preload for Inter Variable woff2 (FOUT/LCP risk).
- **L2** — Some images missing `width`/`height` (CLS risk, currently low because most visuals are inline SVG).
- **L3** — No RSS feed for the blog.

---

## Category Deep Dives

### AI Citability — 78/100

Atomic citable passages live across the site, particularly:
- `/diensten/momentsleutel-kalibratie`: *"Kalibratie op 5 meetpunten (≥20%, 40%, 60%, 80%, 100% van het bereik) voor de ingreep. Drie herhalingen per punt."* — score 95.
- `/blog/iso-6789-type-1-type-2-uitgelegd`: ships a Type I vs II comparison table — score 88. None of the verified NL competitors publish an equivalent.
- `/blog/verschil-kalibreren-justeren-ijken`: *"Kalibreren is het meten van de afwijking van een instrument ten opzichte van een bekende referentie. Meer niet."* — cleanest definitional sentence in the niche.

### Brand Authority — 8/100

The single most-fixable score. Off-site entity desert (see C1). Once LinkedIn + GBP + Wikidata land, this jumps to ~50–60 mechanically.

### Content E-E-A-T — 71/100

Sub-scores: Experience 17/25, Expertise 21/25, Authoritativeness 14/25, Trustworthiness 19/25. Best-in-niche blog depth and the just-shipped tolerance-honesty wording (±2% DTS guarantee within ±4% ISO norm) are differentiators no NL competitor matches. Held back by absent credentials, no real photos, no testimonials.

### Technical GEO — 84/100

SSR perfect (100). AI allowlist + sitemap chain best-in-class. HSTS at 2-year preload. Deductions: missing security headers (−28), oversized logo, canonical/origin mismatch.

### Schema & Structured Data — 87/100

Production-grade. `@id` graph integrity 100%, `areaServed` and `openingHoursSpecification` consistent everywhere. Three fixable items: duplicate LocalBusiness on `/faq`, broken `speakable` selectors, missing `inLanguage` on several node types.

### Platform Optimization — 70/100

Per-platform: Google AIO 78, ChatGPT 74, Perplexity 70, Bing 52 (canonical/origin mismatch), Apple 76. Bing pulls the average down; once C2 (DNS cutover) lands, Bing rises to ~75 and the aggregate to ~76.

---

## Quick Wins (Implementing Now)

1. Remove duplicate `LocalBusiness` JSON-LD from `/faq` (H1).
2. Rewrite `speakable.cssSelector` to actually-rendered classes; add `.article-lead` + `.faq-answer` classes (H2).
3. Add `inLanguage: "nl-NL"` to every schema node that lacks it (H3).
4. Render "Laatst bijgewerkt" date in `BlogLayout.astro` (H4).
5. Add credentials scaffold + `Person.hasCredential` to `/over-ons` (H5, partial — scaffold ready for user to fill).
6. Add `vercel.json` with security headers (H6) and edge caching (M4).
7. Add `WebSite.potentialAction` `SearchAction` (M5).
8. Add `totalTime` to `/diensten/*` `HowTo` blocks (M6).
9. Disambiguate the remaining bare `±2%` references in `diensten/index.astro` (continuation of the prior tolerance fix).

## 30-Day Action Plan

### Week 1: Code-only quick wins (this run)
- [x] Phase 3 + Phase 4 from prior `/seo-optimize` run
- [x] Duplicate `LocalBusiness` removed from `/faq`
- [x] `speakable.cssSelector` corrected; classes added to DOM
- [x] `inLanguage: "nl-NL"` propagated to all nodes
- [x] Visible "Laatst bijgewerkt" surfaced in blog layout
- [x] Credentials block scaffold on `/over-ons`
- [x] `vercel.json` with security headers + edge caching
- [x] `SearchAction` added to WebSite schema
- [x] `totalTime` added to remaining HowTos
- [x] Tolerance disambiguation completed in diensten/index.astro

### Week 2: Off-site entity work (requires user action)
- [ ] Create LinkedIn Company Page; populate; add to `sameAs`
- [ ] Claim Google Business Profile at Tonterstraat 42, 5561 AN Riethoven; add to `sameAs`; add `hasMap`
- [ ] Create Wikidata item; add to `sameAs`
- [ ] Cut over `www.dutchtorqueservice.nl` DNS to Vercel
- [ ] Submit `sitemap-index.xml` to Google Search Console + Bing Webmaster Tools

### Week 3: Real-content depth
- [ ] Take + publish real workshop photo (test bench, deadweight standards)
- [ ] Take + publish real Jan-Piet headshot for `BlogLayout` featured-image slot
- [ ] Fill in actual credentials in the new `/over-ons` block (years, factory training, prior-employer history)

### Week 4: Reviews + content
- [ ] Collect ≥5 customer testimonials with named companies
- [ ] Add `Review` schema items + `aggregateRating` to `LocalBusiness`
- [ ] Publish 2–3 short YouTube clips of an actual ISO 6789 calibration run
- [ ] Optionally publish 1 new article: "Momentsleutel kalibratie kosten" (high-intent, no current competitor in NL targets it)

---

## Appendix: Pages Analyzed

| URL | Title | Schema Types | Issues |
|---|---|---|---|
| `/` | Momentsleutel Kalibratie ISO 6789:2017 \| Dutch Torque Service | LocalBusiness, WebSite, Person, ItemList | speakable mismatch |
| `/contact` | Momentsleutel Kalibratie Riethoven \| Dutch Torque Service | + ContactPage | inLanguage missing |
| `/over-ons` | Over Ons \| Dutch Torque Service — Riethoven, Noord-Brabant | + AboutPage+ProfilePage | credentials missing |
| `/faq` | Momentsleutel Kalibratie FAQ \| Dutch Torque Service | + FAQPage (10 Q) | DUP LocalBusiness |
| `/werk` | Gecertificeerde Momentsleutel Cases \| Dutch Torque Service | (Base graph only) | (clean) |
| `/diensten` | Momentsleutel Diensten \| Dutch Torque Service | + ItemList(Service×4) | (clean) |
| `/diensten/momentsleutel-kalibratie` | Momentsleutel Laten Kalibreren \| Dutch Torque Service | + Service+HowTo+FAQPage | (clean) |
| `/diensten/momentsleutel-reparatie` | Momentsleutel Reparatie — Alle Merken \| Dutch Torque Service | + Service+HowTo | totalTime missing |
| `/diensten/momentsleutel-justeren` | Momentsleutel Justeren ISO 6789 \| Dutch Torque Service | + Service+HowTo | totalTime missing |
| `/diensten/iso-6789-certificering` | ISO 6789 Certificaat Momentsleutel \| Dutch Torque Service | + Service+FAQPage | (clean) |
| `/merken/snap-on-kalibratie` | Snap-On Kalibratie & Reparatie \| Geautoriseerd Dealer DTS | + Service+Brand | (clean) |
| `/blog/` | Blog \| Dutch Torque Service — Momentsleutel Kennisbank | + CollectionPage+ItemList | (clean) |
| `/blog/iso-6789-type-1-type-2-uitgelegd` | ISO 6789 Type I en Type II … | + Article + BreadcrumbList | dateModified visible? |
| `/blog/verschil-kalibreren-justeren-ijken` | Kalibreren, Justeren of IJken … | + Article + BreadcrumbList + FAQPage | dateModified visible? |
| `/blog/hoe-vaak-momentsleutel-kalibreren` | Hoe vaak moet je een momentsleutel laten kalibreren? | + Article + BreadcrumbList | dateModified visible? |
| `/blog/mijn-momentsleutel-klopt-niet-meer` | Mijn momentsleutel klopt niet meer — wat nu? | + Article + BreadcrumbList | dateModified visible? |
| `/blog/momentsleutel-gevallen-wat-nu` | Momentsleutel Gevallen — Wat Nu? | + Article + BreadcrumbList + FAQPage | dateModified visible? |

---

## Verified Competitor Evidence

| Competitor | URL | Notable Differentiation Against DTS |
|---|---|---|
| Kalibratiebureau Nederland | https://www.kalibratiebureau.nl/ | ISO 17025-accredited; owns the "accredited" entity slot DTS cannot match without a 17025 lab |
| Laco Zaandam | https://lacozaandam.com/nl/diensten/momentsleutels-kalibreren/ | No ISO 6789 reference, no tolerance tables, no FAQ schema (DTS wins on depth) |
| MG Service | https://mgservice.nl/service-en-reparatie-gereedschap/momentsleutel-kalibreren/ | DIN EN ISO 6789:2017 mentioned; "officiële Wera-partner" anchor; no schema, no tables |
| Zuidwest Keuringen | https://zuidwestkeuringen.nl/momentsleutel-kalibreren/ | Named operator Michäel Thoen + Koninklijke Metaalunie membership (DTS lacks comparable credentials surface) |
| CE-ESTER (machineskeuren.nl) | https://www.machineskeuren.nl/kalibreren/momentsleutel/ | "1.000+ bedrijven" social-proof claim; mechanical test bench detail (0.5–4s force) |
| RAD Torque NL (distributor, not direct competitor) | https://www.radialtorque.eu/radtorque/momentsleutels/kalibratie/ | Systems-product depth; not a direct AEO competitor in calibration-as-service |

---

**Prepared by:** `/geo-audit` skill (live URL audit, 5-subagent parallel)
**Next recommended audit:** 60 days after Week 2 off-site entity work + DNS cutover land, to re-score Brand Authority against actual third-day citations.
