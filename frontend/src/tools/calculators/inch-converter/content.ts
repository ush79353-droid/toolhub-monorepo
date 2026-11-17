import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertInches, formatLength } from './calculation';
import { METERS_PER_LIGHT_YEAR, METERS_PER_NAUTICAL_MILE, METERS_PER_SOLAR_RADIUS } from './types';

export const INCH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'inch-conversion-table', label: 'Inch Conversion Table' },
  { id: 'inches-to-cm', label: 'How to Convert Inches to Centimeters' },
  { id: 'inches-to-mm', label: 'How to Convert Inches to Millimeters' },
  { id: 'inches-to-feet', label: 'How to Convert Inches to Feet' },
  { id: 'inches-to-yards', label: 'How to Convert Inches to Yards' },
  { id: 'inch-conversion-chart', label: 'Inch Conversion Chart' },
  { id: 'related-tools', label: 'Other Length Converters' },
  { id: 'inch-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  diagram?: readonly string[];
}

export const INCH_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'inch-conversion-table',
    title: 'Inch Conversion Table',
    paragraphs: [
      'The international inch is defined exactly as 0.0254 meters (2.54 centimeters). That SI link makes every metric conversion deterministic.',
      'Within Imperial/US customary measure: 1 foot = 12 inches, 1 yard = 36 inches, and 1 statute mile = 63,360 inches.',
    ],
    formula: '1 in = 0.0254 m = 2.54 cm = 25.4 mm = 1/12 ft = 1/36 yd = 1/63360 mi',
    tableHeaders: ['Unit', 'Equivalent of 1 inch'],
    table: [
      ['Millimeters', '25.4 mm'],
      ['Centimeters', '2.54 cm'],
      ['Meters', '0.0254 m'],
      ['Kilometers', '0.0000254 km'],
      ['Feet', '1/12 ft'],
      ['Yards', '1/36 yd'],
      ['Miles', '1/63,360 mi'],
      [
        'Nautical miles',
        `${formatLength(convertInches(1, 'in', 'nmi'))} nmi (0.0254 ÷ ${METERS_PER_NAUTICAL_MILE})`,
      ],
    ],
  },
  {
    id: 'inches-to-cm',
    title: 'How to Convert Inches to Centimeters',
    paragraphs: [
      'Multiply inches by 2.54. Example: 10 × 2.54 = 25.4 cm.',
    ],
    formula: 'cm = in × 2.54',
  },
  {
    id: 'inches-to-mm',
    title: 'How to Convert Inches to Millimeters',
    paragraphs: [
      'Multiply inches by 25.4. Example: 5 × 25.4 = 127 mm.',
    ],
    formula: 'mm = in × 25.4',
  },
  {
    id: 'inches-to-feet',
    title: 'How to Convert Inches to Feet',
    paragraphs: [
      'Divide inches by 12. Example: 48 ÷ 12 = 4 ft.',
    ],
    formula: 'ft = in ÷ 12',
  },
  {
    id: 'inches-to-yards',
    title: 'How to Convert Inches to Yards',
    paragraphs: [
      'Divide inches by 36. Example: 108 ÷ 36 = 3 yd.',
    ],
    formula: 'yd = in ÷ 36',
  },
  {
    id: 'inch-conversion-chart',
    title: 'Inch Conversion Chart',
    paragraphs: [
      'A compact view of how miles, yards, feet, and inches nest. Use the calculator fields for exact values; this diagram is a memory aid.',
      `Specialized Others fields use 1 nmi = ${METERS_PER_NAUTICAL_MILE} m, IAU nominal solar radius = ${METERS_PER_SOLAR_RADIUS.toLocaleString('en-US')} m, and 1 Julian light-year = ${METERS_PER_LIGHT_YEAR.toLocaleString('en-US')} m.`,
    ],
    diagram: [
      'Miles → Yards → Feet → Inches',
      '      ×1760    ×3      ×12',
      '',
      'Inches → Feet → Yards → Miles',
      '        ÷12     ÷3      ÷1760',
      '',
      '1 mile = 63,360 inches',
    ],
    tableHeaders: ['Inches', 'Feet', 'Yards', 'Centimeters'],
    table: [1, 12, 36, 100, 63360].map((inches) => [
      formatLength(inches),
      formatLength(convertInches(inches, 'in', 'ft')),
      formatLength(convertInches(inches, 'in', 'yd')),
      formatLength(convertInches(inches, 'in', 'cm')),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Length Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Feet Converter, Feet and Inches Calculator, Height Converter, Imperial Calculator, Imperial to Metric Conversion, and Metric converters. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const INCH_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Convert Inches to Centimeters?',
    answer: 'Multiply inches by 2.54. Example: 10 inches = 25.4 cm.',
  },
  {
    question: 'How Do You Convert Inches to Millimeters?',
    answer: 'Multiply inches by 25.4. Example: 8 inches = 203.2 mm.',
  },
  {
    question: 'How Do You Convert Inches to Meters?',
    answer: 'Multiply inches by 0.0254. Example: 100 inches = 2.54 meters.',
  },
  {
    question: 'How Many Inches Are in One Foot?',
    answer: 'There are exactly 12 inches in one foot.',
  },
  {
    question: 'How Many Inches Are in One Yard?',
    answer: 'There are exactly 36 inches in one yard.',
  },
  {
    question: 'How Many Inches Are in One Mile?',
    answer: 'There are exactly 63,360 inches in one statute mile.',
  },
  {
    question: 'How Do You Convert 108 Inches to Yards?',
    answer: 'Divide 108 by 36. Result: 3 yards.',
  },
  {
    question: 'What Is 5 Feet 8 Inches in Centimeters?',
    answer:
      'Convert to inches first: 5 × 12 + 8 = 68 inches. Then 68 × 2.54 = 172.72 centimeters.',
  },
  {
    question: 'Is an Inch an Imperial or Metric Unit?',
    answer:
      'An inch is a unit of length used in the Imperial and US customary measurement systems. Its metric equivalent is exactly 2.54 centimeters.',
  },
];
