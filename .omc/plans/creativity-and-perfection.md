# DTS Website — Creativity & Perfection Plan
_Deliberate-mode consensus plan, v0.2 (Architect + Critic improvements applied)_

## 0. Context

The DTS (Dutch Torque Service) showcase site is Astro 5 + Tailwind v4 + GSAP/ScrollTrigger + Sharp, Dutch-language, with modules composed across 7 page routes. Three independent read-only audits were produced in Phase A:

- **Performance audit** (`performance-optimizer`, in-session): 10 ranked findings, 5 HIGH.
- **WCAG 2.2 audit** (`a11y-architect`, in-session): 44 findings — 8 CRITICAL, 15 HIGH.
- **Structural audit** (`code-explorer`, in-session): decomposition map for 4 mega-files.

**Verified line counts (HEAD, pre-B0):**
- `src/pages/werk.astro` — 1001 lines
- `src/components/modules/NavIsland.astro` — 644 lines
- `src/components/modules/CasesGrid.astro` — 588 lines
- `src/components/modules/WrenchBackground.astro` — 399 lines
- `src/layouts/BlogLayout.astro` — 670 lines
- `src/pages/diensten/momentsleutel-kalibratie.astro` — 586 lines
- `src/pages/diensten/iso-6789.astro` — 566 lines
- `src/pages/diensten/reparatie.astro` — 517 lines
- `src/pages/diensten/justeren.astro` — 445 lines

All `:N–M` line ranges quoted in §4 are relative to the B0 checkpoint commit and must be re-derived if the working tree drifts before an extraction pass runs.

**Existing infrastructure already in repo (NOT to duplicate):**
- `scripts/seo-agents/` — 7 SEO agents + npm scripts (`seo:research`, `seo:write`, `seo:facts`, `seo:eeat`, `seo:humanize`, `seo:optimize`, `seo:aeo`).
- `scripts/copy-agents/` — 5 copy agents + `copy:audit`, `copy:rewrite`, `copy:facts`, `copy:seo`, `copy:apply`, `copy:all`.
- `public/llms.txt` — exists, 3734 bytes of well-formed content. To be UPDATED not recreated.
- `public/robots.txt` — comprehensive, 50+ lines including AI crawlers. Verified before reauth.
- `@fontsource-variable/inter` — already in `package.json:29` dependencies, currently unused. To be IMPORTED not redownloaded.

**Two parallel chats producing deliverables:**
- `ui-ux-pro-max` — creative direction. Deliverable format undefined at plan time (markdown brief or component sketches); AC-11 verification depends on format which must be clarified before Phase C.
- `geo-audit` — SEO + AI citability. Output expected as schema.org diff + llms.txt delta + meta proposals; must reconcile with existing `scripts/seo-agents` outputs.

Uncommitted work exists on `main` (`.omc/project-memory.json` contains absolute user paths; `.omc/state/hud-stdin-cache.json` contains session data). B0 handles these via `.gitignore`, not commit.

## 1. Requirements Summary

Bring the DTS site to a state that is **simultaneously** creative (distinctive visual/motion direction from ui-ux-pro-max), performant (Core Web Vitals "Good" on mobile 4G), accessible (WCAG 2.2 AA, no CRITICAL findings), structurally healthy (no module >400 lines soft / >800 hard), and AI-discoverable (geo-audit remediations applied on top of the existing SEO pipeline). Two parallel chats must not step on each other.

**Out of scope for this plan:** backend changes, CMS migration, new page creation, blog content rewrite, i18n beyond existing Dutch, `src/pages/blog/**` article decomposition (waived under AC-1 documented-rationale clause — articles are long-form content, not composed modules).

## 2. Acceptance Criteria (testable)

| # | Criterion | Verification |
|---|---|---|
| AC-1 | No `src/components/` or `src/pages/` file exceeds 400 lines except `src/pages/blog/**` (long-form content, waived) and `src/layouts/BlogLayout.astro` (waived until blog-template refresh, out of this plan's scope); none exceed 800 | `find src -name "*.astro" -o -name "*.ts" \| xargs wc -l \| awk '$1>400 && $2!~/blog\|BlogLayout/'` returns empty |
| AC-2 | Zero CRITICAL WCAG 2.2 findings remain from the a11y audit's top-10 list | `axe-core` CLI run against `dist/` on routes `/ /werk /contact /diensten /faq`; VoiceOver on Safari macOS walkthrough of NavIsland mobile overlay and CasesGrid modal; screenshot/recording evidence stored in `.omc/verification/phase-F/axe-<route>.json` and `.omc/verification/phase-F/vo-<dialog>.mov` |
| AC-3 | Lighthouse mobile performance ≥ 90, LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms on every audited route; phase fails if any route misses any threshold | `npx lighthouse http://localhost:4321/<route> --preset=mobile --output=json --output-path=.omc/verification/phase-F/lh-<route>.json` on `/`, `/werk`, `/contact`, `/diensten/momentsleutel-kalibratie`, `/faq` |
| AC-4 | Only dynamic images (cases.ts content) use raw `<img>`; logos and hero assets use either `<Image />` from `astro:assets` OR existing responsive `<img srcset width height loading fetchpriority>` pattern | `grep -rEn '<img ' src/ \| grep -v srcset` should return only `werk.astro:218` + any post-Phase-B additions that are explicitly content-driven |
| AC-5 | **Correctness target (not perf):** GSAP `registerPlugin(ScrollTrigger)` called exactly once site-wide, from `src/lib/gsap.ts`; all GSAP-using modules import from that module | `grep -rn "registerPlugin" src/` returns exactly one call site (expected at `src/lib/gsap.ts`) |
| AC-6 | Every GSAP tween/timeline and every CSS `animation-iteration-count: infinite` keyframe gated by `prefers-reduced-motion: reduce` OR `prefersReducedMotion()` helper | `grep -rEn 'gsap\.(to\|from\|fromTo\|timeline)' src/` cross-referenced to `prefersReducedMotion` calls; `grep -rEn 'animation-iteration-count: ?infinite' src/` cross-referenced to `@media (prefers-reduced-motion: reduce)` blocks |
| AC-7 | NavIsland mobile dialog: focus trap, focus moves to close button on open, focus returns to hamburger on close, background `inert` while open | Chrome stable + Safari macOS on 390×844 viewport; keyboard-only walkthrough recorded to `.omc/verification/phase-F/nav-dialog.mov`; VoiceOver confirms dialog announcement and no background content reachable |
| AC-8 | CasesGrid modal: same focus management as AC-7 | Same matrix as AC-7 against homepage modal; recorded to `.omc/verification/phase-F/cases-modal.mov` |
| AC-9 | All informational text ≥ 4.5:1 contrast; all large text (≥24px or ≥18px bold) ≥ 3:1; decorative text exempt | `axe-core` contrast rule pass on each route; any residual warnings listed in `.omc/verification/phase-F/contrast-exemptions.md` with rationale |
| AC-10 | Inter served from `@fontsource-variable/inter` (already installed dependency); no requests to `fonts.gstatic.com` | Chrome DevTools Network tab on `/`: filter `gstatic` → zero requests; WOFF2 served from `/_astro/` or similar Vite-handled path |
| AC-11 | Creative direction from ui-ux-pro-max applied and verified — **gated on `.omc/ui-ux-pro-max-brief.md` existing in repo**; AC is non-evaluable until that file lands | If brief missing at Phase F: explicitly defer AC-11 and flag in acceptance report; do not tick |
| AC-12 | geo-audit remediations layered ON TOP OF existing `scripts/seo-agents/` outputs, not replacing them; schema.org passes Google Rich Results Test; `llms.txt` updated (not recreated); meta descriptions unique per route | `curl -s https://dutchtorqueservice.nl/llms.txt \| head` (post-deploy) OR local `cat public/llms.txt` confirms updates landed; Rich Results Test on LocalBusiness + WebSite schema returns no errors; `grep -rEh 'meta name="description"' dist/ \| sort \| uniq -d` returns empty |
| AC-13 | `npm run build` clean; `npm run dev` (not only `preview`) renders every route with zero console errors and zero failed network requests | Manual preview walk on all 8 routes: `/`, `/werk`, `/diensten`, `/diensten/momentsleutel-kalibratie`, `/diensten/iso-6789`, `/diensten/reparatie`, `/diensten/justeren`, `/over-ons`, `/faq`, `/contact`, `/blog`; DevTools Console panel and Network panel both clean |
| AC-14 | No English-leak aria-labels — enforced via denylist (not allowlist) | `grep -rEn 'aria-label="[^"]*\b(back\|close\|menu\|open\|view\|submit\|navigate\|home\|toggle\|expand\|collapse)\b' src/` returns zero matches |
| AC-15 | Keyboard-only walkthrough of golden paths completes without focus trap or hidden focus, on Chrome stable + Safari macOS, 1440×900 | Recorded session per route; stored in `.omc/verification/phase-F/keyboard-<route>.mov` |
| AC-16 | **New (Architect):** No new `.astro` or `.ts` file imports from deeper than 2 relative levels | `grep -rEn "from ['\\\"]\\.\\./\\.\\./\\.\\./" src/` returns zero |
| AC-17 | **New (Architect):** `npm ci && npm run build` from clean `node_modules` completes without warnings | CI-style fresh-install smoke |
| AC-18 | **New (Architect):** After B3 decomposition, no module has more `<script>` tags than before; werk.astro rendered HTML size does not grow >20% | `grep -c '<script' dist/**/werk/index.html` compared before/after B3; `wc -c dist/werk/index.html` ratio |
| AC-19 | **New (Architect):** schema.org JSON-LD validates against Rich Results Test after Phase E; no duplicate `@id` collisions across routes | `npx schema-dts-gen --validate` OR manual Rich Results Test checked per audited route |
| AC-20 | **New (Architect):** `data-filtered` attribute behavior on `werk.astro` cards still works after extraction to `WerkCasesGrid.astro`; each filter pill click updates count | Manual click-test during B3e verification |
| AC-21 | **New (Architect):** E2E harness explicitly resolved — either `@playwright/test` added as devDependency OR golden paths migrated to `browser-qa` MCP skill (cannot remain ambiguous) | `package.json` inspection or documented browser-qa invocation plan |

## 3. RALPLAN-DR Deliberation

### 3.1 Principles (5)

1. **Refactor before redecorate.** Creative changes on 1000-line files are destructive; shrink first, then style.
2. **Three audits that converge on the same file mean one surgery, not three.** WrenchBackground, NavIsland, CasesGrid appear in perf + a11y + structure reports — each gets one unified pass (including WrenchBackground, which now has its own B3h step).
3. **Read-only parallel, write-serial.** Parallel chats may analyze simultaneously but writes must serialize on shared files (specifically `Base.astro`).
4. **Fix the systemic defect in one place, not every consumer.** Motion guards → `src/lib/motion.ts`. Focus traps → `src/lib/dialogFocus.ts`. Case color map → `src/utils/caseColors.ts`. GSAP plugin registration → `src/lib/gsap.ts`. Four shared primitives, each with ≥2 current call sites. (`<Img />` wrapper removed from primitives — only 1 call site justifies it.)
5. **Preserve the module composition contract.** `src/components/nav/`, `cases/`, `werk/` are sub-component folders, not new modules. `src/components/modules/` remains the composition surface for pages.

### 3.2 Decision Drivers (top 3)

1. **Two parallel chats are editing the same repo.** Drives strict phasing on shared files (primarily `Base.astro`).
2. **Motion-heavy site + a11y audit names motion as #1 risk.** Creative direction will likely add motion. Reduced-motion infrastructure must precede new motion.
3. **File-size edit-cost multiplier.** A focus-trap fix applied across 3 × 180-line files is cheaper than 1 fix in a 593-line file only if the fix is localized to each seam; for shared helpers (same fix in all three), small files are neutral. The real cost is mental navigation time — folding / symbol search helps but does not eliminate it.

### 3.3 Viable Options (honest comparison)

#### Option A — _Refactor-first, design-second, polish-third_ (recommended)

**Approach:** Phase B = decomposition + shared primitives. Phase C = ui-ux-pro-max creative direction on the now-small modules. Phase D = perf + a11y. Phase E = geo-audit layered on existing SEO pipeline. Phase F = verification.

**Pros:** Clean canvas for creative direction; shared primitives amortize fixes; Base.astro writes serialize cleanly.

**Cons:** Slowest time-to-visible-progress; if ui-ux-pro-max reshapes the creative seams, some B3 decomposition work gets redone.

#### Option B — _Primitives-first, deferred decomposition_ (Architect synthesis — viable)

**Approach:** B1 (primitives) + B2 (data extractions) land immediately. Apply ui-ux-pro-max direction on current mega-files using the primitives. Decompose AFTER creative direction is stable (B3 moves to after C2).

**Pros:** Visible progress starts on day 3. Decomposition happens once the real creative seams are known. Primitives still land first so motion-before-motion (Driver 2) holds. Does not violate Driver 1 (no shared-file writes before the other chat lands).

**Cons:** Editing mega-files during Phase C has the cost Driver 3 warns about (~2× edit-time on 600–1000 line files vs. 150-line sub-components). A11y + perf fixes land on mega-files and partially move during decomposition. Merge-conflict risk with ui-ux-pro-max output is highest because both tracks touch the same long files.

**Honest comparison to A:** B is not strictly worse. It trades edit-cost-during-C for lower rework-risk-if-creative-rescopes. Choice depends on confidence that B3 seams will still be valid after C1 triage.

#### Option C — _Parallel tri-track on non-overlapping files_

**Approach:** Three workers simultaneously: decompose (werk, NavIsland); creative (Hero, Footer, Cases visual); geo-audit (schema, meta, llms.txt). Constrain each track to its own file set.

**Pros:** Wall-clock fastest if the file partition holds.

**Cons:** The file partition does not hold. Creative direction almost always wants to touch Hero composition, which lives inside `werk.astro`'s work-related patterns; schema.org changes live in `Base.astro` alongside font loading changes from B4. Coordination overhead of enforcing the partition exceeds the wall-clock savings.

**Rejection rationale:** Option C's file partition is unstable given how the creative and structural concerns actually overlap in this codebase. Not rejected because "parallel is bad" but because the partition is wishful. Option A also uses parallelism on non-overlapping files (Phase E runs in parallel with late Phase D where possible) — the distinction is that Option A sequences the overlap-prone writes serially.

**Final recommendation:** Option A is chosen over B primarily because C1-triage rework risk (creative reshaping seams) can be mitigated by picking the small set of extractions that are structurally invariant regardless of creative direction — and those are the safe-first ones we already prioritized (WerkFeatures, CaseModal, data extractions). This is essentially the Architect's Option B synthesis folded into Option A's sequencing. See Phase B3 where extractions are classified by "creative-invariant" vs "creative-dependent".

## 4. Implementation Steps

### Phase B — Foundation (serialized, before ui-ux-pro-max or geo-audit lands writes)

**B0. Prepare for clean commit.**
- Add `.omc/state/` to `.gitignore` (contains session data with absolute paths).
- Add `.omc/project-memory.json` to `.gitignore` (contains absolute user paths).
- Verify: `git status` shows the two `.omc/` files removed from tracked changes.
- Commit: `git add -A -- ':!.omc' && git commit -m "chore: checkpoint before creativity refresh"`.
- Record the B0 commit SHA in this plan's §10 changelog; every `:N–M` range in §4 is valid only against this SHA.

**B1. Shared primitives** _(all land in one commit)_
- `src/lib/gsap.ts` — exports a pre-configured `gsap` instance with `registerPlugin(ScrollTrigger)` called exactly once. All current registrations (`Base.astro:192`, `HeroDTS.astro:454`, `FooterDTS.astro:467`, `WrenchBackground.astro:225`) are removed and replaced with `import { gsap, ScrollTrigger } from '~/lib/gsap'`.
- `src/lib/motion.ts` — exports `prefersReducedMotion(): boolean` and `onMotionPreferenceChange(cb: (reduced: boolean) => void): () => void`. Consolidates two current duplicates (`Base.astro:194`, `HeroDTS.astro:466`).
- `src/lib/dialogFocus.ts` — exports `trapFocus(container, { returnTo?, inertTargets? }): { release: () => void }`. Inert-targets default to document siblings of `container`. Handles Esc, Tab/Shift+Tab cycling, initial focus placement, focus return on release. Adopted by NavMobile (D1) and CaseModal (D1) — both adoptions are mandatory (not optional) to justify the shared primitive.
- `src/utils/caseColors.ts` — exports `serviceColors` + `serviceTextColors` objects. Consolidates three current duplicates (`werk.astro:7–13`, `CasesGrid.astro:4–17`, `CasesGrid.astro:446 [script block]`).
- **Not included:** `<Img />` wrapper. Only 1 real raw `<img>` call site remains (`werk.astro:218`, dynamic content-driven). Handle directly with `<Image />` from `astro:assets` when Phase C reshapes werk card imagery, or inline otherwise.
- **AC framing:** AC-5 is correctness (one `registerPlugin` call to prevent plugin-registered-twice ordering bugs) — NOT a bundle-size win. Astro already dedupes the GSAP import graph across component scripts.

**B2. Data extractions (zero-template-change, pure moves)**
- `src/data/wrench.ts` — geometry constants from `WrenchBackground.astro:1–41` (`gearPath`, `hexPath`, `bodyKnurl`, `handleKnurl`, `TICKER_TEXT`, `cx=105, cy=115`). The pivot coordinates are exported separately so the rotation `svgOrigin` stays synchronized.
- `src/data/werk.ts` — `serviceColors` (import from `src/utils/caseColors.ts`), `filters`, `shortDate()` from `werk.astro:1–33`.
- `src/data/werkFeatures.ts` — `features[]` from `werk.astro:34–84`. **Note:** `features[].icon` contains raw SVG HTML strings; consumers render via `<Fragment set:html={f.icon} />`. No behavioral change. If a cleaner refactor is desired later, extract each icon to `src/components/icons/Feature<N>.astro` and reference by component — deferred to a follow-up.
- Update imports in `werk.astro`, `CasesGrid.astro` frontmatter, and `CasesGrid.astro` script block. Run `npm run build` — must pass.

**B3. Decomposition — classified by creative-invariance**

**B3-early (creative-invariant, runs immediately after B2):**
- **B3a.** `src/components/werk/WerkFeatures.astro` ← extract from `werk.astro:292–329` + `:849–972`. Self-contained 2×2 grid, no shared state, no script. Safe under any creative direction.
- **B3g_split.** Atomic extraction pair (must land in one commit to avoid broken modal wiring between steps): `src/components/cases/CaseModal.astro` + `src/lib/caseModal.ts` ← from `CasesGrid.astro:131–226` (template) + `:412–526` (script). Modal is a separate overlay, not a page seam.
- Each step ends with `npm run build` + `npm run preview` + click-through `/werk` and `/` (modal path).

**B3-late (may-be-reshaped-by-creative, runs after C1 triage):**
- **B3b.** `src/components/cases/CaseCard.astro` ← from `CasesGrid.astro:38–112`. Gated on modal wiring being stable after B3g_split.
- **B3c.** `src/components/nav/NavMobile.astro` ← from `NavIsland.astro:90–131` + `:304–440`. Shared scripts remain in `NavIsland.astro` shell; sub-components emit no `<script>` tag.
- **B3d.** `src/components/werk/WerkHero.astro` + `src/components/werk/WerkMechBg.astro` ← from `werk.astro:97–174`.
- **B3e.** `src/components/werk/WerkFilterBar.astro` + `src/components/werk/WerkCasesGrid.astro` ← atomic pair (filter script stays co-located with grid DOM).
- **B3f.** `src/components/nav/NavDesktop.astro` ← from `NavIsland.astro:17–88` + `:156–302`. Scripts remain in shell.
- **B3h. (new) WrenchBackground unified pass.** This step satisfies Principle 2 (one surgery per converging file):
  1. Split SVG markup into `src/components/wrench/WrenchSvg.astro` ← `WrenchBackground.astro:43–179`.
  2. Apply D1 a11y fixes inline: gate rotation, ticker, entrance timeline with `prefersReducedMotion()` (replaces current un-gated GSAP).
  3. Apply D2 perf fix inline: pre-cache `getTotalLength()` results in one batch `gsap.set()` before timeline starts.
  4. Replace `drop-shadow` filter animation with composited sibling overlay (`<div class="wrench-glow">` + `box-shadow`/radial gradient), removing the `filter` keyframe from the SVG element itself.
- **After each B3-late step:** `npm run build` passes; `npm run preview` renders visually identical except where explicitly changed; `dist/werk/index.html` size does not grow >20%.
- **Rollback per step:** `git revert` the extraction commit. If multiple steps batched in one commit, revert the whole batch and re-extract individually.

**B4. Font strategy — use existing dependency**
- `src/styles/global.css`: add `@import '@fontsource-variable/inter/wght.css';` (already installed via `package.json:29`).
- `src/layouts/Base.astro:154–158`: remove the Google Fonts `<link rel="preconnect">`, `<link rel="preload">`, and `<link rel="stylesheet">` lines for `fonts.googleapis.com`.
- Verify: Chrome DevTools Network tab shows zero requests to `fonts.gstatic.com` and `fonts.googleapis.com`; Inter WOFF2 served from Vite-handled path.
- No WOFF2 download needed.

**B5. Image handling — precise scope**
- The only true raw `<img>` needing migration is `werk.astro:218` (case photos, dynamic from `cases.ts`). Migrate to `<Image />` from `astro:assets` ONLY IF `cases.ts` content fields become non-null; currently all `c.before`/`c.after` are null, so this migration has nothing to migrate until content exists.
- `NavIsland.astro:32–42` and `FooterDTS.astro:70` already use correct responsive `<img srcset width height loading fetchpriority>` patterns. **Do not touch.** Explicitly protected by AC-4.
- **`public/dts-logo.png` (2.2 MB) — OPTIMIZE, do not delete.** Referenced by `Base.astro:26` in LocalBusiness JSON-LD `logo` URL. Compress to ≤150 KB at the same path (use `sharp` CLI or equivalent). Verify schema.org `logo` URL resolves after build.
- `AboutSnippet.astro` and other modules: leave unchanged until C2 introduces new imagery.

**B6. Commit Phase B.** Message: `refactor: decompose mega-modules, add shared primitives, optimize logo`.

### Phase C — Creative direction (after ui-ux-pro-max output lands in `.omc/ui-ux-pro-max-brief.md`)

**C1. Triage.**
- Read `.omc/ui-ux-pro-max-brief.md` (gate — if missing, defer Phase C and inform the user).
- Classify each brief item as: fits existing decomposition / requires new sub-component / requires re-decomposition.
- If re-decomposition needed: expand or re-scope B3-late before writing.
- Clarify brief artifact format: markdown specs → AC-11 = human review with evidence screenshots; component sketches → AC-11 = diff check.

**C2. Apply creative direction.**
- Use `prefersReducedMotion()` for any new motion.
- Use `<Image />` from `astro:assets` for any new static imagery.
- At end of each file-level change: screenshot at 1440×900 + 390×844 stored under `.omc/verification/phase-C/`.
- **Composition review:** after the final C2 commit, screenshot each full route at 1440×900 and check visual coherence across sub-component seams. Store in `.omc/verification/phase-C/composition-<route>.png`.

**C3. Contrast sweep.**
- Batch alpha-value bumps for a11y audit findings 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 7.9, 7.11, 7.12.
- Verify with `axe-core` contrast rule against `dist/` per AC-9.

**C4. Commit Phase C:** `feat: apply creative direction`.

### Phase D — A11y & perf hardening

**D1. A11y CRITICALs (applied to now-decomposed files where B3-late ran; applied to mega-files otherwise):**
- NavIsland: `trapFocus()` on mobile overlay; `aria-controls="nav-mobile"` + `aria-haspopup="dialog"` on hamburger; `min-width: 44px; min-height: 44px` on toggle; focus returns to toggle on close.
- CasesGrid → CaseModal: `trapFocus()`; replace `<article role="button">` with `<article>` containing a real `<button class="case-open-btn">` (accessible name = model + "bekijken"); `preventDefault()` on Space keydown.
- ChatExplainer: remove `aria-live="polite"` from per-char `.user-text` span; announce only final answer via `role="status"` on parent; short-circuit `startChat()` under `prefersReducedMotion()` (render final state immediately).
- FooterDTS gauge: gate rotation with `prefersReducedMotion()`.
- werk.astro (or `WerkCasesGrid` after B3e): wrap content in `<main id="werk-main">`; demote `<h2 class="card-model">` to `<h3>`; add `aria-pressed` attribute to filter pills; add `role="status"` to `#filter-count`.
- contact.astro: `<h3>` "Bel direct" → `<h2>`.
- CaseModal: `aria-label="Case details"` (Dutch replacement for "Case detail").
- Footer legal/copy text colors: raise from `rgba(122,175,196,0.28)` to opacity ≥ 0.70 or solid `#8EAAB8` (contrast ≥ 4.5:1).

**D2. Perf HIGHs:**
- `Base.astro`: wrap `ScrollTrigger.refresh()` in `requestAnimationFrame`.
- `NavIsland.astro`: cache `navRect` via ResizeObserver; remove global `document.addEventListener('keydown', …)` — attach only on menu open, remove on close.
- `werk.astro` (or `WerkFilterBar` after B3e): add `contain: layout style` on `.filter-bar-wrap`; pre-index card services into `Map<HTMLElement, Set<string>>` at init.
- `NavIsland.astro`: ensure logo `<img>` has `fetchpriority="high"` (verify — may already be present).
- `CasesGrid.astro` → `CaseModal.astro` (via B3g_split): scope tab-click `document.querySelectorAll` to `modal.querySelectorAll`; add guard flag against double-invocation in card scroll-in `animationend`/timeout race.
- (Covered by B3h) WrenchBackground `drop-shadow` replacement + path-length precompute.

**D3. Commit Phase D:** `fix: a11y + perf hardening`.

### Phase E — GEO/SEO remediation (serialized after D on `Base.astro`)

**E0. Reconcile with existing pipeline.**
- Run `npm run seo:aeo` and inspect output against geo-audit proposals.
- Run `npm run copy:all` if copy changes are part of geo-audit output.
- Record any duplications between geo-audit output and `scripts/seo-agents/*` output in `.omc/verification/phase-E/pipeline-reconciliation.md`.

**E1. Apply geo-audit output.**
- Explicitly gated: starts only after D3 commits and D2's `Base.astro` writes are merged.
- Schema.org JSON-LD in `Base.astro:18–117` — apply geo-audit deltas; run Rich Results Test per AC-19.
- Update `public/llms.txt` (currently 3734 bytes) in-place with geo-audit deltas — do NOT recreate.
- Update meta descriptions per-route (unique per AC-12).
- Open Graph per-route (via Base.astro prop threading).
- Verify `public/robots.txt` is still valid — do NOT regenerate.

**E2. Commit Phase E:** `feat: GEO/SEO remediation`.

### Phase F — Verification

**F1. Build + dev smoke.** `npm run build` clean. `npm run dev` click-through every route; DevTools Console + Network panels clean (zero errors, zero failed requests).
**F2. Lighthouse mobile** on each audited route (AC-3); store JSON under `.omc/verification/phase-F/lh-<route>.json`.
**F3. Keyboard-only walkthrough** per AC-15; recordings under `.omc/verification/phase-F/keyboard-<route>.mov`.
**F4. Screen-reader spot-check:** VoiceOver on Safari macOS for NavMobile + CaseModal (mandatory per AC-7, AC-8); NVDA on Firefox Windows optional if available.
**F5. axe-core against `dist/`** per AC-2, AC-9.
**F6. Rich Results Test** for LocalBusiness + WebSite + any per-route schema per AC-19.
**F7. Composition review** — visual check of assembled pages vs. ui-ux-pro-max brief per AC-11 (if brief exists).
**F8. Acceptance report** — one-page markdown mapping each AC to its evidence artifact, stored at `.omc/verification/phase-F/acceptance-report.md`.

## 5. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Parallel chat writes during Phase B cause merge loss | Medium | High | B0 checkpoint commit; if a write conflict is detected (git merge markers), the LATER writer rebases on current HEAD and hand-merges (NOT "most recent wins"); conflicts in decomposed sub-components resolved by treating Phase-B extractions as authoritative |
| ui-ux-pro-max creative direction requires restructuring beyond B3-late | Medium | Medium | C1 triage step explicitly re-scopes before writing; B3-late classification keeps creative-dependent extractions deferred until after triage |
| B3 line ranges drift between plan-draft and execution | High | High | Every `:N–M` range is valid against the B0 SHA only; re-derive via `wc -l` + `grep -n` before each extraction |
| GSAP consolidation to `src/lib/gsap.ts` introduces plugin-registration-timing bug | Low | Medium | Smoke-test every GSAP-using module after B1 commit; `grep -c "registerPlugin" src/` must equal 1 before B1 merges |
| `@fontsource-variable/inter` import fails at build time | Low | Low | Verify locally pre-B4-commit: `npm run build` must succeed; fallback = re-add Google Fonts link with explicit comment |
| Focus trap helper breaks SR virtual cursor edge case | Low | High | VoiceOver test on both dialogs before claiming AC-7/AC-8 done; if manual trap fails, adopt `focus-trap` npm package (2 KB) |
| Creative direction adds motion without `prefersReducedMotion()` gate | Medium | Medium | Grep gate in F5: `grep -rEn 'gsap\.(to\|from\|fromTo\|timeline)' src/` must have matching `prefersReducedMotion` in the same file; ESLint rule deferred |
| Playwright assumed for E2E but not installed | High | Medium | AC-21 forces explicit resolution in Phase F prep — either `npm i -D @playwright/test` OR route through `browser-qa` MCP skill and document in §7 |
| Existing `scripts/seo-agents/` pipeline collides with geo-audit output | Medium | Medium | E0 reconciliation step records overlaps before E1 writes |
| `public/dts-logo.png` optimization loses visual fidelity | Low | Medium | Compare before/after at 1× and 2× display in preview; `sharp` with `--quality 85` typically preserves perceptual quality |
| `.omc/state/` or `.omc/project-memory.json` leaked to public git | Low | Medium | B0 gitignores them before checkpoint; `git log -- .omc/` verifies no accidental inclusion |
| `src/pages/diensten/*` files over AC-1 soft cap remain unaddressed | High | Low | Waived for this plan scope; tracked as follow-up in §9 ADR |
| `BlogLayout.astro` 670 lines over AC-1 soft cap | Medium | Low | Waived — deferred to a blog-template refresh scope |
| C1 triage doesn't trigger re-decomposition when it should | Medium | Medium | Triage checklist: "Does the creative brief change any module's public shape (props), script seam, or CSS cascade root?" If yes, rescope B3-late. |

## 6. Pre-mortem (3 failure scenarios — each with prevention wired into §4/§7)

**Scenario 1 — "The site looks worse after the refresh."** ui-ux-pro-max direction was applied without accounting for decomposition boundaries, leaving visual seams between sub-components. Root cause: Phase C didn't check cross-sub-component consistency. **Prevention (wired to §4 C2):** C2 mandates a "composition review" step where the assembled page is screenshot-diffed at 1440×900 and 390×844 per route, stored in `.omc/verification/phase-C/composition-<route>.png`. AC-11 gates on this evidence.

**Scenario 2 — "axe-core passed; real screen-reader users hate it."** The focus trap in NavMobile / CaseModal has a subtle bug (first Tab cycles to a `tabindex="-1"` element, focus escapes). Root cause: synthetic testing didn't cover SR virtual cursor. **Prevention (wired to §4 F4 and AC-7/AC-8):** AC-7 and AC-8 REQUIRE VoiceOver on Safari macOS walkthrough recorded to `.omc/verification/phase-F/{nav,cases}-dialog.mov`. axe-core alone does not satisfy these ACs — both require SR evidence.

**Scenario 3 — "Lighthouse regressed on `/werk`."** Sub-components introduced more `<script>` tags, inlined scripts pushed `werk.astro`'s rendered HTML past critical CSS budget, LCP dropped. Root cause: Astro inlines every component's `<script>` tag. **Prevention (wired to §4 B3 and §7 Observability):** AC-18 (new) enforces `<script>` count parity after B3 and `dist/werk/index.html` size growth ≤20%. §7 Observability measures rendered HTML size before and after B3e. If the check fails, hoist all page-level scripts to a single inline script tag in `werk.astro`.

## 7. Expanded Test Plan

### Unit
- `src/lib/motion.ts` — `prefersReducedMotion()` returns boolean; `onMotionPreferenceChange` fires callback on `MediaQueryList` change event (test via `matchMedia` mock).
- `src/lib/dialogFocus.ts` — trap/release lifecycle: first Tab cycles, Shift+Tab cycles backward, Esc fires `release`, focus returns to `returnTo`, `inertTargets` correctly marked inert.
- `src/utils/caseColors.ts` — every service key from `cases.ts` has a defined color; no extra keys.
- `src/lib/gsap.ts` — imported instance has `ScrollTrigger` registered once.

### Integration
- Each decomposed module composes correctly: `werk.astro` after B3 renders visually identical to pre-B3 baseline at 1440×900 and 390×844 (visual diff between `.omc/verification/phase-B-baseline/` and post-B3).
- Modal wiring after B3g_split: card click on `/` opens the modal, Esc closes, focus returns to the card.
- Filter bar after B3e: each pill click updates `#filter-count` and toggles card visibility (manual).

### E2E (tool resolved per AC-21)
- **Golden path 1:** Load `/`, Tab to first nav link, Tab through entire nav, Tab into main content, Tab to first case card trigger button, Enter opens modal, Tab cycles inside modal, Esc closes, focus returns to the triggering card.
- **Golden path 2:** Load `/werk`, click each filter pill, verify `aria-pressed` updates, `#filter-count` announces new count via `role="status"`, hidden cards not keyboard-focusable.
- **Golden path 3:** iPhone 12 viewport (390×844). Load `/`, tap hamburger, verify focus moves into overlay and background is `inert`; tap outside → closes, focus returns to hamburger.
- **Golden path 4:** Load `/`, run Lighthouse mobile → mobile score ≥ 90, LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- **Golden path 5:** Load `/` with `prefers-reduced-motion: reduce` emulated (DevTools → Rendering); verify WrenchBackground does not rotate, ticker does not scroll, ChatExplainer renders final state immediately, FooterDTS gauge is static.

### Observability
- **`dist/` size delta** per phase (AC-18): `du -sb dist/` recorded after each phase commit.
- **HTML-inline growth check** (Scenario 3 prevention): `wc -c dist/werk/index.html` before B3 and after B3e — ratio must be ≤ 1.20.
- **File-size conformance** (AC-1): `find src -name "*.astro" -o -name "*.ts" | xargs wc -l | awk '$1>400 && $2!~/blog\|BlogLayout/'` returns empty after each phase.
- **Lighthouse diff**: Lighthouse JSON from Phase B → C → D → E → F; each phase's audited routes must not regress from the prior phase's scores.
- **Console/network smoke**: DevTools error/failure count per route must be zero (AC-13).

## 8. Verification Steps (with browser/viewport/SR matrix)

1. **After every phase commit:** `npm run build` clean; `npm run dev` walk every route (`/`, `/werk`, `/diensten`, 4× `/diensten/*`, `/over-ons`, `/faq`, `/contact`, `/blog`) on Chrome stable at 1440×900; DevTools Console + Network panels clean.
2. **Phase D close:** keyboard-only walkthrough (Chrome stable + Safari macOS, 1440×900) of Golden Paths 1, 2, 3. Each recorded to `.omc/verification/phase-D/keyboard-<gp>.mov`.
3. **Phase D close:** VoiceOver on Safari macOS walkthrough of NavMobile dialog (Golden Path 3 on iPhone 12 simulator) and CaseModal (Golden Path 1). Each recorded. NVDA on Firefox Windows: optional if Windows machine available.
4. **Phase F:** full E2E suite (Golden Paths 1–5) on Chrome stable, with GP5 additionally on Firefox for reduced-motion emulation validation.
5. **Phase F:** Lighthouse mobile per AC-3 audited routes; JSON stored per-route.
6. **Phase F:** axe-core against `dist/` per AC-2, AC-9.
7. **Phase F:** Rich Results Test on LocalBusiness + WebSite + FAQ schema per AC-19.
8. **Phase F:** acceptance report generated mapping each AC to its evidence (screenshot, command output, Lighthouse JSON, `.mov` path).
9. **Pass/fail thresholds:** any AC-3 route missing any threshold fails the phase. Any CRITICAL a11y finding in axe failing fails AC-2. Any Lighthouse score below 90 on audited routes fails the phase. No subjective pass/fail — all gated on evidence artifacts or numeric thresholds.

## 9. ADR

- **Decision:** Adopt Option A (Refactor-first, design-second, polish-third) with the Architect's Option B synthesis folded in — B3 is classified into B3-early (creative-invariant, runs immediately) and B3-late (creative-dependent, runs after C1 triage).
- **Drivers:** Parallel-chat write safety (Driver 1); motion-infra-before-motion ordering (Driver 2); file-size edit-cost multiplier on shared helper adoption (Driver 3).
- **Alternatives considered:**
  - Option B (Design-first): viable but editing mega-files during C incurs edit-cost; merge-conflict risk with ui-ux-pro-max chat is highest here.
  - Option C (Parallel tri-track): file partition unstable given creative/structural overlap in this repo; coordination cost exceeds wall-clock savings.
- **Why chosen:** Option A with B3-early/B3-late split gets visible progress on day 3 (primitives, safe extractions, font migration, image optimization, Phase D hardening on now-decomposed pieces) while deferring the seams that creative might reshape. Captures Option B's main value (low rework risk) without paying Option B's cost (editing 600–1000 line files during C).
- **Consequences:**
  - Slightly slower to visible design change than pure B, but visible perf/a11y improvements land in Phase D (before creative direction).
  - Requires disciplined C1 triage to avoid B3-late invalidation.
  - Creates `src/lib/`, `src/components/nav/`, `src/components/cases/`, `src/components/werk/`, `src/components/wrench/` folder structure that didn't exist before.
- **Follow-ups (explicitly out of scope for this plan):**
  - `src/layouts/BlogLayout.astro` decomposition (670 lines).
  - `src/pages/diensten/*.astro` per-service page decomposition (445–586 lines each).
  - Feature icons in `src/data/werkFeatures.ts` → `src/components/icons/` extraction.
  - Post-launch perf monitoring via Vercel Speed Insights / RUM.
  - Playwright as a permanent devDependency if E2E becomes routine.

## 10. Changelog

- **v0.2** — Applied 12 Architect improvements and 9 Critic blockers. Specifically: fixed verified line counts; reframed AC-5 as correctness (not perf); dropped `<Img />` wrapper primitive (YAGNI); switched B4 to use `@fontsource-variable/inter` already in deps; changed B5 from "delete `dts-logo.png`" to "optimize" (schema dependency); added B3h unified WrenchBackground pass; added B3-early/late split per Architect synthesis; serialized Phase D/E on `Base.astro`; wired Pre-mortem Scenario 3 prevention into §7 Observability and AC-18; added ACs 16–21; added browser/viewport/SR matrix to §8; gitignored `.omc/state/` and `.omc/project-memory.json` in B0; clarified AC-11 gating on `.omc/ui-ux-pro-max-brief.md`; changed AC-14 to denylist; added explicit `scripts/seo-agents/` + `scripts/copy-agents/` reconciliation in E0; noted `public/llms.txt` and `public/robots.txt` already exist.
- **v0.1** — Initial draft from Phase A audits.
