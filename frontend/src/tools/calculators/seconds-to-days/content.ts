import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { SECONDS_PER_DAY, daysToSeconds, formatDuration, secondsToDays } from './calculation';

export const S2D_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Seconds to Days Converter' },
  { id: 'how-to-convert', label: 'How to Convert Seconds to Days' },
  { id: 'how-it-works', label: 'How Does the Converter Work?' },
  { id: 'days-to-seconds', label: 'How to Convert Days to Seconds' },
  { id: 'conversion-chart', label: 'Seconds to Days Conversion Chart' },
  { id: 'related-tools', label: 'Other Similar Time Conversion Tools' },
  { id: 'seconds-to-days-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_SECONDS = [
  1, 60, 3_600, 21_600, 43_200, 86_400, 172_800, 604_800, 1_000_000, 2_592_000,
] as const;

export const S2D_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Seconds to Days Converter',
    paragraphs: [
      'Convert seconds into days and days back into seconds with a fixed 24-hour day. Use it for scheduling, time tracking, project planning, scientific calculations, event durations, programming timers, and everyday time math.',
      `This converter treats one day as exactly ${SECONDS_PER_DAY.toLocaleString('en-US')} seconds (24 × 60 × 60).`,
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Seconds to Days',
    paragraphs: [
      'One day contains 24 hours, and each hour contains 3,600 seconds.',
      '24 × 3,600 = 86,400, so days = seconds ÷ 86,400.',
      `Example 1 — 86,400 seconds: 86,400 ÷ 86,400 = ${formatDuration(secondsToDays(86_400))} day.`,
      `Example 2 — 1,000,000 seconds: 1,000,000 ÷ 86,400 ≈ ${formatDuration(secondsToDays(1_000_000))} days.`,
      `Example 3 — 43,200 seconds: 43,200 ÷ 86,400 = ${formatDuration(secondsToDays(43_200))} days.`,
    ],
    formula:
      'Days = Seconds / 86400\n86400 ÷ 86400 = 1 day\n1000000 ÷ 86400 ≈ 11.57407407 days\n43200 ÷ 86400 = 0.5 days',
  },
  {
    id: 'how-it-works',
    title: 'How Does the Seconds to Days Converter Work?',
    paragraphs: [
      '1. Enter a duration in seconds.',
      '2. The converter divides the input by 86,400.',
      '3. The equivalent number of days appears automatically.',
      '4. Edit the days field to perform the reverse calculation.',
      '5. Use the result in planning, research, or other calculations.',
      'Both fields update in real time — there is no separate Calculate button.',
    ],
  },
  {
    id: 'days-to-seconds',
    title: 'How to Convert Days to Seconds',
    paragraphs: [
      'Multiply the number of days by 86,400.',
      `1 day = ${daysToSeconds(1).toLocaleString('en-US')} seconds`,
      `2 days = ${daysToSeconds(2).toLocaleString('en-US')} seconds`,
      `5 days = ${daysToSeconds(5).toLocaleString('en-US')} seconds`,
      `7 days = ${daysToSeconds(7).toLocaleString('en-US')} seconds`,
      `10 days = ${daysToSeconds(10).toLocaleString('en-US')} seconds`,
    ],
    formula: 'Seconds = Days × 86400',
  },
  {
    id: 'conversion-chart',
    title: 'Seconds to Days Conversion Chart',
    paragraphs: [
      'Common second values converted with the exact factor 1 day = 86,400 seconds. Values come from the same conversion engine used by the calculator.',
    ],
    tableHeaders: ['Seconds', 'Days'],
    table: TABLE_SECONDS.map((sec) => [
      sec.toLocaleString('en-US'),
      formatDuration(secondsToDays(sec)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Similar Time Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Milliseconds Converter, Seconds Converter, Minute Converter, Hour Converter, Day Converter, Milliseconds to Seconds Converter, Minutes to Days Calculator, and Hours to Days Calculator. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const S2D_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Calculate How Many Days Are in 1 Million Seconds?',
    answer: `Divide 1,000,000 by 86,400. 1,000,000 ÷ 86,400 ≈ ${formatDuration(secondsToDays(1_000_000))}. Therefore, 1 million seconds is approximately 11.57 days.`,
  },
  {
    question: 'How Many Days Are in 1 Billion Seconds?',
    answer: `1,000,000,000 ÷ 86,400 ≈ ${formatDuration(secondsToDays(1_000_000_000))}. That is about 11,574.07 days, or roughly 31.69 average Gregorian years (365.2425 days/year).`,
  },
  {
    question: 'How Many Seconds Are in a Day?',
    answer:
      'There are exactly 86,400 seconds in a standard 24-hour day: 24 × 60 × 60 = 86,400.',
  },
  {
    question: 'How Many Seconds Are in 7 Days?',
    answer: `7 × 86,400 = ${daysToSeconds(7).toLocaleString('en-US')}. There are 604,800 seconds in 7 days.`,
  },
  {
    question: 'How Do I Convert 90,000 Seconds to Days?',
    answer: `90,000 ÷ 86,400 ≈ ${formatDuration(secondsToDays(90_000))}. Therefore, 90,000 seconds is approximately 1.0417 days.`,
  },
  {
    question: 'Is 86,400 Seconds Always Equal to One Day?',
    answer:
      'A fixed 24-hour duration contains exactly 86,400 SI seconds. Local civil days can differ during daylight saving transitions, and elapsed time between calendar dates may require timezone-aware calculations. This converter uses a fixed 24-hour day.',
  },
];
