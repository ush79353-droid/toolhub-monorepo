import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertTime, daysToMonths, formatDuration, monthsToDays } from './calculation';
import { DAYS_PER_MONTH, DAYS_PER_YEAR } from './types';

export const DAYS_TO_MONTHS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How to Convert Days to Months' },
  { id: 'how-it-works', label: 'How Does the Days to Months Calculator Work?' },
  { id: 'related-time-tools', label: 'Other Time Conversion Related Tools' },
  { id: 'days-to-months-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const DAYS_TO_MONTHS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How to Convert Days to Months',
    paragraphs: [
      'Calendar months are not fixed lengths; February has 28 or 29 days, and other months have 30 or 31. For duration planning this calculator uses the average Gregorian month: 365.2425 ÷ 12 = 30.436875 days.',
      `Formula: Months = Days ÷ ${DAYS_PER_MONTH}.`,
      `Example: 90 ÷ ${DAYS_PER_MONTH} ≈ ${formatDuration(daysToMonths(90))}. Therefore 90 days ≈ 2.96 average months. Ninety days do not always span the same number of named calendar months.`,
    ],
    formula: `Months = Days ÷ ${DAYS_PER_MONTH}  ·  Days = Months × ${DAYS_PER_MONTH}`,
  },
  {
    id: 'how-it-works',
    title: 'How Does the Days to Months Calculator Work?',
    paragraphs: [
      '1. Enter days to read approximate months. 2. Enter months to reverse the conversion. 3. Expand Other Time Conversions for seconds, minutes, hours, weeks, and years. 4. Read the combined hours/minutes/seconds panel (hours do not wrap at 24). 5. Open an example to load a worked scenario. Updates run automatically as you type.',
      'Years also use the average Gregorian year of 365.2425 days. Exact calendar spans need a start date and are outside this duration tool.',
    ],
  },
  {
    id: 'related-time-tools',
    title: 'Other Time Conversion Related Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Day Converter, Time Unit Converter, Minutes to Hours Converter, and other duration tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const DAYS_TO_MONTHS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Long Is 90 Days in Months and Weeks?',
    answer: `Using the average Gregorian month: 90 ÷ ${DAYS_PER_MONTH} ≈ ${formatDuration(daysToMonths(90))} months (about 2.96). For weeks: 90 ÷ 7 ≈ ${formatDuration(convertTime(90, 'days', 'weeks'))} (12 weeks and 6 days).`,
  },
  {
    question: 'How Many Days Are in a Month?',
    answer: `Named months contain 28, 29, 30, or 31 days (February has 29 in a leap year). This converter uses an average month of ${DAYS_PER_MONTH} days; not the length of a particular calendar month.`,
  },
  {
    question: 'How Do I Convert 180 Days Into Months?',
    answer: `180 ÷ ${DAYS_PER_MONTH} ≈ ${formatDuration(daysToMonths(180))}. Therefore 180 days ≈ 5.91 average months.`,
  },
  {
    question: 'How Many Months Are in 365 Days?',
    answer: `365 ÷ ${DAYS_PER_MONTH} ≈ ${formatDuration(daysToMonths(365))}. Therefore 365 days ≈ 11.99 average months. A full average year (${DAYS_PER_YEAR} days) is exactly 12 average months.`,
  },
  {
    question: 'Is One Month Always 30 Days?',
    answer:
      'No. Calendar months contain 28, 29, 30, or 31 days. A 30-day rule of thumb is a rough estimate, not the convention used here.',
  },
  {
    question: 'How Can I Convert Months to Days?',
    answer: `Multiply average months by ${DAYS_PER_MONTH}. Example: 3 × ${DAYS_PER_MONTH} = ${formatDuration(monthsToDays(3))}, so 3 average months ≈ 91.31 days.`,
  },
];

export const MONTH_LENGTH_TABLE: readonly string[][] = [
  ['January', '31'],
  ['February', '28 or 29'],
  ['March', '31'],
  ['April', '30'],
  ['May', '31'],
  ['June', '30'],
  ['July', '31'],
  ['August', '31'],
  ['September', '30'],
  ['October', '31'],
  ['November', '30'],
  ['December', '31'],
];
