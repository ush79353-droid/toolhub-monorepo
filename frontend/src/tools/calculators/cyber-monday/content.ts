import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { getCyberMondayDate } from './calculation';

const cm2026 = getCyberMondayDate(2026);

export const CYBER_MONDAY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Cyber Monday Calculator' },
  { id: 'what-is', label: 'What Is Cyber Monday?' },
  { id: 'when', label: 'When Is Cyber Monday?' },
  { id: 'how-works', label: 'How the Calculator Works' },
  { id: 'how-discount', label: 'How to Calculate Discounts' },
  { id: 'multiple', label: 'Multiple / Stacked Discounts' },
  { id: 'double', label: 'Double Discount' },
  { id: 'triple', label: 'Triple Discount' },
  { id: 'bogo', label: 'BOGO Deals' },
  { id: 'buy-x-get-y', label: 'Buy X Get Y Free' },
  { id: 'coupons', label: 'Coupons and Codes' },
  { id: 'tax', label: 'Sales Tax on Discounts' },
  { id: 'shipping', label: 'Shipping and Savings' },
  { id: 'vs-bf', label: 'Cyber Monday vs. Black Friday' },
  { id: 'genuine', label: 'Finding Genuine Deals' },
  { id: 'mistakes', label: 'Common Shopping Mistakes' },
  { id: 'save-more', label: 'How to Save More' },
  { id: 'examples', label: 'Calculator Examples' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'cm-faq', label: 'Frequently Asked Questions' },
];

export const CYBER_MONDAY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is Cyber Monday?',
    answer:
      'Cyber Monday is an online shopping event traditionally held the Monday after U.S. Thanksgiving, featuring ecommerce discounts, coupons, and promotions.',
  },
  {
    question: 'When is Cyber Monday in 2026?',
    answer: `Cyber Monday 2026 falls on ${cm2026.isoDate} (November ${cm2026.day}, 2026): the Monday after Thanksgiving.`,
  },
  {
    question: 'How does a Cyber Monday calculator work?',
    answer:
      'You enter a unit price, quantity, and deal type (percentage, fixed, stacked, BOGO, etc.), then optional tax and shipping. The tool computes discounted merchandise, tax, shipping, and final checkout.',
  },
  {
    question: 'How do I calculate a 20% discount?',
    answer:
      'Discounted price = Original × 0.80. Example: $100 × 0.80 = $80 (save $20).',
  },
  {
    question: 'How do I calculate a 30% discount?',
    answer: 'Discounted price = Original × 0.70. Example: $200 × 0.70 = $140.',
  },
  {
    question: 'How do I calculate a fixed discount?',
    answer:
      'Discounted = max(0, Original − Fixed). Example: $150 − $30 = $120.',
  },
  {
    question: 'How do I calculate two discounts?',
    answer:
      'Apply them sequentially: Final = P × (1 − d1) × (1 − d2). Do not add the percentages.',
  },
  {
    question: 'How do I calculate three discounts?',
    answer:
      'Final = P × (1 − d1) × (1 − d2) × (1 − d3). Example: $300 with 20%, 10%, 5% → $205.20.',
  },
  {
    question: 'Is 20% off followed by 10% off equal to 30% off?',
    answer:
      'No. 20% then 10% leaves 72% of the original (28% off), not 70%.',
  },
  {
    question: 'What is a BOGO offer?',
    answer:
      'Buy One Get One; typically the second item free or discounted. For identical free BOGO, paid items ≈ ceil(quantity / 2).',
  },
  {
    question: 'How does Buy 2 Get 1 Free work?',
    answer:
      'Each group of 3 items charges for 2. For 6 items at $30: 2 complete groups → 2 free → pay for 4 → $120.',
  },
  {
    question: 'How do I calculate stacked coupons?',
    answer:
      'Apply each allowed coupon in the retailer’s order (often percent then fixed). Not every store permits stacking.',
  },
  {
    question: 'Can I combine two Cyber Monday discounts?',
    answer:
      'Only if the retailer allows it. Mathematically this tool can stack sequential percentages or percent + coupon when you choose that deal type.',
  },
  {
    question: 'Does sales tax apply before or after discounts?',
    answer:
      'Many jurisdictions tax the discounted selling price. This calculator’s default is tax after the merchandise discount. Local rules can differ.',
  },
  {
    question: 'How do shipping fees affect savings?',
    answer:
      'A large % off can still lose to a smaller discount with free shipping. Always compare final checkout totals.',
  },
  {
    question: 'What is the difference between Black Friday and Cyber Monday?',
    answer:
      'Black Friday is the day after Thanksgiving (stores and online). Cyber Monday emphasizes online deals the following Monday. Promotions increasingly overlap.',
  },
  {
    question: 'Which is better, Black Friday or Cyber Monday?',
    answer:
      'Neither is always better. Compare identical products’ final checkout prices, shipping, returns, and availability for each event.',
  },
  {
    question: 'How can I check whether a Cyber Monday deal is genuine?',
    answer:
      'Check price history when available, read exclusions, verify shipping/tax, and confirm return policies before buying.',
  },
  {
    question: 'How do I calculate the effective discount percentage?',
    answer:
      'Effective% = (Original − Discounted) / Original × 100. Example: $200 → $144 is 28% effective.',
  },
  {
    question: 'How much do I save with 25% off $200?',
    answer: '$50 merchandise savings; discounted price $150 before tax/shipping.',
  },
  {
    question: 'How do I compare two online shopping deals?',
    answer:
      'Match product and quantity, then compare final checkout (merchandise + tax + shipping), not headline percentages alone.',
  },
  {
    question: 'Can a 50% discount be applied twice?',
    answer:
      'Only if the offer stacks. Two sequential 50% discounts leave 25% of the original; not free.',
  },
  {
    question: 'What is a free-shipping threshold?',
    answer:
      'An order amount at which shipping becomes free. This tool defaults to checking the after-discount merchandise subtotal.',
  },
  {
    question: 'How do I calculate a discount after tax?',
    answer:
      'If tax is already included, extract pre-tax = Inclusive ÷ (1 + t) and included tax = Inclusive − pre-tax. Do not add tax again.',
  },
  {
    question: 'Can a Cyber Monday calculator help me plan a shopping budget?',
    answer:
      'Yes: estimate checkout totals per item, sum them, and stay under your budget before impulse adds.',
  },
];
