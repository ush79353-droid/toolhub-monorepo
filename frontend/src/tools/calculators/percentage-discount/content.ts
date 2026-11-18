import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PERCENTAGE_DISCOUNT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-percentage-discount', label: 'What Is a Percentage Discount?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'percentage-discount-formula', label: 'Discount Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'percentage-discount-faq', label: 'Frequently Asked Questions' },
];

export const PERCENTAGE_DISCOUNT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is a percentage discount calculated?',
    answer:
      'Discount amount equals price before discount × discount percent ÷ 100. Price after discount equals original price minus that amount. You save equals the discount amount. Rates outside 0–100% and negative prices are rejected.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Price before, price after, and you save each have independent currencies. Discount math runs in the price-before currency at full precision; results convert for display. The discount percent is never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'Is zero or 100% discount allowed?',
    answer:
      'Yes. A 0% discount leaves the price unchanged and saves nothing. A 100% discount sets the sale price to zero and saves the full original price.',
  },
  {
    question: 'How does this differ from the Discount Calculator?',
    answer:
      'This tool focuses on a simple percent-off flow: price before, discount %, price after, and savings. The advanced Discount Calculator adds extra labeling options such as discount type and tax-included flags when you need that workflow.',
  },
];
