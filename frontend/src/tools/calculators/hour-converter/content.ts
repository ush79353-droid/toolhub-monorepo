import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertTime,
  formatDuration,
  hmsToSeconds,
  secondsToHms,
} from './calculation';
import {
  HOURS_PER_GREGORIAN_MONTH,
  HOURS_PER_GREGORIAN_YEAR,
  TIME_CONSTANTS,
} from './types';

export const HOUR_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'converting-hours', label: 'Converting Time from Hours to Other Units' },
  { id: 'conversion-table', label: 'Hour Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the Hour Converter' },
  { id: 'decimal-hours', label: 'Decimal Hours to Hours, Minutes, and Seconds' },
  { id: 'when-useful', label: 'When Is an Hour Converter Useful?' },
  { id: 'related-tools', label: 'Related Calculators' },
  { id: 'hour-converter-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly {
    hours: string;
    minutes: string;
    seconds: string;
    days: string;
  }[];
}

const TABLE_HOURS = [0.5, 1, 2, 5, 8, 12, 24, 48, 72, 168] as const;

export const HOUR_CONVERSION_TABLE = TABLE_HOURS.map((hours) => ({
  hours: String(hours),
  minutes: formatDuration(convertTime(hours, 'HOUR', 'MINUTE')),
  seconds: formatDuration(convertTime(hours, 'HOUR', 'SECOND')),
  days: formatDuration(Number(convertTime(hours, 'HOUR', 'DAY').toFixed(7))),
}));

const ex275 = secondsToHms(convertTime(2.75, 'HOUR', 'SECOND'));
const ex15125 = secondsToHms(hmsToSeconds(1, 30, 45));

export const HOUR_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'converting-hours',
    title: 'Converting Time from Hours to Other Units',
    paragraphs: [
      'One hour equals exactly 60 minutes, 3,600 seconds, 1/24 of a day, and 1/168 of a week.',
      `Months and years use average Gregorian calendar durations: 1 year = ${formatDuration(HOURS_PER_GREGORIAN_YEAR)} hours (365.2425 days), and 1 month = ${formatDuration(HOURS_PER_GREGORIAN_MONTH)} hours (30.436875 days). These are duration conventions, not calendar-date spans.`,
    ],
    formula: [
      'Hours to minutes: hours × 60',
      'Hours to seconds: hours × 3,600',
      'Hours to days: hours ÷ 24',
      'Hours to weeks: hours ÷ 168',
      `Hours to months: hours ÷ ${formatDuration(HOURS_PER_GREGORIAN_MONTH)}`,
      `Hours to years: hours ÷ ${formatDuration(HOURS_PER_GREGORIAN_YEAR)}`,
    ].join('\n'),
  },
  {
    id: 'conversion-table',
    title: 'Hour Conversion Table',
    paragraphs: [
      'Common hour values converted with the same engine used by the calculator.',
    ],
    table: HOUR_CONVERSION_TABLE,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Hour Converter',
    paragraphs: [
      '1. Enter a value in the Hours field or any other time unit field.',
      '2. The calculator automatically converts it into the remaining time units.',
      '3. Edit another field to convert in the opposite direction.',
      '4. Use Hours / Minutes / Seconds for compound measurements.',
      '5. Clear or reload the calculator to start again.',
    ],
  },
  {
    id: 'decimal-hours',
    title: 'Converting Decimal Hours to Hours, Minutes, and Seconds',
    paragraphs: [
      'Decimal hours (for example 2.75) are not the same as “2 hours and 75 minutes.” Convert the fractional part by multiplying by 60 for minutes, then residual minutes by 60 for seconds.',
      `Example: 2.75 hours → ${ex275.hours} hours ${ex275.minutes} minutes.`,
      `Example with seconds: 1.5125 hours = ${ex15125.label}.`,
    ],
    formula: 'hours_total = h + m/60 + s/3600',
  },
  {
    id: 'when-useful',
    title: 'When Is an Hour Converter Useful?',
    paragraphs: [
      'Use it for work schedules, payroll, study plans, travel planning, project timelines, time tracking, scientific durations, and converting decimal working hours into hours, minutes, and seconds.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Day Converter, Days to Weeks Calculator, Days to Months Calculator, Days to Years Calculator, Minutes to Hours Converter, and Milliseconds to Seconds Converter. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const HOUR_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Hours Are in a Year?',
    answer: `Using the average Gregorian calendar year: 365.2425 × 24 = ${formatDuration(HOURS_PER_GREGORIAN_YEAR)} hours. A common year has 8,760 hours; a leap year has 8,784 hours.`,
  },
  {
    question: 'How Do I Convert Hours into Days?',
    answer: 'Divide hours by 24. Example: 48 ÷ 24 = 2 days.',
  },
  {
    question: 'How Many Minutes Are in 2.5 Hours?',
    answer: `Multiply by 60: 2.5 × 60 = ${formatDuration(convertTime(2.5, 'HOUR', 'MINUTE'))} minutes.`,
  },
  {
    question: 'How Many Seconds Are in 8 Hours?',
    answer: `8 × 3,600 = ${formatDuration(convertTime(8, 'HOUR', 'SECOND'))} seconds.`,
  },
  {
    question: 'How Many Hours Are in One Week?',
    answer: 'Seven days × 24 hours = 168 hours.',
  },
  {
    question: 'How Do I Convert 1.75 Hours into Hours and Minutes?',
    answer: (() => {
      const parts = secondsToHms(convertTime(1.75, 'HOUR', 'SECOND'));
      return `The whole-hour component is ${parts.hours} hour. The remaining 0.75 hours equals ${parts.minutes} minutes. Therefore 1.75 hours = ${parts.hours} hour ${parts.minutes} minutes.`;
    })(),
  },
  {
    question: 'How Many Hours Are in a Month?',
    answer: `It depends on the calendar month (28–31 days → 672–744 hours). For general conversion this calculator uses an average Gregorian month of ${formatDuration(HOURS_PER_GREGORIAN_MONTH)} hours (${TIME_CONSTANTS.MONTH} seconds).`,
  },
];
