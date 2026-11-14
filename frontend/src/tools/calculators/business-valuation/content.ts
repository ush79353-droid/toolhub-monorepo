import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BUSINESS_VALUATION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-business-valuation', label: 'What Business Valuation Means' },
  { id: 'valuation-methods', label: 'Valuation Methods' },
  { id: 'dcf-formula', label: 'DCF Formula' },
  { id: 'other-formulas', label: 'Other Formulas' },
  { id: 'business-valuation-faq', label: 'Frequently Asked Questions' },
];

export const BUSINESS_VALUATION_FAQS: readonly FAQItem[] = [
  {
    question: 'Does the DCF method include a terminal value?',
    answer:
      'No. This calculator discounts only the constant annual cash flows over the projection period. It does not add a terminal or exit value after year n.',
  },
  {
    question: 'What does the thousand / million scale do?',
    answer:
      'It multiplies the entered cash flow before discounting. Entering 500 with “thousand” means 500,000 in the selected currency.',
  },
  {
    question: 'Can the discount rate be zero?',
    answer:
      'Yes. At 0%, the DCF value equals cash flow × projection years, because there is no time-value discount.',
  },
  {
    question: 'Does currency convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter all money fields for a method in the same currency.',
  },
];
