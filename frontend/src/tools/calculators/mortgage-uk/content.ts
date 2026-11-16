import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MORTGAGE_UK_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-uk-mortgage', label: 'What Is a UK Mortgage Payment?' },
  { id: 'uk-mortgage-formula', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'mortgage-uk-faq', label: 'Frequently Asked Questions' },
];

export const MORTGAGE_UK_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the loan amount calculated?',
    answer:
      'Loan amount = home price × (1 − deposit%/100). A 25% deposit on a £500,000 home leaves a £375,000 loan.',
  },
  {
    question: 'How are interest-only and repayment amounts calculated?',
    answer:
      'Monthly rate r = annual rate / 1200. Interest-only payment = loan × r. Standard repayment uses Loan × r / (1 − (1+r)^(−n)) with n = years × 12. At 0% interest, repayment = loan / n.',
  },
  {
    question: 'How are optional taxes and insurance handled?',
    answer:
      'When “Include optionals below” is checked, annual taxes = home price × taxes%, and annual insurance/other amounts are divided by 12 for monthly figures. Lifetime totals multiply monthly amounts by the number of payments. Unchecking the box excludes those costs.',
  },
  {
    question: 'Is currency conversion supported?',
    answer:
      'No. This calculator uses fixed pounds sterling (£) to match the reference. There is no currency selector or FX conversion.',
  },
];
