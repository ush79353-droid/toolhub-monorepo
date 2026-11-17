import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DEBT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-debt-calculator', label: 'What Is a Debt Calculator?' },
  { id: 'debt-repayment-methods', label: 'Debt Repayment Methods' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'debt-faq', label: 'Frequently Asked Questions' },
];

export const DEBT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between snowball and avalanche?',
    answer:
      'Both keep your combined monthly budget constant. Snowball redirects freed payments to the smallest remaining balance. Avalanche redirects them to the highest interest rate. When every dollar of the budget is already allocated to minimums, the two methods can match until the first debt is paid off.',
  },
  {
    question: 'How is consolidation APR calculated?',
    answer:
      'The consolidation loan amortizes the combined balances at the consolidation rate while keeping the same combined monthly payment. The prepaid fee is paid upfront and reduces net funds advanced for the cash-flow APR; it is not added a second time to principal.',
  },
  {
    question: 'Why is the minimum-payment APR marked with an asterisk?',
    answer:
      'Minimum-payment APR is estimated with a balance-weighted average of the individual debt rates. Snowball, avalanche, and consolidation APRs use the payment schedule’s comparable cash-flow rate.',
  },
];
