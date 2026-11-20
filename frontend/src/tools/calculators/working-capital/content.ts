import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WORKING_CAPITAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-wc', label: 'What Is Working Capital?' },
  { id: 'current-assets', label: 'What Are Current Assets?' },
  { id: 'current-liabilities', label: 'What Are Current Liabilities?' },
  { id: 'wc-formula', label: 'Working Capital Formula' },
  { id: 'wc-ratio', label: 'Working Capital Ratio' },
  { id: 'how-to-calculate', label: 'How to Calculate' },
  { id: 'positive-vs-negative', label: 'Positive vs Negative WC' },
  { id: 'good-ratio', label: 'What Is a Good Ratio?' },
  { id: 'net-wc', label: 'Net Working Capital' },
  { id: 'turnover', label: 'Working Capital Turnover' },
  { id: 'turnover-example', label: 'Turnover Example' },
  { id: 'change-in-wc', label: 'Changes in Working Capital' },
  { id: 'cash-flow', label: 'Working Capital and Cash Flow' },
  { id: 'improve', label: 'How to Improve Working Capital' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'wc-faq', label: 'Frequently Asked Questions' },
];

export const WORKING_CAPITAL_FAQS: readonly FAQItem[] = [
  {
    question: 'What is working capital?',
    answer:
      'Working capital is current assets minus current liabilities. It measures short-term liquidity available for day-to-day operations.',
  },
  {
    question: 'How do I calculate working capital?',
    answer:
      'Subtract current liabilities from current assets. Example: 500,000 − 350,000 = 150,000.',
  },
  {
    question: 'What is the working capital formula?',
    answer: 'Working Capital = Current Assets − Current Liabilities.',
  },
  {
    question: 'What is the working capital ratio?',
    answer:
      'In this calculator it is the current ratio: Current Assets ÷ Current Liabilities.',
  },
  {
    question: 'Is the working capital ratio the same as the current ratio?',
    answer:
      'Yes — many texts use the names interchangeably for CA ÷ CL. Working capital itself remains the absolute monetary difference.',
  },
  {
    question: 'What is a good working capital ratio?',
    answer:
      'There is no universal target. Suitability depends on industry, operating cycle, and asset quality. Compare peers and trends.',
  },
  {
    question: 'What does negative working capital mean?',
    answer:
      'Current liabilities exceed current assets. That can signal liquidity pressure — or a deliberate model with fast turnover and supplier credit. Context matters.',
  },
  {
    question: 'Can working capital be zero?',
    answer: 'Yes, when current assets equal current liabilities.',
  },
  {
    question: 'Can working capital be negative?',
    answer:
      'Yes. This calculator preserves signed negative working capital rather than treating it as invalid.',
  },
  {
    question: 'What happens when current liabilities equal zero?',
    answer:
      'The working capital amount can still be computed, but the ratio is undefined. The calculator shows unavailable — never Infinity.',
  },
  {
    question: 'What is net working capital?',
    answer:
      'Often synonymous with working capital (CA − CL). Some contexts refine the definition (for example excluding cash or debt). Check the definition used in your analysis.',
  },
  {
    question: 'What is working capital turnover?',
    answer:
      'Revenue divided by average working capital. It measures how much sales the firm generates per unit of average WC.',
  },
  {
    question: 'How do I calculate average working capital?',
    answer:
      'Average the beginning and ending working capital balances for the period: (Beginning WC + Ending WC) ÷ 2.',
  },
  {
    question: 'What happens if average working capital equals zero?',
    answer:
      'Turnover is undefined. Do not divide by zero — this tool shows unavailable.',
  },
  {
    question: 'Can working capital turnover be negative?',
    answer:
      'If average WC is negative, the mathematical ratio can be negative. Interpret with caution; efficiency comparisons may not apply.',
  },
  {
    question: 'How do I calculate changes in working capital?',
    answer:
      'Change = Ending WC − Beginning WC. A rise is not automatically good for free cash flow, and a decline is not automatically bad for operations.',
  },
  {
    question: 'How does working capital affect cash flow?',
    answer:
      'Increases in inventory or receivables often consume cash; increases in payables can free cash. WC balances and cash movements are related but not identical.',
  },
  {
    question: 'How can a business improve working capital?',
    answer:
      'Collect receivables faster, manage inventory, negotiate supplier terms carefully, and avoid unnecessary short-term borrowing relative to liquid assets.',
  },
  {
    question: 'Is positive working capital always good?',
    answer:
      'No. Excess WC can mean idle cash, slow inventory, or inefficient collections. Balance liquidity with efficiency.',
  },
  {
    question: 'Is negative working capital always bad?',
    answer:
      'No. Some high-turnover businesses operate with negative WC. Stress-test cash timing and covenant risk before judging.',
  },
  {
    question: 'What financial statements provide working capital figures?',
    answer:
      'The balance sheet provides current assets and current liabilities. Revenue for turnover comes from the income statement for the matching period.',
  },
  {
    question:
      'What is the current ratio if current assets are $240,000 and current liabilities are $120,000?',
    answer: '240,000 ÷ 120,000 = 2.00.',
  },
  {
    question:
      'What is working capital turnover if revenue is $1,500,000 and average WC is $175,000?',
    answer: '1,500,000 ÷ 175,000 ≈ 8.57x.',
  },
];
