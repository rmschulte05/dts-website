# NL kalibratie hub: report (27 Oct 2026)

## Hub
`/diensten/momentsleutel-kalibratie` (canonical unchanged). No new pages, no redirects.

## Files changed
- `src/pages/diensten/momentsleutel-kalibratie.astro`
  - Title: "Momentsleutel kalibreren & kalibratie | Dutch Torque Service"; description has both phrasings, Riethoven and `+31 6 13 17 27 74`.
  - H1 unchanged ("Momentsleutel laten kalibreren."). New early H2: "Momentsleutel kalibratie: wat het is en wanneer je het nodig hebt." with a short definition block.
  - New section/H2 `#ijken`: "Momentsleutel ijken? Dan bedoel je meestal kalibreren." Links to `/blog/verschil-kalibreren-justeren-ijken`.
  - FAQ: added prijs, hoe vaak, kalibreren vs ijken, certificaat/meetrapport (now 9 items).
  - `faqSchema` is now generated from the visible `faq` array (HTML stripped), so both stay in sync.
  - Service schema description updated. CTA now shows full NAP (Jan-Piet Schulte, Tonterstraat 42, 5561 AN Riethoven, phone, e-mail).
- `src/components/modules/Services.astro` (home): link label -> "Momentsleutel kalibreren en kalibratie".
- `src/pages/diensten/index.astro`: CTA -> "Momentsleutel kalibreren: hoe het werkt".

## Keywords covered
momentsleutel kalibreren, momentsleutel kalibratie / kalibratie momentsleutel (title, H2s, body, FAQ), momentsleutel ijken (section + FAQ).

## Assumptions
- Only existing site facts used: 5 meetpunten, ISO 6789:2017 en 2003, ±2% / ±4%, as-found/as-left, jaarlijks, 3-6 maanden / 5.000 cycli, Metrologiewet statement from the ijken blog.
- Prijs FAQ gives no amount; points to contact, phone and e-mail.
- No Snap-On / Van Rootselaar copy added. The existing Snap-On card was left as is.

## Blockers / open
- No pricing, no lab photos supplied.
- Existing home `index.astro` meta already targets "Momentsleutel Kalibratie"; not changed.
- Other pages still use the old phone format `+31(0)6-131 72 774`; only the hub was switched to `+31 6 13 17 27 74`.
- Not committed, not deployed, no email sent. `npm run seo` not run.

## Build
`npm run build` succeeded (18 pages, ~47s) on 27 Oct 2026 ~11:26 Europe/Amsterdam. Not deployed. Local changes uncommitted on `main`.
