import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const KNOTS_KPH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-knot', label: 'What Is a Knot?' },
  { id: 'how-to-convert', label: 'How to Convert kph to Knots and Vice Versa' },
  { id: 'how-to-use', label: 'How to Use the Knots to kph Converter' },
  { id: 'knots-vs-kph', label: 'Knots vs. Kilometers per Hour' },
  { id: 'knots-to-kph-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const KNOTS_KPH_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-knot',
    title: 'What Is a Knot?',
    paragraphs: [
      'A knot (kn) is a unit of speed: one international nautical mile per hour. The international nautical mile is defined as exactly 1852 meters, so one knot equals exactly 1.852 kilometers per hour.',
      'Knots are standard in maritime navigation, sailing, aviation, and many marine weather forecasts. Pilots and mariners often report speed and wind in knots because nautical miles align naturally with geographic coordinates (one minute of latitude is approximately one nautical mile).',
    ],
    formula: '1 kn = 1 nmi/h = 1852 m / 3600 s = 1.852 km/h',
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert kph to Knots and Vice Versa',
    paragraphs: [
      'To convert knots to kilometers per hour, multiply by 1.852. To convert kilometers per hour to knots, divide by 1.852.',
      'Example 1: 60 kn × 1.852 = 111.12 km/h. Example 2: 50 km/h ÷ 1.852 ≈ 26.99784 kn. Use knots when charts or instruments speak nautical miles; use km/h when communicating with road or metric-only contexts.',
    ],
    formula: 'km/h = kn × 1.852 · kn = km/h ÷ 1.852',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Knots to kph Converter',
    paragraphs: [
      '1. Enter a speed in knots to calculate km/h, or enter km/h to calculate knots.',
      '2. Results update as you type — no Calculate button required.',
      '3. Expand More conversion options for mph, m/s, and ft/s.',
      '4. Editing any expanded field updates all other speed fields.',
      '5. Use Share Result, Reload Calculator, or Clear All Changes as needed.',
    ],
  },
  {
    id: 'knots-vs-kph',
    title: 'Knots vs. Kilometers per Hour',
    paragraphs: [
      'Both knots and kilometers per hour measure the same physical quantity — speed — with different unit sizes. One knot is larger than one km/h because it is based on the nautical mile (1852 m) rather than the kilometer (1000 m).',
      'Nautical miles remain convenient at sea and in the air because they relate to Earth’s angular geometry. Kilometers per hour remain the everyday metric unit for road traffic and many engineering contexts.',
    ],
    tableHeaders: ['Unit', 'Definition', 'Equals'],
    table: [
      ['Knot (kn)', '1 international nmi per hour', '1.852 km/h'],
      ['Kilometer per hour (km/h)', '1000 m per 3600 s', '≈ 0.539957 kn'],
      ['Statute mile per hour (mph)', '1609.344 m per hour', '≈ 0.868976 kn'],
    ],
  },
];

export const KNOTS_KPH_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert knots to kph?',
    answer: 'Multiply the number of knots by 1.852.',
  },
  {
    question: 'What is 10 knots in kph?',
    answer: '10 knots equals 18.52 km/h.',
  },
  {
    question: 'How fast is 20 knots in kilometers per hour?',
    answer: '20 knots equals 37.04 km/h.',
  },
  {
    question: 'What is 50 knots in km/h?',
    answer: '50 knots equals 92.6 km/h.',
  },
  {
    question: 'How many knots is 100 km/h?',
    answer: '100 km/h equals approximately 53.99568 knots.',
  },
  {
    question: 'Is one knot equal to one nautical mile per hour?',
    answer: 'Yes. One knot equals exactly one international nautical mile per hour.',
  },
  {
    question: 'Are knots faster than kilometers per hour?',
    answer:
      'One knot represents a greater speed than one km/h because 1 knot equals 1.852 km/h.',
  },
  {
    question: 'Why do ships and airplanes use knots?',
    answer:
      'Knots are convenient for navigation because they are based on nautical miles, which relate to Earth’s geographic coordinate system.',
  },
];
