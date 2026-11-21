import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  daysToHours,
  formatDuration,
  hoursToDays,
  tableRowForHours,
} from './calculation';
import { HOURS_PER_DAY } from './types';

export const HOURS_TO_DAYS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-calculate', label: 'How to Calculate Days from Hours' },
  { id: 'standard-vs-workdays', label: 'Standard Days vs. Workdays' },
  { id: 'conversion-table', label: 'Hours to Days Conversion Table' },
  { id: 'decimal-hours', label: 'Decimal Hours to Days' },
  { id: 'related-tools', label: 'Related Calculators' },
  { id: 'hours-to-days-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

/** Featured rows shown by default (matches common reference values). */
export const FEATURED_TABLE_HOURS = [
  1, 2, 3, 4, 6, 8, 12, 18, 24, 36, 48, 72, 96, 120, 168,
] as const;

/** Broader 1–72 hour table (expandable). */
export const FULL_TABLE_HOURS: readonly number[] = Array.from({ length: 72 }, (_, i) => i + 1);

export const FEATURED_CONVERSION_ROWS = FEATURED_TABLE_HOURS.map(tableRowForHours);
export const FULL_CONVERSION_ROWS = FULL_TABLE_HOURS.map(tableRowForHours);

export const HOURS_TO_DAYS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-calculate',
    title: 'How to Calculate Days from Hours (and Vice Versa)',
    paragraphs: [
      `A standard day contains exactly ${HOURS_PER_DAY} hours.`,
      'To convert hours to days, divide by 24. Example: 72 ÷ 24 = 3, so 72 hours equals 3 days.',
      'To convert days into hours, multiply by 24. Example: 2.5 × 24 = 60, so 2.5 days equals 60 hours.',
    ],
    formula: `Days = Hours ÷ ${HOURS_PER_DAY}\nHours = Days × ${HOURS_PER_DAY}`,
  },
  {
    id: 'standard-vs-workdays',
    title: 'Examples; Standard Days vs. 8-Hour Workdays',
    paragraphs: [
      'Elapsed calendar days use 24 hours. An 8-hour workday counts only working hours and is a different concept.',
      'Example: 48 elapsed hours = 2 standard days, but 48 working hours = 6 eight-hour workdays. This calculator uses 24-hour days only and does not mix workday math into the synced fields.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Hours to Days Conversion Table',
    paragraphs: [
      'Each fraction is hours ÷ 24 reduced with a greatest-common-divisor. Decimals come from the same conversion engine.',
    ],
  },
  {
    id: 'decimal-hours',
    title: 'How to Convert Decimal Hours to Days',
    paragraphs: [
      `Example: convert 30.5 hours. 30.5 ÷ 24 = ${formatDuration(hoursToDays(30.5))} days.`,
      'Decimal days are not the same as “days plus remaining hours.” 30.5 hours can also be written as 1 day 6 hours 30 minutes.',
    ],
    formula: `Days = Hours ÷ ${HOURS_PER_DAY}`,
  },
  {
    id: 'related-tools',
    title: 'Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Hour Converter, Day Converter, Time Unit Converter, Days to Weeks Calculator, Days to Months Calculator, and Days to Years Calculator. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const HOURS_TO_DAYS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Hours to Days?',
    answer: `Divide hours by ${HOURS_PER_DAY}. Example: 72 ÷ 24 = ${formatDuration(hoursToDays(72))} days.`,
  },
  {
    question: 'How Many Days Are 24 Hours?',
    answer: '24 hours equals exactly 1 standard day.',
  },
  {
    question: 'How Many Days Are 48 Hours?',
    answer: `48 ÷ 24 = ${formatDuration(hoursToDays(48))} days.`,
  },
  {
    question: 'How Many Days Are 72 Hours?',
    answer: `72 ÷ 24 = ${formatDuration(hoursToDays(72))} days.`,
  },
  {
    question: 'How Many Hours Are in 3 Days?',
    answer: `3 × 24 = ${formatDuration(daysToHours(3))} hours.`,
  },
  {
    question: 'How Do I Convert Hours to 8-Hour Workdays?',
    answer:
      'Divide working hours by 8. Example: 40 ÷ 8 = 5 workdays. That is different from standard elapsed-day conversion (÷ 24) used by this calculator.',
  },
  {
    question: 'How Many Days Are 100 Hours?',
    answer: `100 ÷ 24 = ${formatDuration(Number(hoursToDays(100).toFixed(7)))} days, which is 4 days and 4 hours.`,
  },
  {
    question: 'What Is 1.5 Days in Hours?',
    answer: `1.5 × 24 = ${formatDuration(daysToHours(1.5))} hours.`,
  },
];
