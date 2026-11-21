import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { feetToMeters, formatLength, metersToFeet } from './calculation';
import { METERS_PER_FOOT } from './types';

export const FT_TO_M_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How Do I Convert ft to m?' },
  { id: 'conversion-examples', label: 'Examples of ft to m Conversion' },
  { id: 'related-tools', label: 'Other Length Conversion Related Calculators' },
  { id: 'ft-to-m-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_FEET = [1, 2, 3, 5, 6, 10, 20, 100, 300, 1000] as const;

export const FT_TO_M_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How Do I Convert ft to m?',
    paragraphs: [
      'This converter turns lengths between feet (ft) and meters (m) instantly in either direction. Feet are a customary imperial unit; meters are the SI base unit for length. Converting between them is common in construction, height measurement, room dimensions, engineering, and everyday international comparisons.',
      `The international foot is defined as exactly ${METERS_PER_FOOT} meters. Therefore feet to meters is exact multiplication by ${METERS_PER_FOOT}, and meters to feet is exact division by ${METERS_PER_FOOT}.`,
      `One meter is approximately ${formatLength(metersToFeet(1))} feet (1 ÷ ${METERS_PER_FOOT}). Prefer dividing by ${METERS_PER_FOOT} rather than multiplying by a rounded reciprocal such as 3.281.`,
      `Example; convert 10 feet: 10 × ${METERS_PER_FOOT} = ${formatLength(feetToMeters(10))} m. Therefore 10 feet equals exactly 3.048 meters.`,
      `Example; convert 20 meters: 20 ÷ ${METERS_PER_FOOT} ≈ ${formatLength(metersToFeet(20))} ft. Therefore 20 meters is approximately 65.6168 feet.`,
    ],
    formula: `m = ft × ${METERS_PER_FOOT} · ft = m ÷ ${METERS_PER_FOOT}`,
    tableHeaders: ['Feet (ft)', 'Meters (m)'],
    table: TABLE_FEET.map((ft) => [formatLength(ft), formatLength(feetToMeters(ft))]),
  },
  {
    id: 'conversion-examples',
    title: 'Examples of ft to m Conversion',
    paragraphs: [
      `Example 1: measuring a bunk bed: a bunk bed is 2 feet wide. 2 × ${METERS_PER_FOOT} = ${formatLength(feetToMeters(2))} m. The width is exactly 0.6096 meters.`,
      `Example 2: measuring a running track: a distance is 200 meters. 200 ÷ ${METERS_PER_FOOT} ≈ ${formatLength(metersToFeet(200))} ft. The distance is approximately 656.168 feet.`,
    ],
    formula: `2 × ${METERS_PER_FOOT} = ${formatLength(feetToMeters(2))} m · 200 ÷ ${METERS_PER_FOOT} ≈ ${formatLength(metersToFeet(200))} ft`,
  },
  {
    id: 'related-tools',
    title: 'Other Length Conversion Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Distance Converter, Feet Converter, Foot to Centimeter Converter, Feet to Miles Converter, Feet to Yards Conversion, Meter Converter, cm to m Converter, and Inches Converter. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const FT_TO_M_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 300 ft to Meters?',
    answer: `Multiply feet by ${METERS_PER_FOOT}: 300 × ${METERS_PER_FOOT} = ${formatLength(feetToMeters(300))}. Therefore 300 feet equals exactly 91.44 meters.`,
  },
  {
    question: 'How Many Meters Are in 6 Feet?',
    answer: `6 × ${METERS_PER_FOOT} = ${formatLength(feetToMeters(6))}. Therefore 6 feet equals exactly 1.8288 meters.`,
  },
  {
    question: 'How Many Feet Are in One Meter?',
    answer: `One meter is approximately ${formatLength(metersToFeet(1))} feet: 1 ÷ ${METERS_PER_FOOT} ≈ 3.28084.`,
  },
  {
    question: 'Is the Feet-to-Meters Conversion Factor Exact?',
    answer: `Yes. The international foot is defined as exactly ${METERS_PER_FOOT} meters. Converting feet to meters with this factor is exact, subject to the precision of the numerical input and calculation.`,
  },
];
