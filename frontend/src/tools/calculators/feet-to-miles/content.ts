import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { feetToMiles, formatLength, milesToFeet } from './calculation';
import { FEET_PER_MILE } from './types';

export const FEET_TO_MILES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How Do I Convert Feet to Miles?' },
  { id: 'conversion-examples', label: 'Examples of Feet to Miles Conversion' },
  { id: 'conversion-table', label: 'Feet to Miles Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the Feet to Miles Converter' },
  { id: 'related-tools', label: 'Other Length Conversion Related Calculators' },
  { id: 'feet-to-miles-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_FEET = [100, 500, 1000, 2640, 5280, 10000, 10560, 15840, 26400, 52800] as const;

export const FEET_TO_MILES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Feet to Miles?',
    paragraphs: [
      `One international mile equals exactly ${FEET_PER_MILE} international feet. Divide feet by ${FEET_PER_MILE} to get miles; multiply miles by ${FEET_PER_MILE} to get feet.`,
      `Example; convert 2,640 feet to miles: 2640 ÷ ${FEET_PER_MILE} = ${formatLength(feetToMiles(2640))}. Therefore 2,640 feet = 0.5 miles.`,
      `Reverse; convert 2.5 miles to feet: 2.5 × ${FEET_PER_MILE} = ${formatLength(milesToFeet(2.5))}. Therefore 2.5 miles = 13,200 feet.`,
      'This converter is useful for road distances, walking and running routes, sports fields, construction layouts, and geographic estimates.',
    ],
    formula: `Miles = Feet ÷ ${FEET_PER_MILE}   ·   Feet = Miles × ${FEET_PER_MILE}`,
  },
  {
    id: 'conversion-examples',
    title: 'Examples of Feet to Miles Conversion',
    paragraphs: [
      `Football field (including end zones): 360 ft ÷ ${FEET_PER_MILE} ≈ ${formatLength(feetToMiles(360))} mi.`,
      `Walking distance: 10,000 ft ÷ ${FEET_PER_MILE} ≈ ${formatLength(feetToMiles(10000))} mi.`,
      `Running distance: 15,840 ft ÷ ${FEET_PER_MILE} = ${formatLength(feetToMiles(15840))} mi (exactly 3 miles).`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'Feet to Miles Conversion Table',
    paragraphs: [
      'Table values are rounded for display. The calculator uses the exact 5,280 ft per mile factor without intermediate rounding.',
    ],
    tableHeaders: ['Feet', 'Miles'],
    table: TABLE_FEET.map((ft) => [formatLength(ft), formatLength(feetToMiles(ft))]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Feet to Miles Converter',
    paragraphs: [
      '1. Enter the distance in feet.',
      '2. The corresponding distance in miles appears automatically.',
      '3. To convert in reverse, enter the distance in miles.',
      '4. The calculator automatically updates the feet field.',
      '5. Use Clear All Changes to reset the values, or Reload Calculator for a full empty reset.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Length Conversion Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Distance Converter, Feet Converter, Meter Converter, Meters to Feet Converter, and Feet to Inches Calculator. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const FEET_TO_MILES_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Feet Are in a Mile?',
    answer: `There are exactly ${FEET_PER_MILE} feet in one international mile. Multiply miles by ${FEET_PER_MILE} to convert to feet.`,
  },
  {
    question: 'How Do I Convert 46,000 Feet to Miles?',
    answer: `Miles = Feet ÷ ${FEET_PER_MILE}. 46000 ÷ ${FEET_PER_MILE} ≈ ${formatLength(feetToMiles(46000))}. Therefore 46,000 feet ≈ ${formatLength(feetToMiles(46000))} miles.`,
  },
  {
    question: 'How Many Miles Is 1,000 Feet?',
    answer: `1000 ÷ ${FEET_PER_MILE} ≈ ${formatLength(feetToMiles(1000))}. Therefore 1,000 feet ≈ ${formatLength(feetToMiles(1000))} miles.`,
  },
  {
    question: 'How Many Feet Are in 2 Miles?',
    answer: `2 × ${FEET_PER_MILE} = ${formatLength(milesToFeet(2))}. Therefore 2 miles = 10,560 feet.`,
  },
  {
    question: 'How Do I Convert Feet to Miles Without a Calculator?',
    answer: `Divide the number of feet by ${FEET_PER_MILE}. Example: 10560 ÷ ${FEET_PER_MILE} = 2 miles.`,
  },
];
