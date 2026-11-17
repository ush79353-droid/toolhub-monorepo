import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARGIN_VAT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-margin-vat', label: 'What Is Margin and VAT?' },
  { id: 'margin-vat-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'margin-vat-faq', label: 'Frequently Asked Questions' },
];

export const MARGIN_VAT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the difference between margin and markup?',
    answer:
      'Margin is profit as a percent of net selling price. Markup is profit as a percent of net cost. A 20% margin equals a 25% markup when cost is positive.',
  },
  {
    question: 'How does VAT relate to net and gross amounts?',
    answer:
      'Gross = Net × (1 + VAT/100). Inverse: Net = Gross ÷ (1 + VAT/100). The same VAT rate applies to both cost and selling price pairs.',
  },
  {
    question: 'What do the pin icons on Margin and Markup do?',
    answer:
      'Pin chooses which percentage drives price-from-cost solving. With net cost known, pinned margin uses Net price = Net cost ÷ (1 − Margin/100). Pinned markup uses Net price = Net cost × (1 + Markup/100).',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. The five money fields each have an independent currency. Before math, amounts are normalized into the net-cost currency using stored FX rates. VAT, margin, and markup percentages are never converted.',
  },
];
