import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertFeet, formatLength } from './calculation';

export const FEET_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'feet-conversion', label: 'Feet Conversion' },
  { id: 'feet-chart', label: 'Feet Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use the Feet Converter' },
  { id: 'similar-tools', label: 'Similar Converter Tools' },
  { id: 'feet-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  subsections?: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    tableHeaders?: readonly string[];
    table?: readonly string[][];
  }[];
  diagram?: readonly string[];
}

export const FEET_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'feet-conversion',
    title: 'Feet Conversion',
    paragraphs: [
      'The international foot is defined exactly as 0.3048 meters. That exact SI link makes every metric conversion deterministic: 1 ft = 30.48 cm = 304.8 mm = 0.0003048 km.',
      'Within customary US / imperial measure: 1 foot = 12 inches, 1 yard = 3 feet, and 1 mile = 5,280 feet. This converter also offers nautical miles, an IAU nominal solar radius, and light-years (speed of light × Julian year).',
    ],
    formula: '1 ft = 0.3048 m = 12 in = 1/3 yd = 1/5280 mi',
    subsections: [
      {
        id: 'imperial-us-units',
        title: 'Imperial/US Units',
        paragraphs: [
          'Inches, feet, yards, and miles are linked by exact integer ratios. Convert by multiplying or dividing — no approximate factors.',
        ],
        tableHeaders: ['Conversion', 'Formula'],
        table: [
          ['Feet to inches', 'ft × 12'],
          ['Feet to yards', 'ft ÷ 3'],
          ['Feet to miles', 'ft ÷ 5280'],
          ['Inches to feet', 'in ÷ 12'],
          ['Yards to feet', 'yd × 3'],
          ['Miles to feet', 'mi × 5280'],
        ],
      },
      {
        id: 'metric-units',
        title: 'Metric Units',
        paragraphs: [
          'Metric results follow from the exact definition 1 ft = 0.3048 m. Divide meters by 0.3048 to recover feet.',
        ],
        tableHeaders: ['Conversion', 'Formula'],
        table: [
          ['Feet to millimeters', 'ft × 304.8'],
          ['Feet to centimeters', 'ft × 30.48'],
          ['Feet to meters', 'ft × 0.3048'],
          ['Feet to kilometers', 'ft × 0.0003048'],
          ['Meters to feet', 'm ÷ 0.3048'],
        ],
      },
    ],
  },
  {
    id: 'feet-chart',
    title: 'Feet Conversion Chart',
    paragraphs: [
      'A compact view of how inches, feet, yards, and miles nest. Use the calculator fields for exact values; this diagram is a memory aid only.',
    ],
    diagram: [
      'Miles → Yards → Feet → Inches',
      '×1760     ×3      ×12',
      '',
      'Inches → Feet → Yards → Miles',
      '÷12       ÷3      ÷1760',
    ],
    tableHeaders: ['Feet', 'Inches', 'Yards', 'Miles'],
    table: [1, 3, 10, 100, 5280].map((ft) => [
      formatLength(ft),
      formatLength(convertFeet(ft, 'ft', 'in')),
      formatLength(convertFeet(ft, 'ft', 'yd')),
      formatLength(convertFeet(ft, 'ft', 'mi')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Feet Converter',
    paragraphs: [
      '1. Enter a value in the Feet field (Convert Feet group).',
      '2. Matching values appear in Metric, Imperial/US, and Others.',
      '3. Expand or collapse unit groups as needed.',
      '4. Enter a value into any other unit field to convert in reverse.',
      '5. Use Clear All Changes to reset values, or Reload Calculator for a full empty reset.',
    ],
  },
  {
    id: 'similar-tools',
    title: 'Similar Converter Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Meter Converter, Distance Converter, Feet to Centimeter Converter, Meters to Feet Converter, and Feet to Inches Calculator. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const FEET_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Inches to Feet?',
    answer: `Divide inches by 12. Example: 24 in = ${formatLength(convertFeet(24, 'in', 'ft'))} ft.`,
  },
  {
    question: 'How Do I Convert Meters to Feet?',
    answer: `Divide meters by 0.3048. Example: 1 m ≈ ${formatLength(convertFeet(1, 'm', 'ft'))} ft.`,
  },
  {
    question: 'What Is 174 cm in Feet?',
    answer: `174 ÷ 30.48 ≈ ${formatLength(convertFeet(174, 'cm', 'ft'))} ft (about 5 ft 8.5 in). Decimal feet and feet-and-inches notation are different representations of the same length.`,
  },
  {
    question: 'How Do I Convert 15 Feet to Centimeters?',
    answer: `15 × 30.48 = ${formatLength(convertFeet(15, 'ft', 'cm'))}. Therefore 15 feet = ${formatLength(convertFeet(15, 'ft', 'cm'))} centimeters.`,
  },
  {
    question: 'How Many Feet Are in One Mile?',
    answer: 'One international mile equals exactly 5,280 feet.',
  },
  {
    question: 'How Many Feet Are in One Yard?',
    answer: 'One yard equals exactly 3 feet.',
  },
];
