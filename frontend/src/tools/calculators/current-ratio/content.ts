import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-cr', label: 'What Is a Current Ratio?' },
  { id: 'cr-formula', label: 'The Current Ratio Formula' },
  { id: 'how-to-use', label: 'How to Calculate a Current Ratio' },
  { id: 'examples', label: 'Example of Current Ratio Calculation' },
  { id: 'good-ratio', label: 'What Is a Good Current Ratio?' },
  { id: 'below-one', label: 'Current Ratio Below One' },
  { id: 'above-two', label: 'Current Ratio Above Two' },
  { id: 'vs-quick', label: 'Current Ratio vs Quick Ratio' },
  { id: 'vs-cash', label: 'Current Ratio vs Cash Ratio' },
  { id: 'working-capital', label: 'Current Ratio and Working Capital' },
  { id: 'improve', label: 'How Can a Business Improve Its Current Ratio?' },
  { id: 'mistakes', label: 'Common Mistakes When Calculating Current Ratio' },
  { id: 'limitations', label: 'Limitations of the Current Ratio' },
  { id: 'cr-faq', label: 'Frequently Asked Questions' },
];

export const CR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the current ratio?',
    answer:
      'The current ratio (working capital ratio) equals current assets divided by current liabilities. It is a short-term liquidity coverage measure from the balance sheet.',
  },
  {
    question: 'How do I calculate current ratio?',
    answer: 'CR = CA / CL, where CA is current assets and CL is positive current liabilities.',
  },
  {
    question: 'What does a current ratio of 2 mean?',
    answer:
      'Current assets are twice current liabilities — about two units of current assets per unit of current liabilities.',
  },
  {
    question: 'What does a current ratio below 1 mean?',
    answer:
      'Reported current liabilities exceed current assets. That may warrant closer liquidity review, but it does not automatically mean the company cannot meet obligations.',
  },
  {
    question: 'Is a current ratio of 1.5 good?',
    answer:
      'It depends on industry, operating cycle, asset liquidity, financing access, and cash-flow stability. There is no universal ideal ratio.',
  },
  {
    question: 'Can the current ratio be zero?',
    answer:
      'Yes, when current assets are zero and current liabilities are positive.',
  },
  {
    question: 'Can the current ratio be negative?',
    answer:
      'Not under the standard nonnegative balance-sheet input model used here. Negative inputs are rejected.',
  },
  {
    question: 'What happens if current liabilities are zero?',
    answer:
      'The current ratio is undefined (division by zero). This calculator does not display Infinity.',
  },
  {
    question: 'What is the difference between current ratio and quick ratio?',
    answer:
      'The current ratio includes all current assets. The quick ratio typically uses a narrower, more liquid numerator (often cash, marketable securities, and receivables, or current assets less inventory/prepaids).',
  },
  {
    question: 'What is the difference between current ratio and working capital?',
    answer:
      'Current ratio is dimensionless (CA / CL). Working capital is a currency amount: CA − CL.',
  },
  {
    question:
      'What is the current ratio if current assets are $300,000 and current liabilities are $150,000?',
    answer: 'CR = 300,000 / 150,000 = 2.00.',
  },
  {
    question: 'How do I calculate current assets from the current ratio?',
    answer: 'CA = CR × CL when liabilities are known.',
  },
  {
    question: 'How do I calculate current liabilities from the current ratio?',
    answer:
      'CL = CA / CR when the ratio is positive. If both assets and the ratio are zero, liabilities are not uniquely determined.',
  },
  {
    question: 'Does a high current ratio always mean a healthy business?',
    answer:
      'No. Coverage can look strong while inventory is slow, receivables are weak, or cash flow is strained. Use additional analysis.',
  },
  {
    question: 'What are examples of current assets and current liabilities?',
    answer:
      'Current assets often include cash, receivables, inventory, short-term investments, and prepaid expenses. Current liabilities often include payables, short-term debt, accruals, current LTD portion, and taxes payable.',
  },
];
