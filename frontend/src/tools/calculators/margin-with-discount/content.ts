import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARGIN_WITH_DISCOUNT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-margin-with-discount', label: 'What Is Margin With Discount?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'margin-with-discount-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'margin-with-discount-faq', label: 'Frequently Asked Questions' },
];

export const MARGIN_WITH_DISCOUNT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between margin and markup?',
    answer:
      'Margin is profit as a percent of revenue (selling price). Markup is profit as a percent of cost. A 25% margin means profit is 25% of the selling price; a 25% markup means profit is 25% of cost. They are related but not equal: markup = margin / (1 − margin), and margin = markup / (1 + markup).',
  },
  {
    question: 'What happens if I fill both base margin and base markup?',
    answer:
      'They stay synchronized. The last field you edited among base margin, base markup, and base revenue is authoritative. Editing margin recalculates markup and revenue; editing markup recalculates margin and revenue; editing revenue recalculates both percents.',
  },
  {
    question: 'How does a discount change true margin?',
    answer:
      'Price after discount = base revenue × (1 − discount/100). Profit = price after discount − cost. True margin = profit / price after discount × 100, and true markup = profit / cost × 100. A discount lowers the selling price, so true margin and markup are usually lower than the base targets.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Cost, base revenue, price after discount, and profit each have independent currencies. Math runs in the cost currency at full precision; money results convert for display. Margin, markup, and discount percents are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
