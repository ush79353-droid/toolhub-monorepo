import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SWP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'SWP Calculator' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'swp-faq', label: 'Frequently Asked Questions' },
];

export const SWP_FAQS: readonly FAQItem[] = [
  {
    question: 'What is an SWP?',
    answer:
      'A Systematic Withdrawal Plan withdraws a fixed (or inflation-growing) amount from an investment on a schedule while the remaining balance continues to earn a return.',
  },
  {
    question: 'Which solve modes are supported?',
    answer:
      'Initial investment, sustainable withdrawal, duration, final balance, and required rate of return.',
  },
  {
    question: 'How is the period interest rate calculated?',
    answer:
      'Nominal annual return ÷ withdrawals per year (for example 5% ÷ 12 for monthly). Withdrawals occur at the beginning of each period.',
  },
  {
    question: 'Does inflation use a growing annuity?',
    answer:
      'Yes. Post-start withdrawals grow with inflation via a growing-annuity present-value model rather than simply subtracting inflation from return.',
  },
  {
    question: 'Is currency conversion included?',
    answer:
      'No. The currency selector formats amounts only (PKR default).',
  },
];
