import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertVolume,
  formatVolume,
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
} from './calculation';

export const GAL_TO_PINTS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-many-gallons-in-pint', label: 'How Many Gallons Are in a Pint?' },
  { id: 'how-to-convert', label: 'How Do I Convert Gallons to Pints?' },
  { id: 'us-vs-uk-gallons', label: 'US Gallons vs UK Gallons' },
  { id: 'related-tools', label: 'Other Similar Tools' },
  { id: 'gal-to-pints-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const usGalToUkPt = convertVolume(1, 'usGal', 'ukPt');
const ukGalToUsPt = convertVolume(1, 'ukGal', 'usPt');
const usGalToUkGal = convertVolume(1, 'usGal', 'ukGal');

export const GAL_TO_PINTS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-many-gallons-in-pint',
    title: 'How Many Gallons Are in a Pint?',
    paragraphs: [
      'Gallons and pints both measure volume. This converter synchronizes US liquid gallons, UK imperial gallons, US liquid pints, and UK imperial pints so you can enter any one and read the others instantly.',
      'Within the US customary system: 1 US gallon = 8 US pints, so 1 US pint = 0.125 US gallons.',
      'Within the UK imperial system: 1 UK gallon = 8 UK pints, so 1 UK pint = 0.125 UK gallons.',
      'These 8× relationships apply only inside the same measurement system. A US pint and a UK pint are different volumes, as are US and UK gallons.',
    ],
    formula: '1 US gal = 8 US pt · 1 UK gal = 8 UK pt',
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Gallons to Pints?',
    paragraphs: [
      '1. Identify whether the quantity uses US or UK gallons. 2. Multiply gallons by 8 to obtain pints in the same system. 3. If converting between US and UK units, convert through liters (or use this calculator). 4. Label the result with the correct unit.',
      'Example A: 3 US gallons → US pints: 3 × 8 = 24. Result: 24 US pints.',
      'Example B: 2 UK gallons → UK pints: 2 × 8 = 16. Result: 16 UK pints.',
      'Example C: 16 US pints → US gallons: 16 ÷ 8 = 2. Result: 2 US gallons.',
      `Cross-system example: 1 US gallon ≈ ${formatVolume(usGalToUkPt)} UK pints. 1 UK gallon ≈ ${formatVolume(ukGalToUsPt)} US pints.`,
    ],
    formula: 'Same-system: Pints = Gallons × 8 · Gallons = Pints ÷ 8',
  },
  {
    id: 'us-vs-uk-gallons',
    title: 'US Gallons vs UK Gallons',
    paragraphs: [
      `1 US liquid gallon = exactly ${LITERS_PER_US_LIQUID_GALLON} liters. 1 UK imperial gallon = exactly ${LITERS_PER_IMPERIAL_GALLON} liters.`,
      'The UK imperial gallon is larger than the US liquid gallon. Never treat them as interchangeable.',
      `1 US gallon ≈ ${formatVolume(usGalToUkGal)} UK gallons. Choosing the wrong system changes cooking, beverage, and tank calculations.`,
    ],
    formula: `1 US gal = ${LITERS_PER_US_LIQUID_GALLON} L · 1 UK gal = ${LITERS_PER_IMPERIAL_GALLON} L`,
    tableHeaders: ['Unit', 'Liters'],
    table: [
      ['1 US liquid gallon', formatVolume(LITERS_PER_US_LIQUID_GALLON)],
      ['1 UK imperial gallon', formatVolume(LITERS_PER_IMPERIAL_GALLON)],
      ['1 US liquid pint', formatVolume(LITERS_PER_US_LIQUID_GALLON / 8)],
      ['1 UK imperial pint', formatVolume(LITERS_PER_IMPERIAL_GALLON / 8)],
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Similar Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Conversion, Gallons to Cups Converter, Gallons to Cubic Feet Converter, Gallons to Grams Conversion, and other liquid-volume tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const GAL_TO_PINTS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Gallons Are in 40 Pints?',
    answer:
      'For US customary units: 40 ÷ 8 = 5. Therefore 40 US pints = 5 US gallons. The same numerical relationship applies between UK pints and UK gallons (40 UK pt = 5 UK gal).',
  },
  {
    question: 'How Many Gallons Are in 50 Pints?',
    answer:
      '50 ÷ 8 = 6.25. Therefore 50 US pints = 6.25 US gallons. For UK imperial pints, the result is 6.25 UK gallons.',
  },
  {
    question: 'How Do I Convert Pints to Half-Gallons?',
    answer:
      'One half-gallon contains 4 pints within the same measurement system. Half gallons = Pints ÷ 4. Example: 8 US pints = 2 US half-gallons.',
  },
  {
    question: 'Are US and UK Pints the Same Size?',
    answer:
      'No. A US liquid pint contains 473.176473 mL, whereas a UK imperial pint contains 568.26125 mL.',
  },
  {
    question: 'How Many Pints Are in 2 Gallons?',
    answer:
      'Within the same measurement system: 2 × 8 = 16. Therefore 2 US gallons equal 16 US pints, and 2 UK gallons equal 16 UK pints.',
  },
];
