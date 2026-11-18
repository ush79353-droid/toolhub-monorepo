import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatApprox,
  formatDuration,
  weeksToDays,
  weeksToYears,
  yearsToWeeks,
  DAYS_PER_YEAR,
  WEEKS_PER_YEAR,
  YEARS_PER_WEEK,
} from './calculation';

export const W2Y_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Weeks to Years Converter' },
  { id: 'how-to-use', label: 'How to Use the Weeks to Years Converter' },
  { id: 'converting', label: 'Converting Time From Weeks to Years' },
  { id: 'weeks-in-year', label: 'How Many Weeks Are in a Year?' },
  { id: 'examples', label: 'Weeks to Years Conversion Table' },
  { id: 'related-tools', label: 'Other Time Conversion Calculators' },
  { id: 'w2y-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const EXAMPLE_WEEKS = [1, 2, 3, 4, 8, 12, 20, 26, 40, 50, 52, 72, 100, 104] as const;

export const W2Y_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Weeks to Years Converter',
    paragraphs: [
      'Convert weeks to years and other time units using an average Gregorian year. The tool also converts years, months, days, hours, minutes, and seconds back into weeks.',
      'Useful for long-term project timelines, academic schedules, work experience, travel planning, contract durations, and general time conversions.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Weeks to Years Converter',
    paragraphs: [
      '1. Enter a duration in the Time in weeks field.',
      '2. Expand Time in other units to view years, months, days, hours, minutes, and seconds.',
      '3. Edit any supported field to convert in the opposite direction.',
      '4. Use the combined hours/minutes/seconds fields if needed.',
      '5. Share, reload, or clear the calculator to start again.',
      `Example: enter 20 weeks → approximately ${formatApprox(weeksToYears(20))} years.`,
    ],
  },
  {
    id: 'converting',
    title: 'Converting Time From Weeks to Years',
    paragraphs: [
      `1 week = 7 days. 1 average Gregorian year = ${DAYS_PER_YEAR} days.`,
      `Therefore 1 average year = ${formatDuration(WEEKS_PER_YEAR)} weeks, and 1 week ≈ ${formatDuration(YEARS_PER_WEEK)} years.`,
      `Years = Weeks ÷ ${formatDuration(WEEKS_PER_YEAR)}. Weeks = Years × ${formatDuration(WEEKS_PER_YEAR)}.`,
      `Examples: 20 weeks ≈ ${formatApprox(weeksToYears(20))} years · 50 weeks ≈ ${formatApprox(weeksToYears(50))} years · 72 weeks ≈ ${formatApprox(weeksToYears(72))} years · 3 years = ${formatDuration(yearsToWeeks(3))} weeks.`,
    ],
    formula: `Years = Weeks / ${formatDuration(WEEKS_PER_YEAR)}\nWeeks = Years × ${formatDuration(WEEKS_PER_YEAR)}\n20 wks ≈ ${formatApprox(weeksToYears(20))} yrs\n3 yrs = ${formatDuration(yearsToWeeks(3))} wks`,
  },
  {
    id: 'weeks-in-year',
    title: 'How Many Weeks Are in a Year?',
    paragraphs: [
      `Common year: 365 ÷ 7 ≈ ${formatApprox(365 / 7)} weeks.`,
      `Leap year: 366 ÷ 7 ≈ ${formatApprox(366 / 7)} weeks.`,
      `Average Gregorian year: ${DAYS_PER_YEAR} ÷ 7 = ${formatDuration(WEEKS_PER_YEAR)} weeks (about 52.18 weeks).`,
      'Calendar years contain 365 or 366 days, so fractional-year duration conversions are not exact calendar dates.',
    ],
  },
  {
    id: 'examples',
    title: 'Weeks to Years Conversion Table',
    paragraphs: [
      'Conversions use an average Gregorian year of 365.2425 days. Actual calendar years contain 365 or 366 days.',
    ],
    tableHeaders: ['Weeks', 'Approximate Years'],
    table: EXAMPLE_WEEKS.map((weeks) => [
      formatDuration(weeks),
      formatApprox(weeksToYears(weeks)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Time Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Hours to Week Conversion, Days to Weeks Calculator, Weeks to Months Calculator, Seconds to Years Conversion, Minutes to Years Conversion, Hours to Years Converter, Days to Years Calculator, Months to Years Calculator, Seconds to Days Converter, Seconds to Hours Converter, and Seconds to Minutes Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const W2Y_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I Convert My 3-Week Holiday to Years?',
    answer: `Yes. Three weeks represent ${formatDuration(weeksToDays(3))} days. Using the average Gregorian year: 3 ÷ ${formatDuration(WEEKS_PER_YEAR)} ≈ ${formatApprox(weeksToYears(3))}. A three-week holiday is approximately ${formatApprox(weeksToYears(3))} years.`,
  },
  {
    question: 'What Is 72 Weeks Converted to Years?',
    answer: `Years = 72 ÷ ${formatDuration(WEEKS_PER_YEAR)} ≈ ${formatApprox(weeksToYears(72))}. Therefore 72 weeks ≈ ${formatApprox(weeksToYears(72))} years.`,
  },
  {
    question: 'How Many Weeks Are There in a Year?',
    answer: `There are approximately ${formatApprox(WEEKS_PER_YEAR)} weeks in an average Gregorian year. A common calendar year contains 52 weeks and one additional day. A leap year contains 52 weeks and two additional days.`,
  },
  {
    question: 'How Many Years Are in 100 Weeks?',
    answer: `100 ÷ ${formatDuration(WEEKS_PER_YEAR)} ≈ ${formatApprox(weeksToYears(100))}. Therefore 100 weeks ≈ ${formatApprox(weeksToYears(100))} years.`,
  },
  {
    question: 'Is 52 Weeks Exactly One Year?',
    answer:
      'No. 52 weeks equal 364 days. A common year has 365 days, and a leap year has 366 days. Therefore 52 weeks are slightly shorter than a calendar year.',
  },
  {
    question: 'How Do I Convert Years Back to Weeks?',
    answer: `Multiply years by approximately ${formatDuration(WEEKS_PER_YEAR)}. Example: 2 × ${formatDuration(WEEKS_PER_YEAR)} = ${formatDuration(yearsToWeeks(2))}. Two average Gregorian years equal ${formatDuration(yearsToWeeks(2))} weeks.`,
  },
];
