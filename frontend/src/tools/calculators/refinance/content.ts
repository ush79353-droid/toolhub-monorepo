import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const REFINANCE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-refinance', label: 'What Does This Calculator Compare?' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'refinance-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Example' },
  { id: 'refinance-faq', label: 'FAQ' },
];

export const REFINANCE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the remaining term calculated?',
    answer:
      'From remaining balance, monthly payment, and current APR using the standard amortizing-loan formula. If the payment does not cover interest, no remaining term can be solved.',
  },
  {
    question: 'Are points and fees financed into the new loan?',
    answer:
      'No. This screenshot-first tool treats points and costs as upfront closing costs. New loan amount equals remaining balance plus cash-out only. Points cost equals that principal × points ÷ 100.',
  },
  {
    question: 'When is there no break-even?',
    answer:
      'If the new monthly payment is not lower than the current payment, monthly savings are zero or negative, so break-even from closing costs is not defined.',
  },
  {
    question: 'Is currency conversion supported?',
    answer:
      'No. Amounts are fixed USD to match the reference. Rates, points, and terms are never currency-converted.',
  },
];
