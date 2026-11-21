import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatDuration,
  monthsToYears,
  monthsToYearsMonths,
  MONTHS_PER_YEAR,
  yearsToMonths,
} from './calculation';

export const MONTHS_TO_YEARS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Months to Years Calculator' },
  { id: 'how-to-convert', label: 'How Do I Convert Months to Years?' },
  { id: 'how-to-use', label: 'How Do I Use the Months to Years Calculator?' },
  { id: 'conversion-table', label: 'Months to Years Conversion Table' },
  { id: 'decimal-vs-mixed', label: 'Decimal Years vs. Years and Months' },
  { id: 'related-tools', label: 'Other Related Time Calculators' },
  { id: 'months-to-years-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MONTHS = [1, 3, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60, 120] as const;

function mixedLabel(totalMonths: number): string {
  const { years, months } = monthsToYearsMonths(totalMonths);
  return `${formatDuration(years)} yr ${formatDuration(months)} mo`;
}

export const MONTHS_TO_YEARS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Months to Years Calculator',
    paragraphs: [
      'Convert durations between months and years using the exact calendar convention of 12 months per year. Useful for age, work experience, subscriptions, project timelines, education periods, contracts, and loan terms.',
      'This tool performs duration arithmetic; it does not convert calendar dates or use average days per month.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Months to Years?',
    paragraphs: [
      `Exactly 1 year = ${MONTHS_PER_YEAR} months, so 1 month = 1/${MONTHS_PER_YEAR} year.`,
      `Years = months ÷ ${MONTHS_PER_YEAR}. Months = years × ${MONTHS_PER_YEAR}.`,
      `Example 1: 18 months: 18 ÷ ${MONTHS_PER_YEAR} = ${formatDuration(monthsToYears(18))} years (${mixedLabel(18)}).`,
      `Example 2: 48 months: 48 ÷ ${MONTHS_PER_YEAR} = ${formatDuration(monthsToYears(48))} years.`,
      `Example 3: 120 months: 120 ÷ ${MONTHS_PER_YEAR} = ${formatDuration(monthsToYears(120))} years.`,
    ],
    formula: `1 year = ${MONTHS_PER_YEAR} months\nyears = months ÷ ${MONTHS_PER_YEAR}\nmonths = years × ${MONTHS_PER_YEAR}`,
  },
  {
    id: 'how-to-use',
    title: 'How Do I Use the Months to Years Calculator?',
    paragraphs: [
      '1. Enter the number of months.',
      '2. Read the equivalent decimal years.',
      '3. Check the whole-years and remaining-months breakdown.',
      '4. Alternatively, enter years to calculate months.',
      '5. Edit the combined years/months fields; values such as 2 yr + 15 mo normalize automatically.',
      '6. Share or clear the result when finished.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Months to Years Conversion Table',
    paragraphs: [
      'Common month values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Months', 'Decimal Years', 'Years + Months'],
    table: TABLE_MONTHS.map((mo) => [
      formatDuration(mo),
      formatDuration(monthsToYears(mo)),
      mixedLabel(mo),
    ]),
  },
  {
    id: 'decimal-vs-mixed',
    title: 'Decimal Years vs. Years and Months',
    paragraphs: [
      'Decimal years and years+months notation are related but not identical in how people read them.',
      `1.5 years = 1 year 6 months, because 0.5 × ${MONTHS_PER_YEAR} = 6.`,
      `But 1.6 years is not “1 year 6 months.” Instead 0.6 × ${MONTHS_PER_YEAR} = ${formatDuration(0.6 * MONTHS_PER_YEAR)}, so 1.6 years = 1 year and 7.2 months.`,
      'Use decimal years for continuous arithmetic; use years+months for everyday duration wording.',
    ],
    formula: `1.5 yr = 1 yr 6 mo\n1.6 yr = 1 yr 7.2 mo`,
  },
  {
    id: 'related-tools',
    title: 'Other Related Time Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Minutes to Years Conversion, Day Converter, Hours to Minutes Converter, Hours to Seconds Converter, Minutes to Days Calculator, and Week converters. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MONTHS_TO_YEARS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Months Are in One Year?',
    answer: `There are exactly ${MONTHS_PER_YEAR} calendar months in one year.`,
  },
  {
    question: 'When Do 12 Months Become a Year?',
    answer:
      'Twelve calendar months represent one year of duration. For calendar-date ranges, the exact number of days can vary with months and leap years.',
  },
  {
    question: 'How Do I Convert 60 Months to Years?',
    answer: `60 ÷ ${MONTHS_PER_YEAR} = ${formatDuration(monthsToYears(60))} years.`,
  },
  {
    question: 'How Many Months Are in 4 Years?',
    answer: `4 × ${MONTHS_PER_YEAR} = ${formatDuration(yearsToMonths(4))} months.`,
  },
  {
    question: 'How Many Years Is 18 Months?',
    answer: `18 ÷ ${MONTHS_PER_YEAR} = ${formatDuration(monthsToYears(18))} years, or ${mixedLabel(18)}.`,
  },
  {
    question: 'How Many Years Is 30 Months?',
    answer: `30 ÷ ${MONTHS_PER_YEAR} = ${formatDuration(monthsToYears(30))} years, or ${mixedLabel(30)}.`,
  },
  {
    question: 'Is 1.5 Years Equal to 15 Months?',
    answer: `No. 1.5 × ${MONTHS_PER_YEAR} = ${formatDuration(yearsToMonths(1.5))} months.`,
  },
  {
    question: 'Can I Convert Fractional Months?',
    answer: `Yes. For example, 2.5 ÷ ${MONTHS_PER_YEAR} = ${formatDuration(monthsToYears(2.5))} years.`,
  },
];
