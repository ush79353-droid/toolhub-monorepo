import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatApprox,
  formatDuration,
  monthsToWeeks,
  weeksToDays,
  weeksToMonths,
  DAYS_PER_MONTH,
  DAYS_PER_YEAR,
  MONTHS_PER_WEEK,
  WEEKS_PER_MONTH,
} from './calculation';

export const W2M_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Weeks to Months Calculator' },
  { id: 'how-to-convert', label: 'How to Perform Weeks to Months Conversion' },
  { id: 'how-it-works', label: 'How Does the Weeks to Months Calculator Work?' },
  { id: 'four-weeks', label: 'Why Are Months Not Exactly Four Weeks?' },
  { id: 'examples', label: 'Example Weeks to Months Values' },
  { id: 'related-tools', label: 'Other Time Unit Conversion Calculators' },
  { id: 'w2m-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const EXAMPLE_WEEKS = [1, 2, 3, 4, 6, 8, 12, 13, 14, 26, 52] as const;

export const W2M_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Weeks to Months Calculator',
    paragraphs: [
      'Convert a duration expressed in weeks into an approximate number of months, and convert months back into weeks. The calculator also updates years, days, hours, minutes, and seconds from the same duration.',
      'Common uses include project planning, study schedules, event planning, travel planning, and comparing time intervals when an average month is good enough.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Perform Weeks to Months Conversion',
    paragraphs: [
      `Using the mean Gregorian year of ${DAYS_PER_YEAR} days, one average month is ${DAYS_PER_MONTH} days ≈ ${formatDuration(WEEKS_PER_MONTH)} weeks.`,
      `1 week ≈ ${formatDuration(MONTHS_PER_WEEK)} months. 1 average month ≈ ${formatDuration(WEEKS_PER_MONTH)} weeks.`,
      'Weeks to months: divide weeks by ≈ 4.348125 (or multiply by ≈ 0.229984).',
      'Months to weeks: multiply months by ≈ 4.348125.',
      `Example: 13 weeks ≈ ${formatApprox(weeksToMonths(13))} average months. 6 average months ≈ ${formatApprox(monthsToWeeks(6))} weeks.`,
    ],
    formula: `1 wk ≈ ${formatDuration(MONTHS_PER_WEEK)} mos\n1 mo ≈ ${formatDuration(WEEKS_PER_MONTH)} wks\n13 wks ≈ ${formatApprox(weeksToMonths(13))} mos\n6 mos ≈ ${formatApprox(monthsToWeeks(6))} wks`,
  },
  {
    id: 'how-it-works',
    title: 'How Does the Weeks to Months Calculator Work?',
    paragraphs: [
      '1. Enter a duration in weeks (or months).',
      '2. The calculator converts the duration to seconds internally using fixed week and average-month factors.',
      '3. The equivalent average-month (or week) value appears automatically.',
      '4. Related time units update at the same time.',
      '5. Expand Other time units to view years, days, hours, minutes, seconds, and a combined HMS breakdown.',
      'A single canonical duration in seconds keeps all fields synchronized without cumulative rounding error.',
    ],
  },
  {
    id: 'four-weeks',
    title: 'Why Are Months Not Exactly Four Weeks?',
    paragraphs: [
      'Four weeks equal exactly 28 days. Calendar months may contain 28, 29, 30, or 31 days, so four weeks and one calendar month are not always the same.',
      'This tool distinguishes a fixed-duration week (7 days), an average-length Gregorian month, and an actual calendar month that depends on dates.',
      'For exact date-based month counts, you need a start date and a defined counting method.',
    ],
  },
  {
    id: 'examples',
    title: 'Example Weeks to Months Values',
    paragraphs: [
      'These values use an average Gregorian month of approximately 30.436875 days. Actual calendar months vary from 28 to 31 days.',
    ],
    tableHeaders: ['Weeks', 'Average Months'],
    table: EXAMPLE_WEEKS.map((weeks) => [
      formatDuration(weeks),
      formatApprox(weeksToMonths(weeks)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Time Unit Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Hours to Week Conversion, Days to Weeks Calculator, Seconds to Years Conversion, Minutes to Years Conversion, Hours to Years Converter, Days to Years Calculator, Months to Years Calculator, Seconds to Days Converter, Seconds to Hours Converter, and Seconds to Minutes Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const W2M_FAQS: readonly FAQItem[] = [
  {
    question: 'How Long Are 13 Weeks in Months and Days?',
    answer: `13 weeks equal exactly ${formatDuration(weeksToDays(13))} days. In average Gregorian months: ${formatDuration(weeksToDays(13))} ÷ ${DAYS_PER_MONTH} ≈ ${formatApprox(weeksToMonths(13))}. Result: 13 weeks = ${formatDuration(weeksToDays(13))} days ≈ ${formatApprox(weeksToMonths(13))} average months.`,
  },
  {
    question: 'How Long Are 6 Weeks in Months and Days?',
    answer: `6 weeks equal ${formatDuration(weeksToDays(6))} days. In average months: ≈ ${formatApprox(weeksToMonths(6))}. Result: 6 weeks = ${formatDuration(weeksToDays(6))} days ≈ ${formatApprox(weeksToMonths(6))} average months.`,
  },
  {
    question: 'How Many Months Are in 14 Weeks?',
    answer: `14 ÷ ${formatDuration(WEEKS_PER_MONTH)} ≈ ${formatApprox(weeksToMonths(14))}. Therefore 14 weeks ≈ ${formatApprox(weeksToMonths(14))} average months.`,
  },
  {
    question: 'How Many Months Are in 12 Weeks?',
    answer: `12 ÷ ${formatDuration(WEEKS_PER_MONTH)} ≈ ${formatApprox(weeksToMonths(12))}. Therefore 12 weeks ≈ ${formatApprox(weeksToMonths(12))} average months.`,
  },
  {
    question: 'Is One Month Equal to Four Weeks?',
    answer: `Not generally. Four weeks are exactly 28 days, while calendar months can have 28–31 days. An average Gregorian month is approximately ${formatDuration(WEEKS_PER_MONTH)} weeks.`,
  },
  {
    question: 'How Many Weeks Are in Three Months?',
    answer: `Using average Gregorian months: 3 × ${formatDuration(WEEKS_PER_MONTH)} ≈ ${formatApprox(monthsToWeeks(3))}. Therefore three average months ≈ ${formatApprox(monthsToWeeks(3))} weeks.`,
  },
  {
    question: 'Can I Convert Weeks to Calendar Months Exactly?',
    answer:
      'An exact calendar-based result requires a start date and a defined method of counting months, because calendar months have different lengths. This calculator provides average-duration conversions rather than date-specific calendar calculations.',
  },
];
