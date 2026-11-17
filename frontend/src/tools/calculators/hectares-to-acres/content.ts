import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  acresToHectares,
  formatArea,
  hectaresToAcres,
  SQUARE_METERS_PER_ACRE,
  SQUARE_METERS_PER_HECTARE,
} from './calculation';

export const HECTARES_TO_ACRES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'hectares-to-acres', label: 'Hectares to Acres Converter' },
  { id: 'how-ha-to-ac', label: 'How to Convert Hectares to Acres' },
  { id: 'how-ac-to-ha', label: 'How to Convert Acres to Hectares' },
  { id: 'conversion-table', label: 'Hectares to Acres Conversion Table' },
  { id: 'related-tools', label: 'Other Area Conversion Tools' },
  { id: 'hectares-to-acres-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { hectares: string; acres: string }[];
}

const ACRES_PER_HECTARE = SQUARE_METERS_PER_HECTARE / SQUARE_METERS_PER_ACRE;
const HECTARES_PER_ACRE = SQUARE_METERS_PER_ACRE / SQUARE_METERS_PER_HECTARE;

const TABLE_HA = [0, 0.1, 0.5, 1, 2, 3, 5, 7, 10, 20, 50, 100, 1000] as const;

export const HA_TO_AC_TABLE: readonly { hectares: string; acres: string }[] = TABLE_HA.map(
  (ha) => ({
    hectares: String(ha),
    acres: formatArea(Number(hectaresToAcres(ha).toFixed(6))),
  }),
);

const ha3 = hectaresToAcres(3);
const ha5 = hectaresToAcres(5);
const ac19 = acresToHectares(19);
const ac21 = acresToHectares(21);
const ac100 = acresToHectares(100);

export const HECTARES_TO_ACRES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'hectares-to-acres',
    title: 'Hectares to Acres Converter',
    paragraphs: [
      'This converter changes land area between hectares and acres. Both units are used for agriculture, real estate, surveying, forestry, and other large outdoor measurements.',
      `One hectare equals exactly ${SQUARE_METERS_PER_HECTARE} square meters. One international acre equals exactly ${SQUARE_METERS_PER_ACRE} square meters, so 1 ha ≈ ${formatArea(Number(ACRES_PER_HECTARE.toFixed(6)))} ac.`,
    ],
    formula: `1 ha = ${SQUARE_METERS_PER_HECTARE} m²\n1 ac = ${SQUARE_METERS_PER_ACRE} m²\n1 ha ≈ ${formatArea(Number(ACRES_PER_HECTARE.toFixed(12)))} ac`,
  },
  {
    id: 'how-ha-to-ac',
    title: 'How to Convert Hectares to Acres',
    paragraphs: [
      `Multiply hectares by ${SQUARE_METERS_PER_HECTARE} ÷ ${SQUARE_METERS_PER_ACRE} (≈ ${formatArea(Number(ACRES_PER_HECTARE.toFixed(12)))}).`,
      `Example: convert 3 hectares to acres. 3 × ${formatArea(Number(ACRES_PER_HECTARE.toFixed(12)))} ≈ ${formatArea(Number(ha3.toFixed(6)))} ac.`,
      'Steps: (1) enter hectares, (2) multiply by the hectare-to-acre factor, (3) read acres.',
    ],
    formula: `Acres = Hectares × (${SQUARE_METERS_PER_HECTARE} ÷ ${SQUARE_METERS_PER_ACRE})`,
  },
  {
    id: 'how-ac-to-ha',
    title: 'How to Convert Acres to Hectares',
    paragraphs: [
      `Multiply acres by ${HECTARES_PER_ACRE} (exactly ${SQUARE_METERS_PER_ACRE} ÷ ${SQUARE_METERS_PER_HECTARE}).`,
      `Example: convert 21 acres to hectares. 21 × ${HECTARES_PER_ACRE} ≈ ${formatArea(Number(ac21.toFixed(12)))} ha.`,
      'Entering acres in the calculator performs this reverse conversion automatically.',
    ],
    formula: `Hectares = Acres × ${HECTARES_PER_ACRE}`,
  },
  {
    id: 'conversion-table',
    title: 'Hectares to Acres Conversion Table',
    paragraphs: [
      'Values below use the exact square-meter definitions and are rounded for display.',
    ],
    table: HA_TO_AC_TABLE,
  },
  {
    id: 'related-tools',
    title: 'Other Area Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Acres to Hectares Converter, Ares to Hectares Converter, Gaj to Square Yard Converter, Lot Size to Acres Converter, Area Converter, and other land-area tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const HECTARES_TO_ACRES_FAQS: readonly FAQItem[] = [
  {
    question: 'Is a Hectare Bigger Than an Acre?',
    answer: `Yes. One hectare equals approximately ${formatArea(Number(ACRES_PER_HECTARE.toFixed(6)))} acres. A hectare covers ${SQUARE_METERS_PER_HECTARE} square meters, while an international acre covers ${SQUARE_METERS_PER_ACRE} square meters.`,
  },
  {
    question: 'How Many Hectares Are in 19 Acres?',
    answer: `Hectares = 19 × ${HECTARES_PER_ACRE} ≈ ${formatArea(Number(ac19.toFixed(6)))} ha.`,
  },
  {
    question: 'How Many Hectares Are in a Football Field?',
    answer:
      'It depends on the sport and field dimensions. An American football field including both end zones is roughly 0.535 hectares. Association football (soccer) pitches vary by competition rules and are not a single fixed size.',
  },
  {
    question: 'How Many Acres Are in 5 Hectares?',
    answer: `5 × ${formatArea(Number(ACRES_PER_HECTARE.toFixed(12)))} ≈ ${formatArea(Number(ha5.toFixed(6)))} acres.`,
  },
  {
    question: 'How Do I Convert 100 Acres to Hectares?',
    answer: `Multiply by ${HECTARES_PER_ACRE}. 100 × ${HECTARES_PER_ACRE} = ${formatArea(ac100)} hectares.`,
  },
  {
    question: 'What Is the Difference Between a Hectare and an Acre?',
    answer: `A hectare is a metric area unit equal to ${SQUARE_METERS_PER_HECTARE} square meters. An international acre equals ${SQUARE_METERS_PER_ACRE} square meters and is used in US customary and imperial contexts.`,
  },
];
