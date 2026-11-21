import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DSO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-dso', label: 'What Is Days Sales Outstanding?' },
  { id: 'dso-formula', label: 'How to Calculate DSO' },
  { id: 'average-ar', label: 'How to Calculate Average Accounts Receivable' },
  { id: 'worked-example', label: 'Complete DSO Calculation Example' },
  { id: 'purpose', label: 'The Purpose of DSO' },
  { id: 'good-dso', label: 'What Is a Good DSO?' },
  { id: 'reduce-dso', label: 'How to Reduce DSO' },
  { id: 'vs-turnover', label: 'DSO vs Accounts Receivable Turnover' },
  { id: 'vs-dio-dpo', label: 'DSO vs DIO vs DPO' },
  { id: 'ccc', label: 'DSO and Cash Conversion Cycle' },
  { id: 'mistakes', label: 'Common DSO Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations of the DSO Calculator' },
  { id: 'dso-faq', label: 'Frequently Asked Questions' },
];

export const DSO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is DSO?',
    answer:
      'Days Sales Outstanding (also called the average collection period) estimates how many days, on average, a business takes to collect accounts receivable relative to sales over a reporting period.',
  },
  {
    question: 'How do I calculate DSO?',
    answer:
      'DSO = (Average accounts receivable ÷ Sales) × days in the accounting period.',
  },
  {
    question: 'What does high DSO mean?',
    answer:
      'A relatively high DSO means more receivables remain outstanding versus sales. Causes can include longer credit terms, slow collections, seasonal sales, or large recent credit sales.',
  },
  {
    question: 'What does low DSO mean?',
    answer:
      'A relatively low DSO means receivables are smaller versus sales; often faster collections or shorter credit terms. A low DSO does not automatically guarantee strong overall financial performance.',
  },
  {
    question: 'Is lower DSO always better?',
    answer:
      'No. Faster collections can free cash, but excessively tight credit policies may affect customer relationships and revenue.',
  },
  {
    question: 'How do I calculate average accounts receivable?',
    answer:
      'Average AR = (beginning AR + ending AR) ÷ 2, or enter a known period average directly.',
  },
  {
    question: 'Should I use total sales or credit sales for DSO?',
    answer:
      'Net credit sales is generally preferable because receivables arise mainly from credit sales. Total sales is a useful proxy when credit sales are unavailable, but cash sales can understate DSO.',
  },
  {
    question: 'Can DSO be zero?',
    answer:
      'Yes, when average AR is zero and sales are positive. Interpret carefully; it is a simplified ratio, not proof that every invoice pays immediately.',
  },
  {
    question: 'Can DSO be negative?',
    answer:
      'Under the standard nonnegative receivables and sales model used here, no. Negative balances are rejected as validation errors.',
  },
  {
    question: 'What happens when sales are zero?',
    answer:
      'DSO is undefined because the formula divides by sales. This calculator does not display Infinity.',
  },
  {
    question: 'What is the relationship between DSO and accounts receivable turnover?',
    answer:
      'AR turnover = Sales ÷ Average AR. When turnover is positive, DSO = period days ÷ turnover.',
  },
  {
    question: 'How does DSO affect the cash conversion cycle?',
    answer:
      'CCC = DIO + DSO − DPO. Reducing DSO lowers measured CCC when other components are unchanged, but tightening terms can affect sales.',
  },
  {
    question: 'What accounting period should I use?',
    answer:
      'Use the actual day count of the reporting period that matches your receivables and sales figures (for example 90 for a quarter, 365 or 366 for a year).',
  },
  {
    question: 'Can seasonality affect DSO?',
    answer:
      'Yes. A simple beginning/ending average can miss mid-period peaks or troughs. Seasonal sales and collections can distort period-end balances.',
  },
  {
    question:
      'What is DSO if average AR is $100,000, sales are $800,000, and the accounting period is 365 days?',
    answer:
      'DSO = (100,000 / 800,000) × 365 = 45.625 days (displayed as 45.63 days).',
  },
];
