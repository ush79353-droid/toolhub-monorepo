import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CREDIT_CARDS_PAYOFF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-credit-cards-payoff', label: 'What Is This Calculator?' },
  { id: 'avalanche-method', label: 'Debt Avalanche Method' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'credit-cards-payoff-faq', label: 'Frequently Asked Questions' },
];

export const CREDIT_CARDS_PAYOFF_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the debt avalanche method?',
    answer:
      'Avalanche repayment pays the required minimum on every card, then applies any leftover monthly budget to the card with the highest APR. When that card is paid off, its payment capacity rolls to the next-highest APR until every balance reaches zero.',
  },
  {
    question: 'How is monthly interest calculated?',
    answer:
      'Each month, interest accrues on every outstanding balance as balance × (APR / 100 / 12) before payments are applied. Amounts stay at full precision during the schedule and are rounded only for display.',
  },
  {
    question: 'What if my budget cannot cover the minimums?',
    answer:
      'The calculator requires your monthly budget to be at least the sum of minimum payments on cards with a positive balance. Increase the budget or lower one or more minimums before calculating.',
  },
  {
    question: 'Why is there no currency selector?',
    answer:
      'The reference layout formats money in USD only. Balances, minimums, budget, interest, and totals use fixed dollar formatting. Interest rates are percentages and are never converted.',
  },
  {
    question: 'How is this different from the Debt Avalanche Calculator?',
    answer:
      'This tool focuses on multiple credit cards with a single monthly budget, named cards, a payoff schedule, and per-card payoff months. The Debt Avalanche Calculator compares baseline vs avalanche summaries across general debts with independent FX fields.',
  },
];
