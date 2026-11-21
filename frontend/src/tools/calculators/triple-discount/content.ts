import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TRIPLE_DISCOUNT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-triple-discount', label: 'What Is a Triple Discount?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'triple-discount-formula', label: 'Triple Discount Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'triple-discount-faq', label: 'Frequently Asked Questions' },
];

export const TRIPLE_DISCOUNT_FAQS: readonly FAQItem[] = [
  {
    question: 'Why isn’t 20% + 20% + 20% equal to 60% off?',
    answer:
      'Discounts stack sequentially. Each percent applies to the already-reduced price, not the original. The combined effective discount is [1 − (1−D1/100)(1−D2/100)(1−D3/100)] × 100, for three 20% discounts that is 48.8%, not 60%.',
  },
  {
    question: 'How is the final price calculated?',
    answer:
      'Final Price = Original Price × (1 − D1/100) × (1 − D2/100) × (1 − D3/100). Price difference equals original price minus final price. Each discount percent must be between 0% and 100%, and original price must be zero or greater.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Original price, final price, and price difference each have independent currencies. Discount math runs in the original-price currency at full precision; results convert for display. The three discount percents and the effective discount percent are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'How is this different from Double Discount?',
    answer:
      'Double Discount applies two sequential percent-offs. This Triple Discount Calculator applies three sequential discounts and reports the combined effective rate from the product of all three retention factors.',
  },
];
