import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DOUBLE_DISCOUNT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-double-discount', label: 'What Is a Double Discount?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'double-discount-formula', label: 'Double Discount Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'double-discount-faq', label: 'Frequently Asked Questions' },
];

export const DOUBLE_DISCOUNT_FAQS: readonly FAQItem[] = [
  {
    question: 'Why isn’t 20% + 20% equal to 40% off?',
    answer:
      'Discounts stack sequentially. After the first 20% off, the second 20% applies to the already-reduced price. The combined effective discount is 20 + 20 − (20 × 20 / 100) = 36%, not 40%.',
  },
  {
    question: 'How is the final price calculated?',
    answer:
      'Final Price = Original Price × (1 − D1/100) × (1 − D2/100). Total savings equals original price minus final price. Each discount percent must be between 0% and 100%, and original price must be zero or greater.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Original price, final price, and total savings each have independent currencies. Discount math runs in the original-price currency at full precision; results convert for display. The two discount percents and the effective discount percent are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is this the same as the Discount Calculator?',
    answer:
      'No. The Discount Calculator applies a single percent-off. This Double Discount Calculator applies two sequential percent discounts and reports the combined effective rate.',
  },
];
