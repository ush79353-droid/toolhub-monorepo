import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SIMPLE_MORTGAGE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-simple-mortgage', label: 'What This Calculator Estimates' },
  { id: 'simple-mortgage-formula', label: 'Payment Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'simple-mortgage-faq', label: 'Frequently Asked Questions' },
];

export const SIMPLE_MORTGAGE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the monthly payment calculated?',
    answer:
      'Fixed-rate amortizing mortgage: r = APR / 1200, n = term years × 12 (or months), Payment = P × r / (1 − (1 + r)^(−n)). When the rate is zero, Payment = P / n.',
  },
  {
    question: 'What happens when Include taxes, insurance, and fees is checked?',
    answer:
      'The checkbox is shown for screenshot parity, but no verified tax, insurance, or fee fields appear in the reference when it is enabled. Results stay blocked while it is checked so charges are not invented.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Loan amount converts on currency change. Monthly payment currency re-expresses the calculated payment. Rate and term are never converted.',
  },
];
