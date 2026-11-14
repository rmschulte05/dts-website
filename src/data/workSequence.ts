export type WorkStepId =
  | 'diagnosticeren'
  | 'repareren'
  | 'justeren'
  | 'kalibreren'
  | 'certificeren';

export interface WorkStep {
  id: WorkStepId;
  n: string;
  title: string;
  subtitle: string;
  body: string;
  howToText: string;
  accent: string;
  href: string;
  linkLabel: string;
}

export const WORK_SEQUENCE: WorkStep[] = [
  {
    id: 'diagnosticeren',
    n: '01',
    title: 'Diagnosticeren',
    subtitle: 'Gratis inspectie',
    body: 'Visuele en mechanische inspectie plus as-found meting. We brengen schade, slijtage en afwijking in kaart voordat we iets aan de sleutel doen. Altijd gratis.',
    howToText:
      'Visuele en mechanische inspectie plus as-found meting. We brengen schade, slijtage en afwijking in kaart voordat we iets aan de sleutel doen. Altijd gratis.',
    accent: '#8EAAB8',
    href: '/diensten/',
    linkLabel: 'Onze diensten',
  },
  {
    id: 'repareren',
    n: '02',
    title: 'Repareren',
    subtitle: 'Alleen indien nodig',
    body: 'Alleen bij mechanische schade: demontage, reiniging en vervanging van slijtdelen, pas na jouw akkoord. Geen schade? Dan slaan we deze stap over.',
    howToText:
      'Alleen bij mechanische schade: demontage, reiniging en vervanging van slijtdelen, pas na jouw akkoord. Geen schade? Dan slaan we deze stap over.',
    accent: '#C48A64',
    href: '/diensten/momentsleutel-reparatie/',
    linkLabel: 'Momentsleutel reparatie',
  },
  {
    id: 'justeren',
    n: '03',
    title: 'Justeren',
    subtitle: 'Alleen indien nodig',
    body: 'Alleen als de sleutel buiten tolerantie valt. We stellen hem bij tot binnen onze ±2% servicegarantie. Zit hij er al binnen? Dan slaan we justeren over.',
    howToText:
      'Alleen als de sleutel buiten tolerantie valt. We stellen hem bij tot binnen onze ±2% servicegarantie. Zit hij er al binnen? Dan slaan we justeren over.',
    accent: '#C4AF64',
    href: '/diensten/momentsleutel-justeren/',
    linkLabel: 'Momentsleutel laten justeren',
  },
  {
    id: 'kalibreren',
    n: '04',
    title: 'Kalibreren',
    subtitle: 'ISO 6789:2017 en 2003',
    body: 'Gedocumenteerde meting volgens ISO 6789:2017 en 2003 over het volledige bereik (as-left na de ingreep). Meerdere metingen per punt, traceerbare referentieapparatuur.',
    howToText:
      'Gedocumenteerde meting volgens ISO 6789:2017 en 2003 over het volledige bereik (as-left na de ingreep). Meerdere metingen per punt, traceerbare referentieapparatuur.',
    accent: '#7AAFC4',
    href: '/diensten/momentsleutel-kalibratie/',
    linkLabel: 'Momentsleutel kalibreren',
  },
  {
    id: 'certificeren',
    n: '05',
    title: 'Certificeren',
    subtitle: 'Officieel certificaat',
    body: 'ISO 6789:2017 en 2003 certificaat met as-found en as-left waarden, gebruikte referentieapparatuur en aanbevolen interval. Audit-proof.',
    howToText:
      'ISO 6789:2017 en 2003 certificaat met as-found en as-left waarden, gebruikte referentieapparatuur en aanbevolen interval. Audit-proof.',
    accent: '#64C48A',
    href: '/diensten/iso-6789-certificering/',
    linkLabel: 'ISO 6789 certificaat',
  },
];

export const SELLABLE_SERVICES: WorkStep[] = WORK_SEQUENCE.filter(
  (step) => step.id !== 'diagnosticeren',
);

export interface HowToStep {
  '@type': 'HowToStep';
  position: number;
  name: string;
  text: string;
}

export function getHowToSteps(
  texts?: Partial<Record<WorkStepId, string>>,
): HowToStep[] {
  return WORK_SEQUENCE.map((step, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: step.title,
    text: texts?.[step.id] ?? step.howToText,
  }));
}
