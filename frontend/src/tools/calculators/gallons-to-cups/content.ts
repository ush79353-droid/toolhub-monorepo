import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { cupsToGallons, formatVolume, gallonsToCups } from './calculation';
import { CUPS_PER_US_GALLON } from './types';

export const GAL_TO_CUPS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'gallons-to-cups-conversion', label: 'Gallons to Cups Conversion' },
  { id: 'half-gallon', label: 'How Many Cups Are in a Half-Gallon?' },
  { id: 'how-to-convert', label: 'How to Convert Gallons to Cups' },
  { id: 'related-tools', label: 'Other Similar Tools' },
  { id: 'gal-to-cups-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_GALLONS = [0.125, 0.25, 0.5, 0.75, 1, 2, 3, 4, 5, 10] as const;

export const GAL_TO_CUPS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'gallons-to-cups-conversion',
    title: 'Gallons to Cups Conversion',
    paragraphs: [
      'This converter turns US liquid gallons into US customary cups — and back — instantly. Cooking, baking, beverage prep, and liquid measurement often need both units.',
      `Exact relationship: 1 US liquid gallon = ${CUPS_PER_US_GALLON} US customary cups, so 1 US cup = 1/${CUPS_PER_US_GALLON} US gallon.`,
      `Multiply gallons by ${CUPS_PER_US_GALLON} to get cups. Divide cups by ${CUPS_PER_US_GALLON} to get gallons. The calculator uses US customary cups (236.5882365 mL), not 250 mL metric cups, and US liquid gallons, not UK imperial gallons.`,
    ],
    formula: `1 US gal = ${CUPS_PER_US_GALLON} US cups · Cups = Gallons × ${CUPS_PER_US_GALLON}`,
    tableHeaders: ['US gallons', 'US cups'],
    table: TABLE_GALLONS.map((g) => [formatVolume(g), formatVolume(gallonsToCups(g))]),
  },
  {
    id: 'half-gallon',
    title: 'How Many Cups Are in a Half-Gallon?',
    paragraphs: [
      `Half a US liquid gallon: 0.5 × ${CUPS_PER_US_GALLON} = ${formatVolume(gallonsToCups(0.5))}. Therefore half a gallon equals 8 US cups.`,
      `Other fractions: quarter gallon = ${formatVolume(gallonsToCups(0.25))} cups; three-quarter gallon = ${formatVolume(gallonsToCups(0.75))} cups; one gallon = ${formatVolume(gallonsToCups(1))} cups.`,
      'These fractions appear often in recipes, water containers, and beverage servings.',
    ],
    formula: `0.5 × ${CUPS_PER_US_GALLON} = ${formatVolume(gallonsToCups(0.5))} cups`,
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Gallons to Cups',
    paragraphs: [
      `1. Enter the amount in US gallons. 2. Multiply by ${CUPS_PER_US_GALLON}. 3. Read the equivalent US cups.`,
      `Example: 2.5 × ${CUPS_PER_US_GALLON} = ${formatVolume(gallonsToCups(2.5))}. Therefore 2.5 US gallons = 40 US cups.`,
      `Reverse: Gallons = Cups ÷ ${CUPS_PER_US_GALLON}. Example: 12 ÷ ${CUPS_PER_US_GALLON} = ${formatVolume(cupsToGallons(12))}. Therefore 12 US cups = 0.75 US gallons.`,
    ],
    formula: `Cups = Gallons × ${CUPS_PER_US_GALLON} · Gallons = Cups ÷ ${CUPS_PER_US_GALLON}`,
  },
  {
    id: 'related-tools',
    title: 'Other Similar Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Cups to Gallons Converter, Gallons to Cubic Feet Converter, Volume Conversion, Cups to Pints Converter, Cups to Quarts Converter, Cups to Oz Converter, and Gallon Calculator. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const GAL_TO_CUPS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Convert 2 Gallons to Cups?',
    answer: `Multiply 2 by ${CUPS_PER_US_GALLON}: 2 × ${CUPS_PER_US_GALLON} = ${formatVolume(gallonsToCups(2))}. Therefore 2 US gallons = 32 US cups.`,
  },
  {
    question: 'How Many Cups Are in 3 Gallons?',
    answer: `3 × ${CUPS_PER_US_GALLON} = ${formatVolume(gallonsToCups(3))}. Therefore 3 US gallons = 48 US cups.`,
  },
  {
    question: 'How Many Cups Are in a Half-Gallon?',
    answer: `There are ${formatVolume(gallonsToCups(0.5))} US cups in half a US liquid gallon.`,
  },
  {
    question: 'How Many Gallons Are 32 Cups?',
    answer: `32 ÷ ${CUPS_PER_US_GALLON} = ${formatVolume(cupsToGallons(32))}. Therefore 32 US cups = 2 US gallons.`,
  },
  {
    question: 'Are US Cups and Metric Cups the Same?',
    answer:
      'No. A US customary cup equals 236.5882365 mL. A metric cup equals 250 mL. This calculator uses US customary cups.',
  },
  {
    question: 'How Many Cups Are in One UK Gallon?',
    answer:
      'A UK imperial gallon is approximately 19.2152 US customary cups. This calculator’s primary gallon input is a US liquid gallon (16 US cups).',
  },
];
