import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertTime, MS_PER_SECOND } from './calculation';
import {
  MS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_JULIAN_YEAR,
  MS_PER_MINUTE,
  MS_PER_WEEK,
} from './types';

export const MS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ms', label: 'What Is a Millisecond?' },
  { id: 'ms-to-other', label: 'How to Convert Time in Milliseconds Into Other Units' },
  { id: 'to-milliseconds', label: 'Converting Time to Milliseconds' },
  { id: 'conversion-chart', label: 'Milliseconds Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use Our Milliseconds Converter' },
  { id: 'related-tools', label: 'Other Time Unit Converters' },
  { id: 'ms-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

function fmt(value: number, digits = 8): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

const CHART_MS = [1, 10, 100, 250, 500, 1000, 5000, 10_000, 30_000, 60_000, 120_000, 3_600_000] as const;

export const MS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-ms',
    title: 'What Is a Millisecond?',
    paragraphs: [
      'The Milliseconds Converter turns milliseconds into seconds, minutes, hours, days, and other time units used in programming, performance measurement, digital electronics, scientific experiments, animation timing, response times, and audio/video sync.',
      `A millisecond is one-thousandth of a second: 1 ms = 10⁻³ s, so ${MS_PER_SECOND} ms = 1 s.`,
      'Milliseconds give fine-grained timing for latency budgets, frame intervals, and instrumentation without requiring calendar dates.',
    ],
    formula: `1 ms = 10⁻³ s\n${MS_PER_SECOND} ms = 1 s`,
  },
  {
    id: 'ms-to-other',
    title: 'How to Convert Time in Milliseconds Into Other Units',
    paragraphs: [
      `1 ms = 0.001 s = 1/${MS_PER_MINUTE} min = 1/${MS_PER_HOUR} h = 1/${MS_PER_DAY} day.`,
      'Divide milliseconds by the milliseconds-per-unit factor to move to a larger unit.',
      `Example: 5000 ms ÷ ${MS_PER_SECOND} = 5 seconds.`,
      `Example: 120000 ms ÷ ${MS_PER_MINUTE} = 2 minutes.`,
      `Example: 7200000 ms ÷ ${MS_PER_HOUR} = 2 hours.`,
    ],
    formula: `seconds = ms / ${MS_PER_SECOND}\nminutes = ms / ${MS_PER_MINUTE}\nhours = ms / ${MS_PER_HOUR}\ndays = ms / ${MS_PER_DAY}`,
  },
  {
    id: 'to-milliseconds',
    title: 'Converting Time to Milliseconds',
    paragraphs: [
      'Multiply by the milliseconds-per-unit factor when converting from a larger unit into milliseconds.',
      `2 seconds = ${2 * MS_PER_SECOND} ms; 5 minutes = ${5 * MS_PER_MINUTE} ms; 3 hours = ${3 * MS_PER_HOUR} ms; 1 day = ${MS_PER_DAY} ms.`,
      `Weeks use ${MS_PER_WEEK} ms. Years in this tool follow the shared Omega Calculators Julian convention (365.25 days ≈ ${MS_PER_JULIAN_YEAR} ms), not a fixed 365-day calendar year.`,
    ],
    formula: `ms = seconds × ${MS_PER_SECOND}\nms = minutes × ${MS_PER_MINUTE}\nms = hours × ${MS_PER_HOUR}\nms = days × ${MS_PER_DAY}`,
  },
  {
    id: 'conversion-chart',
    title: 'Milliseconds Conversion Chart',
    paragraphs: [
      'Common millisecond values with table display rounded for readability. Live calculator fields keep full precision.',
    ],
    tableHeaders: ['Milliseconds (ms)', 'Seconds (s)', 'Minutes (min)'],
    table: CHART_MS.map((ms) => [
      String(ms),
      fmt(convertTime(ms, 'milliseconds', 'seconds')),
      fmt(convertTime(ms, 'milliseconds', 'minutes')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use Our Milliseconds Converter',
    paragraphs: [
      '1. Enter the time value in milliseconds.',
      '2. View the corresponding values in seconds, minutes, hours, and days.',
      '3. Select additional time units (ns, µs, weeks, fortnights, years) when needed.',
      '4. Enter a value in another field to perform reverse conversion.',
      '5. Use Reload calculator to restore defaults.',
      '6. Use Clear all changes to empty the fields.',
      '7. Share the result with Share result.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Time Unit Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Hour Converter, Hours to Minutes Converter, Hours to Seconds Converter, Hours to Days Calculator, Hours to Week Conversion, Hours to Years Converter, Minutes Converter, Seconds Converter, Seconds to Minutes Converter, Minutes to Seconds Converter, and Seconds to Hours Converter. Only active catalog tools appear as live links.',
    ],
  },
];

export const MS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 220 Milliseconds Into Seconds?',
    answer: `Divide by ${MS_PER_SECOND}. 220 ÷ ${MS_PER_SECOND} = 0.22 seconds.`,
  },
  {
    question: 'How Many Milliseconds Are in One Second?',
    answer: `Exactly ${MS_PER_SECOND} milliseconds.`,
  },
  {
    question: 'What Is the Conversion Factor Between Minutes and Milliseconds?',
    answer: `1 minute = ${MS_PER_MINUTE} milliseconds.`,
  },
  {
    question: 'How Many Milliseconds Are in One Hour?',
    answer: `1 hour = ${MS_PER_HOUR} milliseconds.`,
  },
  {
    question: 'How Do I Convert 500 Milliseconds to Seconds?',
    answer: `500 ÷ ${MS_PER_SECOND} = 0.5 seconds.`,
  },
  {
    question: 'How Many Milliseconds Are in One Day?',
    answer: `1 day = ${MS_PER_DAY} milliseconds.`,
  },
  {
    question: 'How Do I Convert 2500 Milliseconds to Seconds?',
    answer: `2500 ÷ ${MS_PER_SECOND} = 2.5 seconds.`,
  },
  {
    question: 'What Is the Difference Between a Microsecond and a Millisecond?',
    answer: 'One millisecond equals 1000 microseconds. 1 ms = 1000 µs.',
  },
];
