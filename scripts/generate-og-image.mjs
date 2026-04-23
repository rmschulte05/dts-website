// Generate public/og-image.jpg (1200x630) — branded social share card.
// Run: node scripts/generate-og-image.mjs
//
// Renders an SVG composition (dark theme, brand accent, clean typography)
// and rasterizes to JPG via Sharp (already in dependencies).

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(__dirname, '../public/og-image.jpg');

const W = 1200;
const H = 630;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#08090B"/>
      <stop offset="100%" stop-color="#0E1118"/>
    </linearGradient>
    <radialGradient id="glow" cx="25%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#7AAFC4" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="#7AAFC4" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#7AAFC4" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7AAFC4" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <rect x="80" y="120" width="4" height="390" rx="2" fill="#7AAFC4" fill-opacity="0.85"/>

  <text x="112" y="162"
        font-family="Inter, 'Helvetica Neue', Arial, sans-serif"
        font-size="22" font-weight="700"
        letter-spacing="6" fill="#7AAFC4" opacity="0.85">
    ISO 6789:2017 · SNAP-ON DEALER
  </text>

  <text x="112" y="260"
        font-family="Inter, 'Helvetica Neue', Arial, sans-serif"
        font-size="74" font-weight="900"
        letter-spacing="-2" fill="#ffffff">
    Dutch Torque Service
  </text>

  <text x="112" y="340"
        font-family="Inter, 'Helvetica Neue', Arial, sans-serif"
        font-size="38" font-weight="500"
        fill="#C4D0D8">
    Momentsleutel kalibratie, reparatie &amp; certificering.
  </text>

  <text x="112" y="400"
        font-family="Inter, 'Helvetica Neue', Arial, sans-serif"
        font-size="26" font-weight="400"
        fill="#8EAAB8">
    5 meetpunten. ±2% servicegarantie. Audit-proof certificaat.
  </text>

  <rect x="80" y="550" width="1040" height="1" fill="#7AAFC4" fill-opacity="0.15"/>
  <text x="80" y="590"
        font-family="Inter, 'Helvetica Neue', Arial, sans-serif"
        font-size="22" font-weight="600"
        fill="#7AAFC4">
    dutchtorqueservice.nl
  </text>
  <text x="1120" y="590" text-anchor="end"
        font-family="Inter, 'Helvetica Neue', Arial, sans-serif"
        font-size="20" font-weight="500"
        fill="#8EAAB8">
    Riethoven · Noord-Brabant · NL
  </text>
</svg>`;

await sharp(Buffer.from(svg))
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(outPath);

console.log(`✓ Wrote ${outPath}`);
