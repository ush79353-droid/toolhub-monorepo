import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PERCENT_OFF_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Percent Off Calculator' },
  { id: 'what-is', label: 'What Is Percent Off?' },
  { id: 'how-it-works', label: 'How This Calculator Works' },
  { id: 'formula', label: 'Percent Off Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Percent Off' },
  { id: 'final-price', label: 'Final Price After a Discount' },
  { id: 'savings', label: 'How Much You Save' },
  { id: 'two-discounts', label: 'Two Discounts' },
  { id: 'not-additive', label: 'Why Discounts Do Not Add' },
  { id: 'original-price', label: 'Find Original Price' },
  { id: 'find-percent', label: 'Find Discount Percentage' },
  { id: 'sales-tax', label: 'Sales Tax After a Discount' },
  { id: 'vs-points', label: 'Percent Off vs. Percentage Points' },
  { id: 'retailers', label: 'How Retailers Use Discounts' },
  { id: 'black-friday', label: 'Black Friday Discounts' },
  { id: 'compare', label: 'Compare Discount Offers' },
  { id: 'psychology', label: 'Strategic Aspects of Discounts' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'po-faq', label: 'Frequently Asked Questions' },
];

export const PERCENT_OFF_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I calculate percent off?',
    answer:
      'Multiply the original price by the discount percent ÷ 100 to get savings, then subtract savings from the original price. Final = Original × (1 − PercentOff/100).',
  },
  {
    question: 'What is 10% off $100?',
    answer: 'Savings = $10. Final price = $90.',
  },
  {
    question: 'What is 15% off $200?',
    answer: 'Savings = $30. Final price = $170.',
  },
  {
    question: 'What is 20% off $150?',
    answer: 'Savings = $30. Final price = $120.',
  },
  {
    question: 'What is 25% off $80?',
    answer: 'Savings = $20. Final price = $60.',
  },
  {
    question: 'What is 30% off $50?',
    answer: 'Savings = $15. Final price = $35.',
  },
  {
    question: 'What is 40% off $100?',
    answer: 'Savings = $40. Final price = $60.',
  },
  {
    question: 'What is 50% off $120?',
    answer: 'Savings = $60. Final price = $60.',
  },
  {
    question: 'How much is 75% off?',
    answer:
      'You pay 25% of the original price. On $100, 75% off leaves $25. On $80, 75% off leaves $20.',
  },
  {
    question: 'How do I calculate the final price after a discount?',
    answer:
      'Final price = Original × (1 − discount%/100). Example: $200 with 25% off → $150.',
  },
  {
    question: 'How do I calculate the original price before a discount?',
    answer:
      'Original = Sale ÷ (1 − discount%/100), when discount% < 100. Example: $75 after 25% off → $100 original.',
  },
  {
    question: 'How do I find the discount percentage?',
    answer:
      'Percent off = (Original − Sale) ÷ Original × 100. Example: $200 to $150 → 25% off.',
  },
  {
    question: 'How do I calculate two percentage discounts?',
    answer:
      'Apply them in sequence: Final = P × (1 − D₁/100) × (1 − D₂/100). Example: $100 with 20% then 10% → $72.',
  },
  {
    question: 'Is 20% off followed by 10% off the same as 30% off?',
    answer:
      'No. 20% then 10% is an effective 28% off. A single 30% off leaves $70 on a $100 item; sequential leaves $72.',
  },
  {
    question: 'How do I calculate sales tax after a discount?',
    answer:
      'Tax the discounted price: Tax = Discounted × tax%/100; Total = Discounted + Tax. Example: $150 after discount with 8% tax → $12 tax, $162 total.',
  },
  {
    question: 'Can a discount be greater than 100%?',
    answer:
      'In standard retail percent-off mode, No: that would imply a negative sale price. This calculator rejects values above 100%.',
  },
  {
    question: 'What is the difference between percent off and percentage points?',
    answer:
      'Percent off is a relative reduction of a price. Percentage points measure the arithmetic difference between two rates (e.g. 10% to 8% is a 2 percentage-point drop, not 2% off).',
  },
  {
    question: 'How do I compare two discount offers?',
    answer:
      'Compare final prices (and total savings) on the same original price. Effective discount % helps when offers stack differently.',
  },
  {
    question: 'How do I calculate the effective discount percentage?',
    answer:
      'Effective% = (Original − Final) ÷ Original × 100, or 100 × [1 − Π(1 − Dᵢ/100)] for sequential discounts.',
  },
  {
    question: 'What does 100% off mean?',
    answer:
      'The item is free (final price $0). You cannot uniquely reverse a 100% discount to find the original price from a $0 sale price.',
  },
];
