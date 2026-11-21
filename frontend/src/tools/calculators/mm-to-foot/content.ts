import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertLength,
  formatLength,
  millimetersToFeet,
  MM_PER_FOOT,
} from './calculation';

export const MM_TO_FOOT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'mm to Foot Converter' },
  { id: 'how-to-convert', label: 'How Do I Convert mm to Foot?' },
  { id: 'formula', label: 'mm to Foot Conversion Formula' },
  { id: 'example', label: 'mm to Feet Conversion Example' },
  { id: 'conversion-table', label: 'Millimeters to Feet Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the mm to Foot Converter' },
  { id: 'where-used', label: 'Where Is mm to Foot Conversion Used?' },
  { id: 'related-tools', label: 'Other Length-Related Converters' },
  { id: 'mm-to-foot-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MM = [1, 10, 50, 100, 150, 304.8, 500, 1000, 1219.2, 2438.4, 3048] as const;

export const MM_TO_FOOT_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'mm to Foot Converter',
    paragraphs: [
      'Convert length between millimeters (mm) and international feet (ft) instantly. Useful for construction, engineering drawings, manufacturing, DIY projects, and everyday metric ↔ imperial measurement work.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert mm to Foot?',
    paragraphs: [
      `One international foot equals exactly ${MM_PER_FOOT} millimeters.`,
      `Therefore feet = millimeters ÷ ${MM_PER_FOOT}.`,
      `Examples: 150 mm ≈ ${formatLength(millimetersToFeet(150))} ft; 500 mm ≈ ${formatLength(millimetersToFeet(500))} ft; 1000 mm ≈ ${formatLength(millimetersToFeet(1000))} ft.`,
    ],
    formula: `1 ft = ${MM_PER_FOOT} mm\nft = mm ÷ ${MM_PER_FOOT}`,
  },
  {
    id: 'formula',
    title: 'mm to Foot Conversion Formula',
    paragraphs: [
      'Use the exact international foot definition; do not approximate 304.8 before dividing or multiplying.',
      `ft = mm ÷ ${MM_PER_FOOT}`,
      `mm = ft × ${MM_PER_FOOT}`,
    ],
    formula: `ft = mm ÷ ${MM_PER_FOOT}\nmm = ft × ${MM_PER_FOOT}`,
  },
  {
    id: 'example',
    title: 'mm to Feet Conversion Example',
    paragraphs: [
      'A wooden panel measures 2438.4 mm. Convert to feet for an imperial cut list:',
      `2438.4 ÷ ${MM_PER_FOOT} = ${formatLength(millimetersToFeet(2438.4))} ft.`,
      'Accurate conversion helps when metric plans meet imperial tools and lumber sizes.',
    ],
    formula: `2438.4 ÷ ${MM_PER_FOOT} = 8\n2438.4 mm = 8 ft`,
  },
  {
    id: 'conversion-table',
    title: 'Millimeters to Feet Conversion Table',
    paragraphs: [
      'Common millimeter values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Millimeters (mm)', 'Feet (ft)'],
    table: TABLE_MM.map((mm) => [
      formatLength(mm),
      formatLength(convertLength(mm, 'mm', 'ft')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mm to Foot Converter',
    paragraphs: [
      '1. Enter a length in millimeters.',
      '2. Read the equivalent value in feet.',
      '3. Alternatively, enter feet to convert to millimeters.',
      '4. Choose another length unit and edit that field for additional conversions.',
      '5. Share or clear the results when finished.',
    ],
  },
  {
    id: 'where-used',
    title: 'Where Is mm to Foot Conversion Used?',
    paragraphs: [
      'Typical uses include construction measurements, engineering drawings, manufacturing dimensions, furniture and interior design, renovations, international product specs, and everyday length conversions between metric and imperial systems.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Length-Related Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Millimeter Calculator, mm Calculator, Inch Converter, Feet Converter, Meter Converter, Inch to Meter Calculator, and Kilometer Calculator. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MM_TO_FOOT_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 150 mm to Feet?',
    answer: `Divide 150 by ${MM_PER_FOOT}: 150 ÷ ${MM_PER_FOOT} ≈ ${formatLength(millimetersToFeet(150))} ft.`,
  },
  {
    question: 'What Are 100 Millimeters Converted to Feet?',
    answer: `100 ÷ ${MM_PER_FOOT} ≈ ${formatLength(millimetersToFeet(100))} ft.`,
  },
  {
    question: 'How Many Millimeters Are in One Foot?',
    answer: `There are exactly ${MM_PER_FOOT} millimeters in one international foot.`,
  },
  {
    question: 'How Many Feet Are in 1000 mm?',
    answer: `1000 ÷ ${MM_PER_FOOT} ≈ ${formatLength(millimetersToFeet(1000))} ft.`,
  },
  {
    question: 'How Do I Convert Feet Back to Millimeters?',
    answer: `Multiply feet by ${MM_PER_FOOT}. Example: 5 × ${MM_PER_FOOT} = ${formatLength(convertLength(5, 'ft', 'mm'))} mm.`,
  },
  {
    question: 'Is a Foot the Same as 12 Inches?',
    answer:
      'Yes. One international foot is exactly 12 inches, and one inch is exactly 25.4 millimeters.',
  },
];
