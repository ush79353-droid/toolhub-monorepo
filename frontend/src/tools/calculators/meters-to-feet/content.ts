import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { feetToMeters, formatLength, metersToFeet } from './calculation';
import { METERS_PER_FOOT } from './types';

export const METERS_TO_FEET_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert-meters-to-feet', label: 'How Do I Convert Meters to Feet?' },
  { id: 'conversion-examples', label: 'Examples of Meters to Feet / Feet to Meters Conversion' },
  { id: 'related-length-tools', label: 'Other Length Conversion Related Calculators' },
  { id: 'meters-to-feet-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_METERS = [0.5, 1, 2, 3, 4, 5, 10, 20, 50, 100, 500, 1000] as const;

export const METERS_TO_FEET_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert-meters-to-feet',
    title: 'How Do I Convert Meters to Feet?',
    paragraphs: [
      `The international foot is defined exactly as ${METERS_PER_FOOT} meters. Therefore 1 m = 1 / ${METERS_PER_FOOT} ft ≈ ${formatLength(metersToFeet(1))} ft.`,
      `To convert meters to feet, divide by ${METERS_PER_FOOT}. To convert feet to meters, multiply by ${METERS_PER_FOOT}.`,
      `Example 1: convert 5 meters to feet: Feet = 5 / ${METERS_PER_FOOT} ≈ ${formatLength(metersToFeet(5))} ft.`,
      `Example 2: convert 10 feet to meters: Meters = 10 × ${METERS_PER_FOOT} = ${formatLength(feetToMeters(10))} m.`,
      'Table values below are rounded for display; the calculator uses the exact 0.3048 m per foot factor.',
    ],
    formula: `ft = m / ${METERS_PER_FOOT} · m = ft × ${METERS_PER_FOOT}`,
    tableHeaders: ['Meters (m)', 'Feet (ft)'],
    table: TABLE_METERS.map((m) => [formatLength(m), formatLength(metersToFeet(m))]),
  },
  {
    id: 'conversion-examples',
    title: 'Examples of Meters to Feet / Feet to Meters Conversion',
    paragraphs: [
      `Room length: 4 m → 4 / ${METERS_PER_FOOT} ≈ ${formatLength(metersToFeet(4))} ft (about 13.12 feet).`,
      `Room width: 10 ft → 10 × ${METERS_PER_FOOT} = ${formatLength(feetToMeters(10))} m.`,
      `Building height: 30 m → 30 / ${METERS_PER_FOOT} ≈ ${formatLength(metersToFeet(30))} ft (about 98.43 feet).`,
      `Human height: 1.8 m → 1.8 / ${METERS_PER_FOOT} ≈ ${formatLength(metersToFeet(1.8))} ft. Decimal feet are not the same as feet-and-inches notation; about 5.9055 ft is roughly 5 ft 10.87 in.`,
    ],
  },
  {
    id: 'related-length-tools',
    title: 'Other Length Conversion Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages include Meter Converter, Length Converter, Feet and Inches Calculator, Feet to Inches Calculator, Decimeter to Meter Converter, Angstrom to nm Converter, and Measurement Converter. Only active catalog tools appear as live site links.',
    ],
  },
];

export const METERS_TO_FEET_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Feet Are in a Meter?',
    answer: `One meter is approximately ${formatLength(metersToFeet(1))} feet. Exactly 1 foot = ${METERS_PER_FOOT} meters, so 1 meter = 1 / ${METERS_PER_FOOT} feet.`,
  },
  {
    question: 'How Do I Convert 3 Meters to Feet?',
    answer: `Feet = Meters / ${METERS_PER_FOOT}. 3 / ${METERS_PER_FOOT} ≈ ${formatLength(metersToFeet(3))} feet.`,
  },
  {
    question: 'How Many Meters Are in 1 Foot?',
    answer: `Exactly 1 foot = ${METERS_PER_FOOT} meters.`,
  },
  {
    question: 'How Many Feet Are in 10 Meters?',
    answer: `10 / ${METERS_PER_FOOT} ≈ ${formatLength(metersToFeet(10))} feet.`,
  },
  {
    question: 'How Do I Convert Feet to Meters?',
    answer: `Multiply feet by ${METERS_PER_FOOT}. Example: 20 × ${METERS_PER_FOOT} = ${formatLength(feetToMeters(20))} meters.`,
  },
  {
    question: 'Is 1 Meter Equal to 3 Feet?',
    answer: `No. One meter is approximately ${formatLength(metersToFeet(1))} feet. Three feet equals ${formatLength(feetToMeters(3))} meters.`,
  },
];
