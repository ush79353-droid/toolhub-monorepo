import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  daysToWeeks,
  daysToWeeksTableRows,
  formatDuration,
  weeksToDays,
  weeksToDaysTableRows,
} from './calculation';

export const DAYS_TO_WEEKS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'calc-by-hand', label: 'Days-to-Weeks Calculation by Hand' },
  { id: 'days-to-weeks-table', label: 'Days-to-Weeks Conversion Table' },
  { id: 'weeks-to-days-table', label: 'Weeks-to-Days Conversion Table' },
  { id: 'related-time-tools', label: 'Other Similar Calculators' },
  { id: 'days-to-weeks-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const DAYS_TABLE = daysToWeeksTableRows(100);
const WEEKS_TABLE = weeksToDaysTableRows();

export const DAYS_TO_WEEKS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'calc-by-hand',
    title: 'Days-to-Weeks Calculation by Hand',
    paragraphs: [
      'A week is exactly 7 days. To convert days to weeks, divide by 7. To convert weeks to days, multiply by 7.',
      `Example: 20 ÷ 7 ≈ ${formatDuration(daysToWeeks(20))}. Therefore 20 days ≈ 2.857 weeks, or 2 weeks and 6 days.`,
      'The calculator also shows average years and months (Gregorian averages) plus hours, minutes, and seconds for the same duration.',
    ],
    formula: 'Weeks = Days ÷ 7  ·  Days = Weeks × 7',
  },
  {
    id: 'days-to-weeks-table',
    title: 'Days-to-Weeks Conversion Table',
    paragraphs: [
      'The table below lists days 1 through 100 converted with Weeks = Days ÷ 7. Whole multiples of 7 land on exact week counts (7 → 1, 14 → 2, and so on).',
    ],
    tableHeaders: ['Days', 'Weeks'],
    table: DAYS_TABLE.map((row) => [formatDuration(row.days), formatDuration(row.weeks)]),
  },
  {
    id: 'weeks-to-days-table',
    title: 'Weeks-to-Days Conversion Table',
    paragraphs: [
      'The reverse table multiplies weeks by 7. Useful checkpoints include 4 weeks = 28 days, 52 weeks = 364 days, and 100 weeks = 700 days.',
    ],
    tableHeaders: ['Weeks', 'Days'],
    table: WEEKS_TABLE.map((row) => [formatDuration(row.weeks), formatDuration(row.days)]),
  },
  {
    id: 'related-time-tools',
    title: 'Other Similar Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Day Converter, Days to Months Calculator, Time Unit Converter, and other duration tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const DAYS_TO_WEEKS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Days Are in a Week and a Half?',
    answer: `One week contains 7 days. 1.5 × 7 = ${formatDuration(weeksToDays(1.5))}. Therefore 1.5 weeks = 10.5 days.`,
  },
  {
    question: 'Is 14 Days Equal to 2 Weeks?',
    answer: `Yes. 14 ÷ 7 = ${formatDuration(daysToWeeks(14))}. Therefore 14 days = exactly 2 weeks.`,
  },
  {
    question: 'Is 21 Days Equal to 3 Weeks?',
    answer: `Yes. 21 ÷ 7 = ${formatDuration(daysToWeeks(21))}. Therefore 21 days = exactly 3 weeks.`,
  },
  {
    question: 'How Many Weeks Are in 20 Days?',
    answer: `20 ÷ 7 ≈ ${formatDuration(daysToWeeks(20))}. Therefore 20 days ≈ 2.86 weeks, or 2 weeks and 6 days.`,
  },
  {
    question: 'How Many Weeks Are in 28 Days?',
    answer: `28 ÷ 7 = ${formatDuration(daysToWeeks(28))}. Therefore 28 days = exactly 4 weeks.`,
  },
  {
    question: 'How Many Weeks Are in 365 Days?',
    answer: `365 ÷ 7 ≈ ${formatDuration(daysToWeeks(365))}. Therefore 365 days = 52 weeks and 1 day.`,
  },
];
