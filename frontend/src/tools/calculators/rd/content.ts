import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const RD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'RD Calculator' },
  { id: 'formula', label: 'RD Formula' },
  { id: 'how-to', label: 'How to Use' },
  { id: 'example', label: 'Worked Example' },
  { id: 'compounding', label: 'Compounding Convention' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'rd-faq', label: 'Frequently Asked Questions' },
];

export const RD_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a recurring deposit (RD)?',
    answer:
      'A recurring deposit is a bank savings product where you deposit a fixed amount every month for a chosen term and earn interest that is typically compounded quarterly.',
  },
  {
    question: 'How is RD maturity calculated?',
    answer:
      'This calculator uses the bank-style closed form with monthly deposits and quarterly compounding: M = R × [(1+i)^n − 1] / [1 − (1+i)^(−1/3)], where i = r/400 and n is the number of quarters.',
  },
  {
    question: 'Is this simple interest?',
    answer:
      'No. Interest compounds quarterly. Total interest equals maturity minus total deposits.',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Independent selectors use Omega’s stored FX rates. Math runs in the monthly-deposit currency; results convert for display. Term and interest rate never convert.',
  },
];
