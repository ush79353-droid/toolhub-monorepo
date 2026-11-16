import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertTime, formatDuration, splitDaysToHms } from './calculation';
import { DAYS_PER_MONTH, DAYS_PER_YEAR } from './types';

export const DAY_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'convert-by-hand', label: 'Converting Days to Time Amounts by Hand' },
  { id: 'how-to-use', label: 'How to Use the Day Converter' },
  { id: 'related-time-tools', label: 'Other Time Converters' },
  { id: 'day-converter-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const DAY_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'convert-by-hand',
    title: 'Converting Days to Time Amounts by Hand',
    paragraphs: [
      'A standard day has exactly 24 hours, 1,440 minutes, and 86,400 seconds. Weeks are exact at 7 days. Years and months vary on a calendar, so this converter uses average Gregorian lengths: 365.2425 days per year and 30.436875 days per month.',
      `Days to seconds: Seconds = Days × 86,400. Example: 2 × 86,400 = ${formatDuration(convertTime(2, 'days', 'seconds'))}, so 2 days equal 172,800 seconds.`,
      `Days to minutes: Minutes = Days × 1,440. Example: 2 × 1,440 = ${formatDuration(convertTime(2, 'days', 'minutes'))}.`,
      `Days to hours: Hours = Days × 24. Example: 2 × 24 = ${formatDuration(convertTime(2, 'days', 'hours'))}.`,
      `Days to weeks: Weeks = Days ÷ 7. Example: 14 ÷ 7 = ${formatDuration(convertTime(14, 'days', 'weeks'))}.`,
      `Days to months (average): Months ≈ Days ÷ ${DAYS_PER_MONTH}. Calendar months still need a start date for exact spans.`,
      `Days to years (average): Years ≈ Days ÷ ${DAYS_PER_YEAR}. An individual calendar year is 365 or 366 days.`,
    ],
    formula: 's = d×86400 · min = d×1440 · h = d×24 · wk = d÷7 · mo ≈ d÷30.436875 · yr ≈ d÷365.2425',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Day Converter',
    paragraphs: [
      '1. Enter the number of days (or edit years, months, weeks, hours, minutes, or seconds). 2. Read the equivalent durations instantly. 3. Treat years and months as average approximations. 4. Use weeks/hours/minutes/seconds for fixed-length conversions. 5. Read the combined hours/minutes/seconds panel when you want a duration clock (hours do not wrap at 24). 6. Change any input to update the rest.',
      `Example: 0.4 days → ${formatDuration(convertTime(0.4, 'days', 'hours'))} hours → ${splitDaysToHms(0.4).label}.`,
    ],
  },
  {
    id: 'related-time-tools',
    title: 'Other Time Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Minutes to Hours Converter, and other duration tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const DAY_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Years and Months Are in 18,906 Days?',
    answer: `Using the average Gregorian year: 18,906 ÷ ${DAYS_PER_YEAR} ≈ ${formatDuration(convertTime(18906, 'days', 'years'))} years (about 51.76 years). That is roughly 51 years plus about 9.16 average months. Calendar-exact years and months require a starting date.`,
  },
  {
    question: 'How Many Hours and Minutes Are in 0.4 Days?',
    answer: `0.4 × 24 = ${formatDuration(convertTime(0.4, 'days', 'hours'))} hours. The fractional 0.6 hour is 36 minutes. Therefore 0.4 days = ${splitDaysToHms(0.4).label}.`,
  },
  {
    question: 'How Many Hours and Minutes Are in 1.3 Days?',
    answer: `1.3 × 24 = ${formatDuration(convertTime(1.3, 'days', 'hours'))} hours. The fractional 0.2 hour is 12 minutes. Therefore 1.3 days = ${splitDaysToHms(1.3).label}.`,
  },
  {
    question: 'How Many Hours, Minutes, and Seconds Are in 100 Days?',
    answer: `100 days equal ${formatDuration(convertTime(100, 'days', 'hours'))} hours, ${formatDuration(convertTime(100, 'days', 'minutes'))} minutes, and ${formatDuration(convertTime(100, 'days', 'seconds'))} seconds. Combined: ${splitDaysToHms(100).label}.`,
  },
  {
    question: 'How Many Weeks Are in 30 Days?',
    answer: `30 ÷ 7 ≈ ${formatDuration(convertTime(30, 'days', 'weeks'))}. Therefore 30 days equal approximately 4.286 weeks.`,
  },
  {
    question: 'How Many Minutes Are in One Day?',
    answer: `24 × 60 = ${formatDuration(convertTime(1, 'days', 'minutes'))}. There are 1,440 minutes in one day.`,
  },
];
