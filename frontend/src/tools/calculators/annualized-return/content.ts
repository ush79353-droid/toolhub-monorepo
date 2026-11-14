import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ANNUALIZED_RETURN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-annualized-return', label: 'What Annualized Return Means' },
  { id: 'annualized-return-formulas', label: 'Formulas' },
  { id: 'annualized-return-example', label: 'Example' },
  { id: 'annualized-return-faq', label: 'Frequently Asked Questions' },
];

export const ANNUALIZED_RETURN_FAQS: readonly FAQItem[] = [
  {
    question: 'What is annualized return?',
    answer:
      'Annualized return is the constant yearly rate that would compound to the same total return over the holding period. It lets you compare investments held for different lengths of time.',
  },
  {
    question: 'What if total return is −100%?',
    answer:
      'That is a complete loss. The calculator reports −100% annualized return rather than producing NaN or Infinity.',
  },
  {
    question: 'Can total return be below −100%?',
    answer:
      'No. A return below −100% would imply a negative growth factor, which is not defined for this formula.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. In beginning/ending mode, currency only changes the symbol and grouping. Amounts stay in the denomination you enter.',
  },
];
