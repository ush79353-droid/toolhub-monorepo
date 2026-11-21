import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ACCRUAL_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-accrual-ratio', label: 'What Is the Accrual Ratio?' },
  { id: 'balance-sheet-method', label: 'Balance Sheet Accrual Ratio' },
  { id: 'cash-flow-method', label: 'Cash Flow Accrual Ratio' },
  { id: 'how-to-calculate', label: 'How to Calculate the Accrual Ratio' },
  { id: 'earnings-quality', label: 'Applying Accrual Ratios to Earnings Quality' },
  { id: 'operating-assets-liabilities', label: 'Operating Assets and Liabilities' },
  { id: 'accrual-vs-cash', label: 'Accrual Accounting vs Cash Accounting' },
  { id: 'positive-vs-negative', label: 'Positive vs Negative Accrual Ratio' },
  { id: 'vs-ocf-ratio', label: 'Accrual Ratio vs Operating Cash Flow Ratio' },
  { id: 'limitations', label: 'Limitations of the Accrual Ratio' },
  { id: 'accrual-ratio-faq', label: 'Frequently Asked Questions' },
];

export const ACCRUAL_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What are operating assets?',
    answer:
      'Operating assets are assets used in the company’s core operating activities under the classification you apply; often including items such as operating receivables, inventory, and operating fixed assets, while excluding financing assets when that is the chosen methodology.',
  },
  {
    question: 'What are operating liabilities?',
    answer:
      'Operating liabilities are obligations arising from operations (for example trade payables and similar operating items), as distinct from financing liabilities such as interest-bearing debt under the relevant NOA framework.',
  },
  {
    question: 'What are net operating assets?',
    answer:
      'Net Operating Assets = Operating Assets − Operating Liabilities. Beginning and ending NOA are computed the same way at each balance-sheet date.',
  },
  {
    question: 'What are accruals?',
    answer:
      'Accruals are accounting adjustments and timing differences that make reported earnings differ from cash flows, for example revenue recognized before cash is collected, or expenses recognized before cash is paid.',
  },
  {
    question: 'What is the net operating asset if operating assets are $300,000?',
    answer:
      'You also need operating liabilities. Example: operating assets $300,000 − operating liabilities $100,000 = NOA $200,000.',
  },
  {
    question: 'How do I calculate the balance sheet accrual ratio?',
    answer:
      'Compute beginning and ending NOA, average them, take the change in NOA (ending − beginning), then divide change by average NOA. Display as a decimal or as a percentage (× 100).',
  },
  {
    question: 'What is the cash flow accrual ratio?',
    answer:
      'Cash Flow Accrual Ratio = (Net Income − Operating Cash Flow) / Average NOA. It measures the accrual gap between earnings and operating cash flow relative to average operating capital.',
  },
  {
    question: 'Can an accrual ratio be negative?',
    answer:
      'Yes. Ending NOA below beginning NOA, or operating cash flow above net income, can produce a negative ratio when the denominator is nonzero.',
  },
  {
    question: 'Does a high accrual ratio always indicate poor earnings quality?',
    answer:
      'No. Higher measured accruals can warrant further review, but they are not automatic proof of manipulation or weak performance. Compare periods, peers, policies, and cash-flow trends.',
  },
  {
    question: 'What happens when average net operating assets are zero?',
    answer:
      'The ratio is undefined. This calculator does not divide by zero and marks the accrual ratio unavailable while still showing the NOA inputs.',
  },
  {
    question: 'What is the difference between net income and operating cash flow?',
    answer:
      'Net income is accrual-based accounting profit or loss. Operating cash flow measures cash generated or used by operations. Timing and noncash items create the difference.',
  },
  {
    question: 'Why should accrual ratios be compared over multiple periods?',
    answer:
      'Single-period ratios miss trends, one-time events, and reporting changes. Multi-period comparison improves context for earnings-quality analysis.',
  },
];
