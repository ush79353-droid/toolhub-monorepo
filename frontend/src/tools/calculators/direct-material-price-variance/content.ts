import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DMPV_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-price-variance', label: 'What Is Price Variance?' },
  { id: 'formula', label: 'Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'dmpv-faq', label: 'Frequently Asked Questions' },
];

export const DMPV_FAQS: readonly FAQItem[] = [
  {
    question: 'What is direct materials price variance?',
    answer:
      'It measures the difference between the actual price paid for materials and the standard (budgeted) price, multiplied by the quantity purchased or used as the variance base.',
  },
  {
    question: 'How is the variance calculated?',
    answer:
      'Price variance = (Actual rate − Standard rate) × Quantity. Example: (120 − 100) × 500 = 10,000.',
  },
  {
    question: 'When is the variance favorable or unfavorable?',
    answer:
      'A positive variance (actual rate above standard) is unfavorable. A negative variance is favorable. Zero means no variance.',
  },
  {
    question: 'Can rates or quantity be zero?',
    answer:
      'Yes. Zero rates or quantity are allowed. Negative values are rejected because they are not valid for this calculator.',
  },
  {
    question: 'Does changing the currency convert amounts?',
    answer:
      'No. The currency selector only changes the display symbol and formatting. Entered amounts stay in the currency you choose.',
  },
];
