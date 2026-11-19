import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PROFIT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-profit', label: 'What Is This Profit Calculator?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'profit-formulas', label: 'Profit Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'profit-faq', label: 'Frequently Asked Questions' },
];

export const PROFIT_FAQS: readonly FAQItem[] = [
  {
    question: 'How is total profit calculated?',
    answer:
      'Unit cost = buying cost ÷ cost-per units. Unit selling price = selling price ÷ price-per units. Total cost = unit cost × quantity. Revenue = unit selling price × quantity × (1 − discount%/100). Total profit = revenue − total cost. Negative profit means a loss.',
  },
  {
    question: 'Why are there “per” fields on cost and price?',
    answer:
      'They normalize pack or lot prices to a single unit before scaling by quantity. For example, cost 100 for 10 units is a unit cost of 10.',
  },
  {
    question: 'Does discount apply to cost or revenue?',
    answer:
      'Discount reduces selling revenue only: Revenue = unit price × quantity × (1 − D/100). Buying cost is not discounted.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Cost, price, total cost, revenue, and total profit each have independent currencies. Math runs in the buying-cost currency after Phase 2 FX normalization; results convert for display. Unit counts and discount % are never converted.',
  },
  {
    question: 'Is this the same as Margin or Contribution Margin Calculator?',
    answer:
      'No. This tool estimates total profit from unit-normalized buying cost, selling price, quantity, and a revenue discount. Margin and contribution-margin tools remain separate calculators.',
  },
];
