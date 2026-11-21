import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARKUP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Markup Calculator' },
  { id: 'what-is-markup', label: 'What Is Markup?' },
  { id: 'definition', label: 'Markup Definition' },
  { id: 'margin-vs-markup', label: 'Margin vs. Markup' },
  { id: 'how-to-calculate', label: 'How to Calculate Markup' },
  { id: 'formula', label: 'Markup Formula' },
  { id: 'selling-price', label: 'Selling Price from Markup' },
  { id: 'cost-from-price', label: 'Cost from Selling Price' },
  { id: 'price-management', label: 'Markup in Price Management' },
  { id: 'industries', label: 'Markup by Industry' },
  { id: 'vs-markdown', label: 'Markup vs. Markdown' },
  { id: 'vs-profit-margin', label: 'Markup vs. Profit Margin' },
  { id: 'mistakes', label: 'Common Pricing Mistakes' },
  { id: 'choose', label: 'Choosing a Markup Percentage' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'mu-faq', label: 'Frequently Asked Questions' },
];

export const MARKUP_FAQS: readonly FAQItem[] = [
  {
    question: 'What is markup?',
    answer:
      'Markup is the amount added to unit cost to set selling price, usually expressed as a percentage of cost: Markup% = (Revenue − Cost) ÷ Cost × 100.',
  },
  {
    question: 'How do I calculate markup percentage?',
    answer:
      'Subtract cost from revenue (or selling price) to get profit, divide profit by cost, then multiply by 100. Example: cost $50, revenue $70 → profit $20 → markup 40%.',
  },
  {
    question: 'What is a 40% markup on a cost of $50?',
    answer: 'Profit = $20. Selling price (revenue) = $70.',
  },
  {
    question: 'What is a 25% markup on $100?',
    answer: 'Profit = $25. Selling price = $125.',
  },
  {
    question: 'How do I calculate selling price from markup?',
    answer:
      'Revenue = Cost × (1 + Markup%/100). For cost $80 and markup 25%: revenue = 80 × 1.25 = $100.',
  },
  {
    question: 'What is the difference between markup and margin?',
    answer:
      'Markup divides profit by cost; margin divides profit by revenue. Same dollars can show different percentages. Cost $60 and revenue $100 → markup ≈ 66.67%, margin 40%.',
  },
  {
    question: 'Is a 50% markup equal to a 50% margin?',
    answer:
      'No. A 50% markup on positive cost corresponds to a 33.33% margin (Margin% = Markup% ÷ (100 + Markup%) × 100).',
  },
  {
    question: 'How do I convert markup to margin?',
    answer:
      'Margin% = Markup% ÷ (100 + Markup%) × 100, provided Markup% > −100 so the denominator is not zero.',
  },
  {
    question: 'How do I convert margin to markup?',
    answer:
      'Markup% = Margin% ÷ (100 − Margin%) × 100, provided Margin% < 100. A 20% margin converts to a 25% markup.',
  },
  {
    question: 'Can markup be negative?',
    answer:
      'Yes. Negative markup means selling below cost (a unit loss). Example: cost $100, markup −20% → revenue $80, profit −$20.',
  },
  {
    question: 'What does 100% markup mean?',
    answer:
      'Selling price is twice the cost. Cost $50 with 100% markup → revenue $100 and profit $50.',
  },
  {
    question: 'What markup produces a 20% profit margin?',
    answer:
      '25% markup. Because Margin% = 20 implies Markup% = 20 ÷ (100 − 20) × 100 = 25%.',
  },
  {
    question: 'How do I calculate profit from markup?',
    answer: 'Profit = Cost × (Markup%/100). Cost $200 and markup 30% → profit $60.',
  },
  {
    question: 'Is markup calculated before or after tax?',
    answer:
      'It depends on whether your cost and price inputs already include tax and on local accounting rules. Keep tax treatment consistent on both sides; this calculator does arithmetic only.',
  },
  {
    question: 'What is the difference between markup and markdown?',
    answer:
      'Markup raises selling price relative to cost. Markdown reduces an established selling (list) price. They answer different pricing questions.',
  },
  {
    question: 'Does higher markup always mean higher profit?',
    answer:
      'Not necessarily. Demand, sales volume, fees, and operating costs can offset a higher unit markup. Higher markup on fewer sales may earn less than a lower markup with higher turnover.',
  },
  {
    question: 'How do I calculate original cost from selling price and markup?',
    answer:
      'Cost = Revenue ÷ (1 + Markup%/100), when Markup% > −100. Example: revenue $150 and markup 50% → cost $100.',
  },
  {
    question: 'Why is markup important for business?',
    answer:
      'Markup links cost recovery to selling price, supports gross-profit planning, and helps compare pricing options, without replacing a full P&L or competitive analysis.',
  },
];
