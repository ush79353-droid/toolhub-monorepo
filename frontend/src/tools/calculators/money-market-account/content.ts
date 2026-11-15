import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MONEY_MARKET_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-money-market-account', label: 'What Is a Money Market Account?' },
  { id: 'money-market-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'money-market-faq', label: 'Frequently Asked Questions' },
];

export const MONEY_MARKET_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator estimate?',
    answer:
      'It projects the future value of a money market account from a starting balance, optional recurring contributions, an expected annual return, and an investment period in years and months.',
  },
  {
    question: 'How does Systematic Investment Plan differ from one-time investment?',
    answer:
      'SIP adds a recurring contribution at the end of each period. One-time investment grows only the starting balance and hides the recurring field.',
  },
  {
    question: 'How is interest compounded?',
    answer:
      'Monthly is the default contribution mode and uses monthly compounding (i = r / 12). Other contribution frequencies compound once per contribution period (for example weekly uses r / 52). Contributions are assumed at the end of each period.',
  },
  {
    question: 'What if the expected return is zero?',
    answer:
      'Future value equals starting balance plus the sum of contributions (P + C × N). Total interest is zero.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter all money fields already in the selected currency.',
  },
];
