import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARGIN_SALES_TAX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-margin-sales-tax', label: 'What Is Margin and Sales Tax?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'margin-sales-tax-faq', label: 'Frequently Asked Questions' },
];

export const MARGIN_SALES_TAX_FAQS: readonly FAQItem[] = [
  {
    question: 'How are net price, margin, gross price, and profit calculated?',
    answer:
      'Net Price = Cost × (1 + Markup/100). Profit = Net Price − Cost. Margin (%) = Profit / Net Price × 100 (undefined when net price is zero). Gross Price = Net Price × (1 + Sales Tax/100). Sales tax is added on top of net price and is not counted as profit.',
  },
  {
    question: 'What is the difference between markup and margin?',
    answer:
      'Markup is a percent of cost. Margin is profit as a percent of net selling price. A 25% markup on cost 100 yields net 125, profit 25, and margin 20%.',
  },
  {
    question: 'Is sales tax included in profit?',
    answer:
      'No. Profit uses net price only. Sales tax raises the gross (customer) price but does not increase business profit in this model.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Cost, net price, gross price, and profit each have independent currencies. Math runs in the cost currency at full precision; other money fields convert for display. Markup, margin, and sales-tax percentages are never FX-converted.',
  },
];
