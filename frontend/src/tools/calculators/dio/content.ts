import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-dio', label: 'What Is Days Inventory Outstanding?' },
  { id: 'dio-meaning', label: 'Days Inventory Outstanding Meaning' },
  { id: 'dio-formula', label: 'Days Inventory Outstanding Formula' },
  { id: 'average-inventory', label: 'How to Calculate Average Inventory' },
  { id: 'how-to-calculate', label: 'How to Calculate DIO' },
  { id: 'worked-example', label: 'DIO Calculation Example' },
  { id: 'why-calculate', label: 'Why Calculate Days Inventory Outstanding?' },
  { id: 'good-dio', label: 'What Is a Good DIO?' },
  { id: 'reduce-dio', label: 'How to Reduce DIO' },
  { id: 'vs-turnover', label: 'DIO vs Inventory Turnover' },
  { id: 'ccc', label: 'DIO and the Cash Conversion Cycle' },
  { id: 'mistakes', label: 'Common DIO Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations of the DIO Calculator' },
  { id: 'dio-faq', label: 'Frequently Asked Questions' },
];

export const DIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is DIO?',
    answer:
      'Days Inventory Outstanding (also called days sales of inventory) estimates the average number of days a business holds inventory before it is sold, based on average inventory, COGS, and the reporting period.',
  },
  {
    question: 'How do I calculate DIO?',
    answer:
      'DIO = (Average inventory ÷ COGS) × days in the accounting period. Average inventory is often (beginning + ending) ÷ 2.',
  },
  {
    question: 'What does a high DIO mean?',
    answer:
      'A relatively high DIO means inventory remains on hand longer versus COGS for the period. Causes can include seasonality, long cycles, weak demand, or overstocking; interpret with industry context.',
  },
  {
    question: 'What does a low DIO mean?',
    answer:
      'A relatively low DIO means inventory turns faster relative to COGS. That can free working capital, but very low levels may also raise stockout risk.',
  },
  {
    question: 'Is lower DIO always better?',
    answer:
      'No. Faster turns can improve cash efficiency, but cutting inventory too aggressively can create stockouts, lost sales, and supply-chain stress.',
  },
  {
    question: 'What is the difference between DIO and inventory turnover?',
    answer:
      'Inventory turnover = COGS ÷ average inventory (times per period). When turnover is positive, DIO = period days ÷ turnover. They describe the same relationship from different angles.',
  },
  {
    question: 'How do I calculate average inventory?',
    answer:
      'Average inventory = (starting inventory + ending inventory) ÷ 2, or enter a known period average directly.',
  },
  {
    question: 'Can DIO be zero?',
    answer:
      'Yes, when average inventory is zero and COGS is positive. That result needs careful interpretation and does not automatically mean perfect inventory management.',
  },
  {
    question: 'Can DIO be negative?',
    answer:
      'Under the standard nonnegative inventory and COGS model used here, no. Negative balances are rejected as validation errors.',
  },
  {
    question: 'What happens when COGS is zero?',
    answer:
      'DIO is undefined because the formula divides by COGS. This calculator does not display Infinity.',
  },
  {
    question: 'How does DIO affect the cash conversion cycle?',
    answer:
      'CCC = DIO + DSO − DPO. Longer inventory holding days increase the cash conversion cycle when other components are unchanged.',
  },
  {
    question:
      'What is DIO if average inventory is $100,000, COGS is $500,000, and the period is 365 days?',
    answer: 'DIO = 100,000 / 500,000 × 365 = 73 days.',
  },
  {
    question: 'What accounting period should I use?',
    answer:
      'Use the actual day count of the reporting period that matches your inventory and COGS figures (for example 90 for a quarter, 365 or 366 for a year).',
  },
  {
    question: 'Why is COGS used instead of revenue?',
    answer:
      'Inventory is generally carried at cost. COGS provides a more consistent denominator than sales revenue for measuring how long cost-basis inventory stays on hand.',
  },
  {
    question: 'Can seasonal inventory affect DIO?',
    answer:
      'Yes. A simple beginning/ending average can miss mid-period peaks or troughs. Monthly averages may better represent highly seasonal businesses.',
  },
];
