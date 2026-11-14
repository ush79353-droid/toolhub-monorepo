import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertDistance, formatDistance } from './calculation';

export const AU_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-an-au', label: 'What Is an Astronomical Unit?' },
  { id: 'how-au-defined', label: 'How the Astronomical Unit Is Defined' },
  { id: 'au-to-km', label: 'Astronomical Units to Kilometers' },
  { id: 'au-to-miles', label: 'Astronomical Units to Miles' },
  { id: 'au-to-ly', label: 'Astronomical Units to Light-Years' },
  { id: 'au-to-pc', label: 'Astronomical Units to Parsecs' },
  { id: 'light-travel', label: 'Light-Travel Time Across One AU' },
  { id: 'conversion-table', label: 'Astronomical Unit Conversion Table' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'astronomical-unit-faq', label: 'Frequently Asked Questions' },
];

export interface AuTableRow {
  au: string;
  km: string;
  ly: string;
}

export interface AuGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly AuTableRow[];
}

const TABLE_AU = [0.1, 0.5, 1, 2, 5, 10, 100] as const;

function tableRow(au: number): AuTableRow {
  return {
    au: formatDistance(au),
    km: formatDistance(convertDistance(au, 'au', 'km')),
    ly: formatDistance(convertDistance(au, 'au', 'ly')),
  };
}

export const AU_GUIDE_SECTIONS: readonly AuGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This calculator converts astronomical distances among astronomical units (au), meters, kilometers, miles, light-years, parsecs, and light-travel distance units. Enter a value in any field and the others update from one canonical length in meters.',
      'An astronomical unit measures distance—not time—though light-travel time across a given distance can be reported as a derived convenience.',
    ],
  },
  {
    id: 'what-is-an-au',
    title: 'What Is an Astronomical Unit?',
    paragraphs: [
      'An astronomical unit is a standardized length used mainly for solar-system scales. Its official symbol is au. One au equals exactly 149,597,870,700 meters—about the average Earth–Sun distance. Earth’s actual heliocentric distance varies over the year and is not always exactly one au.',
    ],
  },
  {
    id: 'how-au-defined',
    title: 'How the Astronomical Unit Is Defined',
    paragraphs: [
      'In 2012 the International Astronomical Union fixed one astronomical unit at exactly 149,597,870,700 meters. The unit is no longer defined through a measured or dynamically varying Earth–Sun distance.',
    ],
  },
  {
    id: 'au-to-km',
    title: 'Astronomical Units to Kilometers',
    paragraphs: [
      'Divide meters by 1000: kilometers = au × 149,597,870.7. Example: 5 au = 747,989,353.5 km.',
    ],
    formula: 'kilometers = au × 149597870.7',
  },
  {
    id: 'au-to-miles',
    title: 'Astronomical Units to Miles',
    paragraphs: [
      'Convert au to meters, then divide by the exact international mile (1,609.344 m). Example: 1 au ≈ 92,955,807.273 miles.',
    ],
    formula: 'miles = au × 149597870700 / 1609.344',
  },
  {
    id: 'au-to-ly',
    title: 'Astronomical Units to Light-Years',
    paragraphs: [
      'A Julian light-year is c × 31,557,600 s = 9,460,730,472,580,800 m. Divide the au meter length by that constant. Example: 1 au ≈ 1.58125074 × 10⁻⁵ ly; 1 ly ≈ 63,241.077 au. Astronomical units suit solar-system scales; light-years suit interstellar scales.',
    ],
    formula: 'ly = au × 149597870700 / 9460730472580800',
  },
  {
    id: 'au-to-pc',
    title: 'Astronomical Units to Parsecs',
    paragraphs: [
      'A parsec is the distance at which a baseline of one au subtends one arcsecond: 1 pc = (648,000/π) au ≈ 206,264.806 au. Because π appears, decimal meter and light-year equivalents are approximate in floating-point arithmetic. Stellar parallax is a geometric angle relationship, not a stopwatch measurement.',
    ],
    formula: 'pc = au × π / 648000',
    formulaNote: 'Do not treat a rounded parsec factor as an exact SI constant.',
  },
  {
    id: 'light-travel',
    title: 'Light-Travel Time Across One AU',
    paragraphs: [
      'In vacuum, time = distance / c. For one au: 149,597,870,700 ÷ 299,792,458 ≈ 499.005 seconds, about 8 minutes 19 seconds. Light-second, light-minute, light-hour, and light-day are distance units equal to how far light travels in those times.',
    ],
    formula: 't = 149597870700 / 299792458 ≈ 499.004783836 s',
  },
  {
    id: 'conversion-table',
    title: 'Astronomical Unit Conversion Table',
    paragraphs: [
      'Values use the exact IAU au and Julian light-year definitions.',
    ],
    table: TABLE_AU.map(tableRow),
  },
  {
    id: 'practical-applications',
    title: 'Practical Applications',
    paragraphs: [
      'Astronomy, astrophysics, planetary science, solar-system planning, space exploration outreach, classroom distance comparisons, and research notes all mix au with kilometers, miles, light-years, and parsecs. Converting through meters keeps those scales consistent.',
      'This page scales a known distance. It does not model orbits, ephemerides, or cosmological redshift.',
    ],
  },
];

export const AU_FAQS: readonly FAQItem[] = [
  {
    question: 'How many astronomical units are in the Earth–Sun distance?',
    answer:
      'The average Earth–Sun distance is approximately one astronomical unit. The actual distance varies throughout Earth’s orbit.',
  },
  {
    question: 'What is one astronomical unit in kilometers?',
    answer: 'Exactly 149,597,870.7 kilometers.',
  },
  {
    question: 'What is one astronomical unit in meters?',
    answer: 'Exactly 149,597,870,700 meters.',
  },
  {
    question: 'How many miles are in one astronomical unit?',
    answer: 'Approximately 92.956 million international miles.',
  },
  {
    question: 'How do I convert astronomical units to light-years?',
    answer:
      'Multiply the au value by 149,597,870,700 m, then divide by 9,460,730,472,580,800 m (one Julian light-year).',
  },
  {
    question: 'How many astronomical units are in one light-year?',
    answer: 'Approximately 63,241.077 astronomical units.',
  },
  {
    question: 'How many AU are in one parsec?',
    answer: 'Approximately 206,264.806 astronomical units.',
  },
  {
    question: 'Is an astronomical unit larger than a light-year?',
    answer: 'No. A light-year is much larger than one astronomical unit.',
  },
  {
    question: 'How long does light take to travel one AU?',
    answer: 'Approximately 499 seconds, or 8 minutes and 19 seconds, in vacuum.',
  },
  {
    question: 'Is an astronomical unit a measurement of time or distance?',
    answer: 'An astronomical unit measures distance.',
  },
  {
    question: 'Can I convert AU to miles and kilometers?',
    answer:
      'Yes. The calculator supports both conversions as well as meters, light-years, parsecs, and light-travel distance units.',
  },
];
