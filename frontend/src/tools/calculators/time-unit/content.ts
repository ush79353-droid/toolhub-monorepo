import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TIME_UNIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to Use the Time Unit Converter' },
  { id: 'how-it-works', label: 'How the Time Unit Converter Works' },
  { id: 'convert-larger', label: 'How to Convert Between Units of Time; Larger to Smaller' },
  { id: 'convert-smaller', label: 'How to Convert Between Units of Time; Smaller to Larger' },
  { id: 'conversion-table', label: 'Time Unit Conversion Table' },
  { id: 'applications', label: 'Common Applications of Time Conversion' },
  { id: 'time-unit-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly [string, string];
  table?: readonly { left: string; right: string }[];
}

export const TIME_UNIT_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'How to Use the Time Unit Converter',
    paragraphs: [
      '1. Choose any of the seven fields: years, months, weeks, days, hours, minutes, or seconds.',
      '2. Enter a duration. The remaining fields update immediately from one shared value in seconds.',
      '3. Edit a different unit to reverse the conversion.',
      '4. Open Other time units to convert milliseconds, microseconds, nanoseconds, fortnights, decades, centuries, or millennia.',
      '5. Share the result, or use Reload Calculator / Clear All Changes to reset.',
    ],
  },
  {
    id: 'how-it-works',
    title: 'How the Time Unit Converter Works',
    paragraphs: [
      'Common clock units have fixed SI relationships. Months and years do not: calendar months have 28–31 days, and a calendar year is 365 or 366 days. This converter uses a single average-year convention so every field stays consistent.',
      'An average year is 365.25 days (the Julian-year length). An average month is one twelfth of that year, 30.4375 days. Those factors are for duration conversion without a start date. Exact elapsed time between two calendar dates still depends on leap years and month lengths. Time-zone offsets are a separate problem.',
    ],
    formula:
      '1 minute = 60 seconds · 1 hour = 60 minutes · 1 day = 24 hours · 1 week = 7 days · 1 average year = 365.25 days · 1 average month = 30.4375 days',
  },
  {
    id: 'convert-larger',
    title: 'How to Convert Between Units of Time; From Hours to Minutes, From Years to Seconds',
    paragraphs: [
      'Convert through seconds: target = input × (source seconds) ÷ (target seconds). Hours to minutes: 3 × 60 = 180 minutes. Days to hours: 5 × 24 = 120 hours. Weeks to seconds: 1 × 7 × 24 × 60 × 60 = 604,800 seconds. Average years to seconds: 1 × 365.25 × 24 × 60 × 60 = 31,557,600 seconds.',
    ],
    formula: 'Target value = Input value × Source unit in seconds / Target unit in seconds',
  },
  {
    id: 'convert-smaller',
    title: 'How to Convert Between Units of Time; From Minutes to Hours, Hours to Days, Milliseconds to Minutes',
    paragraphs: [
      'Divide when moving to a larger unit. Minutes to hours: 150 / 60 = 2.5 hours. Hours to days: 48 / 24 = 2 days. Seconds to minutes: 180 / 60 = 3 minutes. Milliseconds to seconds: 5,000 / 1,000 = 5 seconds. Milliseconds to minutes: 120,000 / 60,000 = 2 minutes.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Time Unit Conversion Table',
    paragraphs: ['Seconds for each unit using this converter’s average-year convention:'],
    tableHeaders: ['Time unit', 'Equivalent'],
    table: [
      { left: '1 microsecond', right: '0.000001 seconds' },
      { left: '1 millisecond', right: '0.001 seconds' },
      { left: '1 second', right: '1 second' },
      { left: '1 minute', right: '60 seconds' },
      { left: '1 hour', right: '3,600 seconds' },
      { left: '1 day', right: '86,400 seconds' },
      { left: '1 week', right: '604,800 seconds' },
      { left: '1 average month', right: '2,629,800 seconds' },
      { left: '1 average year', right: '31,557,600 seconds' },
      { left: '1 average decade', right: '315,576,000 seconds' },
      { left: '1 average century', right: '3,155,760,000 seconds' },
    ],
  },
  {
    id: 'applications',
    title: 'Common Applications of Time Conversion',
    paragraphs: [
      'Duration conversion appears in scheduling, classroom unit work, laboratory timing, engineering logs, sports splits, project estimates, software timeouts, travel elapsed time, and historical spans written in years or centuries.',
      'This tool converts a length of time. It does not convert clock times between time zones, and it does not add days onto a calendar date.',
    ],
  },
];

export const TIME_UNIT_FAQS: readonly FAQItem[] = [
  {
    question: 'How many seconds are in one minute?',
    answer: '60 seconds.',
  },
  {
    question: 'How many minutes are in one hour?',
    answer: '60 minutes.',
  },
  {
    question: 'How many hours are in one day?',
    answer: '24 hours.',
  },
  {
    question: 'How many minutes are in one day?',
    answer: '1,440 minutes.',
  },
  {
    question: 'How many seconds are in one day?',
    answer: '86,400 seconds.',
  },
  {
    question: 'How many hours are in one week?',
    answer: '168 hours.',
  },
  {
    question: 'How many minutes are in one week?',
    answer: '10,080 minutes.',
  },
  {
    question: 'How many seconds are in one week?',
    answer: '604,800 seconds.',
  },
  {
    question: 'How many days are in one year?',
    answer:
      'An average Gregorian calendar year contains 365.2425 days over its 400-year cycle. This calculator uses a simplified average-year convention of 365.25 days. An individual calendar year contains either 365 or 366 days.',
  },
  {
    question: 'How many seconds are in a year?',
    answer: 'Using this converter’s convention: 365.25 × 24 × 60 × 60 = 31,557,600 seconds.',
  },
  {
    question: 'How do I convert minutes to hours?',
    answer: 'Divide by 60. Example: 180 / 60 = 3 hours.',
  },
  {
    question: 'How do I convert hours to days?',
    answer: 'Divide by 24. Example: 72 / 24 = 3 days.',
  },
  {
    question: 'How do I convert seconds to hours?',
    answer: 'Divide by 3,600. Example: 7,200 / 3,600 = 2 hours.',
  },
  {
    question: 'Are months always 30 days?',
    answer:
      'No. Calendar months contain between 28 and 31 days. This converter uses an average month of 30.4375 days (1/12 of a 365.25-day year) for duration estimates without calendar dates.',
  },
  {
    question: 'Can I convert negative time values?',
    answer:
      'Yes. Negative durations are valid in the arithmetic. They do not represent a negative amount of elapsed time in everyday usage.',
  },
];
