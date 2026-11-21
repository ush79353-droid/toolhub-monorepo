import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const UNIX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-unix', label: 'What Is Unix Timestamp / Epoch?' },
  { id: 'conversion-chart', label: 'Unix Time Conversion Chart' },
  { id: 'peculiarities', label: 'Peculiarities of Unix Epoch Time' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'convert-by-hand', label: 'How to Convert Unix Time by Hand' },
  { id: 'year-2038', label: 'The 2038 Problem' },
  { id: 'unix-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string }[];
  tableHeaders?: readonly [string, string];
}

export const UNIX_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-unix',
    title: 'What Is the Current Unix Timestamp or Unix Epoch?',
    paragraphs: [
      'Unix time (epoch time) counts elapsed seconds relative to 1970-01-01 00:00:00 UTC, the Unix epoch. Systems store that integer so programs can compare and sort instants without local calendar formatting.',
      'Negative timestamps represent times before the epoch. Unix timestamps identify instants independently of time zone; UTC is the usual reference when converting them into calendar dates. POSIX Unix time does not insert leap seconds into the count.',
    ],
    formula: 'Epoch = 1970-01-01 00:00:00 UTC · unix_ms = unix_s × 1000',
  },
  {
    id: 'conversion-chart',
    title: 'Unix Time Conversion Chart',
    paragraphs: [
      'Useful second totals for estimation. Calendar months and years are not fixed lengths because of varying month lengths and leap years.',
    ],
    tableHeaders: ['Period', 'Seconds'],
    table: [
      { left: '1 minute', right: '60' },
      { left: '1 hour', right: '3,600' },
      { left: '1 day', right: '86,400' },
      { left: '1 week', right: '604,800' },
      { left: '30 days', right: '2,592,000' },
      { left: '365 days', right: '31,536,000' },
    ],
  },
  {
    id: 'peculiarities',
    title: 'Peculiarities of Unix Epoch Time',
    paragraphs: [
      'UTC anchors conversions; local labels come from time-zone rules. Daylight saving changes how a timestamp displays in a city but does not change the timestamp itself.',
      'Precision may be seconds or milliseconds (and finer units in some systems). Signed 32-bit counters overflow in 2038; modern 64-bit timestamps have a vastly larger range. APIs and databases still rely on Unix time because it is compact and easy to exchange.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Unix Timestamp Converter',
    paragraphs: [
      '1. Enter a Unix timestamp and choose seconds or milliseconds.',
      '2. Review the UTC date and time (or edit UTC fields to compute a timestamp).',
      '3. Expand eastern/western fixed-offset and IANA summer-zone sections.',
      '4. Use current time or enable the live clock when you want a running stamp.',
      '5. Copy or share the summary; reload or clear to reset.',
    ],
  },
  {
    id: 'convert-by-hand',
    title: 'How to Convert Unix Time to Date by Hand',
    paragraphs: [
      'For rough math, divide by 86,400 to get whole UTC days since the epoch, then add that many days to 1970-01-01. Example: 172800 / 86400 = 2 → 1970-01-03 00:00:00 UTC.',
      'Modern dates need leap-year and calendar rules, prefer a converter for exact results.',
    ],
    formula: '1 day = 86,400 seconds',
  },
  {
    id: 'year-2038',
    title: 'The 2038 Problem',
    paragraphs: [
      'Signed 32-bit Unix seconds max out at 2,147,483,647 → 2038-01-19 03:14:07 UTC. After that, overflowing 32-bit counters wrap to negative values unless software uses wider integers.',
      'Most modern platforms use 64-bit time_t or millisecond timestamps and are not bound by that limit. Legacy embedded 32-bit systems may still need attention.',
    ],
    formula: 'INT32_MAX seconds = 2,147,483,647 → 2038-01-19 03:14:07 UTC',
  },
];

export const UNIX_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is Unix Time?',
    answer:
      'Unix time is the number of elapsed seconds relative to 1970-01-01 00:00:00 UTC under the Unix/POSIX timestamp convention.',
  },
  {
    question: 'When Did Unix Time Start?',
    answer: 'Unix time starts at January 1, 1970, 00:00:00 UTC.',
  },
  {
    question: 'What Is the Maximum Unix Timestamp?',
    answer:
      'It depends on representation. Signed 32-bit seconds max at 2,147,483,647 (2038-01-19 03:14:07 UTC). Signed 64-bit timestamps cover a far larger range.',
  },
  {
    question: 'How Do I Convert Unix Time to Date in Excel?',
    answer:
      'For the Excel 1900 date system with Unix seconds in A1: =A1/86400+DATE(1970,1,1). Format the cell as date/time. The result is UTC-equivalent and does not auto-apply a local zone.',
  },
  {
    question: 'Is Unix Time Always in UTC?',
    answer:
      'Timestamps identify instants without a zone. UTC is the usual reference when formatting them as calendar dates.',
  },
  {
    question: 'What Is the Difference Between Unix Seconds and Milliseconds?',
    answer:
      'Seconds count whole seconds from the epoch; milliseconds count thousandths of a second from the same epoch (1 s = 1000 ms).',
  },
  {
    question: 'Can Unix Time Be Negative?',
    answer: 'Yes. Negative values represent instants before 1970-01-01 UTC.',
  },
  {
    question: 'Does Unix Time Include Daylight Saving Time?',
    answer:
      'No. DST affects how an instant is labeled in a geographical zone, not the Unix count itself.',
  },
  {
    question: 'What Is a 13-Digit Unix Timestamp?',
    answer:
      'Thirteen digits often mean milliseconds, but always confirm the unit, do not infer solely from digit length.',
  },
];
