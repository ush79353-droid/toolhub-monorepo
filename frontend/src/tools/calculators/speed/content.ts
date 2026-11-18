import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SPEED_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-speed', label: 'What Is Speed?' },
  { id: 'units-of-speed', label: 'Units of Speed' },
  { id: 'how-to-convert', label: 'How to Convert Between Units of Speed' },
  { id: 'how-to-use', label: 'How to Use This Speed Converter' },
  { id: 'fts-ms', label: 'ft/s to m/s and m/s to ft/s Conversion' },
  { id: 'ms-mph', label: 'm/s to mph and mph to m/s Conversion' },
  { id: 'kmh-ms', label: 'km/h to m/s and m/s to km/h Conversion' },
  { id: 'mph-fts', label: 'mph to ft/s and ft/s to mph Conversion' },
  { id: 'running-pace', label: 'Running Pace and Speed Conversion' },
  { id: 'speed-conversion-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const SPEED_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-speed',
    title: 'What Is Speed?',
    paragraphs: [
      'Speed is distance traveled per unit time. It is a scalar: it has magnitude but no direction. Velocity is the vector counterpart that includes direction. Average speed is total distance over total time; instantaneous speed is the limit of that ratio over a vanishing time interval.',
      'The SI unit of speed is the meter per second (m/s). Everyday transport often uses km/h or mph; aviation and maritime use knots; physics may use fractions of c. Sports tracking often reports pace (time per distance) instead of speed.',
    ],
    formula: 'v = d / t',
  },
  {
    id: 'units-of-speed',
    title: 'Units of Speed',
    paragraphs: [
      'Meters per second (m/s) is the SI base for this converter. Kilometers per hour (km/h) and miles per hour (mph) dominate road traffic. Feet per second (ft/s) appears in engineering and ballistics. Knots (kn) equal one nautical mile per hour. The speed of light in vacuum (c) is an exact SI defining constant: 299,792,458 m/s.',
      'Running pace (min/km, min/mi, …) is not a linear speed unit — it is the time required to cover a fixed distance, so faster running yields smaller pace numbers.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Between Units of Speed',
    paragraphs: [
      'Convert the source value into meters per second, then into the target unit. Equivalently, multiply by the ratio of the two factors to m/s.',
    ],
    formula: 'v_target = v_source × (f_source / f_target)  ·  f = meters per second per unit',
    tableHeaders: ['Unit', 'Symbol', 'm/s per unit'],
    table: [
      ['Miles per hour', 'mph', '0.44704'],
      ['Feet per second', 'ft/s', '0.3048'],
      ['Kilometers per hour', 'km/h', '1/3.6'],
      ['Meters per second', 'm/s', '1'],
      ['Knot', 'kn', '1852/3600'],
      ['Speed of light', 'c', '299792458'],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use This Speed Converter',
    paragraphs: [
      '1. Expand Imperial/US, Metric, Other, or Run pace.',
      '2. Enter a value in any field.',
      '3. Read converted values across all sections.',
      '4. Use the “other units” selectors for extra imperial, metric, or pace units.',
      '5. Share, reload, or clear as needed.',
    ],
  },
  {
    id: 'fts-ms',
    title: 'ft/s to m/s and m/s to ft/s Conversion',
    paragraphs: [
      'One international foot is exactly 0.3048 m, so 1 ft/s = 0.3048 m/s and 1 m/s ≈ 3.280839895 ft/s. Example: 20 ft/s = 6.096 m/s.',
    ],
    formula: '1 ft/s = 0.3048 m/s · 1 m/s ≈ 3.280839895 ft/s',
  },
  {
    id: 'ms-mph',
    title: 'm/s to mph and mph to m/s Conversion',
    paragraphs: [
      'One mile is exactly 1609.344 m, so 1 mph = 1609.344/3600 = 0.44704 m/s and 1 m/s ≈ 2.2369362921 mph. Example: 10 m/s ≈ 22.369 mph.',
    ],
    formula: '1 mph = 0.44704 m/s · 1 m/s ≈ 2.2369362921 mph',
  },
  {
    id: 'kmh-ms',
    title: 'km/h to m/s and m/s to km/h Conversion',
    paragraphs: [
      'Because 1 km/h = 1000 m / 3600 s, 1 km/h = 1/3.6 m/s and 1 m/s = 3.6 km/h. Example: 100 km/h ≈ 27.7778 m/s; 10 m/s = 36 km/h.',
    ],
    formula: '1 km/h = 1/3.6 m/s · 1 m/s = 3.6 km/h',
  },
  {
    id: 'mph-fts',
    title: 'mph to ft/s and ft/s to mph Conversion',
    paragraphs: [
      'Since 1 mile = 5280 ft and 1 hour = 3600 s, 1 mph = 5280/3600 = 22/15 ft/s and 1 ft/s = 15/22 mph.',
    ],
    formula: '1 mph = 22/15 ft/s · 1 ft/s = 15/22 mph',
  },
  {
    id: 'running-pace',
    title: 'Running Pace and Speed Conversion',
    paragraphs: [
      'Pace is time per distance: t = D / v. At 12 km/h (≈ 3.333 m/s), one kilometer takes 300 s → 5 min/km. At 4 min/km (240 s), speed is 1000/240 ≈ 4.167 m/s → 15 km/h. Faster speeds produce smaller pace values. Zero speed makes pace undefined.',
    ],
    formula: 't = D / v · pace(min/km) = (1000 / v_mps) / 60',
  },
];

export const SPEED_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert mph to km/h?',
    answer: 'Multiply mph by 1.609344 (exactly 1609.344 m / 1000).',
  },
  {
    question: 'How do I convert km/h to mph?',
    answer: 'Divide km/h by 1.609344.',
  },
  {
    question: 'How many km/h is 1 m/s?',
    answer: '1 m/s = 3.6 km/h.',
  },
  {
    question: 'How many m/s is 100 km/h?',
    answer: '100 km/h ≈ 27.7778 m/s (100 / 3.6).',
  },
  {
    question: 'How fast is 60 mph in km/h?',
    answer: '60 mph = 96.56064 km/h.',
  },
  {
    question: 'What is the difference between speed and velocity?',
    answer:
      'Speed is a scalar (magnitude only). Velocity is a vector that also includes direction.',
  },
  {
    question: 'How do I convert knots to km/h?',
    answer: 'Multiply knots by 1.852 (one international nautical mile = 1852 m).',
  },
  {
    question: 'What is the speed of light in km/h?',
    answer:
      'c = 299,792,458 m/s exactly, which equals 1,079,252,848.8 km/h.',
  },
  {
    question: 'How do I convert running pace into speed?',
    answer:
      'Divide the fixed distance by the time to cover it (v = D / t). Example: 5 min/km → 12 km/h.',
  },
  {
    question: 'What is a 5-minute-per-kilometer pace in km/h?',
    answer: '5 min/km = 12 km/h.',
  },
];
