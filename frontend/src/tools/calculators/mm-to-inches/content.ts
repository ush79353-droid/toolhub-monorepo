import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatLength,
  inchesToMillimeters,
  millimetersToInches,
  MM_PER_INCH,
} from './calculation';

export const MM_TO_INCHES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'mm to Inches Conversion' },
  { id: 'how-to-convert', label: 'How to Convert Millimeters to Inches' },
  { id: 'how-to-use', label: 'How to Use the mm to Inches Converter' },
  { id: 'formula', label: 'mm to Inches Conversion Formula' },
  { id: 'examples', label: 'Millimeters to Inches Conversion Examples' },
  { id: 'conversion-table', label: 'Millimeters to Inches Conversion Table' },
  { id: 'when-useful', label: 'When Is mm to Inches Conversion Useful?' },
  { id: 'related-tools', label: 'More Length Conversion Tools' },
  { id: 'mm-to-inches-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MM = [1, 2, 5, 10, 20, 25.4, 50, 100, 150, 200, 254, 500, 1000] as const;

export const MM_TO_INCHES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'mm to Inches Conversion',
    paragraphs: [
      'Convert length between millimeters (mm) and inches (in). Millimeters are the metric everyday unit for small distances; inches are common in imperial and US customary measurements.',
      'Useful for engineering, manufacturing, construction, DIY, screen and component dimensions, and product specifications that mix metric and imperial units.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Millimeters to Inches',
    paragraphs: [
      `One international inch is defined as exactly ${MM_PER_INCH} millimeters.`,
      '1. Enter the millimeter measurement.',
      `2. Divide by ${MM_PER_INCH}.`,
      '3. Read the equivalent value in inches.',
      '4. Round only if your application needs fewer decimals.',
      `Example; 20 mm: 20 ÷ ${MM_PER_INCH} ≈ ${formatLength(millimetersToInches(20))} in.`,
    ],
    formula: `1 in = ${MM_PER_INCH} mm\ninches = mm ÷ ${MM_PER_INCH}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mm to Inches Converter',
    paragraphs: [
      '1. Enter a measurement in millimeters.',
      '2. Read the converted value in inches.',
      '3. Alternatively, enter a measurement in inches.',
      '4. Millimeters update automatically.',
      '5. Share or clear the calculator when finished.',
      'Conversion works in both directions without a separate Convert button.',
    ],
  },
  {
    id: 'formula',
    title: 'mm to Inches Conversion Formula',
    paragraphs: [
      `inches = mm ÷ ${MM_PER_INCH}`,
      `mm = inches × ${MM_PER_INCH}`,
      `The factor ${MM_PER_INCH} is exact; do not round it before calculating.`,
    ],
    formula: `inches = mm ÷ ${MM_PER_INCH}\nmm = inches × ${MM_PER_INCH}`,
  },
  {
    id: 'examples',
    title: 'Millimeters to Inches Conversion Examples',
    paragraphs: [
      `2 mm ≈ ${formatLength(millimetersToInches(2))} in.`,
      `10 mm ≈ ${formatLength(millimetersToInches(10))} in.`,
      `20 mm ≈ ${formatLength(millimetersToInches(20))} in.`,
      `50 mm ≈ ${formatLength(millimetersToInches(50))} in.`,
      `100 mm ≈ ${formatLength(millimetersToInches(100))} in.`,
      `150 mm ≈ ${formatLength(millimetersToInches(150))} in.`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'Millimeters to Inches Conversion Table',
    paragraphs: [
      'Common millimeter values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Millimeters (mm)', 'Inches (in)'],
    table: TABLE_MM.map((mm) => [formatLength(mm), formatLength(millimetersToInches(mm))]),
  },
  {
    id: 'when-useful',
    title: 'When Is mm to Inches Conversion Useful?',
    paragraphs: [
      'Typical uses include engineering drawings, mechanical parts, international product specs, renovation measurements, and manufacturing tolerances when metric plans meet imperial tools.',
    ],
  },
  {
    id: 'related-tools',
    title: 'More Length Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, mm to Foot Converter, mm Calculator, Inch Converter, Feet to Inches Calculator, Millimeter Calculator, and Meter Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MM_TO_INCHES_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Millimeters Are in 1.5 Inches?',
    answer: `Exactly ${formatLength(inchesToMillimeters(1.5))} mm: 1.5 × ${MM_PER_INCH} = 38.1 mm.`,
  },
  {
    question: 'Is 2 mm Half an Inch?',
    answer: `No. 2 ÷ ${MM_PER_INCH} ≈ ${formatLength(millimetersToInches(2))} in. Half an inch is exactly ${formatLength(inchesToMillimeters(0.5))} mm.`,
  },
  {
    question: 'How Many Inches Are in 100 mm?',
    answer: `100 ÷ ${MM_PER_INCH} ≈ ${formatLength(millimetersToInches(100))} in.`,
  },
  {
    question: 'How Do I Convert Inches to Millimeters?',
    answer: `Multiply inches by ${MM_PER_INCH}. Example: 4 × ${MM_PER_INCH} = ${formatLength(inchesToMillimeters(4))} mm.`,
  },
  {
    question: 'Is 25.4 mm Exactly One Inch?',
    answer: `Yes. One international inch is defined as exactly ${MM_PER_INCH} millimeters.`,
  },
  {
    question: 'How Many Millimeters Are in 12 Inches?',
    answer: `12 × ${MM_PER_INCH} = ${formatLength(inchesToMillimeters(12))} mm.`,
  },
];
