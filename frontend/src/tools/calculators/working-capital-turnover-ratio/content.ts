import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const WORKING_CAPITAL_TURNOVER_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'what-is-wctr', label: 'What Is Working Capital Turnover?' },
    { id: 'meaning', label: 'What the Ratio Means' },
    { id: 'what-is-wc', label: 'What Is Working Capital?' },
    { id: 'current-assets', label: 'What Are Current Assets?' },
    { id: 'current-liabilities', label: 'What Are Current Liabilities?' },
    { id: 'formula', label: 'Working Capital Turnover Formula' },
    { id: 'avg-ca', label: 'Average Current Assets' },
    { id: 'avg-cl', label: 'Average Current Liabilities' },
    { id: 'avg-wc', label: 'Average Working Capital' },
    { id: 'how-to-calculate-turnover', label: 'How to Calculate Turnover' },
    { id: 'worked-example', label: 'Complete Example' },
    { id: 'interpret', label: 'How to Interpret' },
    { id: 'good-ratio', label: 'What Is a Good Ratio?' },
    { id: 'high-low', label: 'High vs Low Turnover' },
    { id: 'negative', label: 'Negative Turnover' },
    { id: 'vs-wc-ratio', label: 'vs Working Capital Ratio' },
    { id: 'vs-inventory', label: 'vs Inventory Turnover' },
    { id: 'vs-asset', label: 'vs Asset Turnover' },
    { id: 'cash-flow', label: 'Cash Flow Link' },
    { id: 'improve', label: 'How to Improve' },
    { id: 'mistakes', label: 'Common Mistakes' },
    { id: 'limitations', label: 'Limitations' },
    { id: 'wctr-faq', label: 'Frequently Asked Questions' },
  ];

export const WORKING_CAPITAL_TURNOVER_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is working capital turnover?',
    answer:
      'Working capital turnover measures how much revenue a business generates relative to its average working capital over a reporting period.',
  },
  {
    question: 'What does the working capital turnover ratio measure?',
    answer:
      'It measures working capital efficiency (sales generated per unit of average WC) not profitability or short-term liquidity by itself.',
  },
  {
    question: 'What is the working capital turnover formula?',
    answer:
      'WCT = Revenue ÷ Average Working Capital, where Average WC = Average Current Assets − Average Current Liabilities.',
  },
  {
    question: 'How do I calculate average current assets?',
    answer:
      'Average opening and closing current assets: (Opening CA + Closing CA) ÷ 2.',
  },
  {
    question: 'How do I calculate average current liabilities?',
    answer:
      'Average opening and closing current liabilities: (Opening CL + Closing CL) ÷ 2.',
  },
  {
    question: 'How do I calculate average working capital?',
    answer:
      'Subtract average current liabilities from average current assets. Example: 600,000 − 250,000 = 350,000.',
  },
  {
    question: 'What is a good working capital turnover ratio?',
    answer:
      'There is no universal target. Compare peers in the same industry and review multi-period trends.',
  },
  {
    question: 'Is a higher working capital turnover ratio always better?',
    answer:
      'Not always. Very high turnover can reflect aggressive payable terms or thin WC that raises liquidity risk. Pair with cash flow and current ratio analysis.',
  },
  {
    question: 'What does a low turnover ratio mean?',
    answer:
      'It can indicate excess investment in working capital relative to sales (for example slow inventory or receivables) or a capital-heavy operating model.',
  },
  {
    question: 'Can working capital turnover be negative?',
    answer:
      'Yes, when average working capital is negative and revenue is positive. The math is valid, but conventional efficiency interpretation may be misleading.',
  },
  {
    question: 'What happens when average working capital is zero?',
    answer:
      'Turnover is undefined. This calculator shows unavailable; never Infinity.',
  },
  {
    question: 'Can working capital turnover equal zero?',
    answer:
      'Yes: when revenue is zero and average WC is nonzero, turnover = 0.00x.',
  },
  {
    question:
      'What is the difference between working capital ratio and working capital turnover?',
    answer:
      'Working capital ratio (current ratio) is CA ÷ CL at a point in time. Turnover is Revenue ÷ average WC over a period; efficiency, not liquidity coverage.',
  },
  {
    question: 'Why is average working capital used instead of ending working capital?',
    answer:
      'Revenue spans a period while balance-sheet WC is a snapshot. Averaging opening and closing balances better matches the sales period.',
  },
  {
    question: 'Should revenue and working capital use the same reporting period?',
    answer:
      'Yes. Mixing annual revenue with monthly balances (or mismatched fiscal periods) produces misleading ratios.',
  },
  {
    question:
      'What is the working capital turnover ratio if revenue is $2,000,000 and average working capital is $400,000?',
    answer: '2,000,000 ÷ 400,000 = 5.00x.',
  },
  {
    question: 'How can businesses improve working capital turnover?',
    answer:
      'Collect receivables faster, right-size inventory, negotiate supplier terms carefully, and grow sales without proportionally expanding WC.',
  },
  {
    question: 'What are common working capital turnover calculation mistakes?',
    answer:
      'Using ending WC only, treating empty inputs as zero, mixing periods, using net income instead of revenue, and dividing by zero average WC.',
  },
];
