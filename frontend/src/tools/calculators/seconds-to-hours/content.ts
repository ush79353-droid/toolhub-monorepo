import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  SECONDS_PER_HOUR,
  formatDuration,
  hoursToSeconds,
  secondsToHours,
  secondsToTimeParts,
} from './calculation';

export const S2H_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Seconds to Hours Converter' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'manual-convert', label: 'How to Convert Seconds to Hours Manually' },
  { id: 'hours-to-seconds', label: 'How to Convert Hours to Seconds' },
  { id: 'conversion-chart', label: 'Seconds to Hours Conversion Chart' },
  { id: 'related-tools', label: 'Related Time Conversion Calculators' },
  { id: 'seconds-to-hours-faq', label: 'Frequently Asked Questions' },
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
  1, 30, 60, 300, 900, 1_800, 3_600, 7_200, 10_800, 21_600, 43_200, 86_400,
] as const;

export const S2H_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Seconds to Hours Converter',
    paragraphs: [
      'Convert durations between seconds and hours, and view the same duration as hours, minutes, and seconds. Use it for work-hour calculations, scheduling, project management, video and audio durations, exercise tracking, scientific measurements, and programming timers.',
      `Exact relationship: 1 hour = ${SECONDS_PER_HOUR.toLocaleString('en-US')} seconds (60 × 60).`,
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Seconds to Hours Converter',
    paragraphs: [
      '1. Enter the number of seconds in the Seconds field.',
      '2. The calculator divides the seconds by 3,600.',
      '3. The equivalent number of hours appears automatically.',
      '4. The Hours, Minutes, and Seconds breakdown is also calculated.',
      '5. Enter hours or edit the combined Time fields to calculate in reverse.',
      `Example — 7,260 seconds: 7,260 ÷ 3,600 ≈ ${formatDuration(secondsToHours(7_260))} hours. Breakdown: ${secondsToTimeParts(7_260).label} (7,260 = 2×3,600 + 1×60).`,
    ],
    formula:
      '7260 ÷ 3600 = 2.016666… hours\n7260 = 2(3600) + 1(60)\n7260 seconds = 2 hours and 1 minute',
  },
  {
    id: 'manual-convert',
    title: 'How to Convert Seconds to Hours Manually',
    paragraphs: [
      'An hour has 60 minutes and each minute contains 60 seconds, so 60 × 60 = 3,600.',
      'Therefore hours = seconds ÷ 3,600.',
      `Example — 1,920 seconds: 1,920 ÷ 3,600 ≈ ${formatDuration(secondsToHours(1_920))} hours, which is 32 minutes.`,
    ],
    formula: 'Hours = Seconds / 3600\n1920 ÷ 3600 ≈ 0.533333… hours (= 32 minutes)',
  },
  {
    id: 'hours-to-seconds',
    title: 'How to Convert Hours to Seconds',
    paragraphs: [
      'Multiply the number of hours by 3,600.',
      `0.5 hours = ${hoursToSeconds(0.5).toLocaleString('en-US')} seconds`,
      `1 hour = ${hoursToSeconds(1).toLocaleString('en-US')} seconds`,
      `2 hours = ${hoursToSeconds(2).toLocaleString('en-US')} seconds`,
      `3 hours = ${hoursToSeconds(3).toLocaleString('en-US')} seconds`,
      `5 hours = ${hoursToSeconds(5).toLocaleString('en-US')} seconds`,
      `12 hours = ${hoursToSeconds(12).toLocaleString('en-US')} seconds`,
      `24 hours = ${hoursToSeconds(24).toLocaleString('en-US')} seconds`,
    ],
    formula: 'Seconds = Hours × 3600',
  },
  {
    id: 'conversion-chart',
    title: 'Seconds to Hours Conversion Chart',
    paragraphs: [
      'Common second values converted with the exact factor 1 hour = 3,600 seconds. Values come from the same conversion engine used by the calculator.',
    ],
    tableHeaders: ['Seconds', 'Hours'],
    table: TABLE_SECONDS.map((sec) => [
      sec.toLocaleString('en-US'),
      formatDuration(secondsToHours(sec)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Related Time Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Seconds Converter, Minute Converter, Hour Converter, Minutes to Seconds Converter, Hours to Seconds Converter, Seconds to Days Converter, and Hours to Days Calculator. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const S2H_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Seconds Make an Hour?',
    answer: `One hour contains exactly ${SECONDS_PER_HOUR.toLocaleString('en-US')} seconds: 60 × 60 = 3,600.`,
  },
  {
    question: 'How Do I Convert 1,920 Seconds into Hours?',
    answer: `Divide 1,920 by 3,600: 1,920 ÷ 3,600 ≈ ${formatDuration(secondsToHours(1_920))}. Therefore 1,920 seconds is approximately 0.5333 hours, equivalent to 32 minutes.`,
  },
  {
    question: 'How Many Seconds Are in a Day?',
    answer:
      'One standard day contains 24 hours. 24 × 3,600 = 86,400. Therefore one day contains 86,400 seconds.',
  },
  {
    question: 'How Many Hours Are in 10,000 Seconds?',
    answer: `10,000 ÷ 3,600 ≈ ${formatDuration(secondsToHours(10_000))}. That is approximately 2.7778 hours, or ${secondsToTimeParts(10_000).label}.`,
  },
  {
    question: 'How Do I Convert 90 Minutes into Hours?',
    answer: '90 ÷ 60 = 1.5. Therefore 90 minutes equals 1.5 hours.',
  },
  {
    question: 'What Is the Difference Between Decimal Hours and Hours, Minutes, and Seconds?',
    answer:
      'Decimal hours express time as a single numeric value, while hours, minutes, and seconds express the same duration as separate components. Example: 1.5 decimal hours = 1 hour, 30 minutes, 0 seconds.',
  },
];
