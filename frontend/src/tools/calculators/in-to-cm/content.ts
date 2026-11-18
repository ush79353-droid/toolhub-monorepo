import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { centimetersToInches, formatLength, inchesToCentimeters } from './calculation';
import { CENTIMETERS_PER_INCH } from './types';

export const IN_TO_CM_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'in to cm Converter' },
  { id: 'definition', label: 'How Many Centimeters Are in an Inch?' },
  { id: 'inches-to-cm', label: 'How Do I Convert in to cm?' },
  { id: 'examples', label: 'Examples of in to cm Conversion' },
  { id: 'cm-to-inches', label: 'How to Convert Centimeters to Inches' },
  { id: 'conversion-table', label: 'Inches to Centimeters Conversion Table' },
  { id: 'related-tools', label: 'Other Length Conversion Related Calculators' },
  { id: 'in-to-cm-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_INCHES = [
  1, 2, 5, 10, 12, 22, 24, 29, 36, 50, 72, 100, 152, 250, 500, 1000,
] as const;

export const IN_TO_CM_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'in to cm Converter',
    paragraphs: [
      'Convert inches to centimeters—and centimeters back to inches—instantly with this free Omega Calculators tool. Both fields stay editable so you can start from whichever unit you measured.',
      'Use it for furniture dimensions, construction take-offs, height conversion, product specifications, engineering checks, clothing sizes, and screen measurements.',
      'The international inch is the source of truth: every centimeter result comes from multiplying inches by exactly 2.54.',
    ],
    formula: `1 in = ${CENTIMETERS_PER_INCH} cm`,
  },
  {
    id: 'definition',
    title: 'How Many Centimeters Are in an Inch?',
    paragraphs: [
      `One international inch equals exactly ${CENTIMETERS_PER_INCH} centimeters.`,
      `One centimeter equals approximately ${formatLength(centimetersToInches(1))} inches (1 ÷ 2.54).`,
      'That exact SI link keeps imperial and metric length conversions deterministic in both directions.',
    ],
    formula: `1 in = ${CENTIMETERS_PER_INCH} cm\n1 cm ≈ ${formatLength(centimetersToInches(1))} in`,
  },
  {
    id: 'inches-to-cm',
    title: 'How Do I Convert in to cm?',
    paragraphs: [
      `Multiply the length in inches by ${CENTIMETERS_PER_INCH}.`,
      `Example — convert 22 inches: 22 × ${CENTIMETERS_PER_INCH} = ${formatLength(inchesToCentimeters(22))}. Therefore 22 inches = 55.88 centimeters.`,
    ],
    formula: `cm = in × ${CENTIMETERS_PER_INCH}`,
  },
  {
    id: 'examples',
    title: 'Examples of in to cm Conversion',
    paragraphs: [
      `Example 1 — convert 29 inches: 29 × ${CENTIMETERS_PER_INCH} = ${formatLength(inchesToCentimeters(29))}. Therefore 29 inches = 73.66 centimeters.`,
      `Example 2 — convert 50 inches: 50 × ${CENTIMETERS_PER_INCH} = ${formatLength(inchesToCentimeters(50))}. Therefore 50 inches = 127 centimeters.`,
      `Example 3 — convert 72 inches: 72 × ${CENTIMETERS_PER_INCH} = ${formatLength(inchesToCentimeters(72))}. Therefore 72 inches = 182.88 centimeters.`,
    ],
  },
  {
    id: 'cm-to-inches',
    title: 'How to Convert Centimeters to Inches',
    paragraphs: [
      `Divide centimeters by ${CENTIMETERS_PER_INCH}.`,
      `Example — convert 100 centimeters: 100 ÷ ${CENTIMETERS_PER_INCH} ≈ ${formatLength(centimetersToInches(100))}. Therefore 100 centimeters ≈ ${formatLength(centimetersToInches(100))} inches.`,
      'Use the centimeters field for reverse conversion; the inches field updates automatically.',
    ],
    formula: `in = cm ÷ ${CENTIMETERS_PER_INCH}`,
  },
  {
    id: 'conversion-table',
    title: 'Inches to Centimeters Conversion Table',
    paragraphs: [
      'Common inch values and their centimeter equivalents, generated from the same conversion engine as the calculator.',
    ],
    tableHeaders: ['Inches', 'Centimeters'],
    table: TABLE_INCHES.map((inches) => [
      formatLength(inches),
      formatLength(inchesToCentimeters(inches)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Length Conversion Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Inch Converter, Inch to Meter Calculator, Inches to Yard Conversion, Feet Converter, Feet to Yards Conversion, Length Converter, Distance Converter, Height Converter, Centimeter Calculator, Metric to Inches Calculator, Millimeter Calculator, and Feet to Miles Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const IN_TO_CM_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 22 Inches to Centimeters?',
    answer: `22 × ${CENTIMETERS_PER_INCH} = ${formatLength(inchesToCentimeters(22))}. Therefore 22 inches = 55.88 centimeters.`,
  },
  {
    question: 'How Many Inches Are in a Centimeter?',
    answer: `One centimeter equals approximately ${formatLength(centimetersToInches(1))} inches (exactly 1 ÷ 2.54).`,
  },
  {
    question: 'How Many Centimeters Are in 10 Inches?',
    answer: `10 × ${CENTIMETERS_PER_INCH} = ${formatLength(inchesToCentimeters(10))}. Therefore 10 inches = 25.4 centimeters.`,
  },
  {
    question: 'How Many Centimeters Are in 72 Inches?',
    answer: `72 × ${CENTIMETERS_PER_INCH} = ${formatLength(inchesToCentimeters(72))}. Therefore 72 inches = 182.88 centimeters.`,
  },
  {
    question: 'How Do I Convert 100 Inches to Centimeters?',
    answer: `100 × ${CENTIMETERS_PER_INCH} = ${formatLength(inchesToCentimeters(100))}. Therefore 100 inches = 254 centimeters.`,
  },
  {
    question: 'Is One Inch Exactly 2.54 Centimeters?',
    answer: `Yes. One international inch is defined as exactly ${CENTIMETERS_PER_INCH} centimeters.`,
  },
  {
    question: 'How Many Inches Are in 50 Centimeters?',
    answer: `50 ÷ ${CENTIMETERS_PER_INCH} ≈ ${formatLength(centimetersToInches(50))}. Therefore 50 centimeters ≈ ${formatLength(centimetersToInches(50))} inches.`,
  },
];
