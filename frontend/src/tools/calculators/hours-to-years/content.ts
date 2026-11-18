import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatDuration,
  hoursToYears,
  tableRowForHours,
  yearsToHours,
} from './calculation';
import { DAYS_PER_GREGORIAN_YEAR, HOURS_PER_GREGORIAN_YEAR } from './types';

export const HOURS_TO_YEARS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert-hours-to-years', label: 'How Do I Convert Hours to Years?' },
  { id: 'how-calculator-works', label: 'How Does the Calculator Work?' },
  { id: 'how-to-convert-years-to-hours', label: 'How Do I Convert Years to Hours?' },
  { id: 'conversion-table', label: 'Hours to Years Conversion Table' },
  { id: 'related-tools', label: 'Other Similar Calculators' },
  { id: 'hours-to-years-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

/** Featured conversion-table hours from the task brief. */
export const FEATURED_TABLE_HOURS = [
  24, 168, 720, 1000, 2000, 4000, 5000, 8000, HOURS_PER_GREGORIAN_YEAR, 10_000, 20_000, 50_000,
  100_000,
] as const;

export const FEATURED_CONVERSION_ROWS = FEATURED_TABLE_HOURS.map(tableRowForHours);

export const HOURS_TO_YEARS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert-hours-to-years',
    title: 'How Do I Convert Hours to Years?',
    paragraphs: [
      `One average Gregorian year contains ${DAYS_PER_GREGORIAN_YEAR} days. Each day contains 24 hours, so ${DAYS_PER_GREGORIAN_YEAR} × 24 = ${HOURS_PER_GREGORIAN_YEAR} hours.`,
      `To convert hours to years, divide by ${HOURS_PER_GREGORIAN_YEAR}. Example: 50,000 ÷ ${HOURS_PER_GREGORIAN_YEAR} ≈ ${formatDuration(Number(hoursToYears(50_000).toFixed(6)))} average Gregorian years.`,
      'This is an average-duration conversion, not a calendar-date calculator. Common years have 8,760 hours and leap years have 8,784 hours.',
    ],
    formula: `Years = Hours ÷ ${HOURS_PER_GREGORIAN_YEAR}`,
  },
  {
    id: 'how-calculator-works',
    title: 'How Does the Hours to Years Calculator Work?',
    paragraphs: [
      '1. Enter hours into Time in hours — years update instantly.',
      '2. Edit Time in years to convert hours in reverse.',
      '3. Expand Other time units for months, weeks, days, minutes, seconds, and compound hours/minutes/seconds.',
      '4. Years and months are labeled as average Gregorian durations (365.2425-day year), not exact calendar spans.',
    ],
  },
  {
    id: 'how-to-convert-years-to-hours',
    title: 'How Do I Convert Years to Hours?',
    paragraphs: [
      `Multiply average Gregorian years by ${HOURS_PER_GREGORIAN_YEAR}. Example: 5 × ${HOURS_PER_GREGORIAN_YEAR} = ${formatDuration(yearsToHours(5))} hours.`,
      `Two years equal ${formatDuration(yearsToHours(2))} hours; twelve average months equal one average year.`,
    ],
    formula: `Hours = Years × ${HOURS_PER_GREGORIAN_YEAR}`,
  },
  {
    id: 'conversion-table',
    title: 'Hours to Years Conversion Table',
    paragraphs: [
      `Values use the shared Omega Calculators factor of ${HOURS_PER_GREGORIAN_YEAR} hours per average Gregorian year.`,
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Similar Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Hour Converter, Hours to Week Conversion, Hours to Days Calculator, Days to Years Calculator, and Weeks to Years Converter. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const HOURS_TO_YEARS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Years Are 50,000 Hours?',
    answer: `50,000 ÷ ${HOURS_PER_GREGORIAN_YEAR} ≈ ${formatDuration(Number(hoursToYears(50_000).toFixed(6)))} average Gregorian years.`,
  },
  {
    question: 'How Many Hours Are in 5 Years?',
    answer: `5 × ${HOURS_PER_GREGORIAN_YEAR} = ${formatDuration(yearsToHours(5))} hours.`,
  },
  {
    question: 'How Many Hours Are in One Year?',
    answer: `It depends on the year convention: a common year has 8,760 hours, a leap year has 8,784 hours, and an average Gregorian year has ${HOURS_PER_GREGORIAN_YEAR} hours. This converter uses the average Gregorian year.`,
  },
  {
    question: 'Is One Year Exactly 365 Days?',
    answer: `No. A common calendar year has 365 days and a leap year has 366. The average Gregorian calendar year is ${DAYS_PER_GREGORIAN_YEAR} days.`,
  },
  {
    question: 'How Many Years Are 10,000 Hours?',
    answer: `10,000 ÷ ${HOURS_PER_GREGORIAN_YEAR} ≈ ${formatDuration(Number(hoursToYears(10_000).toFixed(6)))} average Gregorian years.`,
  },
  {
    question: 'How Do I Convert Years into Hours?',
    answer: `Multiply the number of average Gregorian years by ${HOURS_PER_GREGORIAN_YEAR}: Hours = Years × ${HOURS_PER_GREGORIAN_YEAR}.`,
  },
];
