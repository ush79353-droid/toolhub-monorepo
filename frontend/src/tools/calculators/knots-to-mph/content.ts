import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertSpeed } from '../speed/calculation';
import { KNOTS_TO_MPH } from './types';

export const KNOTS_MPH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-knot', label: 'What Is a Knot?' },
  { id: 'how-many-mph', label: 'How Many MPH Is One Knot?' },
  { id: 'knots-to-mph-formula', label: 'Knots to MPH Conversion Formula' },
  { id: 'mph-to-knots-formula', label: 'MPH to Knots Conversion Formula' },
  { id: 'multi-unit', label: 'Knots, KM/H, M/S, and FT/S' },
  { id: 'beaufort', label: 'Wind Speed and the Beaufort Scale' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'knots-to-mph-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
  tableNote?: string;
}

function round2(n: number): string {
  return (Math.round(n * 100) / 100).toFixed(2);
}

const KNOTS_MPH_ROWS = [1, 5, 10, 15, 20, 25, 30, 40, 50, 100] as const;

/** Educational Beaufort ranges (knots). MPH/km/h use exact conversion factors, rounded to whole numbers. */
const BEAUFORT_ROWS: readonly {
  force: number;
  description: string;
  knMin: number;
  knMax: number | null;
}[] = [
  { force: 0, description: 'Calm', knMin: 0, knMax: 0 },
  { force: 1, description: 'Light air', knMin: 1, knMax: 3 },
  { force: 2, description: 'Light breeze', knMin: 4, knMax: 6 },
  { force: 3, description: 'Gentle breeze', knMin: 7, knMax: 10 },
  { force: 4, description: 'Moderate breeze', knMin: 11, knMax: 16 },
  { force: 5, description: 'Fresh breeze', knMin: 17, knMax: 21 },
  { force: 6, description: 'Strong breeze', knMin: 22, knMax: 27 },
  { force: 7, description: 'Near gale', knMin: 28, knMax: 33 },
  { force: 8, description: 'Gale', knMin: 34, knMax: 40 },
  { force: 9, description: 'Strong gale', knMin: 41, knMax: 47 },
  { force: 10, description: 'Storm', knMin: 48, knMax: 55 },
  { force: 11, description: 'Violent storm', knMin: 56, knMax: 63 },
  { force: 12, description: 'Hurricane', knMin: 64, knMax: null },
];

function beaufortRange(
  knMin: number,
  knMax: number | null,
  toUnit: 'mph' | 'kmh',
): string {
  const lo = Math.round(convertSpeed(knMin, 'knot', toUnit));
  if (knMax == null) return `≥ ${lo}`;
  if (knMin === knMax) return String(Math.round(convertSpeed(knMin, 'knot', toUnit)));
  const hi = Math.round(convertSpeed(knMax, 'knot', toUnit));
  return `${lo}–${hi}`;
}

export const KNOTS_MPH_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-a-knot',
    title: 'What Is a Knot?',
    paragraphs: [
      'A knot (kn) is a unit of speed equal to one international nautical mile per hour. The international nautical mile is defined as exactly 1,852 meters, so one knot is exactly 1,852 meters per hour.',
      'Mariners, sailors, aviators, and many meteorologists report speed and wind in knots because nautical miles relate cleanly to geographic coordinates: one minute of latitude is approximately one nautical mile. That makes chart work and position reckoning more natural at sea and in the air than statute miles alone.',
    ],
    formula: '1 kn = 1 nmi/h = 1852 m / 3600 s ≈ 1.15078 mph',
  },
  {
    id: 'how-many-mph',
    title: 'How Many MPH Is One Knot?',
    paragraphs: [
      `One knot equals approximately ${round2(KNOTS_TO_MPH)} miles per hour when rounded to two decimal places. The exact factor is 1852 ÷ 1609.344 (international nautical mile over international statute mile).`,
      'The table below lists common knot values and their mile-per-hour equivalents, rounded to two decimals for quick reference. Use the converter above when you need full precision.',
    ],
    tableHeaders: ['Knots', 'MPH'],
    table: KNOTS_MPH_ROWS.map((kn) => [String(kn), round2(convertSpeed(kn, 'knot', 'mph'))]),
  },
  {
    id: 'knots-to-mph-formula',
    title: 'Knots to MPH Conversion Formula',
    paragraphs: [
      'Multiply knots by the exact ratio of the nautical mile to the statute mile:',
      'Worked example: 40 kn × (1852 / 1609.344) ≈ 46.03 mph. Internally this converter uses meters per second as the canonical unit so all five fields stay consistent.',
    ],
    formula: 'mph = knots × (1852 / 1609.344) ≈ knots × 1.150779448',
  },
  {
    id: 'mph-to-knots-formula',
    title: 'MPH to Knots Conversion Formula',
    paragraphs: [
      'To go the other way, multiply miles per hour by the reciprocal factor (or divide by 1.150779448).',
      'Worked example: 60 mph × (1609.344 / 1852) ≈ 52.14 kn. Enter 60 in the mph field above to see knots, km/h, ft/s, and m/s update together.',
    ],
    formula: 'knots = mph × (1609.344 / 1852) ≈ mph × 0.868976242',
  },
  {
    id: 'multi-unit',
    title: 'Knots, KM/H, M/S, and FT/S',
    paragraphs: [
      'Different industries prefer different speed units. Navigation and aviation lean on knots; road traffic often uses mph or km/h; physics and engineering frequently use m/s; some U.S. technical contexts still quote ft/s.',
      'All of these describe the same physical quantity. Converting through meters per second avoids chaining rounded factors and keeps reverse conversions consistent.',
    ],
    tableHeaders: ['Unit', 'Symbol', 'Definition note'],
    table: [
      ['Knot', 'kn', '1 international nmi per hour (1852 m/h)'],
      ['Mile per hour', 'mph', '1 international mile per hour (1609.344 m/h)'],
      ['Kilometer per hour', 'km/h', '1000 m per 3600 s (1 kn = 1.852 km/h)'],
      ['Meter per second', 'm/s', 'SI base speed unit'],
      ['Foot per second', 'ft/s', '0.3048 m/s per ft/s'],
    ],
  },
  {
    id: 'beaufort',
    title: 'Wind Speed and the Beaufort Scale',
    paragraphs: [
      'Marine and aviation weather often report wind in knots so forecasts match nautical charts and instrument conventions. Wind speed shapes sea state: higher forces build steeper waves and more spray.',
      'The Beaufort wind force scale ranks observed conditions from calm (force 0) to hurricane (force 12). It is a descriptive force scale, not a separate linear speed unit; each force maps to an approximate wind-speed range rather than a single exact value.',
      'Ranges below follow a widely used educational Beaufort reference. Knot bounds are authoritative for this table; mph and km/h are converted with the same exact factors as the calculator and rounded to whole numbers for readability.',
    ],
    tableHeaders: ['Force', 'Description', 'Knots', 'MPH (approx.)', 'KM/H (approx.)'],
    table: BEAUFORT_ROWS.map((row) => [
      String(row.force),
      row.description,
      row.knMax == null ? `≥ ${row.knMin}` : row.knMin === row.knMax ? String(row.knMin) : `${row.knMin}–${row.knMax}`,
      beaufortRange(row.knMin, row.knMax, 'mph'),
      beaufortRange(row.knMin, row.knMax, 'kmh'),
    ]),
    tableNote:
      'Rounding: mph and km/h column endpoints are Math.round of exact conversions from the knot bounds. Force 0 is treated as 0 kn.',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Knots to MPH Converter',
    paragraphs: [
      '1. Enter a speed in knots to see miles per hour instantly.',
      '2. Read the matching km/h, ft/s, and m/s values in the other fields.',
      '3. Type in any other field to reverse-convert from that unit.',
      '4. Use Share Result to copy or share the full conversion.',
      '5. Use Reload Calculator or Clear All Changes to reset the panel.',
    ],
  },
  {
    id: 'practical-applications',
    title: 'Practical Applications',
    paragraphs: [
      'Ship navigation and sailing: hull speed, current, and passage planning are commonly discussed in knots.',
      'Commercial aviation: true airspeed and wind components are often reported in knots for consistency with navigation charts.',
      'Weather forecasting and marine wind reports: coastal and offshore bulletins frequently quote wind in knots; converting to mph or km/h helps land-based audiences.',
      'Travel and education: converting between knots and statute miles per hour clarifies how fast a vessel or aircraft is relative to familiar road speeds.',
    ],
  },
];

export const KNOTS_MPH_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert knots to MPH?',
    answer: 'Multiply the speed in knots by approximately 1.15078 (exact factor 1852/1609.344).',
  },
  {
    question: 'How many MPH is 10 knots?',
    answer: '10 knots is approximately 11.51 MPH.',
  },
  {
    question: 'How many MPH is 20 knots?',
    answer: '20 knots is approximately 23.02 MPH.',
  },
  {
    question: 'How fast is 50 knots in MPH?',
    answer: '50 knots is approximately 57.54 MPH.',
  },
  {
    question: 'How do I convert MPH to knots?',
    answer: 'Multiply the speed in MPH by approximately 0.868976.',
  },
  {
    question: 'Is a knot faster than an MPH?',
    answer: 'Yes. One knot is approximately 1.15078 MPH.',
  },
  {
    question: 'Why do ships use knots instead of MPH?',
    answer:
      'Knots are based on nautical miles, which are convenient for marine navigation and geographic coordinates.',
  },
  {
    question: 'How many kilometers per hour is one knot?',
    answer: 'One knot is exactly 1.852 kilometers per hour.',
  },
  {
    question: 'How fast is 12 knots in miles per hour?',
    answer: '12 knots is approximately 13.81 MPH.',
  },
  {
    question: 'Is a knot the same as a nautical mile?',
    answer:
      'No. A nautical mile measures distance, while a knot measures speed: one nautical mile per hour.',
  },
];
