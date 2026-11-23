import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DUKE_TREADMILL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Duke Treadmill Score Calculator' },
  { id: 'what-is', label: 'What Is the Duke Treadmill Score?' },
  { id: 'formula', label: 'How the Score Is Calculated' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'dts-faq', label: 'Frequently Asked Questions' },
];

export const DUKE_TREADMILL_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'It computes the educational Mark Duke treadmill score from Bruce-protocol exercise minutes, maximal ST-segment deviation in millimeters, and an angina index (0/1/2). It does not interpret prognosis bands or recommend procedures.',
  },
  {
    question: 'Which treadmill protocol is assumed?',
    answer:
      'The classic Mark formula uses exercise duration on the standard Bruce treadmill protocol, entered as minutes (fractional minutes allowed).',
  },
  {
    question: 'When does the score appear?',
    answer:
      'The result stays blank until both exercise duration and maximal ST-segment deviation are entered as valid numbers. Angina defaults to “no angina” (index 0).',
  },
  {
    question: 'Can the score be negative?',
    answer:
      'Yes. Large ST deviation or limiting angina can produce negative scores; the engine preserves them.',
  },
  {
    question: 'Are my values stored?',
    answer:
      'No. Inputs stay in your browser. Share and copy use the public tool page URL only.',
  },
];
