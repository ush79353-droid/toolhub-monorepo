import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  DAYS_PER_GREGORIAN_YEAR,
  formatDuration,
  MILLISECONDS_PER_DAY,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
  millisecondsToSeconds,
  secondsToMilliseconds,
} from './calculation';

export const MS_TO_SECONDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'ms to Seconds Converter' },
  { id: 'what-is-ms', label: 'What Is a Millisecond?' },
  { id: 'conversion-rate', label: 'ms to Seconds Conversion Rate' },
  { id: 'ms-to-s', label: 'How to Convert Milliseconds to Seconds' },
  { id: 's-to-ms', label: 'How to Convert Seconds to Milliseconds' },
  { id: 'how-to-use', label: 'How to Use the ms to Seconds Converter' },
  { id: 'conversion-table', label: 'Milliseconds to Seconds Conversion Chart' },
  { id: 'related-tools', label: 'Other Time Converters' },
  { id: 'ms-to-seconds-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MS = [
  1, 5, 10, 25, 50, 65, 100, 250, 305, 500, 750, 1000, 1500, 5000, 10000,
] as const;

export const MS_TO_SECONDS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'ms to Seconds Converter',
    paragraphs: [
      'Convert milliseconds into seconds and other time units. Useful for programming, JavaScript timers, API response times, website performance, animation timing, video processing, scientific measurements, stopwatch readings, and electronics.',
      `Exact SI relationship: 1 second = ${MILLISECONDS_PER_SECOND} milliseconds. Years and months use average Gregorian durations (${DAYS_PER_GREGORIAN_YEAR} days/year), not fixed calendar dates.`,
    ],
  },
  {
    id: 'what-is-ms',
    title: 'What Is a Millisecond?',
    paragraphs: [
      `A millisecond is one-thousandth of a second: 1 ms = ${formatDuration(millisecondsToSeconds(1))} s.`,
      `Therefore ${MILLISECONDS_PER_SECOND} ms = 1 s exactly.`,
    ],
    formula: `1 ms = 0.001 s\n${MILLISECONDS_PER_SECOND} ms = 1 s`,
  },
  {
    id: 'conversion-rate',
    title: 'ms to Seconds Conversion Rate',
    paragraphs: [
      `Seconds = milliseconds ÷ ${MILLISECONDS_PER_SECOND}. Milliseconds = seconds × ${MILLISECONDS_PER_SECOND}.`,
      `Examples: 65 ms = ${formatDuration(millisecondsToSeconds(65))} s; 305 ms = ${formatDuration(millisecondsToSeconds(305))} s; 1000 ms = ${formatDuration(millisecondsToSeconds(1000))} s; 2500 ms = ${formatDuration(millisecondsToSeconds(2500))} s.`,
    ],
    formula: `s = ms ÷ ${MILLISECONDS_PER_SECOND}\nms = s × ${MILLISECONDS_PER_SECOND}`,
  },
  {
    id: 'ms-to-s',
    title: 'How to Convert Milliseconds to Seconds',
    paragraphs: [
      '1. Take the time in milliseconds.',
      `2. Divide the value by ${MILLISECONDS_PER_SECOND}.`,
      '3. Express the result in seconds.',
      `Example: 305 ÷ ${MILLISECONDS_PER_SECOND} = ${formatDuration(millisecondsToSeconds(305))} s.`,
    ],
  },
  {
    id: 's-to-ms',
    title: 'How to Convert Seconds to Milliseconds',
    paragraphs: [
      '1. Take the time in seconds.',
      `2. Multiply it by ${MILLISECONDS_PER_SECOND}.`,
      '3. Express the result in milliseconds.',
      `Example: 7 × ${MILLISECONDS_PER_SECOND} = ${formatDuration(secondsToMilliseconds(7))} ms.`,
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the ms to Seconds Converter',
    paragraphs: [
      '1. Enter the milliseconds value.',
      '2. Read the seconds result.',
      '3. Alternatively, enter seconds and read milliseconds.',
      '4. Expand Other Units for years, months, weeks, days, hours, minutes, and mixed HMS.',
      '5. Conversion updates automatically — no Calculate button is required.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Milliseconds to Seconds Conversion Chart',
    paragraphs: [
      'Common millisecond values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Milliseconds', 'Seconds'],
    table: TABLE_MS.map((ms) => [
      formatDuration(ms),
      formatDuration(millisecondsToSeconds(ms)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Time Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Milliseconds Converter, Minutes to Seconds Converter, Minutes to Days Calculator, Minutes to Years Conversion, Hour Converter, and Day Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MS_TO_SECONDS_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is 65 ms in Seconds?',
    answer: `65 milliseconds equals ${formatDuration(millisecondsToSeconds(65))} seconds (65 ÷ ${MILLISECONDS_PER_SECOND}).`,
  },
  {
    question: 'How Many Milliseconds Are in a Second?',
    answer: `There are exactly ${MILLISECONDS_PER_SECOND} milliseconds in one second.`,
  },
  {
    question: 'How Do I Convert 500 ms to Seconds?',
    answer: `Divide 500 by ${MILLISECONDS_PER_SECOND}: 500 ÷ ${MILLISECONDS_PER_SECOND} = ${formatDuration(millisecondsToSeconds(500))} s.`,
  },
  {
    question: 'How Many Milliseconds Are in a Minute?',
    answer: `There are exactly ${MILLISECONDS_PER_MINUTE.toLocaleString('en-US')} milliseconds in one minute (60 × ${MILLISECONDS_PER_SECOND}).`,
  },
  {
    question: 'Is 100 ms Equal to 1 Second?',
    answer: `No. 100 ms equals ${formatDuration(millisecondsToSeconds(100))} seconds. One second equals ${MILLISECONDS_PER_SECOND} ms.`,
  },
  {
    question: 'How Many Milliseconds Are in a Day?',
    answer: `One standard 24-hour day contains ${MILLISECONDS_PER_DAY.toLocaleString('en-US')} ms (24 × 60 × 60 × ${MILLISECONDS_PER_SECOND}).`,
  },
  {
    question: 'Can Milliseconds Have Decimal Values?',
    answer: `Yes. For example, 0.5 ms = ${formatDuration(millisecondsToSeconds(0.5))} s. Fractional milliseconds are useful in precise timing and scientific measurements.`,
  },
];
