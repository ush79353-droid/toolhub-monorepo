import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertLength, formatLength } from './calculation';

export const KM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-kilometer', label: 'What Is a Kilometer?' },
  { id: 'how-to-use', label: 'How to Use Our Kilometer Calculator' },
  { id: 'km-to-other', label: 'Kilometer to Other Units Conversion' },
  { id: 'km-to-miles', label: 'Kilometers to Miles' },
  { id: 'miles-to-km', label: 'Miles to Kilometers' },
  { id: 'conversion-table', label: 'Kilometer Conversion Table' },
  { id: 'related-converters', label: 'Other Length-Related Calculators' },
  { id: 'kilometer-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KM = [1, 2, 5, 10, 20, 50, 100] as const;

export const KM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-kilometer',
    title: 'What Is a Kilometer?',
    paragraphs: [
      'A kilometer is a metric unit of length equal to exactly 1,000 meters. It is widely used to measure road distances, travel distances, and geographic separation.',
      'Exactly 1 km = 1,000 m = 100,000 cm = 1,000,000 mm. One international mile equals exactly 1.609344 kilometers.',
    ],
    formula: '1 km = 1000 m\n1 km = 100000 cm\n1 km = 1000000 mm',
  },
  {
    id: 'how-to-use',
    title: 'How to Use Our Kilometer Calculator',
    paragraphs: [
      '1. Enter the distance into the kilometers field or any other measurement field.',
      '2. The calculator automatically converts it into the remaining units.',
      '3. Edit any other unit field to perform reverse conversion.',
      '4. Use the expandable groups to focus on metric or imperial units.',
      '5. Share or copy the converted result.',
      'Negative distances are rejected. Fields start empty.',
    ],
  },
  {
    id: 'km-to-other',
    title: 'Kilometer to Other Units Conversion',
    paragraphs: [
      `1 km = ${formatLength(convertLength(1, 'km', 'm'))} m = ${formatLength(convertLength(1, 'km', 'cm'))} cm = ${formatLength(convertLength(1, 'km', 'mm'))} mm.`,
      `1 km ≈ ${formatLength(convertLength(1, 'km', 'ft'))} ft ≈ ${formatLength(convertLength(1, 'km', 'in'))} in ≈ ${formatLength(convertLength(1, 'km', 'yd'))} yd ≈ ${formatLength(convertLength(1, 'km', 'mi'))} mi.`,
      `Example — 5 km = ${formatLength(convertLength(5, 'km', 'm'))} m ≈ ${formatLength(convertLength(5, 'km', 'mi'))} mi.`,
    ],
  },
  {
    id: 'km-to-miles',
    title: 'Kilometers to Miles',
    paragraphs: [
      'Divide kilometers by 1.609344 (or multiply by approximately 0.621371).',
      `Example — 10 km ≈ ${formatLength(convertLength(10, 'km', 'mi'))} mi.`,
    ],
    formula: 'miles = kilometers / 1.609344',
  },
  {
    id: 'miles-to-km',
    title: 'Miles to Kilometers',
    paragraphs: [
      'Multiply miles by exactly 1.609344.',
      `Example — 5 mi = ${formatLength(convertLength(5, 'mi', 'km'))} km.`,
    ],
    formula: 'kilometers = miles × 1.609344',
  },
  {
    id: 'conversion-table',
    title: 'Kilometer Conversion Table',
    paragraphs: [
      'Common kilometer values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Kilometers', 'Meters', 'Miles (approx.)'],
    table: TABLE_KM.map((km) => [
      formatLength(km),
      formatLength(convertLength(km, 'km', 'm')),
      formatLength(convertLength(km, 'km', 'mi')),
    ]),
  },
  {
    id: 'related-converters',
    title: 'Other Length-Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Distance Converter, Height Converter, Inch Converter, Meter Converter, Inch to Meter Calculator, Meters to Feet Converter, and Centimeter Calculator. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Kilometers Are in a Mile?',
    answer: `One international mile equals exactly ${formatLength(convertLength(1, 'mi', 'km'))} kilometers.`,
  },
  {
    question: 'What Is 100 Kilometers in Miles?',
    answer: `100 kilometers equals approximately ${formatLength(convertLength(100, 'km', 'mi'))} miles.`,
  },
  {
    question: 'How Many Meters Are in One Kilometer?',
    answer: 'One kilometer contains exactly 1,000 meters.',
  },
  {
    question: 'How Many Feet Are in a Kilometer?',
    answer: `One kilometer equals approximately ${formatLength(convertLength(1, 'km', 'ft'))} feet.`,
  },
  {
    question: 'How Many Inches Are in One Kilometer?',
    answer: `One kilometer equals approximately ${formatLength(convertLength(1, 'km', 'in'))} inches.`,
  },
  {
    question: 'How Do I Convert Kilometers to Miles?',
    answer: 'Divide the number of kilometers by 1.609344.',
  },
  {
    question: 'How Do I Convert Miles to Kilometers?',
    answer: 'Multiply the number of miles by 1.609344.',
  },
  {
    question: 'Is One Kilometer Longer Than One Mile?',
    answer:
      'No. One international mile is approximately 1.609 kilometers, so a mile is longer than a kilometer.',
  },
];
