import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  SECONDS_PER_MINUTE,
  formatDuration,
  minutesToSeconds,
  secondsToMinutes,
} from './calculation';

export const S2M_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Seconds to Minutes Converter' },
  { id: 'what-is-a-second', label: 'What Is a Second?' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'manual-convert', label: 'How to Convert Seconds to Minutes Manually' },
  { id: 'minutes-to-seconds', label: 'How to Convert Minutes to Seconds' },
  { id: 'conversion-chart', label: 'Seconds to Minutes Conversion Chart' },
  { id: 'related-tools', label: 'Other Related Calculators' },
  { id: 'seconds-to-minutes-faq', label: 'Frequently Asked Questions' },
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
  1, 5, 15, 30, 45, 60, 78, 90, 120, 300, 600, 3_600, 86_400,
] as const;

export const S2M_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Seconds to Minutes Converter',
    paragraphs: [
      'Convert time values between seconds and minutes for sports timing, running and sprint performance, cooking, exercise, video and audio durations, scheduling, and everyday time calculations.',
      `Example: a 100-meter sprint in 9.58 seconds: 9.58 ÷ 60 ≈ ${formatDuration(secondsToMinutes(9.58))} minutes.`,
    ],
    formula: '9.58 ÷ 60 ≈ 0.159666… minutes',
  },
  {
    id: 'what-is-a-second',
    title: 'What Is a Second?',
    paragraphs: [
      'The second is the SI base unit of time. Everyday clocks group seconds into minutes and hours.',
      '1 minute = 60 seconds.',
      '1 second = 1/60 minute.',
      '1 second = 1,000 milliseconds.',
      'This converter uses the exact clock minute of 60 seconds.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Seconds to Minutes Converter',
    paragraphs: [
      '1. Enter a duration in the Seconds field.',
      '2. The calculator automatically divides the value by 60.',
      '3. Read the equivalent duration in Minutes.',
      '4. To calculate in reverse, enter a value in Minutes.',
      '5. The calculator automatically multiplies by 60 to display seconds.',
      `Example; 78 seconds: 78 ÷ 60 = ${formatDuration(secondsToMinutes(78))}, so 78 seconds = 1.3 minutes (1 minute and 18 seconds).`,
    ],
    formula: '78 ÷ 60 = 1.3\n78 seconds = 1.3 minutes',
  },
  {
    id: 'manual-convert',
    title: 'How to Convert Seconds to Minutes Manually',
    paragraphs: [
      'Divide the number of seconds by 60.',
      `Example; 150 seconds: 150 ÷ 60 = ${formatDuration(secondsToMinutes(150))}, so 150 seconds = 2.5 minutes.`,
    ],
    formula: 'Minutes = Seconds / 60\n150 ÷ 60 = 2.5 minutes',
  },
  {
    id: 'minutes-to-seconds',
    title: 'How to Convert Minutes to Seconds',
    paragraphs: [
      'Multiply the number of minutes by 60.',
      `Example; 3.5 minutes: 3.5 × 60 = ${formatDuration(minutesToSeconds(3.5))}, so 3.5 minutes = 210 seconds.`,
    ],
    formula: 'Seconds = Minutes × 60\n3.5 × 60 = 210 seconds',
  },
  {
    id: 'conversion-chart',
    title: 'Seconds to Minutes Conversion Chart',
    paragraphs: [
      `Common second values converted with the exact factor 1 minute = ${SECONDS_PER_MINUTE} seconds. Values come from the same conversion engine used by the calculator.`,
    ],
    tableHeaders: ['Seconds', 'Minutes'],
    table: TABLE_SECONDS.map((sec) => [
      sec.toLocaleString('en-US'),
      formatDuration(secondsToMinutes(sec)),
    ]),
  },
  {
    id: 'related-tools',
    title: 'Other Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Minute Converter, Seconds Converter, Hours to Minutes Converter, Hours to Seconds Converter, Seconds to Hours Converter, Minutes to Seconds Converter, and Seconds to Days Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const S2M_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Seconds into Minutes?',
    answer: `Divide the number of seconds by 60. Minutes = Seconds ÷ 60. For example, 180 seconds equals ${formatDuration(secondsToMinutes(180))} minutes.`,
  },
  {
    question: 'How Many Minutes Are in a Day?',
    answer:
      'A standard day contains 24 hours, and each hour has 60 minutes. 24 × 60 = 1,440. Therefore a day contains 1,440 minutes.',
  },
  {
    question: 'How Many Minutes Are in a Leap Year?',
    answer:
      'A leap year contains 366 days. 366 × 24 × 60 = 527,040. Therefore a leap year contains 527,040 minutes.',
  },
  {
    question: 'How Many Minutes Are 90 Seconds?',
    answer: `90 ÷ 60 = ${formatDuration(secondsToMinutes(90))}. Therefore 90 seconds equals 1.5 minutes.`,
  },
  {
    question: 'How Many Seconds Are in 5 Minutes?',
    answer: `5 × 60 = ${formatDuration(minutesToSeconds(5))}. Therefore 5 minutes equals 300 seconds.`,
  },
  {
    question: 'Is 1.5 Minutes the Same as 1 Minute and 50 Seconds?',
    answer:
      'No. The decimal portion of 1.5 minutes represents half a minute. 0.5 × 60 = 30. Therefore 1.5 minutes = 1 minute and 30 seconds.',
  },
];
