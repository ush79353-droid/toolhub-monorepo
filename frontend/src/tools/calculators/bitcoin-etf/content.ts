import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BITCOIN_ETF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-bitcoin-etf-calculator', label: 'What Is This Calculator?' },
  { id: 'bitcoin-etf-formulas', label: 'Formulas & Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'bitcoin-etf-faq', label: 'Frequently Asked Questions' },
];

export const BITCOIN_ETF_FAQS: readonly FAQItem[] = [
  {
    question: 'Does this use live Bitcoin or ETF prices?',
    answer:
      'No. It is a compounding estimate from your inputs only. Returns are not guarantees and are not investment advice.',
  },
  {
    question: 'Why is there only a Custom ETF option?',
    answer:
      'This repo has no verified issuer expense-ratio catalog yet. Choose Custom and enter the expense ratio from the fund prospectus yourself. Do not invent ticker fees.',
  },
  {
    question: 'How is effective return calculated?',
    answer:
      'Effective annual return = (1 + expected return ÷ 100) × (1 − expense ratio ÷ 100) − 1.',
  },
  {
    question: 'What is included in total cost of ETF?',
    answer:
      'Upfront other costs plus estimated expense-ratio fees charged each year on the post-return balance. That is actual fee drag, not the separate opportunity cost of lost gains.',
  },
];
