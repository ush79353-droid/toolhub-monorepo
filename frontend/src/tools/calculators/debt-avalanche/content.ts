import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DEBT_AVALANCHE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-debt-avalanche', label: 'What Is the Debt Avalanche Method?' },
  { id: 'avalanche-formulas', label: 'How This Calculator Works' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'debt-avalanche-faq', label: 'Frequently Asked Questions' },
];

export const DEBT_AVALANCHE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the debt avalanche method?',
    answer:
      'Avalanche repayment keeps your total monthly payment budget constant and directs freed payments to the remaining debt with the highest interest rate after each balance is paid off. That typically reduces total interest versus paying each debt only with its original minimum.',
  },
  {
    question: 'How is “current debt” different from avalanche?',
    answer:
      'Current debt simulates each balance with its own fixed monthly payment and does not reallocate freed payments when a debt is paid off. Avalanche keeps the combined monthly budget and rolls finished payments onto the highest-rate remaining debt.',
  },
  {
    question: 'How is APR shown in the comparison table?',
    answer:
      'For current debt, APR is the balance-weighted average of the entered rates. For avalanche, APR is estimated from total interest divided by average opening balance over the payoff years.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each balance and payment has an independent currency. Changing a selector converts that amount with stored FX rates. Before calculation, every money amount is normalized into the total-debt currency. Rates and payoff periods are never converted.',
  },
];
