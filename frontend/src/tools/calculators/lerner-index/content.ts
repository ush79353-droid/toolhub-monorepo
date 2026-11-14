import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LERNER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-lerner', label: 'What Is the Lerner Index?' },
  { id: 'lerner-formula', label: 'Formula' },
  { id: 'lerner-example', label: 'Example' },
  { id: 'lerner-faq', label: 'Frequently Asked Questions' },
];

export const LERNER_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Lerner Index?',
    answer:
      'The Lerner Index measures a firm’s markup of price over marginal cost, relative to price. Higher values indicate greater market power; perfect competition approaches zero.',
  },
  {
    question: 'Is the result a percentage?',
    answer:
      'No. This calculator shows a decimal index, such as 0.40 for a 40% markup relative to price.',
  },
  {
    question: 'Can the Lerner Index be negative?',
    answer:
      'Yes, if marginal cost exceeds price. The calculator does not clamp negative results; they can signal pricing below cost or input error.',
  },
  {
    question: 'Does currency convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter price and marginal cost in the same currency.',
  },
];
