import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatLength,
  kilometersToMillimeters,
  millimetersToKilometers,
  MM_PER_KILOMETER,
} from './calculation';

export const MM_TO_KM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'mm to km Conversion' },
  { id: 'how-to-convert', label: 'How Do I Convert mm to km?' },
  { id: 'how-to-use', label: 'Using This mm to km Conversion Tool' },
  { id: 'formula', label: 'mm to km Conversion Formula' },
  { id: 'examples', label: 'Millimeters to Kilometers Conversion Examples' },
  { id: 'conversion-table', label: 'Millimeters to Kilometers Conversion Table' },
  { id: 'related-tools', label: 'More Length Conversion Tools' },
  { id: 'mm-to-km-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MM = [
  1, 10, 100, 500, 1000, 5000, 10000, 50000, 100000, 250000, 500000, 1_000_000, 2_000_000, 5_000_000,
] as const;

export const MM_TO_KM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'mm to km Conversion',
    paragraphs: [
      'Convert length between millimeters (mm) and kilometers (km). Both are metric units used at very different scales; millimeters for small dimensions, kilometers for distance.',
      'Useful for engineering, construction, surveying, scientific calculations, manufacturing specs, and educational assignments.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert mm to km?',
    paragraphs: [
      '1. Identify the measurement in millimeters.',
      `2. Divide by ${MM_PER_KILOMETER.toLocaleString('en-US')}.`,
      '3. The result is the equivalent measurement in kilometers.',
      `Example: 5000 ÷ ${MM_PER_KILOMETER} = ${formatLength(millimetersToKilometers(5000))} km.`,
      `Reverse: mm = km × ${MM_PER_KILOMETER.toLocaleString('en-US')}.`,
    ],
    formula: `km = mm ÷ ${MM_PER_KILOMETER}\n5000 mm = 0.005 km`,
  },
  {
    id: 'how-to-use',
    title: 'Using This mm to km Conversion Tool',
    paragraphs: [
      '1. Enter the millimeter measurement in the first field.',
      '2. The corresponding kilometer measurement appears automatically.',
      '3. Alternatively, enter kilometers in the second field.',
      '4. The millimeter value updates instantly.',
      '5. Expand Other length conversions for meters, centimeters, inches, and feet.',
      '6. Share or clear the result when finished.',
    ],
  },
  {
    id: 'formula',
    title: 'mm to km Conversion Formula',
    paragraphs: [
      '1 km = 1000 m and 1 m = 1000 mm, so 1 km = 1,000,000 mm exactly.',
      `Therefore 1 mm = ${formatLength(millimetersToKilometers(1))} km.`,
      `km = mm ÷ ${MM_PER_KILOMETER}`,
      `mm = km × ${MM_PER_KILOMETER}`,
    ],
    formula: `1 km = 1000 m = ${MM_PER_KILOMETER} mm\n1 mm = 0.000001 km`,
  },
  {
    id: 'examples',
    title: 'Millimeters to Kilometers Conversion Examples',
    paragraphs: [
      `Example 1: 10 mm: 10 ÷ ${MM_PER_KILOMETER} = ${formatLength(millimetersToKilometers(10))} km.`,
      `Example 2: 2500 mm: 2500 ÷ ${MM_PER_KILOMETER} = ${formatLength(millimetersToKilometers(2500))} km.`,
      `Example 3: 50000 mm: 50000 ÷ ${MM_PER_KILOMETER} = ${formatLength(millimetersToKilometers(50000))} km.`,
      `Example 4: 3 km: 3 × ${MM_PER_KILOMETER} = ${formatLength(kilometersToMillimeters(3))} mm.`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'Millimeters to Kilometers Conversion Table',
    paragraphs: [
      'Common millimeter values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Millimeters (mm)', 'Kilometers (km)'],
    table: TABLE_MM.map((mm) => [formatLength(mm), formatLength(millimetersToKilometers(mm))]),
  },
  {
    id: 'related-tools',
    title: 'More Length Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Kilometer Calculator, Millimeter Calculator, Meter Converter, mm to Inches Conversion, mm to Foot Converter, and Kilometer to Meter Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MM_TO_KM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Kilometers Are in 10 Millimeters?',
    answer: `10 ÷ ${MM_PER_KILOMETER} = ${formatLength(millimetersToKilometers(10))} km.`,
  },
  {
    question: 'Is 1 km Equal to 1000 mm?',
    answer: `No. One kilometer equals ${MM_PER_KILOMETER.toLocaleString('en-US')} millimeters: 1 km = 1000 m = ${MM_PER_KILOMETER} mm.`,
  },
  {
    question: 'How Many Kilometers Are in 1000 mm?',
    answer: `1000 ÷ ${MM_PER_KILOMETER} = ${formatLength(millimetersToKilometers(1000))} km.`,
  },
  {
    question: 'How Do I Convert Kilometers to Millimeters?',
    answer: `Multiply kilometers by ${MM_PER_KILOMETER.toLocaleString('en-US')}. Example: 2.5 × ${MM_PER_KILOMETER} = ${formatLength(kilometersToMillimeters(2.5))} mm.`,
  },
  {
    question: 'How Many Millimeters Are in 0.5 km?',
    answer: `0.5 × ${MM_PER_KILOMETER} = ${formatLength(kilometersToMillimeters(0.5))} mm.`,
  },
  {
    question: 'Why Do We Divide Millimeters by 1,000,000?',
    answer:
      'Because one kilometer contains 1,000 meters, and each meter contains 1,000 millimeters. Multiplying these gives 1,000,000 millimeters per kilometer.',
  },
];
