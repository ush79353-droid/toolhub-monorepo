import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertLength, formatLength } from './calculation';

export const MM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'mm Calculator' },
  { id: 'what-is-mm', label: 'What Is a Millimeter (mm)?' },
  { id: 'mm-to-m', label: 'How to Convert mm to m' },
  { id: 'mm-to-inches', label: 'How to Convert mm to Inches' },
  { id: 'conversion-table', label: 'Millimeter Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the mm Calculator' },
  { id: 'related-converters', label: 'Other mm-Related Calculators' },
  { id: 'mm-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MM = [1, 5, 10, 25.4, 100, 500, 1000] as const;

export const MM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'mm Calculator',
    paragraphs: [
      'Convert millimeter lengths into centimeters, meters, kilometers, inches, feet, yards, and miles instantly. Enter a value in any supported unit and every other field updates from the same physical length.',
    ],
  },
  {
    id: 'what-is-mm',
    title: 'What Is a Millimeter (mm)?',
    paragraphs: [
      'A millimeter is one-thousandth of a meter. It is commonly used for engineering tolerances, manufacturing dimensions, product specs, construction details, and scientific instruments.',
      'Exactly 1 mm = 0.001 m = 0.1 cm. One international inch equals exactly 25.4 mm.',
    ],
    formula: '1 mm = 0.001 m\n1 cm = 10 mm\n1 m = 1000 mm',
  },
  {
    id: 'mm-to-m',
    title: 'How to Convert mm to m',
    paragraphs: [
      'Because 1 m = 1000 mm, divide millimeters by 1000 to get meters.',
      `Example — 1430 mm = ${formatLength(convertLength(1430, 'mm', 'm'))} m.`,
      'Metric ladder: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm.',
    ],
    formula: 'm = mm ÷ 1000\n1430 mm = 1.43 m\nkm → m → cm → mm',
  },
  {
    id: 'mm-to-inches',
    title: 'How to Convert mm to Inches',
    paragraphs: [
      'One international inch is defined as exactly 25.4 millimeters.',
      `Therefore inches = mm ÷ 25.4. Example — 178 mm ≈ ${formatLength(convertLength(178, 'mm', 'in'))} in.`,
      'Displayed values may use fewer decimals; internal conversion keeps full precision.',
    ],
    formula: '1 in = 25.4 mm\nin = mm ÷ 25.4',
  },
  {
    id: 'conversion-table',
    title: 'Millimeter Conversion Table',
    paragraphs: [
      'Common millimeter values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['mm', 'cm', 'm', 'inches'],
    table: TABLE_MM.map((mm) => [
      formatLength(mm),
      formatLength(convertLength(mm, 'mm', 'cm')),
      formatLength(convertLength(mm, 'mm', 'm')),
      formatLength(convertLength(mm, 'mm', 'in')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mm Calculator',
    paragraphs: [
      '1. Enter a length in millimeters.',
      '2. View the equivalent metric measurements (cm, m, km).',
      '3. Expand Imperial/US for inches, feet, yards, and miles.',
      '4. Enter a value in any other unit to convert in reverse.',
      '5. Share or clear the results when finished.',
      'Fields start empty. Negative lengths are rejected.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Other mm-Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Distance Converter, Height Converter, Inch Converter, Millimeter Calculator, Kilometer Calculator, Micrometer Converter, and metric ↔ inch tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const MM_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is 1000th of a Meter?',
    answer: 'One-thousandth of a meter is one millimeter. Exactly 0.001 m = 1 mm.',
  },
  {
    question: 'What Is 3/8 Inches to mm?',
    answer: `Using the exact inch definition, (3/8) × 25.4 = ${formatLength((3 / 8) * 25.4)} mm. Therefore 3/8 inch equals 9.525 mm.`,
  },
  {
    question: 'How Many Millimeters Are in One Inch?',
    answer: 'Exactly 25.4 millimeters.',
  },
  {
    question: 'How Do I Convert 500 mm to Meters?',
    answer: `Divide by 1000: 500 ÷ 1000 = ${formatLength(convertLength(500, 'mm', 'm'))} m.`,
  },
  {
    question: 'How Do I Convert 250 mm to Centimeters?',
    answer: `Divide by 10: 250 ÷ 10 = ${formatLength(convertLength(250, 'mm', 'cm'))} cm.`,
  },
  {
    question: 'How Many mm Are in One Foot?',
    answer: `Exactly ${formatLength(convertLength(1, 'ft', 'mm'))} mm (1 ft = 304.8 mm).`,
  },
];
