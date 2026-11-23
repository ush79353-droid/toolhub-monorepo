import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CONCEPTION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Conception Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'formula', label: 'Dating Formula' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'limits', label: 'Limits and Safety' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'conception-faq', label: 'Frequently Asked Questions' },
];

export const CONCEPTION_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this conception calculator estimate?',
    answer:
      'It estimates a conception calendar date from a due date or from LMP plus average cycle length using ACOG-style educational offsets (conception ≈ EDD − 266 days). It also shows gestational age as of today.',
  },
  {
    question: 'Is the conception date exact?',
    answer:
      'No. Fertilization can occur across a fertile window. The single date is a teaching estimate only and is not proof of paternity or the exact day of conception.',
  },
  {
    question: 'What if I enter both due date and LMP?',
    answer:
      'Results follow the field you edited last. If both dates disagree on EDD, a conflict note appears so you can clear or correct one entry.',
  },
  {
    question: 'Which cycle lengths are supported?',
    answer:
      'Average cycle duration options run from 21 through 45 days, matching the shared due-date engine bounds. The default is 28 days.',
  },
];
