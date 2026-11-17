import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertDistance, formatLength } from './calculation';
import { DISTANCE_METERS_PER_UNIT, type DistanceSource } from './types';

export const DISTANCE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'conversion-table', label: 'Distance Conversion Table' },
  { id: 'conversion-chart', label: 'Distance Conversion Chart' },
  { id: 'inch-meter', label: 'Inch and Meter Definition' },
  { id: 'how-to-use', label: 'How to Use the Distance Converter' },
  { id: 'related-tools', label: 'Other Helpful Tools Beyond the Distance Calculator' },
  { id: 'distance-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_UNITS: readonly DistanceSource[] = [
  'mm',
  'cm',
  'm',
  'km',
  'in',
  'ft',
  'yd',
  'mi',
  'nmi',
];

export const DISTANCE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'conversion-table',
    title: 'Distance Conversion Table',
    paragraphs: [
      'Enter a value in any metric, imperial/US, or additional unit field and the converter updates every other field through meters. The table below lists how many meters equal one unit of each common measure, using standardized international factors.',
    ],
    tableHeaders: ['Unit', 'Meters per unit'],
    table: TABLE_UNITS.map((unit) => [unit, formatLength(DISTANCE_METERS_PER_UNIT[unit])]),
  },
  {
    id: 'conversion-chart',
    title: 'Distance Conversion Chart',
    paragraphs: [
      'Metric prefixes scale by powers of ten: 1 m = 100 cm, 1 km = 1,000 m, and 1 cm = 10 mm.',
      'Imperial relationships are exact for international units: 1 ft = 12 in, 1 yd = 3 ft, and 1 mi = 5,280 ft.',
      `Example: 5 km = ${formatLength(convertDistance(5, 'km', 'm'))} m ≈ ${formatLength(convertDistance(5, 'km', 'mi'))} mi.`,
    ],
    formula: '1 m = 100 cm = 1,000 mm   ·   1 mi = 1.609344 km   ·   1 nmi = 1,852 m',
  },
  {
    id: 'inch-meter',
    title: 'Inch and Meter Definition',
    paragraphs: [
      'The meter is the SI base unit of length. An international inch is exactly 0.0254 m (2.54 cm). One foot is exactly 12 inches, so one meter is approximately 39.3701 inches.',
      'In the SI system the meter is defined by fixing the speed of light in vacuum; the Distance Converter uses the resulting exact meter-based factors for everyday and specialized units.',
    ],
    formula: '1 in = 0.0254 m   ·   1 m ≈ 39.3701 in',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Distance Converter',
    paragraphs: [
      '1. Find the unit that matches your measurement. 2. Type the numeric distance into that field. 3. Read the synchronized values in Metric and Imperial/US. 4. Expand Other distance units for micrometers, nautical miles, astronomical units, and more. 5. Clear or reload to return to empty fields.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Helpful Tools Beyond the Distance Calculator',
    paragraphs: [
      'Related Omega Calculators pages may include Length Converter, Meter Converter, Centimeter Calculator, Meters to Feet Converter, and other length tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const DISTANCE_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Feet Are in One Meter?',
    answer: `One meter is approximately ${formatLength(convertDistance(1, 'm', 'ft'))} feet (1 m ≈ 3.28084 ft).`,
  },
  {
    question: 'How Many Kilometers Are in One Mile?',
    answer: `One international mile equals exactly ${formatLength(convertDistance(1, 'mi', 'km'))} kilometers (1 mi = 1.609344 km).`,
  },
  {
    question: 'How Do I Calculate Distance Conversion?',
    answer:
      'Convert the input into meters using its standardized meters-per-unit factor, then divide by the meters-per-unit factor of the target unit. The Distance Converter performs both steps automatically.',
  },
  {
    question: 'How Many Inches Are in One Foot?',
    answer: `There are exactly ${formatLength(convertDistance(1, 'ft', 'in'))} inches in one foot.`,
  },
  {
    question: 'How Do I Convert Kilometers to Miles?',
    answer: `Divide kilometers by 1.609344, or use the converter. Example: 5 km ≈ ${formatLength(convertDistance(5, 'km', 'mi'))} mi.`,
  },
  {
    question: 'What Is the Difference Between a Mile and a Nautical Mile?',
    answer:
      'An international mile equals 1,609.344 meters. An international nautical mile equals 1,852 meters and is commonly used in marine and air navigation.',
  },
];
