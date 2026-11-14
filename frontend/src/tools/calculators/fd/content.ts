import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-fd', label: 'What Is a Fixed Deposit?' },
  { id: 'fd-formula', label: 'Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'fd-faq', label: 'Frequently Asked Questions' },
];

export const FD_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between simple and cumulative FD?',
    answer:
      'Cumulative FDs reinvest interest so the maturity amount compounds. Simple (non-cumulative) FDs pay interest each period and return the principal at maturity.',
  },
  {
    question: 'What formulas are used?',
    answer:
      'Cumulative: Maturity = P × (1 + r/n)^(n×t). Simple: Total interest = P × r × t and payout per period = P × r/n.',
  },
  {
    question: 'Why can total payout equal maturity for cumulative FDs?',
    answer:
      'Interest is reinvested with no intermediate cash payout, so total payout equals the maturity amount.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and formatting. Enter the principal already in the selected currency.',
  },
];
