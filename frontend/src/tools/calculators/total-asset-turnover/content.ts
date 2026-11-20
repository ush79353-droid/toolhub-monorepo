import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TOTAL_ASSET_TURNOVER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-tat', label: 'What Is Total Asset Turnover?' },
  { id: 'tat-meaning', label: 'What the Ratio Means' },
  { id: 'formula', label: 'Total Asset Turnover Formula' },
  { id: 'average-assets', label: 'Average Total Assets Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate' },
  { id: 'worked-example', label: 'Complete Example' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'what-counts-assets', label: 'What Counts as Total Assets?' },
  { id: 'what-is-revenue', label: 'What Is Revenue?' },
  { id: 'why-average', label: 'Why Average Assets?' },
  { id: 'interpret', label: 'How to Interpret' },
  { id: 'good-ratio', label: 'What Is a Good Ratio?' },
  { id: 'vs-fixed', label: 'vs Fixed Asset Turnover' },
  { id: 'vs-inventory', label: 'vs Inventory Turnover' },
  { id: 'vs-profitability', label: 'vs Profitability & ROA' },
  { id: 'dupont', label: 'DuPont Analysis' },
  { id: 'improve', label: 'How to Improve Turnover' },
  { id: 'industry', label: 'Industry Context' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'mistakes', label: 'Common Mistakes' },
  { id: 'tat-faq', label: 'Frequently Asked Questions' },
];

export const TOTAL_ASSET_TURNOVER_FAQS: readonly FAQItem[] = [
  {
    question: 'What is total asset turnover?',
    answer:
      'Total asset turnover (TAT) measures how much revenue a company generates relative to its average total assets during a reporting period.',
  },
  {
    question: 'What does total asset turnover measure?',
    answer:
      'It measures asset utilization — revenue per unit of average assets — not profitability, margins, or cash flow.',
  },
  {
    question: 'How do I calculate total asset turnover?',
    answer:
      'Average beginning and ending total assets, then divide period revenue by that average. Do not divide when the average is zero.',
  },
  {
    question: 'What is the formula for total asset turnover?',
    answer:
      'TAT = Revenue ÷ Average Total Assets, where Average Total Assets = (Beginning Assets + Ending Assets) ÷ 2.',
  },
  {
    question: 'How do I calculate average assets?',
    answer:
      'Add beginning and ending total assets and divide by two. Example: (300,000 + 500,000) ÷ 2 = 400,000.',
  },
  {
    question: 'What is a good total asset turnover ratio?',
    answer:
      'There is no universal “good” level. Asset-light retailers often show higher ratios than capital-intensive manufacturers or real estate businesses. Compare peers and trends.',
  },
  {
    question: 'Is a higher asset turnover ratio always better?',
    answer:
      'Not always. Very high turnover can reflect thin margins, a depreciated asset base, or aggressive asset sales. Pair TAT with profitability metrics.',
  },
  {
    question: 'Can total asset turnover be negative?',
    answer:
      'With non-negative revenue and assets as used here, the ratio is zero or positive. Negative revenue is rejected in this standard calculator.',
  },
  {
    question: 'Can asset turnover equal zero?',
    answer:
      'Yes — when revenue is zero and average assets are positive, TAT = 0.00x.',
  },
  {
    question: 'What does an asset turnover of 1 mean?',
    answer:
      'About 1.00 of revenue was generated for every 1.00 of average total assets during the period.',
  },
  {
    question: 'What does an asset turnover of 2 mean?',
    answer:
      'About 2.00 of revenue per 1.00 of average assets. Example: revenue 1,000,000 ÷ average assets 500,000 = 2.00x.',
  },
  {
    question: 'What does an asset turnover below 1 mean?',
    answer:
      'Revenue was less than average assets — common in asset-heavy industries or after large investments before sales catch up.',
  },
  {
    question: 'What is the difference between total asset turnover and fixed asset turnover?',
    answer:
      'Total asset turnover uses average total assets. Fixed asset turnover uses average net fixed assets (typically PP&E). Fixed asset turnover focuses on long-lived productive assets.',
  },
  {
    question: 'What is the difference between asset turnover and inventory turnover?',
    answer:
      'Inventory turnover usually compares cost of goods sold to average inventory. Asset turnover compares revenue to average total assets.',
  },
  {
    question: 'Does asset turnover measure profitability?',
    answer:
      'No. A firm can have high turnover and low (or negative) profit margins. ROA links margin and turnover: ROA ≈ Net Profit Margin × Asset Turnover when definitions align.',
  },
  {
    question: 'How can a company improve asset turnover?',
    answer:
      'Increase sales, manage inventory, dispose of idle assets, improve capacity utilization, and avoid unnecessary capital investment relative to demand.',
  },
  {
    question: 'Why is average total assets used?',
    answer:
      'Revenue spans a period while the balance sheet is a point-in-time snapshot. Averaging beginning and ending balances better matches the period of sales.',
  },
  {
    question: 'Can beginning assets be zero?',
    answer:
      'Yes, if the business starts with no recognized assets. As long as average assets are greater than zero, turnover can be computed.',
  },
  {
    question: 'What happens when average assets equal zero?',
    answer:
      'Turnover is undefined. This calculator shows unavailable — never Infinity.',
  },
  {
    question: 'How does depreciation affect asset turnover?',
    answer:
      'Depreciation lowers carrying values of depreciable assets, which can raise turnover without any change in sales. Interpret older asset bases carefully.',
  },
  {
    question: 'Does asset turnover vary by industry?',
    answer:
      'Yes. Retail and grocery often show higher turnover; manufacturing, utilities, and real estate often show lower ratios.',
  },
  {
    question: 'What is the relationship between asset turnover and ROA?',
    answer:
      'In a simplified DuPont identity, ROA = Net Profit Margin × Asset Turnover when net income, revenue, and assets use consistent definitions and periods.',
  },
  {
    question: 'How does asset turnover relate to DuPont analysis?',
    answer:
      'Expanded DuPont decomposes ROE into margin, asset turnover, and financial leverage. Turnover captures how efficiently assets generate sales.',
  },
  {
    question: 'Should I use gross revenue or net sales?',
    answer:
      'Prefer net sales (or the revenue line used in peer analysis) consistently. Do not mix cash sales definitions across years without noting the change.',
  },
  {
    question: 'What are the limitations of asset turnover?',
    answer:
      'Industry differences, accounting policies, leasing, inflation, seasonality, acquisitions, and asset-light models all limit cross-company comparisons.',
  },
  {
    question: 'Can asset turnover increase when assets decline?',
    answer:
      'Yes — selling assets can raise the ratio even if sales are flat. That is not automatically an operational improvement.',
  },
  {
    question: 'What does an asset turnover of 0.5 mean?',
    answer:
      'About 0.50 of revenue per 1.00 of average assets during the period.',
  },
  {
    question:
      'What is the total asset turnover when revenue is $800,000, beginning assets are $400,000, and ending assets are $600,000?',
    answer:
      'Average assets = (400,000 + 600,000) ÷ 2 = 500,000. TAT = 800,000 ÷ 500,000 = 1.60x.',
  },
  {
    question: 'Why can two companies with similar revenue have different turnover ratios?',
    answer:
      'Different average asset bases — capital intensity, leasing vs owning, depreciation age, and growth investments — change the denominator.',
  },
];
