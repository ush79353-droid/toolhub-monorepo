import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MORTGAGE_AMORTIZATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-mortgage-amortization', label: 'What Is Mortgage Amortization?' },
  { id: 'ma-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ma-faq', label: 'Frequently Asked Questions' },
];

export const MORTGAGE_AMORTIZATION_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the loan amount calculated?',
    answer:
      'Loan amount = Home price × (1 − Down payment % / 100). Down payment dollars = Home price × Down payment % / 100.',
  },
  {
    question: 'How is the monthly mortgage payment calculated?',
    answer:
      'With r = APR / 1200 and n = years × 12: Payment = P × r / (1 − (1 + r)^(−n)). When the rate is zero, Payment = P / n.',
  },
  {
    question: 'How are optional costs handled?',
    answer:
      'When Include Optionals Below is checked, annual property tax (% of home price), home insurance, PMI, HOA, and other costs are converted to monthly amounts (/12) and multiplied by n for lifetime totals. Unchecking removes those costs from out-of-pocket figures.',
  },
  {
    question: 'Can I change currencies?',
    answer:
      'No. The reference uses fixed USD ($) symbols without currency selectors.',
  },
];
