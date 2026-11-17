import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatDuration,
  hoursToWeekFractionLabel,
  hoursToWeeks,
  tableRowForHours,
  weeksToHours,
} from './calculation';
import { HOURS_PER_WEEK } from './types';

export const HOURS_TO_WEEKS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert-hours-to-weeks', label: 'How to Convert Hours to Weeks by Hand' },
  { id: 'how-to-convert-weeks-to-hours', label: 'How to Convert Weeks to Hours' },
  { id: 'conversion-table', label: 'Hours to Weeks Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'related-tools', label: 'Other Time Converters' },
  { id: 'hours-to-weeks-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

/** Featured conversion table rows from the task brief. */
export const FEATURED_TABLE_HOURS = [
  1, 3, 8, 12, 24, 40, 48, 72, 84, 98, 120, 168, 336, 504,
] as const;

export const FEATURED_CONVERSION_ROWS = FEATURED_TABLE_HOURS.map(tableRowForHours);

export const HOURS_TO_WEEKS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert-hours-to-weeks',
    title: 'How to Convert Hours to Weeks by Hand',
    paragraphs: [
      'A day contains 24 hours. A week contains 7 days. Therefore 7 × 24 = 168, so there are exactly 168 hours in a week.',
      'To convert hours to weeks, divide by 168. Example: 120 ÷ 168 ≈ 0.7143, so 120 hours is about 0.7143 weeks (exactly 5/7 of a week).',
    ],
    formula: `Weeks = Hours ÷ ${HOURS_PER_WEEK}`,
  },
  {
    id: 'how-to-convert-weeks-to-hours',
    title: 'How to Convert Weeks to Hours',
    paragraphs: [
      `Multiply weeks by 168. Example: 3.5 × 168 = ${formatDuration(weeksToHours(3.5))}, so 3.5 weeks equals ${formatDuration(weeksToHours(3.5))} hours.`,
      'The same factor works in reverse for every exact week multiple: 1 week = 168 hours, 2 weeks = 336 hours, 3 weeks = 504 hours.',
    ],
    formula: `Hours = Weeks × ${HOURS_PER_WEEK}`,
  },
  {
    id: 'conversion-table',
    title: 'Hours to Weeks Conversion Table',
    paragraphs: [
      'Each fraction is hours ÷ 168 reduced with a greatest-common-divisor. Decimals come from the same conversion engine.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Hours to Week Calculator',
    paragraphs: [
      '1. Enter the number of hours in Time in hours — weeks update instantly.',
      '2. Edit Time in weeks to convert hours in reverse.',
      '3. Expand Other time units for years, months, days, minutes, seconds, and compound hours/minutes/seconds.',
      '4. Years and months are labeled as average Gregorian durations (365.2425-day year), not calendar-date spans.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Time Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Hour Converter, Hours to Days Calculator, Hours to Minutes Converter, Hours to Seconds Converter, Days to Weeks Calculator, and Weeks to Months Calculator. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const HOURS_TO_WEEKS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Weeks Are 120 Hours?',
    answer: `120 ÷ 168 = ${formatDuration(hoursToWeeks(120))} weeks (exactly ${hoursToWeekFractionLabel(120)} of a week), or 5 days.`,
  },
  {
    question: 'What Are 8 Hours Converted into Weeks?',
    answer: `8 ÷ 168 = ${formatDuration(hoursToWeeks(8))} weeks (exactly ${hoursToWeekFractionLabel(8)} of a week).`,
  },
  {
    question: 'What Fraction of a Week Is 98 Hours?',
    answer: `98 ÷ 168 = ${hoursToWeekFractionLabel(98)} of a week, or approximately ${(
      (98 / 168) *
      100
    ).toFixed(2)}%.`,
  },
  {
    question: 'What Percentage of the Week Is 40 Hours?',
    answer: `(40 ÷ 168) × 100 ≈ ${((40 / 168) * 100).toFixed(2)}%.`,
  },
  {
    question: 'One Hour Is What Percent of One Week?',
    answer: `(1 ÷ 168) × 100 ≈ ${((1 / 168) * 100).toFixed(5)}%.`,
  },
  {
    question: 'What Fraction of a Week Is 3 Hours?',
    answer: `3 ÷ 168 = ${hoursToWeekFractionLabel(3)} of a week, approximately ${(
      (3 / 168) *
      100
    ).toFixed(4)}%.`,
  },
  {
    question: 'How Many Hours Are in a Week?',
    answer: `There are exactly ${HOURS_PER_WEEK} hours in a seven-day week (7 × 24 = ${HOURS_PER_WEEK}).`,
  },
  {
    question: 'How Many Weeks Are 1,000 Hours?',
    answer: `1,000 ÷ 168 ≈ ${formatDuration(Number(hoursToWeeks(1000).toFixed(10)))} weeks.`,
  },
];
