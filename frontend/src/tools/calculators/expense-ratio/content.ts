import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EXPENSE_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-expense-ratio', label: 'What Is Expense Ratio?' },
  { id: 'expense-ratio-formula', label: 'How This Calculator Works' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'expense-ratio-faq', label: 'Frequently Asked Questions' },
];

export const EXPENSE_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is an expense ratio?',
    answer:
      'An expense ratio is the annual fee charged by a fund or ETF as a percent of assets. This calculator applies that fee each year after investment returns, then adds your yearly contribution.',
  },
  {
    question: 'What is future value of total investment?',
    answer:
      'That is the gross future value of your initial investment plus end-of-year contributions, grown at the expected return with no expense-ratio fees deducted.',
  },
  {
    question: 'What is total cost of ETF?',
    answer:
      'It is the sum of the actual annual expense-ratio fees charged on the post-return balance each year. It does not invent separate opportunity-cost figures.',
  },
  {
    question: 'What is net future value?',
    answer:
      'Net future value is the ending balance after applying return, deducting the expense ratio, and adding the yearly contribution each year, including the compounding effect of fees.',
  },
];
