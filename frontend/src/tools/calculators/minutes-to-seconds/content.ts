import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatDecimal, minutesToSeconds } from './calculation';

export const M2S_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How to Convert Minutes to Seconds' },
  { id: 'examples', label: 'Minutes to Seconds Conversion Examples' },
  { id: 'example-calc', label: 'Example Calculation' },
  { id: 'how-to-use', label: 'How to Use This Converter' },
  { id: 'related-tools', label: 'Other Related Tools' },
  { id: 'm2s-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_MINUTES = [0.5, 1, 1.5, 2, 2.5, 3, 5, 10, 15, 30, 45, 60, 90, 120] as const;

export const M2S_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How to Convert Minutes to Seconds',
    paragraphs: [
      'The Minutes to Seconds Converter transforms minutes into seconds and supports reverse conversions plus a combined minutes-and-seconds view. It is useful for time tracking, workout timing, cooking, sports, study sessions, scientific experiments, and audio or video editing.',
      'The exact relationship is 1 minute = 60 seconds.',
      'Seconds = Minutes × 60. Example: 2.5 × 60 = 150, so 2.5 minutes equals 150 seconds.',
      'Minutes = Seconds ÷ 60. Example: 300 ÷ 60 = 5, so 300 seconds equals 5 minutes.',
    ],
    formula:
      'Seconds = Minutes × 60\n2.5 × 60 = 150 seconds\nMinutes = Seconds / 60\n300 ÷ 60 = 5 minutes',
  },
  {
    id: 'examples',
    title: 'Minutes to Seconds Conversion Examples',
    paragraphs: [
      'Common minute values converted with the exact factor 1 minute = 60 seconds.',
    ],
    tableHeaders: ['Minutes', 'Seconds'],
    table: TABLE_MINUTES.map((min) => {
      const sec = minutesToSeconds(min);
      const secLabel = Number.isInteger(sec)
        ? sec.toLocaleString('en-US')
        : formatDecimal(sec);
      return [formatDecimal(min), secLabel];
    }),
  },
  {
    id: 'example-calc',
    title: 'Example Calculation',
    paragraphs: [
      'Suppose an event lasts 2 minutes 52 seconds.',
      'First convert the whole minutes: 2 × 60 = 120 seconds.',
      'Then add the remaining seconds: 120 + 52 = 172.',
      'Therefore 2 minutes 52 seconds = 172 seconds.',
      'In the reverse direction, 172 ÷ 60 ≈ 2.8667 decimal minutes. That decimal value is not the same notation as 2 minutes with 86.67 leftover seconds — remaining seconds in clock form stay below 60.',
    ],
    formula:
      '2 × 60 = 120\n120 + 52 = 172 seconds\n172 ÷ 60 ≈ 2.8667 minutes',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Minutes to Seconds Converter',
    paragraphs: [
      '1. Enter the number of minutes.',
      '2. Equivalent total seconds appear automatically.',
      '3. The combined minutes-and-seconds representation updates (seconds stay in [0, 60)).',
      '4. Enter total seconds to convert in the opposite direction.',
      '5. Edit the combined duration when you already know minutes and leftover seconds.',
      '6. Use Reload calculator or Clear all changes to reset every field.',
      'Conversions update immediately; there is no separate Calculate button.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Related Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Time Unit Converter, Minutes to Decimal Calculator, Minute Converter, Hours to Minutes Converter, Hours to Seconds Converter, Milliseconds Converter, and Minutes to Days Calculator. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const M2S_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Change Minutes to Seconds?',
    answer:
      'Multiply the number of minutes by 60. Example: 15 × 60 = 900, so 15 minutes equals 900 seconds.',
  },
  {
    question: 'How Many Seconds Are in 5 Minutes?',
    answer: '5 × 60 = 300. There are 300 seconds in 5 minutes.',
  },
  {
    question: 'How Many Seconds Are in 2.5 Minutes?',
    answer: '2.5 × 60 = 150. There are 150 seconds in 2.5 minutes.',
  },
  {
    question: 'How Do I Convert Seconds Back to Minutes?',
    answer:
      'Divide the total number of seconds by 60. For example, 240 ÷ 60 = 4, so 240 seconds equals 4 minutes.',
  },
  {
    question: 'How Many Minutes and Seconds Are in 125 Seconds?',
    answer: '125 = 2 × 60 + 5. Therefore 125 seconds = 2 minutes 5 seconds.',
  },
  {
    question: 'Is 1.5 Minutes Equal to 1 Minute 50 Seconds?',
    answer:
      'No. 1.5 minutes equals 1 minute 30 seconds because the 0.5 decimal portion of a minute is 0.5 × 60 = 30 seconds, not 50.',
  },
];
