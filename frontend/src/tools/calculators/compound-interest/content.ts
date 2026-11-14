import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COMPOUND_INTEREST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-compound-interest', label: 'What Compound Interest Means' },
  { id: 'compound-interest-formulas', label: 'Formulas' },
  { id: 'compound-interest-example', label: 'Example' },
  { id: 'compound-interest-faq', label: 'Frequently Asked Questions' },
];

export const COMPOUND_INTEREST_FAQS: readonly FAQItem[] = [
  {
    question: 'How is compound interest calculated?',
    answer:
      'Without deposits: A = P × (1 + r/n)^(n×t). With recurring deposits, the balance is updated period-by-period using your compounding frequency and deposit schedule.',
  },
  {
    question: 'What is total compound interest?',
    answer:
      'Final balance minus total principal contributed (initial balance plus all additional deposits).',
  },
  {
    question: 'What do the bar colors mean?',
    answer:
      'Blue is the balance path under yearly compounding. Red is the extra balance from your selected compounding frequency (and deposit schedule).',
  },
  {
    question: 'Does currency convert amounts?',
    answer: 'No. Currency only changes the symbol and grouping.',
  },
];
