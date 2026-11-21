import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatDuration,
  hoursToMinutes,
  hoursToSeconds,
  hmsToSeconds,
  minutesToHours,
  secondsToMinutes,
} from './calculation';
import { MINUTES_PER_HOUR, SECONDS_PER_HOUR } from './types';

export const HOURS_TO_MINUTES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How to Convert Hours to Minutes' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'conversion-table', label: 'Hours to Minutes Conversion Table' },
  { id: 'compound-time', label: 'Converting Hours, Minutes, and Seconds' },
  { id: 'related-tools', label: 'Other Time Unit Converters' },
  { id: 'hours-to-minutes-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { hours: string; minutes: string }[];
}

const TABLE_HOURS = [
  0.25, 0.5, 0.75, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 24, 48, 72,
] as const;

export const HOURS_TO_MINUTES_TABLE = TABLE_HOURS.map((hours) => ({
  hours: String(hours),
  minutes: formatDuration(hoursToMinutes(hours)),
}));

const compoundMinutes = 2 * 60 + 15 + 30 / 60;

export const HOURS_TO_MINUTES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How to Convert Hours to Minutes',
    paragraphs: [
      `One hour contains exactly ${MINUTES_PER_HOUR} minutes and exactly ${SECONDS_PER_HOUR} seconds.`,
      'To convert hours to minutes, multiply by 60. Example: 7 × 60 = 420, so 7 hours = 420 minutes.',
      'To convert minutes to hours, divide by 60. Example: 150 ÷ 60 = 2.5 hours.',
    ],
    formula: `1 hour = ${MINUTES_PER_HOUR} minutes\nMinutes = Hours × ${MINUTES_PER_HOUR}\nHours = Minutes ÷ ${MINUTES_PER_HOUR}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Hours to Minutes Converter',
    paragraphs: [
      '1. Enter a value in the Hours field. minutes and seconds update instantly.',
      '2. Or enter minutes to calculate hours and seconds.',
      '3. Or enter seconds to calculate hours and minutes.',
      '4. Use the compound Time field for hours, minutes, and seconds together.',
      '5. Change any value to update the others; reload or clear to start again.',
      `Example: 24 hours = ${formatDuration(hoursToMinutes(24))} minutes = ${formatDuration(hoursToSeconds(24))} seconds.`,
    ],
  },
  {
    id: 'conversion-table',
    title: 'Hours to Minutes Conversion Table',
    paragraphs: ['Common hour values converted with the same engine used by the calculator.'],
    table: HOURS_TO_MINUTES_TABLE,
  },
  {
    id: 'compound-time',
    title: 'Converting Hours, Minutes, and Seconds',
    paragraphs: [
      `Example: convert 2 hours 15 minutes 30 seconds into minutes. 2 × 60 + 15 + 30 ÷ 60 = ${formatDuration(compoundMinutes)} minutes.`,
      `And ${formatDuration(compoundMinutes)} × 60 = ${formatDuration(hmsToSeconds(2, 15, 30))} seconds.`,
    ],
    formula: 'total_seconds = hours × 3600 + minutes × 60 + seconds',
  },
  {
    id: 'related-tools',
    title: 'Other Time Unit Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Hour Converter, Hours to Days Calculator, Time Unit Converter, Days to Weeks Calculator, and Days to Years Calculator. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const HOURS_TO_MINUTES_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is the Rule for Converting Hours to Minutes?',
    answer: `Multiply hours by ${MINUTES_PER_HOUR}. Example: 2 × 60 = ${formatDuration(hoursToMinutes(2))} minutes.`,
  },
  {
    question: 'How Many Minutes Are in an Hour?',
    answer: `There are exactly ${MINUTES_PER_HOUR} minutes in one hour, and exactly ${SECONDS_PER_HOUR} seconds in one hour.`,
  },
  {
    question: 'How Do I Convert 7 Hours into Minutes?',
    answer: `7 × 60 = ${formatDuration(hoursToMinutes(7))}. Therefore 7 hours = 420 minutes.`,
  },
  {
    question: 'How Many Minutes Are in 24 Hours?',
    answer: `24 × 60 = ${formatDuration(hoursToMinutes(24))}. Therefore 24 hours = 1,440 minutes.`,
  },
  {
    question: 'How Many Hours Are 90 Minutes?',
    answer: `90 ÷ 60 = ${formatDuration(minutesToHours(90))}. Therefore 90 minutes = 1.5 hours.`,
  },
  {
    question: 'How Do I Convert 135 Minutes into Hours and Minutes?',
    answer:
      '135 ÷ 60 = 2 complete hours with 15 minutes remaining. Therefore 135 minutes = 2 hours 15 minutes.',
  },
  {
    question: 'How Many Minutes Are in 2.5 Hours?',
    answer: `2.5 × 60 = ${formatDuration(hoursToMinutes(2.5))}. Therefore 2.5 hours = 150 minutes.`,
  },
  {
    question: 'How Do I Convert Seconds into Minutes?',
    answer: `Divide seconds by 60. Example: 3,600 ÷ 60 = ${formatDuration(secondsToMinutes(3600))}, so 3,600 seconds = 60 minutes.`,
  },
];
