import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DEBT_SNOWBALL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-debt-snowball', label: 'What Is the Debt Snowball Method?' },
  { id: 'snowball-vs-avalanche', label: 'Snowball vs Avalanche' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'debt-snowball-faq', label: 'Frequently Asked Questions' },
];

export const DEBT_SNOWBALL_FAQS: readonly FAQItem[] = [
  {
    question: 'How does the debt snowball method work?',
    answer:
      'You pay the minimum on every debt, then put any leftover budget toward the smallest balance. When that debt is gone, its payment rolls into the next-smallest balance until everything is paid.',
  },
  {
    question: 'How is this different from avalanche?',
    answer:
      'Both keep the same combined monthly budget. Snowball prioritizes the lowest balance to clear debts faster psychologically. Avalanche prioritizes the highest interest rate to minimize total interest.',
  },
  {
    question: 'Why is the minimum-payment APR marked with an asterisk?',
    answer:
      'Minimum-payment APR is a balance-weighted average of your individual rates. Snowball and avalanche APRs use the cash-flow rate implied by the full repayment schedule.',
  },
  {
    question: 'Do currency selectors convert amounts?',
    answer:
      'Yes. Each balance, payment, increase, and display total can use its own currency. Amounts normalize into debt #1’s balance currency before schedule math. Interest rates and payoff months never convert.',
  },
];
