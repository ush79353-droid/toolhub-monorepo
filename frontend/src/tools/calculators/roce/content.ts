import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ROCE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-roce', label: 'What Is ROCE?' },
  { id: 'roce-formula', label: 'ROCE Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'roce-faq', label: 'Frequently Asked Questions' },
];

export const ROCE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is capital employed calculated?',
    answer:
      'Using total assets: Capital Employed = Total Assets − Current Liabilities. Using equity: Capital Employed = Total Equity + Non-current Liabilities.',
  },
  {
    question: 'How is ROCE calculated?',
    answer:
      'ROCE (%) = (EBIT / Capital Employed) × 100. Capital employed must be greater than zero.',
  },
  {
    question: 'Can ROCE be negative?',
    answer:
      'Yes. Negative EBIT produces a negative ROCE, which indicates an operating loss relative to capital employed.',
  },
  {
    question: 'Does changing the currency convert the amount?',
    answer:
      'No. Currency selection changes denomination and formatting only. It does not apply a live exchange rate.',
  },
];
