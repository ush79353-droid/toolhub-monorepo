import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatLength } from './calculation';
import { convertLength } from './units';

export const CENTIMETER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-centimeter', label: 'What Is a Centimeter?' },
  { id: 'how-to-use', label: 'How to Use Our Centimeter Calculator' },
  { id: 'conversion-table', label: 'Centimeter Conversion Reference Table' },
  { id: 'related-calculators', label: 'Other Centimeter-Related Calculators' },
  { id: 'centimeter-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_CM = [1, 2.54, 5, 10, 15, 20, 30.48, 50, 100] as const;

export const CENTIMETER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-centimeter',
    title: 'What Is a Centimeter?',
    paragraphs: [
      'A centimeter is a metric unit of length equal to one-hundredth of a meter (1 cm = 0.01 m) and ten millimeters (1 cm = 10 mm).',
      'Centimeters are common for small objects, clothing and body measurements, schoolwork, construction drawings, crafting, product dimensions, and everyday length checks.',
      'Relative to inches: 1 cm = 1/2.54 in ≈ 0.3937007874 in, and 1 in = 2.54 cm exactly.',
    ],
    formula: '1 cm = 0.01 m = 10 mm  ·  1 in = 2.54 cm exactly',
  },
  {
    id: 'how-to-use',
    title: 'How to Use Our Centimeter Calculator',
    paragraphs: [
      '1. Enter a centimeter measurement in the primary field. or type into any imperial or metric field.',
      '2. Read inches, feet, yards, and miles in the Imperial/US section.',
      '3. Review millimeters, meters, and kilometers in the Metric section.',
      '4. Use the other-unit selectors for thou, fathom, nautical mile, micrometer, and similar units.',
      '5. Share, reload, or clear when finished.',
      `Example; convert 50 cm to inches: inches = 50 ÷ 2.54 ≈ ${formatLength(convertLength(50, 'cm', 'in'))} in. The same engine handles reverse conversion when you edit inches.`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'Centimeter Conversion Reference Table',
    paragraphs: [
      'Common centimeter anchors with millimeter, inch, and meter equivalents. Display values are rounded for readability; the calculator uses exact factors.',
    ],
    tableHeaders: ['Centimeters', 'Millimeters', 'Inches', 'Meters'],
    table: TABLE_CM.map((cm) => [
      `${formatLength(cm)} cm`,
      `${formatLength(convertLength(cm, 'cm', 'mm'))} mm`,
      `${formatLength(convertLength(cm, 'cm', 'in'))} in`,
      `${formatLength(convertLength(cm, 'cm', 'm'))} m`,
    ]),
  },
  {
    id: 'related-calculators',
    title: 'Other Centimeter-Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages include Metric Converter, Metric to SAE Calculator, Meters to Feet Converter, and CM Height Conversion. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CENTIMETER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Millimeters Are in a Centimeter?',
    answer: 'There are exactly 10 millimeters in 1 centimeter. Example: 15 cm = 150 mm.',
  },
  {
    question: 'How Many Centimeters Are in 10 Inches?',
    answer: 'There are exactly 25.4 centimeters in 10 inches (10 × 2.54 = 25.4 cm).',
  },
  {
    question: 'How Many Centimeters Are in One Foot?',
    answer: 'One foot equals exactly 30.48 centimeters.',
  },
  {
    question: 'How Do I Convert Centimeters to Meters?',
    answer: 'Divide centimeters by 100. Example: 250 cm = 2.5 m.',
  },
  {
    question: 'How Do I Convert Centimeters to Inches?',
    answer: 'Divide centimeters by 2.54. Example: 20 cm ≈ 7.874 in.',
  },
  {
    question: 'Is One Centimeter Equal to Half an Inch?',
    answer:
      'No. One centimeter is approximately 0.3937 inches. Half an inch equals 1.27 centimeters.',
  },
  {
    question: 'What Is the Difference Between Centimeters and Millimeters?',
    answer:
      'Both are metric length units. A centimeter is ten times larger than a millimeter (1 cm = 10 mm).',
  },
];
