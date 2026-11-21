import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ECONOMIC_PROFIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-economic-profit', label: 'What Is Economic Profit?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'economic-profit-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'economic-profit-faq', label: 'Frequently Asked Questions' },
];

export const ECONOMIC_PROFIT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is economic profit calculated?',
    answer:
      'Economic Profit = Total Revenue − Explicit Costs − Implicit Costs. Explicit costs are direct monetary expenses. Implicit costs are opportunity costs (forgone earnings or returns). A negative result means economic loss.',
  },
  {
    question: 'How is economic profit different from accounting profit?',
    answer:
      'Accounting profit subtracts only explicit costs. Economic profit also subtracts implicit (opportunity) costs, so it is usually lower. Use Accounting Profit Calculator for the explicit-only measure; this tool includes opportunity costs.',
  },
  {
    question: 'Should the same expense appear in both cost fields?',
    answer:
      'No. Enter each cost once. Put cash outflows in Explicit costs and forgone alternatives in Implicit costs so nothing is double-counted.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each money field has an independent currency. Math normalizes inputs into the total-revenue currency, then converts economic profit for its display selector. Missing rates block conversion; stale rates warn but still convert.',
  },
];
