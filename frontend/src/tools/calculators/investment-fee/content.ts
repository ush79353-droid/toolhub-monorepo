import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INVESTMENT_FEE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-investment-fees', label: 'What Are Investment Fees?' },
  { id: 'investment-fee-formula', label: 'How Fees Are Calculated' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'investment-fee-faq', label: 'Frequently Asked Questions' },
];

export const INVESTMENT_FEE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a sales load?',
    answer:
      'A sales load is a front-end fee charged when you buy fund shares. It reduces the amount actually invested.',
  },
  {
    question: 'How is effective return calculated?',
    answer:
      'Effective return = annual return − annual operating fees. That net rate compounds over the investment duration.',
  },
  {
    question: 'What do total fees represent?',
    answer:
      'Total fees are the difference between the fund value without any fees and the final fund value after loads, operating fees, turnover, and redemption charges.',
  },
  {
    question: 'Does changing the currency convert the amount?',
    answer:
      'No. Currency selection changes denomination and formatting only. It does not apply a live exchange rate.',
  },
];
