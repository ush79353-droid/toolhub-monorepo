import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  convertTime,
  formatDuration,
  hmsToSeconds,
  MINUTES_PER_DAY,
  MINUTES_PER_GREGORIAN_MONTH,
  MINUTES_PER_GREGORIAN_YEAR,
  MINUTES_PER_WEEK,
  secondsToHms,
} from './calculation';

export const MINUTE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'conversion-rates', label: 'Conversion Rates for Time Units' },
  { id: 'conversion-table', label: 'Minute Conversion Table' },
  { id: 'how-to-use', label: 'How to Use This Minute Converter' },
  { id: 'minutes-to-hours', label: 'How to Convert Minutes to Hours' },
  { id: 'minutes-to-seconds', label: 'How to Convert Minutes to Seconds' },
  { id: 'minutes-to-days', label: 'How to Convert Minutes to Days' },
  { id: 'minutes-to-weeks', label: 'How to Convert Minutes to Weeks' },
  { id: 'hms-breakdown', label: 'Converting Minutes into Hours, Minutes, and Seconds' },
  { id: 'related-tools', label: 'Related Time Calculators' },
  { id: 'minute-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const MINUTE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'conversion-rates',
    title: 'Conversion Rates for Time Units',
    paragraphs: [
      'The Minute Converter converts minutes into seconds, hours, days, weeks, approximate months, and approximate years for scheduling, time tracking, project planning, study sessions, exercise durations, scientific calculations, and work-hour conversions.',
      'Exact relations: 1 minute = 60 seconds; 1 hour = 60 minutes; 1 day = 1,440 minutes; 1 week = 10,080 minutes.',
      `Calendar months and years vary. This tool uses the average Gregorian year: 1 average year = ${MINUTES_PER_GREGORIAN_YEAR} minutes; 1 average month = ${MINUTES_PER_GREGORIAN_MONTH} minutes.`,
    ],
    formula: `1 min = 60 s\n1 h = 60 min\n1 day = ${MINUTES_PER_DAY} min\n1 week = ${MINUTES_PER_WEEK} min\n1 avg year = ${MINUTES_PER_GREGORIAN_YEAR} min\n1 avg month = ${MINUTES_PER_GREGORIAN_MONTH} min`,
  },
  {
    id: 'conversion-table',
    title: 'Minute Conversion Table',
    paragraphs: [
      'How one minute maps into other units. Month and year rows use the average Gregorian conventions above.',
    ],
    tableHeaders: ['Unit', 'Conversion from 1 minute'],
    table: [
      ['Seconds', '60'],
      ['Minutes', '1'],
      ['Hours', formatDuration(convertTime(1, 'MINUTE', 'HOUR'))],
      ['Days', formatDuration(convertTime(1, 'MINUTE', 'DAY'))],
      ['Weeks', formatDuration(convertTime(1, 'MINUTE', 'WEEK'))],
      ['Average months', formatDuration(convertTime(1, 'MINUTE', 'MONTH'))],
      ['Average years', formatDuration(convertTime(1, 'MINUTE', 'YEAR'))],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use This Minute Converter',
    paragraphs: [
      '1. Enter a duration in the Minutes field.',
      '2. The calculator instantly converts it to the other supported units.',
      '3. Alternatively, enter a value in any other unit.',
      '4. All fields update automatically.',
      '5. Use Hours / Minutes / Seconds for combined durations (not clock time).',
      '6. Use Reload calculator to reset the tool.',
      '7. Use Clear all changes to empty all fields.',
    ],
  },
  {
    id: 'minutes-to-hours',
    title: 'How to Convert Minutes to Hours',
    paragraphs: [
      'Hours = Minutes / 60.',
      'Example: 150 ÷ 60 = 2.5 hours.',
    ],
    formula: 'Hours = Minutes / 60\n150 ÷ 60 = 2.5 hours',
  },
  {
    id: 'minutes-to-seconds',
    title: 'How to Convert Minutes to Seconds',
    paragraphs: [
      'Seconds = Minutes × 60.',
      'Example: 45 × 60 = 2,700 seconds.',
    ],
    formula: 'Seconds = Minutes × 60\n45 × 60 = 2700 seconds',
  },
  {
    id: 'minutes-to-days',
    title: 'How to Convert Minutes to Days',
    paragraphs: [
      `Days = Minutes / ${MINUTES_PER_DAY}.`,
      `Example: 2880 ÷ ${MINUTES_PER_DAY} = 2 days.`,
    ],
    formula: `Days = Minutes / ${MINUTES_PER_DAY}\n2880 ÷ ${MINUTES_PER_DAY} = 2 days`,
  },
  {
    id: 'minutes-to-weeks',
    title: 'How to Convert Minutes to Weeks',
    paragraphs: [
      `Weeks = Minutes / ${MINUTES_PER_WEEK}.`,
      `Example: 20160 ÷ ${MINUTES_PER_WEEK} = 2 weeks.`,
    ],
    formula: `Weeks = Minutes / ${MINUTES_PER_WEEK}\n20160 ÷ ${MINUTES_PER_WEEK} = 2 weeks`,
  },
  {
    id: 'hms-breakdown',
    title: 'Converting Minutes into Hours, Minutes, and Seconds',
    paragraphs: [
      'Break a duration into compound hours, minutes, and seconds (not a clock time of day).',
      (() => {
        const c = secondsToHms(135.75 * 60);
        return `Example: 135.75 minutes → ${c.hours} hours, ${c.minutes} minutes, ${formatDuration(c.seconds)} seconds.`;
      })(),
      (() => {
        const total = hmsToSeconds(2, 15, 45);
        return `Reverse: 2 h 15 min 45 sec = ${formatDuration(total / 60)} minutes.`;
      })(),
    ],
    formula: 'M = 60H + m + s/60\n135.75 min → 2 h 15 min 45 sec',
  },
  {
    id: 'related-tools',
    title: 'Related Time Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Hour Converter, Milliseconds Converter, Seconds Converter, Day Converter, Hours to Minutes Converter, Hours to Seconds Converter, Hours to Days Calculator, Hours to Week Conversion, Hours to Years Converter, Minutes to Days Calculator, and Seconds to Days Converter. Only active catalog tools appear as live links.',
    ],
  },
];

export const MINUTE_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Minutes Are in a Week?',
    answer: `One week contains seven days. 7 × 24 × 60 = ${MINUTES_PER_WEEK}. Therefore one week contains exactly ${MINUTES_PER_WEEK} minutes.`,
  },
  {
    question: 'How Do I Convert Minutes into Hours?',
    answer: 'Divide minutes by 60. For example, 150 ÷ 60 = 2.5 hours.',
  },
  {
    question: 'How Many Seconds Are in 15 Minutes?',
    answer: '15 × 60 = 900 seconds.',
  },
  {
    question: 'How Many Minutes Are in a Day?',
    answer: `24 × 60 = ${MINUTES_PER_DAY} minutes.`,
  },
  {
    question: 'How Many Minutes Are in 2 Hours?',
    answer: '2 × 60 = 120 minutes.',
  },
  {
    question: 'How Do I Convert 90 Minutes into Hours and Minutes?',
    answer: '90 minutes equals 1 hour and 30 minutes.',
  },
  {
    question: 'How Many Minutes Are in a Month?',
    answer: `It depends on the calendar month (28-day: 40,320; 30-day: 43,200; 31-day: 44,640). This calculator uses an average Gregorian month of ${MINUTES_PER_GREGORIAN_MONTH} minutes.`,
  },
  {
    question: 'How Many Minutes Are in a Year?',
    answer: `A common 365-day year has 525,600 minutes. An average Gregorian year has ${MINUTES_PER_GREGORIAN_YEAR} minutes — the convention this calculator uses.`,
  },
];
