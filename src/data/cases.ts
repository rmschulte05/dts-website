export interface Case {
  id: string;
  model: string;
  type: string;
  range: string;
  services: string[];
  date: string;
  notes: string;
  before: string | null;
  after: string | null;
}

export const cases: Case[] = [
  {
    id: 'case-001',
    model: 'Snap-on QJFR2100B',
    type: '1/2" Momentsleutel',
    range: '40–200 Nm',
    services: ['Kalibratie', 'Reiniging'],
    date: '14 november 2025',
    notes: 'Momentsleutel had een afwijking van meer dan 8% op de ingestelde waarde. Na volledige reiniging van het interne ratelwerk en hercalibratie voldoet het gereedschap aan de ISO 6789:2017 norm. Kalibratierapport bijgevoegd.',
    before: null,
    after: null,
  },
  {
    id: 'case-002',
    model: 'Hazet 6292-1CT',
    type: '3/4" Momentsleutel',
    range: '100–600 Nm',
    services: ['Reparatie', 'Kalibratie', 'Certificering'],
    date: '3 december 2025',
    notes: 'Ratelwerk was volledig geblokkeerd door corrosie opbouw. Na demontage, reiniging van alle onderdelen en vervanging van de klikverend is het gereedschap hercalibreerd en gecertificeerd conform ISO 6789-2.',
    before: null,
    after: null,
  },
  {
    id: 'case-003',
    model: 'Wera 7774 Rapidaptor',
    type: '1/4" Momentsleutel',
    range: '2,5–25 Nm',
    services: ['Justeren', 'Kalibratie'],
    date: '19 december 2025',
    notes: 'Schaalverdeling was incorrect afgesteld na een val. Volledige her-justering en verificatie op 5 meetpunten uitgevoerd. Afwijking teruggebracht van ±12% naar ±1,5%.',
    before: null,
    after: null,
  },
  {
    id: 'case-004',
    model: 'Stahlwille 730/10',
    type: '3/8" Momentsleutel',
    range: '20–100 Nm',
    services: ['Kalibratie', 'Certificering'],
    date: '8 januari 2026',
    notes: 'Periodieke kalibratie conform werkplaatsprotocol. Gereedschap was binnen tolerantie, kalibratie bevestigd op 5 meetpunten. Certificaat afgegeven met volgende kalibratietermijn.',
    before: null,
    after: null,
  },
  {
    id: 'case-005',
    model: 'Gedore 3550-10 Red',
    type: '1/2" Momentsleutel',
    range: '60–340 Nm',
    services: ['Reparatie', 'Kalibratie'],
    date: '22 januari 2026',
    notes: 'Klikpunt was niet meer voelbaar door een gebroken klikverend. Onderdeel vervangen en gereedschap opnieuw gecalibreerd. Afwijking na reparatie: ±2% op alle meetpunten.',
    before: null,
    after: null,
  },
  {
    id: 'case-006',
    model: 'Beta 666/200T',
    type: '1/2" Momentsleutel',
    range: '40–200 Nm',
    services: ['Justeren', 'Kalibratie', 'Certificering'],
    date: '14 februari 2026',
    notes: 'Volledig service traject: demontage, reiniging, justering en kalibratie op 5 meetpunten. Gereedschap is gecertificeerd en voldoet aan de vereisten van ISO 6789:2017 type II.',
    before: null,
    after: null,
  },
];
