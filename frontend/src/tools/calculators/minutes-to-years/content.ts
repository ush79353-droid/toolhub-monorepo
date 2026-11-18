import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  DAYS_PER_AVERAGE_YEAR,
  formatDuration,
  minutesToYears,
  MINUTES_PER_AVERAGE_YEAR,
  yearsToMinutes,
} from './calculation';

export const M2Y_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'minutes-to-years', label: 'How to Convert Minutes to Years' },
  { id: 'years-to-minutes', label: 'How to Convert Years to Minutes' },
  { id: 'conversion-table', label: 'Minutes to Years Conversion Table' },
  { id: 'minutes-in-a-year', label: 'How Many Minutes Are in a Year?' },
  { id: 'related-tools', label: 'Other Helpful Time Conversion Tools' },
  { id: 'm2y-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MINUTES = [
  1, 60, 1440, 10_080, 43_830, 100_000, 262_980, 525_960, 1_051_920, 2_629_800, 5_259_600,
  26_298_000,
] as const;

function formatTableYears(minutes: number): string {
  const years = minutesToYears(minutes);
  if (Number.isInteger(years) || years === 0.5) return formatDuration(years);
  // Display rounded values for very small or long recurring decimals.
  if (Math.abs(years) < 0.001) return years.toFixed(10).replace(/0+$/, '').replace(/\.$/, '');
  if (Math.abs(years) < 0.1) return years.toFixed(9).replace(/0+$/, '').replace(/\.$/, '');
  return years.toFixed(9).replace(/0+$/, '').replace(/\.$/, '');
}

export const M2Y_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'How to Use the Minutes to Years Converter',
    paragraphs: [
      'The Minutes to Years Conversion tool converts minutes into average years and the reverse, with optional months, weeks, days, hours, seconds, and combined hours/minutes/seconds. It is useful for long-duration calculations, scientific research, project planning, historical time comparisons, lifetime estimates, and time tracking.',
      `This calculator uses an average year of ${DAYS_PER_AVERAGE_YEAR} days (${MINUTES_PER_AVERAGE_YEAR.toLocaleString('en-US')} minutes). Calendar years have 365 or 366 days; 365.25 days is a duration convention for predictable unit conversion.`,
      '1. Enter a duration in minutes or years.',
      '2. The matching value updates immediately.',
      '3. Expand Other Time Units for months, weeks, days, hours, seconds, and combined HMS.',
      '4. Edit any unit to convert in the other direction.',
      '5. Use Reload calculator or Clear all changes to reset.',
    ],
  },
  {
    id: 'minutes-to-years',
    title: 'How to Convert Minutes to Years',
    paragraphs: [
      `1 average year = ${MINUTES_PER_AVERAGE_YEAR.toLocaleString('en-US')} minutes.`,
      `Years = Minutes ÷ ${MINUTES_PER_AVERAGE_YEAR}.`,
      `Example: 1,000,000 ÷ ${MINUTES_PER_AVERAGE_YEAR} ≈ ${formatTableYears(1_000_000)}.`,
      `Therefore 1,000,000 minutes ≈ ${formatTableYears(1_000_000)} average years.`,
    ],
    formula: `Years = Minutes / ${MINUTES_PER_AVERAGE_YEAR}\n1000000 ÷ ${MINUTES_PER_AVERAGE_YEAR} ≈ ${formatTableYears(1_000_000)}`,
  },
  {
    id: 'years-to-minutes',
    title: 'How to Convert Years to Minutes',
    paragraphs: [
      `Minutes = Years × ${MINUTES_PER_AVERAGE_YEAR}.`,
      `Example: 4 × ${MINUTES_PER_AVERAGE_YEAR} = ${yearsToMinutes(4).toLocaleString('en-US')}.`,
      `Therefore 4 average years = ${yearsToMinutes(4).toLocaleString('en-US')} minutes.`,
      'This uses the average-year convention, not the exact minute count of four specific calendar years.',
    ],
    formula: `Minutes = Years × ${MINUTES_PER_AVERAGE_YEAR}\n4 × ${MINUTES_PER_AVERAGE_YEAR} = ${yearsToMinutes(4)}`,
  },
  {
    id: 'conversion-table',
    title: 'Minutes to Years Conversion Table',
    paragraphs: [
      `Common durations converted with 1 average year = ${MINUTES_PER_AVERAGE_YEAR.toLocaleString('en-US')} minutes. Small year values are rounded for display.`,
    ],
    tableHeaders: ['Minutes', 'Average Years'],
    table: TABLE_MINUTES.map((min) => [min.toLocaleString('en-US'), formatTableYears(min)]),
  },
  {
    id: 'minutes-in-a-year',
    title: 'How Many Minutes Are in a Year?',
    paragraphs: [
      `${DAYS_PER_AVERAGE_YEAR} × 24 × 60 = ${MINUTES_PER_AVERAGE_YEAR.toLocaleString('en-US')}.`,
      `An average Gregorian year in this tool contains ${MINUTES_PER_AVERAGE_YEAR.toLocaleString('en-US')} minutes.`,
      'Common year (365 days): 525,600 minutes.',
      'Leap year (366 days): 527,040 minutes.',
      `Average year used here: ${MINUTES_PER_AVERAGE_YEAR.toLocaleString('en-US')} minutes.`,
    ],
    formula: `${DAYS_PER_AVERAGE_YEAR} × 24 × 60 = ${MINUTES_PER_AVERAGE_YEAR}\nCommon year: 365 × 24 × 60 = 525600\nLeap year: 366 × 24 × 60 = 527040`,
  },
  {
    id: 'related-tools',
    title: 'Other Helpful Time Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Minutes to Days Calculator, Minutes to Seconds Converter, Minute Converter, Hours to Minutes Converter, Hours to Week Conversion, and Milliseconds Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const M2Y_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Minutes Are in a Year?',
    answer: `Using an average year of ${DAYS_PER_AVERAGE_YEAR} days: ${DAYS_PER_AVERAGE_YEAR} × 24 × 60 = ${MINUTES_PER_AVERAGE_YEAR.toLocaleString('en-US')}. There are ${MINUTES_PER_AVERAGE_YEAR.toLocaleString('en-US')} minutes in an average year.`,
  },
  {
    question: 'How Many Minutes Are in a Common Year?',
    answer:
      'A common year contains 365 days. 365 × 24 × 60 = 525,600. Therefore there are 525,600 minutes in a common year.',
  },
  {
    question: 'How Many Minutes Are in a Leap Year?',
    answer:
      'A leap year contains 366 days. 366 × 24 × 60 = 527,040. Therefore there are 527,040 minutes in a leap year.',
  },
  {
    question: 'How Do I Convert 50 Years Into Minutes?',
    answer: `Using the average-year convention: 50 × ${MINUTES_PER_AVERAGE_YEAR.toLocaleString('en-US')} = ${yearsToMinutes(50).toLocaleString('en-US')}. Therefore 50 average years = ${yearsToMinutes(50).toLocaleString('en-US')} minutes.`,
  },
  {
    question: 'How Do I Convert 1 Million Minutes Into Years?',
    answer: `1,000,000 ÷ ${MINUTES_PER_AVERAGE_YEAR.toLocaleString('en-US')} ≈ ${formatTableYears(1_000_000)}. Therefore 1 million minutes is approximately ${formatTableYears(1_000_000)} average years.`,
  },
  {
    question: 'How Many Minutes Are in 10 Years?',
    answer: `10 × ${MINUTES_PER_AVERAGE_YEAR.toLocaleString('en-US')} = ${yearsToMinutes(10).toLocaleString('en-US')}. Therefore 10 average years = ${yearsToMinutes(10).toLocaleString('en-US')} minutes.`,
  },
  {
    question: 'Why Does the Calculator Use 365.25 Days per Year?',
    answer:
      '365.25 days is a commonly used average-year approximation for unit conversion. Individual calendar years have 365 or 366 days, and the long-term Gregorian mean is slightly different (about 365.2425 days). This calculator uses 365.25 consistently so conversions stay predictable.',
  },
];
