import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ACCOUNTING_PROFIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-accounting-profit', label: 'What Is Accounting Profit?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'accounting-profit-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'accounting-profit-faq', label: 'Frequently Asked Questions' },
];

export const ACCOUNTING_PROFIT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is accounting profit calculated?',
    answer:
      'Total explicit costs equal operation expenses + interest + depreciation + taxes. Accounting profit equals total revenue minus total explicit costs. A negative result is a business loss.',
  },
  {
    question: 'Should operating expenses include interest, depreciation, or taxes?',
    answer:
      'No. Enter those three categories in their own fields. Operation expenses must exclude interest, depreciation, and taxes so they are not double-counted in total explicit costs.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Each money field has an independent currency. Math normalizes all amounts into the total-revenue currency, then converts results for display. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Does this include opportunity or implicit costs?',
    answer:
      'No. This tool measures accounting profit from explicit costs only. Economic profit (which subtracts opportunity costs) is a separate concept and is not calculated here.',
  },
];
