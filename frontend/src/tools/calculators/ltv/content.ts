import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const LTV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ltv', label: 'What Is Loan to Value?' },
  { id: 'ltv-formulas', label: 'LTV Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ltv-faq', label: 'Frequently Asked Questions' },
];

export const LTV_FAQS: readonly FAQItem[] = [
  {
    question: 'How is LTV calculated?',
    answer:
      'LTV (%) = (Loan amount ÷ Purchase price) × 100. Down payment and loan amount are linked by Loan = Purchase − Down.',
  },
  {
    question: 'Which fields can I edit?',
    answer:
      'All four fields are editable. Purchase price is required. Editing down payment recalculates loan and LTV; editing loan recalculates down and LTV; editing LTV recalculates loan and down.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Purchase price, down payment, and loan amount each have an independent currency. Before LTV math, amounts are normalized into the purchase-price currency using stored FX rates. Currency-only changes preserve LTV. The LTV percentage is never converted.',
  },
];
