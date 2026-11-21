import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatLength,
  inchesToMeters,
  metersToInches,
} from './calculation';
import { METERS_PER_INCH } from './types';

export const INCH_TO_METER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Inch to Meter Calculator' },
  { id: 'definition', label: 'Inch to Meter Conversion' },
  { id: 'inches-to-meters', label: 'How to Convert Inches to Meters' },
  { id: 'examples', label: 'Examples of Inch to Meter Conversion' },
  { id: 'meters-to-inches', label: 'How to Convert Meters to Inches' },
  { id: 'conversion-table', label: 'Inches to Meters Conversion Table' },
  { id: 'related-tools', label: 'Other Length Conversion Related Calculators' },
  { id: 'inch-to-meter-faq', label: 'FAQs' },
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
  1, 2, 5, 10, 12, 24, 36, 48, 60, 72, 100, 144, 180, 250, 500, 1000,
] as const;

export const INCH_TO_METER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Inch to Meter Calculator',
    paragraphs: [
      'Convert inches to meters, and meters back to inches, instantly with this free Omega Calculators tool. Both primary fields stay editable, and a feet-and-inches row keeps mixed imperial measurements in sync.',
      'Use it for furniture dimensions, construction take-offs, height conversions, product specifications, and engineering checks where customary and SI lengths must match.',
      'The international inch is the source of truth: every meter result comes from multiplying inches by exactly 0.0254.',
    ],
    formula: `1 in = ${METERS_PER_INCH} m`,
  },
  {
    id: 'definition',
    title: 'Inch to Meter Conversion; How Many Meters Are in an Inch?',
    paragraphs: [
      `One international inch equals exactly ${METERS_PER_INCH} meters.`,
      `One meter equals approximately ${formatLength(metersToInches(1))} inches (1 ÷ 0.0254).`,
      'Because the inch definition is exact, reverse conversion simply divides meters by 0.0254, no approximate factor is required in the engine.',
    ],
    formula: `1 in = ${METERS_PER_INCH} m\n1 m ≈ ${formatLength(metersToInches(1))} in`,
  },
  {
    id: 'inches-to-meters',
    title: 'How to Convert Inches to Meters',
    paragraphs: [
      `Multiply the length in inches by ${METERS_PER_INCH}.`,
      `Example; convert 75 inches: 75 × ${METERS_PER_INCH} = ${formatLength(inchesToMeters(75))}. Therefore 75 inches = 1.905 meters.`,
    ],
    formula: `m = in × ${METERS_PER_INCH}`,
  },
  {
    id: 'examples',
    title: 'Examples of Inch to Meter Conversion',
    paragraphs: [
      `Example 1: convert 36 inches: 36 × ${METERS_PER_INCH} = ${formatLength(inchesToMeters(36))}. Therefore 36 inches = 0.9144 meters (exactly 1 yard).`,
      `Example 2: convert 72 inches: 72 × ${METERS_PER_INCH} = ${formatLength(inchesToMeters(72))}. Therefore 72 inches = 1.8288 meters.`,
      `Example 3: convert 100 inches: 100 × ${METERS_PER_INCH} = ${formatLength(inchesToMeters(100))}. Therefore 100 inches = 2.54 meters.`,
    ],
  },
  {
    id: 'meters-to-inches',
    title: 'How to Convert Meters to Inches',
    paragraphs: [
      `Divide meters by ${METERS_PER_INCH}.`,
      `Example; convert 2 meters: 2 ÷ ${METERS_PER_INCH} ≈ ${formatLength(metersToInches(2))}. Therefore 2 meters ≈ ${formatLength(metersToInches(2))} inches.`,
      'Use the meters field for reverse conversion; inches and feet-and-inches update automatically.',
    ],
    formula: `in = m ÷ ${METERS_PER_INCH}`,
  },
  {
    id: 'conversion-table',
    title: 'Inches to Meters Conversion Table',
    paragraphs: [
      'Common inch values and their meter equivalents, generated from the same conversion engine as the calculator.',
    ],
    tableHeaders: ['Inches', 'Meters'],
    table: TABLE_INCHES.map((inches) => [
      formatLength(inches),
      formatLength(inchesToMeters(inches)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Length Conversion Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Inch Converter, Inches to Yard Conversion, Inches to Feet Converter, Feet Converter, Feet to Yards Conversion, Length Converter, Distance Converter, Height Converter, Centimeter Calculator, Meter Converter, Metric to Inches Calculator, and Millimeter Calculator. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const INCH_TO_METER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 2 Meters to Inches?',
    answer: `Divide by ${METERS_PER_INCH}. 2 ÷ ${METERS_PER_INCH} ≈ ${formatLength(metersToInches(2))}. Therefore 2 meters ≈ ${formatLength(metersToInches(2))} inches.`,
  },
  {
    question: 'How Many Inches Are in a Meter?',
    answer: `One meter equals approximately ${formatLength(metersToInches(1))} inches (exactly 1 ÷ 0.0254).`,
  },
  {
    question: 'How Many Meters Are in 10 Inches?',
    answer: `10 × ${METERS_PER_INCH} = ${formatLength(inchesToMeters(10))}. Therefore 10 inches = 0.254 meters.`,
  },
  {
    question: 'How Many Meters Are in 72 Inches?',
    answer: `72 × ${METERS_PER_INCH} = ${formatLength(inchesToMeters(72))}. Therefore 72 inches = 1.8288 meters.`,
  },
  {
    question: 'How Do I Convert 100 Inches to Meters?',
    answer: `100 × ${METERS_PER_INCH} = ${formatLength(inchesToMeters(100))}. Therefore 100 inches = 2.54 meters.`,
  },
  {
    question: 'Is One Inch Exactly 0.0254 Meters?',
    answer: `Yes. One international inch is defined as exactly ${METERS_PER_INCH} meters.`,
  },
  {
    question: 'How Many Inches Are in 1.5 Meters?',
    answer: `1.5 ÷ ${METERS_PER_INCH} ≈ ${formatLength(metersToInches(1.5))}. Therefore 1.5 meters ≈ ${formatLength(metersToInches(1.5))} inches.`,
  },
];
