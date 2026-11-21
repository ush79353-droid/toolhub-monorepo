import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { getBlackFridayDate } from './calculation';

const bf2026 = getBlackFridayDate(2026);

export const BLACK_FRIDAY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Black Friday Calculator' },
  { id: 'what-is', label: 'What Is Black Friday?' },
  { id: 'when', label: 'When Is Black Friday?' },
  { id: 'deals', label: 'Deals and Shopping Discounts' },
  { id: 'how-discount', label: 'How to Calculate a Discount' },
  { id: 'final-price', label: 'How to Calculate Final Sale Price' },
  { id: 'multiple', label: 'How to Calculate Multiple Discounts' },
  { id: 'savings-pct', label: 'How to Calculate Savings Percentage' },
  { id: 'cyber-monday', label: 'Black Friday vs Cyber Monday' },
  { id: 'compare', label: 'How to Compare Deals' },
  { id: 'cheapest', label: 'Is Black Friday Always Cheapest?' },
  { id: 'misleading', label: 'How to Avoid Misleading Discounts' },
  { id: 'budget', label: 'Shopping Budget Tips' },
  { id: 'overspend', label: 'How to Avoid Overspending' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'bf-faq', label: 'Frequently Asked Questions' },
];

export const BLACK_FRIDAY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is Black Friday?',
    answer:
      'Black Friday is a major shopping event traditionally held the day after U.S. Thanksgiving, known for discounts across retail and online stores.',
  },
  {
    question: 'When is Black Friday in 2026?',
    answer: `Black Friday 2026 falls on ${bf2026.isoDate} (November ${bf2026.day}, 2026) — the Friday after U.S. Thanksgiving.`,
  },
  {
    question: 'How do I calculate a Black Friday discount?',
    answer:
      'Discount amount = Original × Discount%/100. Discounted price = Original − Discount amount. Optionally add sales tax on the discounted price.',
  },
  {
    question: 'How do I calculate 30% off a price?',
    answer:
      'Multiply the original price by 0.70 (or subtract 30% of the original). Example: $100 × 0.70 = $70.',
  },
  {
    question: 'How much is 50% off $200?',
    answer: '$100. Discount amount = 200 × 0.50 = $100; discounted price = $100.',
  },
  {
    question: 'What is the formula for calculating discounts?',
    answer:
      'DiscountedPrice = OriginalPrice × (1 − DiscountRate/100). For successive discounts, multiply by each (1 − d_i) in order.',
  },
  {
    question: 'How do I calculate my final price after tax?',
    answer:
      'FinalPrice = DiscountedPrice × (1 + TaxRate/100) when tax applies to the discounted price (this calculator’s default model).',
  },
  {
    question: 'How do I calculate savings percentage?',
    answer:
      'Savings% = (Original − Discounted) / Original × 100. With stacked discounts, use the effective total reduction.',
  },
  {
    question: 'Can I combine two percentage discounts?',
    answer:
      'Only if the retailer allows stacking. Mathematically apply them sequentially: second discount applies to the already-reduced price.',
  },
  {
    question: 'Is 20% off plus 10% off equal to 30% off?',
    answer:
      'No. 20% then 10% leaves 72% of the original (28% off), not 70%.',
  },
  {
    question: 'How do I calculate a fixed-dollar discount?',
    answer:
      'DiscountedPrice = Original − FixedAmount. The fixed amount cannot exceed the original price.',
  },
  {
    question: 'How do I find the original price before discount?',
    answer:
      'Original = Discounted / (1 − d) when d < 100%. A 100% discount cannot uniquely recover the original from a $0 sale price.',
  },
  {
    question: 'What is the difference between Black Friday and Cyber Monday?',
    answer:
      'Black Friday traditionally focuses on the day after Thanksgiving (stores and online). Cyber Monday emphasizes online deals the following Monday. Promotions increasingly overlap.',
  },
  {
    question: 'Are Black Friday deals always cheaper?',
    answer:
      'No. Compare the final price with recent prices, shipping, taxes, and return terms — a large % off a raised list price can still be mediocre.',
  },
  {
    question: 'How can I compare discounts between stores?',
    answer:
      'Compare final checkout prices for the same item (including tax and shipping), not headline percentages alone.',
  },
  {
    question: 'How do I avoid fake Black Friday deals?',
    answer:
      'Check price history when available, ignore artificial urgency, read exclusions, and verify return policies before buying.',
  },
  {
    question: 'Does sales tax apply before or after discounts?',
    answer:
      'Many jurisdictions tax the discounted selling price. This calculator applies tax after the discount by default. Local rules can differ.',
  },
  {
    question: 'How do I calculate multiple item discounts?',
    answer:
      'Discount each item (or apply cart rules), sum discounted subtotals, then apply tax if needed. Use related cart tools for complex baskets.',
  },
  {
    question: 'Can I use this calculator for Cyber Monday?',
    answer:
      'Yes. The math is the same for any percentage or fixed sale discount with optional tax.',
  },
  {
    question: 'How do I calculate the total savings on my shopping cart?',
    answer:
      'Sum original prices, subtract the sum of discounted prices (or compute each line’s savings and add). Tax is separate from pre-tax savings.',
  },
  {
    question: 'What is a good Black Friday discount?',
    answer:
      'There is no universal “good” percentage. Judge the final price versus alternatives and your budget.',
  },
  {
    question: 'How do I calculate 70% off?',
    answer:
      'Pay 30% of the original: Discounted = Original × 0.30. Example: $100 → $30.',
  },
  {
    question: 'Should I compare discounts or final prices?',
    answer:
      'Prefer final prices (and total cost with tax/shipping). Percentages can mislead when list prices differ.',
  },
  {
    question: 'How do I make a Black Friday shopping budget?',
    answer:
      'Set a spending limit, list needed items, estimate discounted totals with this calculator, and leave room for tax and shipping.',
  },
  {
    question: 'Does free shipping make a deal better?',
    answer:
      'Often yes versus a slightly lower sticker price plus shipping — compare total landed cost, not just the sale price.',
  },
];
