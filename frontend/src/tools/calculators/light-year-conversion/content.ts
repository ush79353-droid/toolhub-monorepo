import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertDistance, formatDistance } from './calculation';

export const LIGHT_YEAR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-a-light-year', label: 'What Is a Light-Year?' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'ly-to-miles', label: 'Light-Years to Miles' },
  { id: 'ly-to-kilometers', label: 'Light-Years to Kilometers' },
  { id: 'ly-to-au', label: 'Light-Years to Astronomical Units' },
  { id: 'ly-to-parsecs', label: 'Light-Years to Parsecs' },
  { id: 'conversion-table', label: 'Light-Year Conversion Table' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'light-year-faq', label: 'Frequently Asked Questions' },
];

export interface LightYearTableRow {
  ly: string;
  km: string;
  mi: string;
  au: string;
}

export interface LightYearGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly LightYearTableRow[];
}

const TABLE_LY_VALUES = [0.1, 0.5, 1, 2, 5, 10, 100] as const;

function tableRow(ly: number): LightYearTableRow {
  return {
    ly: formatDistance(ly),
    km: formatDistance(convertDistance(ly, 'ly', 'km')),
    mi: formatDistance(convertDistance(ly, 'ly', 'mi')),
    au: formatDistance(convertDistance(ly, 'ly', 'au')),
  };
}

export const LIGHT_YEAR_GUIDE_SECTIONS: readonly LightYearGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This calculator converts astronomical distances between light-years and common metric, imperial, and astronomical units. Enter a value in light-years, kilometers, miles, or astronomical units (or switch metric, imperial, and astronomical selectors) and the other fields update from one canonical length in meters.',
      'A light-year measures distance—how far light travels in vacuum during one Julian year—not a duration of time.',
    ],
  },
  {
    id: 'what-is-a-light-year',
    title: 'What Is a Light-Year?',
    paragraphs: [
      'By definition used here, one light-year equals the speed of light in vacuum (exactly 299,792,458 m/s) multiplied by one Julian year (365.25 days, or 31,557,600 seconds). That product is exactly 9,460,730,472,580,800 meters.',
      'Astronomers use light-years to describe distances between stars and other objects outside the solar system. The unit is a distance scale, not a clock reading.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Light Year Conversion Calculator',
    paragraphs: [
      'Enter a distance in any of the four fields and choose its unit when a selector is available. The other fields update from the same meter-based measurement. Expand or collapse Metric, Imperial / US, and Astronomical sections as needed. Use Copy results, Share when available, or Reset to clear the form.',
    ],
  },
  {
    id: 'ly-to-miles',
    title: 'How to Convert Light-Years to Miles',
    paragraphs: [
      'Convert light-years to meters, then divide by 1,609.344 (exact international mile). Example: 1 ly × 9,460,730,472,580,800 ÷ 1,609.344 ≈ 5.87862537318 × 10¹² miles.',
    ],
    formula: 'miles = light-years × (9_460_730_472_580_800 / 1609.344)',
  },
  {
    id: 'ly-to-kilometers',
    title: 'How to Convert Light-Years to Kilometers',
    paragraphs: [
      'One light-year equals exactly 9,460,730,472,580.8 kilometers under the Julian-year definition (meters ÷ 1000). Example: 2 ly = 18,921,460,945,161.6 km.',
    ],
    formula: 'kilometers = light-years × 9_460_730_472_580.8',
  },
  {
    id: 'ly-to-au',
    title: 'How to Convert Light-Years to Astronomical Units',
    paragraphs: [
      'An astronomical unit is the conventional solar-system distance scale: exactly 149,597,870,700 meters. Divide the light-year meter length by that constant. Example: 1 ly ≈ 63,241.077 AU.',
    ],
    formula: 'AU = light-years × (9_460_730_472_580_800 / 149_597_870_700)',
  },
  {
    id: 'ly-to-parsecs',
    title: 'Light-Years to Parsecs',
    paragraphs: [
      'A parsec is defined geometrically as (648,000/π) astronomical units. Because π appears in the definition, the meter (and light-year) equivalents are approximate in floating-point arithmetic. One parsec is about 3.26156 light-years.',
    ],
    formula: '1 pc = (648000 / π) AU ≈ 3.26156 ly',
    formulaNote: 'Do not treat a rounded parsec factor as an exact SI constant.',
  },
  {
    id: 'conversion-table',
    title: 'Light-Year Conversion Table',
    paragraphs: [
      'Values use the same Julian-year light-year, exact international mile, and exact AU constants as the calculator.',
    ],
    table: TABLE_LY_VALUES.map(tableRow),
  },
  {
    id: 'practical-applications',
    title: 'Practical Applications',
    paragraphs: [
      'Astronomy outreach, astrophysics homework, space-science writing, and classroom comparisons of interstellar distances all mix light-years with kilometers, miles, AU, and parsecs. Converting through meters keeps those scales consistent.',
      'This page scales a known distance. It does not model cosmology, redshift, or travel time for spacecraft.',
    ],
  },
];

export const LIGHT_YEAR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is one light-year converted to miles?',
    answer:
      'One light-year is approximately 5.8786 trillion international miles (about 5.87862537318 × 10¹² mi).',
  },
  {
    question: 'How many kilometers are in one light-year?',
    answer:
      'One light-year equals exactly 9,460,730,472,580.8 kilometers under the Julian-year definition used here.',
  },
  {
    question: 'Is a light-year a unit of time or distance?',
    answer: 'A light-year measures distance, not time.',
  },
  {
    question: 'Can we travel faster than the speed of light?',
    answer:
      'According to current established physics, objects with nonzero rest mass cannot be accelerated to or beyond the speed of light in a vacuum.',
  },
  {
    question: 'How do I convert light-years to meters?',
    answer: 'Multiply the number of light-years by 9,460,730,472,580,800.',
  },
  {
    question: 'How many astronomical units are in one light-year?',
    answer: 'Approximately 63,241.077 astronomical units.',
  },
  {
    question: 'How many light-years are in one parsec?',
    answer: 'Approximately 3.26156 light-years.',
  },
  {
    question: 'Can I enter decimal light-year measurements?',
    answer: 'Yes. The converter supports decimal measurements and scientific notation.',
  },
];
