export interface RelatedLink {
  href: string;
  title: string;
  context: string;
}

const KALIBRATIE: RelatedLink = {
  href: '/diensten/momentsleutel-kalibratie/',
  title: 'Momentsleutel laten kalibreren',
  context: 'ISO 6789:2017 en 2003, met certificaat',
};
const REPARATIE: RelatedLink = {
  href: '/diensten/momentsleutel-reparatie/',
  title: 'Momentsleutel reparatie',
  context: 'Reparatie na jouw akkoord, daarna kalibratie',
};
const JUSTEREN: RelatedLink = {
  href: '/diensten/momentsleutel-justeren/',
  title: 'Momentsleutel laten justeren',
  context: 'Bijstellen alleen indien nodig, met as-left waarden',
};
const CERTIFICAAT: RelatedLink = {
  href: '/diensten/iso-6789-certificering/',
  title: 'Kalibratiecertificaat volgens ISO 6789',
  context: 'Wat er op het certificaat staat',
};
const OPSTUREN: RelatedLink = {
  href: '/blog/momentsleutel-opsturen-voor-kalibratie/',
  title: 'Momentsleutel opsturen voor kalibratie',
  context: 'Inpakken, meesturen en het adres in Riethoven',
};
const PRIJS: RelatedLink = {
  href: '/blog/wat-kost-momentsleutel-kalibreren/',
  title: 'Wat kost momentsleutel kalibreren?',
  context: 'Geen prijslijst online; offerte binnen één werkdag',
};
const INTERVAL: RelatedLink = {
  href: '/blog/hoe-vaak-momentsleutel-kalibreren/',
  title: 'Hoe vaak moet je een momentsleutel laten kalibreren?',
  context: 'Intervallen en wanneer je tussendoor laat kalibreren',
};
const VERSCHIL: RelatedLink = {
  href: '/blog/verschil-kalibreren-justeren-ijken/',
  title: 'Kalibreren, justeren of ijken: wat is het verschil?',
  context: 'IJken geldt wettelijk niet voor momentsleutels',
};
const TYPE: RelatedLink = {
  href: '/blog/iso-6789-type-1-type-2-uitgelegd/',
  title: 'ISO 6789 Type I en Type II uitgelegd',
  context: 'Indicerend of instellend, en wat dat voor kalibratie betekent',
};
const GEVALLEN: RelatedLink = {
  href: '/blog/momentsleutel-gevallen-wat-nu/',
  title: 'Momentsleutel gevallen, wat nu?',
  context: 'Kalibreren, justeren of repareren na een val',
};
const KLOPT: RelatedLink = {
  href: '/blog/mijn-momentsleutel-klopt-niet-meer/',
  title: 'Mijn momentsleutel klopt niet meer, wat nu?',
  context: 'Signalen, oorzaken en de volgende stap',
};

/** Related links by article path (with or without trailing slash). */
const byPath: Record<string, RelatedLink[]> = {
  '/blog/wat-kost-momentsleutel-kalibreren/': [KALIBRATIE, OPSTUREN, CERTIFICAAT],
  '/blog/momentsleutel-opsturen-voor-kalibratie/': [KALIBRATIE, PRIJS, CERTIFICAAT],
  '/blog/hoe-vaak-momentsleutel-kalibreren/': [KALIBRATIE, GEVALLEN, VERSCHIL],
  '/blog/iso-6789-type-1-type-2-uitgelegd/': [CERTIFICAAT, KALIBRATIE, VERSCHIL],
  '/blog/verschil-kalibreren-justeren-ijken/': [KALIBRATIE, JUSTEREN, CERTIFICAAT],
  '/blog/momentsleutel-gevallen-wat-nu/': [KALIBRATIE, REPARATIE, JUSTEREN],
  '/blog/mijn-momentsleutel-klopt-niet-meer/': [REPARATIE, KALIBRATIE, GEVALLEN],
};

export function getRelatedLinks(canonicalPath: string): RelatedLink[] {
  const withSlash = canonicalPath.endsWith('/') ? canonicalPath : `${canonicalPath}/`;
  return byPath[withSlash] ?? [KALIBRATIE, OPSTUREN, PRIJS];
}
