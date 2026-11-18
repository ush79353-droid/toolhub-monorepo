import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  DAYS_PER_YEAR,
  SECONDS_PER_YEAR,
  formatDuration,
  secondsToYears,
  yearsToSeconds,
} from './calculation';

export const S2Y_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Seconds to Years Conversion' },
  { id: 'how-to-use', label: 'How to Use the Tool' },
  { id: 'years-to-seconds', label: 'Learn How to Convert Years to Seconds' },
  { id: 'conversion-table', label: 'Seconds to Years Conversion Table' },
  { id: 'related-tools', label: 'Other Useful Date and Time Calculators' },
  { id: 'seconds-to-years-faq', label: 'Frequently Asked Questions' },
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
  1, 60, 3_600, 86_400, 604_800, 1_000_000, 31_556_952, 63_113_904, 315_569_520,
] as const;

export const S2Y_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Seconds to Years Conversion',
    paragraphs: [
      'Convert short or long durations from seconds into years for scientific research, engineering, astronomy, historical timelines, large-scale time calculations, project estimates, and comparing time measurements.',
      `This calculator uses a Gregorian mean year of ${DAYS_PER_YEAR} days (${SECONDS_PER_YEAR.toLocaleString('en-US')} seconds). It does not use a Julian 365.25-day year (31,557,600 seconds). Actual calendar years contain 365 or 366 days.`,
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Seconds to Years Conversion Tool',
    paragraphs: [
      '1. Enter the number of seconds.',
      '2. Read the corresponding value in years.',
      '3. Expand Other time units to see months, weeks, days, hours, and minutes.',
      '4. Edit any available unit to calculate in the opposite direction.',
      '5. Use the hours, minutes, and seconds fields for mixed-duration calculations.',
      `Example — 500,000 seconds: 500,000 ÷ ${SECONDS_PER_YEAR.toLocaleString('en-US')} ≈ ${formatDuration(secondsToYears(500_000))} years.`,
    ],
    formula: `500000 / ${SECONDS_PER_YEAR} ≈ ${formatDuration(secondsToYears(500_000))}\n500,000 seconds ≈ ${formatDuration(secondsToYears(500_000))} years`,
  },
  {
    id: 'years-to-seconds',
    title: 'Learn How to Convert Years to Seconds',
    paragraphs: [
      `1 year = ${DAYS_PER_YEAR} days · 1 day = 24 hours · 1 hour = 60 minutes · 1 minute = 60 seconds.`,
      `${DAYS_PER_YEAR} × 24 × 60 × 60 = ${SECONDS_PER_YEAR.toLocaleString('en-US')}.`,
      `Therefore 1 Gregorian mean year = ${SECONDS_PER_YEAR.toLocaleString('en-US')} seconds.`,
      `Years = Seconds ÷ ${SECONDS_PER_YEAR.toLocaleString('en-US')}.`,
      `Example — 100 mean years: 100 × ${SECONDS_PER_YEAR.toLocaleString('en-US')} = ${yearsToSeconds(100).toLocaleString('en-US')} seconds.`,
      'A specific calendar-year interval may differ because common years have 365 days and leap years have 366.',
    ],
    formula: `1 mean year = ${SECONDS_PER_YEAR} seconds\nSeconds = Years × ${SECONDS_PER_YEAR}\nYears = Seconds / ${SECONDS_PER_YEAR}\n100 × ${SECONDS_PER_YEAR} = ${yearsToSeconds(100)}`,
  },
  {
    id: 'conversion-table',
    title: 'Seconds to Years Conversion Table',
    paragraphs: [
      'Useful second values converted with the Gregorian mean-year factor. Results come from the same engine used by the calculator.',
    ],
    tableHeaders: ['Seconds', 'Years'],
    table: TABLE_SECONDS.map((sec) => [
      sec.toLocaleString('en-US'),
      formatDuration(secondsToYears(sec)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Useful Date and Time Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Seconds Converter, Seconds to Minutes Converter, Seconds to Hours Converter, Seconds to Days Converter, Minutes to Years Conversion, Hours to Years Converter, and Days to Years Calculator. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const S2Y_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Seconds Are in a Year?',
    answer: `A Gregorian mean year contains ${SECONDS_PER_YEAR.toLocaleString('en-US')} seconds. For comparison: a 365-day year has 31,536,000 seconds; a 366-day leap year has 31,622,400 seconds; the Gregorian mean year has ${SECONDS_PER_YEAR.toLocaleString('en-US')} seconds.`,
  },
  {
    question: 'How Many Years Are There in One Trillion Seconds?',
    answer: `1,000,000,000,000 ÷ ${SECONDS_PER_YEAR.toLocaleString('en-US')} ≈ ${formatDuration(secondsToYears(1_000_000_000_000))}. Therefore one trillion seconds is approximately 31,689 Gregorian mean years.`,
  },
  {
    question: 'How Can I Convert 100 Years into Seconds?',
    answer: `Multiply 100 by ${SECONDS_PER_YEAR.toLocaleString('en-US')}. 100 × ${SECONDS_PER_YEAR.toLocaleString('en-US')} = ${yearsToSeconds(100).toLocaleString('en-US')}. Therefore 100 Gregorian mean years contain ${yearsToSeconds(100).toLocaleString('en-US')} seconds.`,
  },
  {
    question: 'How Many Seconds Are in a Leap Year?',
    answer:
      'A leap year has 366 days. 366 × 24 × 60 × 60 = 31,622,400. Therefore a leap year contains 31,622,400 seconds, excluding leap-second adjustments.',
  },
  {
    question: 'Is a Year Always 365 Days?',
    answer: `No. Common calendar years contain 365 days, while leap years contain 366 days. The Gregorian mean calendar year is ${DAYS_PER_YEAR} days.`,
  },
];
