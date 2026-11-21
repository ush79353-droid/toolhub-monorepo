import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COMBINED_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-combined-ratio', label: 'What does the combined ratio mean?' },
  { id: 'how-to-calculate', label: 'How to calculate the combined ratio' },
  { id: 'vs-loss-ratio', label: 'Combined ratio vs. loss ratio' },
  { id: 'how-to-interpret', label: 'How to interpret the combined ratio' },
  { id: 'factors', label: 'Factors affecting the combined ratio' },
  { id: 'vs-profitability', label: 'Combined ratio vs. profitability' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'combined-ratio-faq', label: 'Frequently Asked Questions' },
];

export const COMBINED_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a good combined ratio for an insurance company?',
    answer:
      'A combined ratio below 100% generally indicates a positive underwriting result under the chosen accounting definition. What counts as “good” still depends on line of business, competitive pricing, reinsurance, and reporting conventions; there is no universal target that fits every insurer.',
  },
  {
    question: 'Can a combined ratio be above 100%?',
    answer:
      'Yes. Above 100% means losses plus underwriting expenses exceed the premium base. Example: 110% means about $110 of those costs for every $100 of premiums under the simplified model.',
  },
  {
    question: 'Can a combined ratio be negative?',
    answer:
      'With positive premiums and nonnegative losses and underwriting expenses, the combined ratio cannot be negative. Unusual accounting items (large reserve releases or negative reported expenses) can produce atypical figures in some reporting contexts.',
  },
  {
    question: 'What is the difference between loss ratio and combined ratio?',
    answer:
      'Loss ratio measures losses relative to premiums. Combined ratio adds underwriting expenses: Combined Ratio = Loss Ratio + Expense Ratio. A low loss ratio alone does not guarantee underwriting profit if expenses are high.',
  },
  {
    question: 'Does a combined ratio of 100% mean an insurance company makes no profit?',
    answer:
      'Not necessarily. It indicates underwriting break-even under the selected basis. Investment income and other items can still produce company-wide profit (or loss).',
  },
  {
    question: 'How do you calculate the expense ratio in insurance?',
    answer:
      'Expense Ratio = Underwriting Expense / Premiums × 100. Use the same premium definition and period as the loss ratio so the two ratios add to a meaningful combined ratio.',
  },
  {
    question: 'Why is the combined ratio important?',
    answer:
      'It summarizes underwriting performance, supports peer comparison, highlights cost and pricing pressure, and helps spot adverse loss or expense trends when definitions are comparable.',
  },
  {
    question: 'How can an insurance company improve its combined ratio?',
    answer:
      'Common levers include sharper risk selection, pricing that matches expected loss costs, stronger claims management, lower acquisition and admin costs, and fraud controls. None of these guarantee a lower ratio in every market.',
  },
  {
    question: 'What is the underwriting margin?',
    answer:
      'Underwriting Margin (%) = 100% − Combined Ratio (%). An 88% combined ratio implies a 12% simplified underwriting margin before investment income and other items.',
  },
  {
    question: 'Can combined ratios be compared across different insurance companies?',
    answer:
      'Only carefully. Align accounting bases, business mix, reporting periods, and reinsurance treatment. Different definitions of premiums or expenses can make raw comparisons misleading.',
  },
];
