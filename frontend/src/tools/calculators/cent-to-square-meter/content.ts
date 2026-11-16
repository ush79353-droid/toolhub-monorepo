import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertArea, formatArea } from './calculation';
import { SQUARE_FEET_PER_CENT, SQUARE_METERS_PER_CENT } from './types';

export const CENT_TO_SQUARE_METER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-cent', label: 'What Is a Cent?' },
  { id: 'cent-to-square-meters', label: 'How Do I Convert Cent to Square Meters?' },
  { id: 'cent-to-square-feet', label: 'How Do I Convert Cent to Square Feet?' },
  { id: 'conversion-table', label: 'Cent Conversion Reference Table' },
  { id: 'related-area-tools', label: 'Other Area Conversion Tools' },
  { id: 'cent-to-square-meter-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_CENTS = [1, 2, 3, 5, 10, 20, 25, 50, 75, 100] as const;

export const CENT_TO_SQUARE_METER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-cent',
    title: 'What Is a Cent?',
    paragraphs: [
      'A cent is a land-area unit equal to one-hundredth of an acre (100 cents = 1 acre). It is commonly used for residential plots, agricultural land, and property listings in parts of South Asia, especially southern India.',
      `Using the international acre (4,046.8564224 m² and 43,560 ft²): 1 cent = ${SQUARE_METERS_PER_CENT} m² = ${SQUARE_FEET_PER_CENT} ft².`,
      'Cent measures area, not length. Use this converter to compare plot sizes in cents, square meters, and square feet.',
    ],
    formula: `1 cent = 0.01 acre = ${SQUARE_METERS_PER_CENT} m² = ${SQUARE_FEET_PER_CENT} ft²`,
  },
  {
    id: 'cent-to-square-meters',
    title: 'How Do I Convert Cent to Square Meters?',
    paragraphs: [
      `Formula: m² = cents × ${SQUARE_METERS_PER_CENT}.`,
      `Example — convert 5 cents: 5 × ${SQUARE_METERS_PER_CENT} = ${formatArea(convertArea(5, 'cent', 'm2'))}. Therefore 5 cents = ${formatArea(convertArea(5, 'cent', 'm2'))} m².`,
      `Reverse: cents = m² ÷ ${SQUARE_METERS_PER_CENT}. Example: a ${formatArea(100)} m² patio is about ${formatArea(convertArea(100, 'm2', 'cent'))} cents.`,
    ],
    formula: `m² = cent × ${SQUARE_METERS_PER_CENT}  ·  cent = m² ÷ ${SQUARE_METERS_PER_CENT}`,
  },
  {
    id: 'cent-to-square-feet',
    title: 'How Do I Convert Cent to Square Feet?',
    paragraphs: [
      `Formula: ft² = cents × ${SQUARE_FEET_PER_CENT}.`,
      `Example — convert 5 cents: 5 × ${SQUARE_FEET_PER_CENT} = ${formatArea(convertArea(5, 'cent', 'ft2'))}. Therefore 5 cents = ${formatArea(convertArea(5, 'cent', 'ft2'))} ft².`,
      `Reverse: cents = ft² ÷ ${SQUARE_FEET_PER_CENT}. Square feet are often convenient for floor plans and US-style listings; cents remain common for South Asian land parcels.`,
    ],
    formula: `ft² = cent × ${SQUARE_FEET_PER_CENT}  ·  cent = ft² ÷ ${SQUARE_FEET_PER_CENT}`,
  },
  {
    id: 'conversion-table',
    title: 'Cent Conversion Reference Table',
    paragraphs: [
      'Common plot sizes. Display values are rounded for readability; the calculator uses exact international factors.',
    ],
    tableHeaders: ['Cents', 'Square meters', 'Square feet'],
    table: TABLE_CENTS.map((c) => [
      formatArea(c),
      formatArea(convertArea(c, 'cent', 'm2')),
      formatArea(convertArea(c, 'cent', 'ft2')),
    ]),
  },
  {
    id: 'related-area-tools',
    title: 'Other Area Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages include Acres to Square Feet, Acres to Hectares, Ares to Cent, Lot Size to Acres, and Lot Size to Square Feet. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CENT_TO_SQUARE_METER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Square Meters Are in 100 Cents?',
    answer: `100 cents equals one acre, so 100 × ${SQUARE_METERS_PER_CENT} = ${formatArea(convertArea(100, 'cent', 'm2'))} m².`,
  },
  {
    question: 'How Many Square Feet Are in One Cent?',
    answer: `One cent equals exactly ${SQUARE_FEET_PER_CENT} square feet.`,
  },
  {
    question: 'How Many Cents Are in One Acre?',
    answer: 'There are exactly 100 cents in one acre.',
  },
  {
    question: 'How Do I Convert 10 Cents to Square Meters?',
    answer: `Multiply 10 by ${SQUARE_METERS_PER_CENT}: 10 cents = ${formatArea(convertArea(10, 'cent', 'm2'))} m².`,
  },
  {
    question: 'How Many Square Feet Are in 25 Cents?',
    answer: `25 × ${SQUARE_FEET_PER_CENT} = ${formatArea(convertArea(25, 'cent', 'ft2'))}, so 25 cents = ${formatArea(convertArea(25, 'cent', 'ft2'))} ft².`,
  },
  {
    question: 'Is Cent the Same as Square Meter?',
    answer: `No. Both measure area, but 1 cent is approximately ${formatArea(SQUARE_METERS_PER_CENT)} square meters.`,
  },
];
