// Generate per-page Open Graph images (1200x630 JPEG) in public/og/.
// Run: node scripts/generate-og-images.mjs
//
// Reuses the visual language of scripts/generate-og-image.mjs: dark #06080A
// background, teal #7AAFC4 accent, decorative gauge, hairlines, URL and
// location. Headlines are split explicitly so each stays within two lines and
// no text is smaller than 20 px.

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../public/og');

const W = 1200;
const H = 630;

const BG      = '#06080A';
const TEAL    = '#7AAFC4';
const TEAL_HI = '#9BC5D8';
const TEXT    = '#FFFFFF';
const MUTED   = '#A8BDC7';

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

const pages = [
  {
    file: 'home.jpg',
    lines: ['Precisie op elk', 'moment.'],
    sub: 'Momentsleutel kalibratie · reparatie · certificering',
  },
  {
    file: 'kalibratie.jpg',
    lines: ['Momentsleutel laten', 'kalibreren.'],
    sub: 'ISO 6789:2017 en 2003 · certificaat · lab Riethoven',
  },
  {
    file: 'reparatie.jpg',
    lines: ['Momentsleutel', 'reparatie.'],
    sub: 'Snap-On · Stahlwille · Gedore · Facom · Hazet · Würth',
  },
  {
    file: 'justeren.jpg',
    lines: ['Momentsleutel', 'justeren.'],
    sub: 'Bijstellen tot binnen ±2% · nieuw certificaat',
  },
  {
    file: 'iso.jpg',
    lines: ['Kalibratiecertificaat.'],
    sub: 'ISO 6789:2017 en 2003 · as-found en as-left',
  },
  {
    file: 'prijs.jpg',
    lines: ['Wat kost', 'kalibreren?'],
    sub: 'Geen prijslijst · prijsopgave binnen één werkdag',
  },
  {
    file: 'opsturen.jpg',
    lines: ['Momentsleutel', 'opsturen.'],
    sub: 'Inpakken · adres · doorlooptijd',
  },
  {
    file: 'faq.jpg',
    lines: ['Veelgestelde vragen.'],
    sub: 'Kalibratie · reparatie · certificering',
  },
  {
    file: 'contact.jpg',
    lines: ['Contact.'],
    sub: 'Bel, mail of breng je momentsleutel langs',
  },
  {
    file: 'en.jpg',
    lines: ['Torque wrench', 'calibration.'],
    sub: 'ISO 6789 certificate · Riethoven, NL',
  },
  {
    file: 'de.jpg',
    lines: ['Drehmomentschlüssel', 'kalibrieren.'],
    sub: 'ISO 6789 · Zertifikat · Riethoven, NL',
  },
];

function buildSvg({ lines, sub }) {
  const lineHeight = 86;
  // Keep the two-line block visually centred around y=300.
  const firstBaseline = lines.length === 1 ? 300 : 248;
  const headline = lines
    .map((line, i) => `<text x="100" y="${firstBaseline + i * lineHeight}"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="74" font-weight="900" letter-spacing="-2"
        fill="${i === lines.length - 1 ? 'url(#gradMoment)' : TEXT}">${line}</text>`)
    .join('');

  const subBaseline = firstBaseline + (lines.length - 1) * lineHeight + 76;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${TEAL}" fill-opacity="0.06"/>
    </pattern>
    <radialGradient id="halo" cx="28%" cy="48%" r="62%">
      <stop offset="0%"   stop-color="${TEAL}" stop-opacity="0.20"/>
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

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>

  <rect x="0" y="0"         width="${W}" height="2" fill="url(#hairline)"/>
  <rect x="0" y="${H - 2}" width="${W}" height="2" fill="url(#hairline)"/>

  <g opacity="0.30" transform="translate(${W - 20}, ${H / 2})">
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
    <line x1="0" y1="0" x2="0" y2="-180" stroke="${TEAL_HI}" stroke-width="3" stroke-linecap="round" transform="rotate(35)"/>
  </g>

  <rect x="62" y="80" width="3" height="${H - 160}" fill="url(#accentBar)" rx="1.5"/>

  <g transform="translate(100, 130)">
    <line x1="0" y1="0" x2="56" y2="0" stroke="${TEAL}" stroke-width="2.5" stroke-linecap="round"/>
    <text x="74" y="7"
          font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size="22" font-weight="700" letter-spacing="6" fill="${TEAL}">
      DUTCH TORQUE SERVICE
    </text>
  </g>

  ${headline}

  <text x="100" y="${subBaseline}"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="26" font-weight="600" fill="${MUTED}">${sub}</text>

  <rect x="80" y="${H - 80}" width="${W - 160}" height="1" fill="${TEAL}" fill-opacity="0.18"/>
  <text x="100" y="${H - 38}"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="24" font-weight="700" fill="${TEAL_HI}">
    dutchtorqueservice.nl
  </text>
  <text x="${W - 100}" y="${H - 38}" text-anchor="end"
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="20" font-weight="500" fill="${MUTED}" letter-spacing="2.5">
    RIETHOVEN · NOORD-BRABANT · NL
  </text>
</svg>`;
}

await mkdir(outDir, { recursive: true });

for (const page of pages) {
  const svg = buildSvg(page);
  const outPath = path.join(outDir, page.file);
  await sharp(Buffer.from(svg)).jpeg({ quality: 92, mozjpeg: true }).toFile(outPath);
  console.log(`OG image written: ${outPath} (${W}x${H})`);
}
