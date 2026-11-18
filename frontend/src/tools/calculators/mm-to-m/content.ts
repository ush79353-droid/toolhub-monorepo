import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatLength,
  metersToMillimeters,
  millimetersToMeters,
  MM_PER_METER,
} from './calculation';

export const MM_TO_M_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'mm to m Conversion' },
  { id: 'how-to-convert', label: 'How Do I Convert mm to m?' },
  { id: 'examples', label: 'Millimeter to Meter Conversion Examples' },
  { id: 'how-to-use', label: 'How to Use the mm to m Converter' },
  { id: 'conversion-table', label: 'Millimeters to Meters Conversion Table' },
  { id: 'related-tools', label: 'Other Length-Related Converters' },
  { id: 'mm-to-m-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MM = [1, 10, 50, 100, 250, 500, 750, 1000, 1500, 2000, 2500, 5000, 10000, 100000] as const;

export const MM_TO_M_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'mm to m Conversion',
    paragraphs: [
      'Convert length between millimeters (mm) and meters (m). Millimeters suit small dimensions; meters suit longer everyday and engineering lengths.',
      'Useful for construction, manufacturing, furniture, architecture, education, and everyday measurements.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert mm to m?',
    paragraphs: [
      `Exactly 1 mm = ${formatLength(millimetersToMeters(1))} m because 1 m = ${MM_PER_METER} mm.`,
      `To convert millimeters to meters, divide by ${MM_PER_METER}: m = mm ÷ ${MM_PER_METER}.`,
      `To convert meters to millimeters, multiply by ${MM_PER_METER}: mm = m × ${MM_PER_METER}.`,
      `Example: 1910 ÷ ${MM_PER_METER} = ${formatLength(millimetersToMeters(1910))} m.`,
    ],
    formula: `1 mm = 0.001 m\nm = mm ÷ ${MM_PER_METER}\nmm = m × ${MM_PER_METER}\n1910 mm = 1.91 m`,
  },
  {
    id: 'examples',
    title: 'Millimeter to Meter Conversion Examples',
    paragraphs: [
      `Example 1 — 100 mm: 100 ÷ ${MM_PER_METER} = ${formatLength(millimetersToMeters(100))} m.`,
      `Example 2 — 250 mm: 250 ÷ ${MM_PER_METER} = ${formatLength(millimetersToMeters(250))} m.`,
      `Example 3 — 1500 mm: 1500 ÷ ${MM_PER_METER} = ${formatLength(millimetersToMeters(1500))} m.`,
      `Example 4 — 3200 mm: 3200 ÷ ${MM_PER_METER} = ${formatLength(millimetersToMeters(3200))} m.`,
      `Example 5 — 4.5 m: 4.5 × ${MM_PER_METER} = ${formatLength(metersToMillimeters(4.5))} mm.`,
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mm to m Converter',
    paragraphs: [
      '1. Enter a measurement in the millimeter input.',
      '2. The equivalent measurement in meters is calculated immediately.',
      '3. Alternatively, enter a value in the meter input.',
      '4. The millimeter equivalent updates automatically.',
      '5. Expand More length units for centimeters, kilometers, inches, and feet.',
      '6. Share or clear the results when finished.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Millimeters to Meters Conversion Table',
    paragraphs: [
      'Common millimeter values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Millimeters (mm)', 'Meters (m)'],
    table: TABLE_MM.map((mm) => [formatLength(mm), formatLength(millimetersToMeters(mm))]),
  },
  {
    id: 'related-tools',
    title: 'Other Length-Related Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, mm to Inches Conversion, mm to Foot Converter, mm to km Conversion, Meter Converter, Millimeter Calculator, and Kilometer Calculator. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MM_TO_M_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Meters Are in a Millimeter?',
    answer: `There are ${formatLength(millimetersToMeters(1))} meters in one millimeter: 1 ÷ ${MM_PER_METER} = 0.001 m.`,
  },
  {
    question: 'How Do I Convert 100 Millimeters to Meters?',
    answer: `Divide 100 by ${MM_PER_METER}: 100 ÷ ${MM_PER_METER} = ${formatLength(millimetersToMeters(100))} m.`,
  },
  {
    question: 'How Many Meters Are in 2000 Millimeters?',
    answer: `2000 ÷ ${MM_PER_METER} = ${formatLength(millimetersToMeters(2000))} m.`,
  },
  {
    question: 'How Many Millimeters Are in 1 Meter?',
    answer: `One meter contains exactly ${MM_PER_METER} millimeters.`,
  },
  {
    question: 'Is 500 mm Equal to Half a Meter?',
    answer: `Yes. 500 ÷ ${MM_PER_METER} = ${formatLength(millimetersToMeters(500))} m.`,
  },
  {
    question: 'How Do I Convert Meters Back to Millimeters?',
    answer: `Multiply meters by ${MM_PER_METER}. Example: 2.75 × ${MM_PER_METER} = ${formatLength(metersToMillimeters(2.75))} mm.`,
  },
];
