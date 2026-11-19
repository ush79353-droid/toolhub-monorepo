import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BUDGET_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-budget', label: 'What Is This Calculator?' },
  { id: 'budget-formulas', label: 'Formulas' },
  { id: 'budget-tax-and-fx', label: 'Tax Rate & Currency' },
  { id: 'budget-faq', label: 'Frequently Asked Questions' },
];

export const BUDGET_FAQS: readonly FAQItem[] = [
  {
    question: 'Is salary gross or net?',
    answer:
      'Salary is treated as gross. The Tax rate field is a percent of gross salary (after frequency normalization to monthly). Net salary contribution = monthly gross × (1 − tax rate / 100). Pension and other income lines are added separately and are not taxed by this rate.',
  },
  {
    question: 'Are savings counted as expenses?',
    answer:
      'No. Savings are planned cash allocations. They reduce budget balance alongside expenses but are not included in the Monthly expenses or Annual expenses totals.',
  },
  {
    question: 'How do monthly and yearly frequencies work?',
    answer:
      'Each money line has its own / mo or / yr selector. Amounts are normalized before summing: yearly ÷ 12 for monthly totals, monthly × 12 for annual expense totals. Frequency units are never currency-converted.',
  },
  {
    question: 'Which currency are the summary totals in?',
    answer:
      'Summary totals use the Salary currency as the aggregation currency. Other money fields convert with stored Phase 2 FX rates before summing. Missing rates block conversion (never assumed 1:1). Stale rates still convert with a warning.',
  },
];
