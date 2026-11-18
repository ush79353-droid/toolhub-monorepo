import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const VARIABLE_ANNUITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-variable-annuity', label: 'What Is a Variable Annuity?' },
  { id: 'variable-annuity-formulas', label: 'Formulas' },
  { id: 'tax-assumptions', label: 'Tax Assumptions' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'variable-annuity-faq', label: 'Frequently Asked Questions' },
];

export const VARIABLE_ANNUITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the final balance before tax calculated?',
    answer:
      'The starting balance grows at the equivalent rate per payment period from your nominal return and compounding frequency. Recurring contributions use a growing-annuity future-value formula. Annuity due multiplies the payment FV by (1 + period rate).',
  },
  {
    question: 'How does length of annuity relate to ages?',
    answer:
      'Length (years) = withdrawal age − current age. Editing either age updates length; editing length updates withdrawal age from the current age.',
  },
  {
    question: 'How is the taxable balance estimated?',
    answer:
      'Each year’s investment gain is taxed at published US federal ordinary income rates for tax year 2024 (IRS Rev. Proc. 2023-34), Single status. Ordinary income and bracket thresholds grow with the stated income-growth and inflation rates. Contributions are treated as basis. This is not a full IRS return and may differ from other calculators’ proprietary tax models.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Starting balance, contribution, and annual income each have an independent currency. Before math, amounts are normalized into the starting-balance currency using stored FX rates. Rates, ages, and durations are never converted.',
  },
];
