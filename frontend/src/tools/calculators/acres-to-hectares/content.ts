import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { acresToHectares, formatArea, hectaresToAcres } from './calculation';
import { HECTARES_PER_ACRE } from './types';

export const ACRES_TO_HECTARES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-an-acre', label: 'What Is an Acre?' },
  { id: 'what-is-a-hectare', label: 'What Is a Hectare?' },
  { id: 'acres-to-hectares-conversion', label: 'Acres to Hectares Conversion' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'other-area-tools', label: 'Other Surface Area Conversion Tools' },
  { id: 'acres-to-hectares-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_ACRES = [0.5, 1, 2, 5, 10, 20, 50, 100, 500, 1000] as const;

export const ACRES_TO_HECTARES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-an-acre',
    title: 'What Is an Acre?',
    paragraphs: [
      'An acre is a unit of land area used in the imperial and US customary systems. It remains common for farms, ranches, and real-estate listings in countries that still quote land in acres.',
      'One international acre equals exactly 43,560 square feet, 4,840 square yards, and 4,046.8564224 square meters.',
    ],
    formula: '1 acre = 43,560 ft² = 4,046.8564224 m²',
  },
  {
    id: 'what-is-a-hectare',
    title: 'What Is a Hectare?',
    paragraphs: [
      'A hectare is a metric unit of area equal to 10,000 square meters (a 100 m × 100 m square). It also equals 0.01 square kilometers.',
      'Hectares are widely used in agriculture, forestry, surveying, and land administration because they scale neatly with the meter.',
    ],
    formula: '1 hectare = 10,000 m² = 0.01 km²',
  },
  {
    id: 'acres-to-hectares-conversion',
    title: 'Acres to Hectares Conversion',
    paragraphs: [
      `Because 1 acre is 4,046.8564224 m² and 1 hectare is 10,000 m², one acre equals exactly ${HECTARES_PER_ACRE} hectares.`,
      `Example: 15 acres × ${HECTARES_PER_ACRE} = ${formatArea(acresToHectares(15))} ha.`,
      `Reverse: acres = hectares ÷ ${HECTARES_PER_ACRE}. Example: 10 ha ÷ ${HECTARES_PER_ACRE} ≈ ${formatArea(hectaresToAcres(10))} ac.`,
    ],
    formula: `Hectares = Acres × ${HECTARES_PER_ACRE} · Acres = Hectares ÷ ${HECTARES_PER_ACRE}`,
    tableHeaders: ['Acres', 'Hectares'],
    table: TABLE_ACRES.map((ac) => [formatArea(ac), formatArea(acresToHectares(ac))]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Acres to Hectares Converter',
    paragraphs: [
      '1. Enter the land area in acres — hectares update instantly.',
      '2. Or enter hectares to calculate acres.',
      '3. Use Swap Units to reverse the visual field order without changing the values.',
      '4. Share or copy the result when you need it elsewhere.',
      '5. Reload restores the default (10 acres); Clear empties both fields.',
    ],
  },
  {
    id: 'other-area-tools',
    title: 'Other Surface Area Conversion Tools',
    paragraphs: [
      'Depending on your dataset you may also need square meters, square kilometers, square feet, square yards, or square miles. Use Omega Calculators area tools that already exist in the catalog when you need those conversions.',
      'Related pages that may help: Area Converter, Ares to Hectares Converter, Yards to Acres Converter, and Square Kilometers to Acres Converter — when those tools are available on this site.',
    ],
  },
];

export const ACRES_TO_HECTARES_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Hectares Are in 1 Acre?',
    answer: `One acre equals exactly ${HECTARES_PER_ACRE} hectares (Hectares = Acres × ${HECTARES_PER_ACRE}).`,
  },
  {
    question: 'How Do I Convert Acres to Hectares?',
    answer: `Multiply acres by ${HECTARES_PER_ACRE}. Example: 20 × ${HECTARES_PER_ACRE} = ${formatArea(acresToHectares(20))} hectares.`,
  },
  {
    question: 'How Many Hectares Are in 100 Acres?',
    answer: `100 × ${HECTARES_PER_ACRE} = ${formatArea(acresToHectares(100))} hectares.`,
  },
  {
    question: 'How Many Acres Are in 1 Hectare?',
    answer: `Approximately ${formatArea(hectaresToAcres(1))} acres (1 ÷ ${HECTARES_PER_ACRE}).`,
  },
  {
    question: 'How Many Acres Are in 10 Hectares?',
    answer: `Approximately ${formatArea(hectaresToAcres(10))} acres.`,
  },
  {
    question: 'What Is the Difference Between an Acre and a Hectare?',
    answer:
      'Both measure area. The acre comes from imperial/US customary land measure; the hectare is metric (10,000 m²). One hectare is larger than one acre.',
  },
  {
    question: 'Is an Acre Bigger Than a Hectare?',
    answer: `No. One hectare is approximately ${formatArea(hectaresToAcres(1))} acres.`,
  },
  {
    question: 'Can I Convert Decimal Acres to Hectares?',
    answer:
      'Yes. Values such as 1.5, 2.75, or 12.25 acres convert accurately using the same exact factor.',
  },
];
