// Generate public/og-image.jpg (1200x630), branded social share card.
// Run: node scripts/generate-og-image.mjs
//
// Renders an SVG composition (dark theme, brand accent, big legible typography
// down to LinkedIn / iMessage thumbnail size ~150px wide) and rasterizes to
// JPG via Sharp.

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(__dirname, '../public/og-image.jpg');

const W = 1200;
const H = 630;

// Brand palette mirrors the live site
const BG       = '#06080A';
const TEAL     = '#7AAFC4';
const TEAL_HI  = '#9BC5D8';
const GOLD     = '#C4AF64';
const GREEN    = '#64C48A';
const TEXT     = '#FFFFFF';
const MUTED    = '#A8BDC7';

// Build a 24-tick decorative dial (mirrors FooterDTS gauge)
function gaugeTicks(rOuter) {
  const out = [];
  for (let i = 0; i < 24; i++) {
    const a = ((i * 15 - 90) * Math.PI) / 180;
    const isMajor = i % 6 === 0;
    const isMed   = i % 3 === 0;
    const r2 = isMajor ? rOuter - 22 : isMed ? rOuter - 14 : rOuter - 8;
    const sw = isMajor ? 1.8 : isMed ? 1.0 : 0.5;
    out.push(
      `<line x1="${(rOuter * Math.cos(a)).toFixed(2)}" y1="${(rOuter * Math.sin(a)).toFixed(2)}" x2="${(r2 * Math.cos(a)).toFixed(2)}" y2="${(r2 * Math.sin(a)).toFixed(2)}" stroke="${TEAL}" stroke-width="${sw}"/>`
    );
  }
  return out.join('');
}

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${TEAL}" fill-opacity="0.06"/>
    </pattern>
    <radialGradient id="halo" cx="28%" cy="48%" r="60%">
      <stop offset="0%"   stop-color="${TEAL}" stop-opacity="0.22"/>
      <stop offset="55%"  stop-color="${TEAL}" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="${TEAL}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accentBar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${TEAL}" stop-opacity="0"/>
      <stop offset="20%"  stop-color="${TEAL}" stop-opacity="0.85"/>
      <stop offset="80%"  stop-color="${TEAL}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${TEAL}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="gradMoment" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${TEAL}"/>
      <stop offset="55%"  stop-color="${TEAL_HI}"/>
      <stop offset="100%" stop-color="#B8C4CC"/>
    </linearGradient>
    <linearGradient id="hairline" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${TEAL}" stop-opacity="0"/>
      <stop offset="50%"  stop-color="${TEAL}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${TEAL}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background stack -->
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>

  <!-- Top + bottom hairlines -->
  <rect x="0" y="0"          width="${W}" height="2" fill="url(#hairline)"/>
  <rect x="0" y="${H - 2}"  width="${W}" height="2" fill="url(#hairline)"/>

  <!-- Decorative gauge anchored off-canvas right -->
  <g opacity="0.42" transform="translate(${W - 50}, ${H / 2})">
    <circle r="240" stroke="${TEAL}" stroke-width="1"   fill="none"/>
    <circle r="195" stroke="${TEAL}" stroke-width="0.7" fill="none"/>
    <circle r="120" stroke="${TEAL}" stroke-width="1"   fill="none"/>
    <circle r="55"  stroke="${TEAL}" stroke-width="1.5" fill="none"/>
    <line x1="0" y1="-240" x2="0" y2="240" stroke="${TEAL}" stroke-width="0.7"/>
    <line x1="-240" y1="0" x2="240" y2="0" stroke="${TEAL}" stroke-width="0.7"/>
    ${gaugeTicks(240)}
    <circle r="8" fill="${TEAL}"/>
    <circle r="3" fill="${BG}"/>
    <path d="M 0 -195 A 195 195 0 0 1 195 0" stroke="${TEAL_HI}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <path d="M 0 -195 A 195 195 0 0 1 195 0" stroke="${TEAL_HI}" stroke-width="10"  stroke-linecap="round" fill="none" opacity="0.18"/>
    <line x1="0" y1="0" x2="0" y2="-180" stroke="${TEAL_HI}" stroke-width="3" stroke-linecap="round" transform="rotate(35)"/>
  </g>

  <!-- Vertical accent bar on the left edge -->
  <rect x="62" y="80" width="3" height="${H - 160}" fill="url(#accentBar)" rx="1.5"/>

  <!-- ───── COPY BLOCK ───── -->

  <!-- Eyebrow: short rule + brand cap -->
  <g transform="translate(100, 130)">
    <line x1="0" y1="0" x2="56" y2="0" stroke="${TEAL}" stroke-width="2.5" stroke-linecap="round"/>
    <text x="74" y="7"
          font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size="22" font-weight="700" letter-spacing="6" fill="${TEAL}">
      DUTCH TORQUE SERVICE
    </text>
  </g>

  <!-- HUGE two-line headline -->
  <text x="100" y="245"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="108" font-weight="900" letter-spacing="-3" fill="${TEXT}">
    Precisie op elk
  </text>
  <text x="100" y="357"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="108" font-weight="900" letter-spacing="-3" fill="url(#gradMoment)">
    moment.
  </text>

  <!-- Sub-headline, the sales pitch -->
  <text x="100" y="425"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="36" font-weight="600" fill="${MUTED}">
    Momentsleutel kalibratie · reparatie · certificering
  </text>

  <!-- Feature pills row, three trust signals -->
  <g transform="translate(100, 472)">
    <!-- Pill 1: ISO -->
    <g>
      <rect x="0" y="0" width="318" height="56" rx="28"
            fill="${GREEN}" fill-opacity="0.10"
            stroke="${GREEN}" stroke-opacity="0.45" stroke-width="1.5"/>
      <circle cx="28" cy="28" r="6" fill="${GREEN}"/>
      <text x="48" y="36"
            font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
            font-size="20" font-weight="800" letter-spacing="2" fill="${GREEN}">
        ISO 6789:2017 + 2003
      </text>
    </g>
    <!-- Pill 2: ±2% -->
    <g transform="translate(338, 0)">
      <rect x="0" y="0" width="220" height="56" rx="28"
            fill="${GOLD}" fill-opacity="0.10"
            stroke="${GOLD}" stroke-opacity="0.45" stroke-width="1.5"/>
      <circle cx="28" cy="28" r="6" fill="${GOLD}"/>
      <text x="48" y="36"
            font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
            font-size="20" font-weight="800" letter-spacing="2" fill="${GOLD}">
        ±2% GARANTIE
      </text>
    </g>
    <!-- Pill 3: Snap-On -->
    <g transform="translate(578, 0)">
      <rect x="0" y="0" width="244" height="56" rx="28"
            fill="${TEAL}" fill-opacity="0.10"
            stroke="${TEAL}" stroke-opacity="0.45" stroke-width="1.5"/>
      <circle cx="28" cy="28" r="6" fill="${TEAL_HI}"/>
      <text x="48" y="36"
            font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
            font-size="20" font-weight="800" letter-spacing="2" fill="${TEAL_HI}">
        SNAP-ON DEALER
      </text>
    </g>
  </g>

  <!-- Footer URL + location -->
  <rect x="80" y="${H - 80}" width="${W - 160}" height="1" fill="${TEAL}" fill-opacity="0.18"/>
  <text x="100" y="${H - 38}"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="26" font-weight="700" fill="${TEAL_HI}">
    dutchtorqueservice.nl
  </text>
  <text x="${W - 100}" y="${H - 38}" text-anchor="end"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="20" font-weight="500" fill="${MUTED}" letter-spacing="2.5">
    RIETHOVEN · NOORD-BRABANT · NL
  </text>
</svg>`;

const buf = await sharp(Buffer.from(svg))
  .jpeg({ quality: 92, mozjpeg: true })
  .toBuffer();

await sharp(buf).toFile(outPath);
console.log(`OG image written: ${outPath} (${(buf.length / 1024).toFixed(1)} KB, ${W}x${H})`);
