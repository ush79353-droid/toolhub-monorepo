import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatDuration, minutesToDays, MINUTES_PER_DAY } from './calculation';

export const M2D_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'convert-by-hand', label: 'How to Convert Minutes into Days by Hand' },
  { id: 'days-to-minutes', label: 'How to Convert Days to Minutes by Hand' },
  { id: 'conversion-table', label: 'Minutes to Days Conversion Table' },
  { id: 'fractions', label: 'Understanding Fractions of a Day' },
  { id: 'how-to-use', label: 'How to Use the Minutes to Days Calculator' },
  { id: 'related-tools', label: 'Other Time Converters' },
  { id: 'm2d-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MINUTES = [15, 30, 45, 60, 120, 360, 720, 1440, 2880, 10_080] as const;

export const M2D_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'convert-by-hand',
    title: 'How to Convert Minutes into Days by Hand',
    paragraphs: [
      'The Minutes to Days Calculator converts durations between minutes and days for work schedules, daily activities, training sessions, study planning, project duration, and event planning.',
      `A day contains 24 hours and an hour contains 60 minutes, so 24 × 60 = ${MINUTES_PER_DAY}.`,
      `Therefore Days = Minutes / ${MINUTES_PER_DAY}.`,
      `Example: 360 ÷ ${MINUTES_PER_DAY} = 0.25, so 360 minutes equals one-quarter of a day.`,
    ],
    formula: `Days = Minutes / ${MINUTES_PER_DAY}\n360 ÷ ${MINUTES_PER_DAY} = 0.25 days`,
  },
  {
    id: 'days-to-minutes',
    title: 'How to Convert Days to Minutes by Hand',
    paragraphs: [
      `Minutes = Days × ${MINUTES_PER_DAY}.`,
      `Example: 2.5 × ${MINUTES_PER_DAY} = 3600, so 2.5 days equal 3,600 minutes.`,
    ],
    formula: `Minutes = Days × ${MINUTES_PER_DAY}\n2.5 × ${MINUTES_PER_DAY} = 3600 minutes`,
  },
  {
    id: 'conversion-table',
    title: 'Minutes to Days Conversion Table',
    paragraphs: [
      `Common durations converted with the exact factor 1 day = ${MINUTES_PER_DAY} minutes.`,
    ],
    tableHeaders: ['Minutes (min)', 'Days'],
    table: TABLE_MINUTES.map((min) => [String(min), formatDuration(minutesToDays(min))]),
  },
  {
    id: 'fractions',
    title: 'Understanding Fractions of a Day',
    paragraphs: [
      'Common fractions of a 24-hour day expressed in minutes.',
    ],
    tableHeaders: ['Fraction of a day', 'Minutes'],
    table: [
      ['1/24', '60'],
      ['1/12', '120'],
      ['1/8', '180'],
      ['1/4', '360'],
      ['1/2', '720'],
      ['3/4', '1080'],
      ['1', '1440'],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Minutes to Days Calculator',
    paragraphs: [
      '1. Enter the number of minutes.',
      '2. Read the automatically calculated days.',
      '3. Alternatively, enter the number of days.',
      '4. Read the converted minutes.',
      '5. Click an example preset to try a sample calculation.',
      '6. Expand Other equivalent amounts for seconds, hours, weeks, and HMS.',
      '7. Use Clear all changes or Reload calculator to reset.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Time Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Milliseconds Converter, Seconds Converter, Minute Converter, Hour Converter, Day Converter, Hours to Days Calculator, Hours to Minutes Converter, Seconds to Days Converter, and Hours to Week Conversion. Only active catalog tools appear as live links.',
    ],
  },
];

export const M2D_FAQS: readonly FAQItem[] = [
  {
    question: 'What Fraction of a Day Is 30 Minutes?',
    answer: `30 / ${MINUTES_PER_DAY} = 1/48. Therefore 30 minutes is 1/48 of a day, or approximately ${formatDuration(minutesToDays(30))} days.`,
  },
  {
    question: 'What Percent of a Day Is 30 Minutes?',
    answer: `(30 / ${MINUTES_PER_DAY}) × 100 ≈ 2.08333%. Therefore 30 minutes represents approximately 2.0833% of a day.`,
  },
  {
    question: 'What Fraction of a Day Is 45 Minutes?',
    answer: `45 / ${MINUTES_PER_DAY} = 1/32. Therefore 45 minutes is 1/32 of a day, equivalent to ${formatDuration(minutesToDays(45))} days.`,
  },
  {
    question: 'How Many Minutes Are in One Day?',
    answer: `24 × 60 = ${MINUTES_PER_DAY}. One day contains exactly ${MINUTES_PER_DAY} minutes.`,
  },
  {
    question: 'How Many Days Are 10,000 Minutes?',
    answer: `10000 ÷ ${MINUTES_PER_DAY} ≈ ${formatDuration(minutesToDays(10_000))} days.`,
  },
  {
    question: 'How Many Minutes Are in Half a Day?',
    answer: `0.5 × ${MINUTES_PER_DAY} = 720. Half a day equals 720 minutes.`,
  },
  {
    question: 'How Do I Convert 90 Minutes to Days?',
    answer: `90 ÷ ${MINUTES_PER_DAY} = 0.0625. Therefore 90 minutes equals 0.0625 days.`,
  },
];
