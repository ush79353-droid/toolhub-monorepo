import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatDuration,
  hoursToMinutes,
  hoursToSeconds,
  hmsToSeconds,
  secondsToHours,
} from './calculation';
import { MINUTES_PER_HOUR, SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from './types';

export const HOURS_TO_SECONDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How to Convert Hours to Seconds' },
  { id: 'conversion-table', label: 'Hours to Seconds Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'compound-time', label: 'Converting Hours, Minutes, and Seconds' },
  { id: 'related-tools', label: 'Other Related Calculators' },
  { id: 'hours-to-seconds-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { hours: string; seconds: string }[];
}

const TABLE_HOURS = [0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 24] as const;

export const HOURS_TO_SECONDS_TABLE = TABLE_HOURS.map((hours) => ({
  hours: String(hours),
  seconds: formatDuration(hoursToSeconds(hours)),
}));

export const HOURS_TO_SECONDS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How to Convert Hours to Seconds',
    paragraphs: [
      `One hour contains ${MINUTES_PER_HOUR} minutes, and every minute contains ${SECONDS_PER_MINUTE} seconds. Therefore ${MINUTES_PER_HOUR} × ${SECONDS_PER_MINUTE} = ${SECONDS_PER_HOUR}, so 1 hour = ${SECONDS_PER_HOUR} seconds.`,
      `To convert hours to seconds, multiply by ${SECONDS_PER_HOUR}. Example: 13 × 3600 = ${formatDuration(hoursToSeconds(13))}, so 13 hours = 46,800 seconds.`,
      `To convert seconds to hours, divide by ${SECONDS_PER_HOUR}. Example: 7200 ÷ 3600 = ${formatDuration(secondsToHours(7200))}, so 7,200 seconds = 2 hours.`,
    ],
    formula: `1 hour = ${SECONDS_PER_HOUR} seconds\nSeconds = Hours × ${SECONDS_PER_HOUR}\nHours = Seconds ÷ ${SECONDS_PER_HOUR}`,
  },
  {
    id: 'conversion-table',
    title: 'Hours to Seconds Conversion Table',
    paragraphs: ['Common hour values converted with the same engine used by the calculator.'],
    table: HOURS_TO_SECONDS_TABLE,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Hours to Seconds Converter',
    paragraphs: [
      '1. Enter the number of hours. seconds update instantly.',
      '2. Edit the seconds field to convert in reverse.',
      '3. Use the compound time field to enter hours, minutes, and seconds together.',
      '4. All related fields update automatically; reload or clear to start again.',
    ],
  },
  {
    id: 'compound-time',
    title: 'Converting Hours, Minutes, and Seconds Together',
    paragraphs: [
      'Total seconds = 3600h + 60m + s, where h, m, and s are hours, minutes, and seconds.',
      `Example: convert 2 hours, 15 minutes, and 30 seconds. 2(3600) + 15(60) + 30 = ${formatDuration(hmsToSeconds(2, 15, 30))}. Result: 8,130 seconds.`,
    ],
    formula: 'TotalSeconds = 3600h + 60m + s',
  },
  {
    id: 'related-tools',
    title: 'Other Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Hours to Minutes Converter, Hour Converter, Hours to Days Calculator, Time Unit Converter, and Days to Hours tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const HOURS_TO_SECONDS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Seconds Are in One Hour?',
    answer: `There are exactly ${SECONDS_PER_HOUR} seconds in one hour: ${MINUTES_PER_HOUR} × ${SECONDS_PER_MINUTE} = ${SECONDS_PER_HOUR}.`,
  },
  {
    question: 'How Do I Convert One Hour into Seconds?',
    answer: `Multiply by ${SECONDS_PER_HOUR}: 1 × 3600 = ${formatDuration(hoursToSeconds(1))}.`,
  },
  {
    question: 'How Many Hours Are Equal to One Second?',
    answer: `One second equals 1 ÷ ${SECONDS_PER_HOUR} hours ≈ ${formatDuration(Number(secondsToHours(1).toFixed(10)))} hours.`,
  },
  {
    question: 'How Many Seconds Are in 14 Hours?',
    answer: `14 × 3600 = ${formatDuration(hoursToSeconds(14))}. Therefore 14 hours = 50,400 seconds.`,
  },
  {
    question: 'How Many Seconds Are in 24 Hours?',
    answer: `24 × 3600 = ${formatDuration(hoursToSeconds(24))}. Therefore 24 hours = 86,400 seconds.`,
  },
  {
    question: 'How Many Seconds Are in Half an Hour?',
    answer: `0.5 × 3600 = ${formatDuration(hoursToSeconds(0.5))}. Therefore half an hour = 1,800 seconds.`,
  },
  {
    question: 'How Do I Convert 5,400 Seconds into Hours?',
    answer: `5400 ÷ 3600 = ${formatDuration(secondsToHours(5400))}. Therefore 5,400 seconds = 1.5 hours.`,
  },
  {
    question: 'How Many Seconds Are in 2 Hours and 30 Minutes?',
    answer: `2 × 3600 = 7,200 and 30 × 60 = 1,800; sum = ${formatDuration(hmsToSeconds(2, 30, 0))}. Therefore 2 hours 30 minutes = 9,000 seconds (${formatDuration(hoursToMinutes(2.5))} minutes).`,
  },
];
