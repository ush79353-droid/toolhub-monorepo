import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  DAYS_PER_GREGORIAN_YEAR,
  SECONDS_PER_DAY,
  SECONDS_PER_GREGORIAN_MONTH,
  SECONDS_PER_GREGORIAN_YEAR,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  SECONDS_PER_WEEK,
  convertTime,
  formatDuration,
  secondsToHMS,
} from './calculation';

export const SECONDS_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Seconds Converter' },
  { id: 'converting', label: 'Converting Seconds into Different Time Units' },
  { id: 'conversion-chart', label: 'Seconds Conversion Chart' },
  { id: 'how-to-use', label: 'How to Use This Seconds Converter' },
  { id: 'seconds-to-minutes', label: 'How to Convert Seconds to Minutes' },
  { id: 'seconds-to-hours', label: 'How to Convert Seconds to Hours' },
  { id: 'seconds-to-days', label: 'How to Convert Seconds to Days' },
  { id: 'related-tools', label: 'Other Relevant Time Conversion Tools' },
  { id: 'seconds-converter-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_SECONDS = [1, 60, 300, 600, 1800, 3600, 7200, 86_400] as const;

export const SECONDS_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Seconds Converter',
    paragraphs: [
      'Convert seconds into minutes, hours, days, weeks, months, and years — and reverse any of those units back into seconds. Useful for scheduling, science, physics, work tracking, programming timers, event durations, and everyday duration math.',
      'Edit any field and the rest update from the same duration. Expand Time in other units for longer spans and a combined hours / minutes / seconds breakdown.',
    ],
  },
  {
    id: 'converting',
    title: 'Converting Seconds into Different Time Units',
    paragraphs: [
      `Fixed durations: 1 minute = ${SECONDS_PER_MINUTE} seconds, 1 hour = ${SECONDS_PER_HOUR.toLocaleString('en-US')} seconds, 1 day = ${SECONDS_PER_DAY.toLocaleString('en-US')} seconds, 1 week = ${SECONDS_PER_WEEK.toLocaleString('en-US')} seconds.`,
      `Average Gregorian calendar conventions (when no specific dates are supplied): 1 year = ${DAYS_PER_GREGORIAN_YEAR} days = ${SECONDS_PER_GREGORIAN_YEAR.toLocaleString('en-US')} seconds; 1 month = year ÷ 12 = ${SECONDS_PER_GREGORIAN_MONTH.toLocaleString('en-US')} seconds.`,
      'Actual calendar months and years vary. This converter uses average lengths so a single numeric duration can map to years/months without a start date.',
    ],
    formula: `1 min = ${SECONDS_PER_MINUTE} s\n1 hr = ${SECONDS_PER_HOUR} s\n1 day = ${SECONDS_PER_DAY} s\n1 wk = ${SECONDS_PER_WEEK} s\n1 avg Gregorian mo = ${SECONDS_PER_GREGORIAN_MONTH} s\n1 avg Gregorian yr = ${SECONDS_PER_GREGORIAN_YEAR} s`,
  },
  {
    id: 'conversion-chart',
    title: 'Seconds Conversion Chart',
    paragraphs: [
      'Common second values with equivalent minutes, hours, and days. Values use the same conversion engine as the calculator.',
    ],
    tableHeaders: ['Seconds', 'Minutes', 'Hours', 'Days'],
    table: CHART_SECONDS.map((sec) => [
      formatDuration(sec),
      formatDuration(convertTime(sec, 'sec', 'min')),
      formatDuration(convertTime(sec, 'sec', 'hrs')),
      formatDuration(convertTime(sec, 'sec', 'days')),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use This Seconds Converter',
    paragraphs: [
      '1. Enter a time value in seconds.',
      '2. Read the automatically calculated equivalents.',
      '3. Expand Time in other units for years through minutes.',
      '4. Enter a value into any supported unit for reverse conversion.',
      '5. Use the combined hours / minutes / seconds fields when needed.',
      '6. Share or reset your results with the action buttons.',
    ],
  },
  {
    id: 'seconds-to-minutes',
    title: 'How to Convert Seconds to Minutes',
    paragraphs: [
      `Divide seconds by ${SECONDS_PER_MINUTE}. Example: 300 ÷ ${SECONDS_PER_MINUTE} = ${formatDuration(convertTime(300, 'sec', 'min'))} minutes.`,
    ],
    formula: `minutes = seconds ÷ ${SECONDS_PER_MINUTE}`,
  },
  {
    id: 'seconds-to-hours',
    title: 'How to Convert Seconds to Hours',
    paragraphs: [
      `Divide seconds by ${SECONDS_PER_HOUR}. Example: 7200 ÷ ${SECONDS_PER_HOUR} = ${formatDuration(convertTime(7200, 'sec', 'hrs'))} hours.`,
    ],
    formula: `hours = seconds ÷ ${SECONDS_PER_HOUR}`,
  },
  {
    id: 'seconds-to-days',
    title: 'How to Convert Seconds to Days',
    paragraphs: [
      `Divide seconds by ${SECONDS_PER_DAY}. Example: 172800 ÷ ${SECONDS_PER_DAY} = ${formatDuration(convertTime(172_800, 'sec', 'days'))} days.`,
    ],
    formula: `days = seconds ÷ ${SECONDS_PER_DAY}`,
  },
  {
    id: 'related-tools',
    title: 'Other Relevant Time Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages include Time Unit Converter, Milliseconds Converter, Minute Converter, Hour Converter, Day Converter, Minutes to Days Calculator, Hours to Days Calculator, and ms to Seconds Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

const hms3665 = secondsToHMS(3665);

export const SECONDS_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Seconds into Days?',
    answer: `Divide the number of seconds by ${SECONDS_PER_DAY.toLocaleString('en-US')}. days = seconds ÷ ${SECONDS_PER_DAY}.`,
  },
  {
    question: 'How Many Seconds Are in One Year?',
    answer: `An average Gregorian year contains ${DAYS_PER_GREGORIAN_YEAR} × 24 × 60 × 60 = ${SECONDS_PER_GREGORIAN_YEAR.toLocaleString('en-US')} seconds. A standard 365-day year contains 31,536,000 seconds, while a 366-day leap year contains 31,622,400 seconds.`,
  },
  {
    question: 'How Many Seconds Are in One Hour?',
    answer: `One hour contains ${SECONDS_PER_HOUR.toLocaleString('en-US')} seconds.`,
  },
  {
    question: 'How Many Seconds Are in One Day?',
    answer: `One day contains ${SECONDS_PER_DAY.toLocaleString('en-US')} seconds.`,
  },
  {
    question: 'How Many Seconds Are in One Week?',
    answer: `One week contains ${SECONDS_PER_WEEK.toLocaleString('en-US')} seconds.`,
  },
  {
    question: 'How Do I Convert 90 Seconds to Minutes?',
    answer: `90 ÷ ${SECONDS_PER_MINUTE} = ${formatDuration(convertTime(90, 'sec', 'min'))} minutes. That is equivalent to 1 minute and 30 seconds.`,
  },
  {
    question: 'How Do I Convert Seconds to Hours, Minutes, and Seconds?',
    answer: `Divide the duration into complete hours, remaining minutes, and remaining seconds. Example: 3665 seconds → ${hms3665.hours} hour, ${hms3665.minutes} minute, ${formatDuration(hms3665.seconds)} seconds.`,
  },
  {
    question: 'Can I Convert Negative Seconds?',
    answer:
      'Yes. Negative values may represent time differences or durations relative to a reference point. This converter preserves the negative sign consistently.',
  },
];
