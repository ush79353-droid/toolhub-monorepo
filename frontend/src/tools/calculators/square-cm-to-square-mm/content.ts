import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { SQUARE_MM_PER_SQUARE_CM, formatArea, squareCmToSquareMm, squareMmToSquareCm } from './calculation';

export const CM2_MM2_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Square Centimeters to Square Millimeters Converter' },
  { id: 'how-to-convert', label: 'How to Convert Square Centimeters to Square Millimeters' },
  { id: 'example-500', label: 'How to Convert 500 cm² to mm²' },
  { id: 'conversion-table', label: 'Square Centimeters to Square Millimeters Conversion Table' },
  { id: 'notations', label: 'Common Area Unit Notations' },
  { id: 'related-tools', label: 'Other Area Conversion Tools' },
  { id: 'cm2-mm2-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_CM2 = [0.01, 0.1, 0.5, 1, 2, 5, 10, 25, 50, 100, 500, 1_000] as const;

export const CM2_MM2_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Square Centimeters to Square Millimeters Converter',
    paragraphs: [
      'Convert area measurements from square centimeters (cm²) to square millimeters (mm²) and back. Use it for geometry, engineering, construction, technical drawings, manufacturing, surface measurements, and scientific calculations.',
      `Exact relationship: 1 cm² = ${SQUARE_MM_PER_SQUARE_CM} mm². Converting square units is different from converting linear units — squaring the 10 mm per centimeter factor gives 100.`,
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Square Centimeters to Square Millimeters',
    paragraphs: [
      'Since 1 centimeter equals 10 millimeters, the area conversion factor is the square of 10: 10² = 100.',
      'Therefore: area in mm² = area in cm² × 100.',
      `Example — 8 cm²: 8 × 100 = ${formatArea(squareCmToSquareMm(8))}, so 8 cm² = 800 mm².`,
      'Reverse: area in cm² = area in mm² ÷ 100.',
      `Example — 750 mm²: 750 ÷ 100 = ${formatArea(squareMmToSquareCm(750))}, so 750 mm² = 7.5 cm².`,
    ],
    formula:
      '1 cm = 10 mm\n1 cm² = 10² mm² = 100 mm²\nmm² = cm² × 100\ncm² = mm² ÷ 100\n8 × 100 = 800 mm²\n750 ÷ 100 = 7.5 cm²',
  },
  {
    id: 'example-500',
    title: 'How to Convert 500 cm² to mm²',
    paragraphs: [
      'Start from 1 cm² = 100 mm².',
      'Multiply 500 by 100: 500 × 100 = 50,000.',
      'Therefore 500 cm² = 50,000 mm².',
      'The factor is 100 rather than 10 because area has two dimensions — both length and width scale by 10 millimeters per centimeter.',
    ],
    formula: '1 cm² = 100 mm²\n500 × 100 = 50,000\n500 cm² = 50,000 mm²',
  },
  {
    id: 'conversion-table',
    title: 'Square Centimeters to Square Millimeters Conversion Table',
    paragraphs: [
      'Common cm² values converted with the exact factor 1 cm² = 100 mm². Values come from the same conversion engine used by the calculator.',
    ],
    tableHeaders: ['Square centimeters (cm²)', 'Square millimeters (mm²)'],
    table: TABLE_CM2.map((cm2) => [
      formatArea(cm2),
      squareCmToSquareMm(cm2).toLocaleString('en-US'),
    ]),
  },
  {
    id: 'notations',
    title: 'Common Area Unit Notations',
    paragraphs: [
      'People write this conversion in several equivalent ways: cm² to mm², cm2 to mm2, sq cm to sq mm, square cm to square mm, cm squared to mm squared, and square centimeters to square millimeters.',
      'All of those phrases refer to the same area conversion between square centimeters and square millimeters.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Area Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Area Converter, Acres to Square Feet Converter, Hectares to Acres Converter, Acres to Hectares Converter, Ares to Hectares Converter, Square Kilometers to Acres Conversion, and Cent to Square Meter Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const CM2_MM2_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 1 cm² to mm²?',
    answer:
      'Since 1 cm equals 10 mm, square the conversion factor: 1 cm² = 10² mm². Therefore 1 cm² = 100 mm².',
  },
  {
    question: 'How Many cm² Are in 1 mm²?',
    answer: `Divide 1 by 100: 1 ÷ 100 = ${formatArea(squareMmToSquareCm(1))}. Therefore 1 mm² = 0.01 cm².`,
  },
  {
    question: 'Why Do We Multiply by 100 Instead of 10?',
    answer:
      'Area measures two dimensions: length and width. Because each centimeter contains 10 millimeters, both dimensions are multiplied by 10. 10 × 10 = 100. Therefore the square-unit conversion factor is 100.',
  },
  {
    question: 'How Many mm² Are in 25 cm²?',
    answer: `25 × 100 = ${formatArea(squareCmToSquareMm(25))}. Therefore 25 cm² = 2,500 mm².`,
  },
  {
    question: 'How Do I Convert 2,500 mm² to cm²?',
    answer: `2,500 ÷ 100 = ${formatArea(squareMmToSquareCm(2_500))}. Therefore 2,500 mm² = 25 cm².`,
  },
  {
    question: 'Is 1 cm² Equal to 10 mm²?',
    answer:
      'No. 1 cm equals 10 mm as a length, but 1 cm² = 100 mm² as an area.',
  },
];
