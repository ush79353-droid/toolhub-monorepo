import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FIXED_ASSET_TURNOVER_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'what-is-fat', label: 'What Is Fixed Asset Turnover?' },
    { id: 'formula', label: 'Fixed Asset Turnover Formula' },
    { id: 'average-assets', label: 'How to Calculate Average Fixed Assets' },
    { id: 'how-to-calculate', label: 'How to Calculate Fixed Asset Turnover' },
    { id: 'worked-example', label: 'Complete Fixed Asset Turnover Example' },
    { id: 'interpret', label: 'How to Interpret Fixed Asset Turnover' },
    { id: 'good-ratio', label: 'What Is a Good FAT Ratio?' },
    { id: 'vs-profitability', label: 'FAT and Profitability' },
    { id: 'vs-tat', label: 'FAT vs Total Asset Turnover' },
    { id: 'vs-inventory', label: 'FAT vs Inventory Turnover' },
    { id: 'depreciation', label: 'How Depreciation Affects FAT' },
    { id: 'capex', label: 'How Capital Expenditures Affect FAT' },
    { id: 'improve', label: 'How to Improve Fixed Asset Turnover' },
    { id: 'mistakes', label: 'Common FAT Calculation Mistakes' },
    { id: 'limitations', label: 'Limitations' },
    { id: 'fat-faq', label: 'Frequently Asked Questions' },
  ];

export const FIXED_ASSET_TURNOVER_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is fixed asset turnover?',
    answer:
      'Fixed asset turnover (FAT) measures how much revenue a company generates relative to its average net fixed asset base; typically net property, plant, and equipment.',
  },
  {
    question: 'What does FAT stand for?',
    answer: 'FAT stands for Fixed Asset Turnover (ratio).',
  },
  {
    question: 'How do I calculate fixed asset turnover?',
    answer:
      'Average the beginning and ending net fixed assets, then divide period revenue by that average. Do not divide when the average is zero.',
  },
  {
    question: 'What is the fixed asset turnover formula?',
    answer: 'FAT = Revenue / Average Fixed Assets.',
  },
  {
    question: 'How do I calculate average fixed assets?',
    answer:
      'Average Fixed Assets = (Starting Fixed Assets + Final Fixed Assets) / 2 for the same reporting period as revenue.',
  },
  {
    question: 'What is a good fixed asset turnover ratio?',
    answer:
      'It depends on industry capital intensity, asset age, capacity utilization, and investment cycles. Avoid universal thresholds.',
  },
  {
    question: 'Is a high fixed asset turnover ratio always good?',
    answer:
      'No. High FAT can reflect efficient use of assets or an old, heavily depreciated book base that may need future CapEx.',
  },
  {
    question: 'Can fixed asset turnover be negative?',
    answer:
      'Yes, if revenue is negative (for example after large returns). Conventional efficiency interpretation does not apply.',
  },
  {
    question: 'Can fixed asset turnover be zero?',
    answer:
      'Yes, when revenue is zero and average fixed assets are positive: the company generated no sales against its fixed asset base.',
  },
  {
    question: 'What happens when average fixed assets are zero?',
    answer:
      'FAT is undefined. Do not display Infinity; show that turnover is unavailable.',
  },
  {
    question: 'What does a fixed asset turnover of 2 mean?',
    answer:
      'About $2 of revenue for every $1 of average net fixed assets during the period.',
  },
  {
    question: 'What does a fixed asset turnover below 1 mean?',
    answer:
      'Revenue is less than the average net fixed asset base; common in capital-intensive industries or after major investment.',
  },
  {
    question:
      'Does high fixed asset turnover mean the company is profitable?',
    answer:
      'No. FAT measures asset efficiency relative to revenue, not profit margins or net income.',
  },
  {
    question: 'How does depreciation affect fixed asset turnover?',
    answer:
      'Depreciation lowers net book value, which can raise FAT without any increase in physical productivity.',
  },
  {
    question: 'How do capital expenditures affect FAT?',
    answer:
      'New CapEx raises average fixed assets and can temporarily lower FAT until additional revenue appears.',
  },
  {
    question:
      'What is the difference between fixed asset turnover and total asset turnover?',
    answer:
      'FAT uses average net fixed assets; total asset turnover uses average total assets (including current assets). Different denominators.',
  },
  {
    question:
      'What is the difference between fixed asset turnover and inventory turnover?',
    answer:
      'Inventory turnover typically uses COGS ÷ average inventory. FAT uses revenue ÷ average fixed assets.',
  },
  {
    question: 'Should I use gross or net fixed assets?',
    answer:
      'Use net fixed assets (after accumulated depreciation and impairments) consistently; do not mix gross and net.',
  },
  {
    question: 'How can a company improve fixed asset turnover?',
    answer:
      'Raise revenue from existing assets, improve utilization, maintain equipment, reduce idle assets, or manage CapEx timing carefully.',
  },
  {
    question:
      'Why do capital-intensive businesses have different turnover ratios?',
    answer:
      'Heavy plant and equipment raise the denominator, so FAT is often lower even when operations are healthy for that industry.',
  },
  {
    question: 'Can fixed asset turnover be used to compare companies?',
    answer:
      'Yes within the same industry and accounting policies; cross-industry comparisons are often misleading.',
  },
  {
    question:
      'Why should revenue and fixed assets come from the same reporting period?',
    answer:
      'Mismatched periods mix unrelated activity and balances, distorting the efficiency measure.',
  },
  {
    question:
      'What is the fixed asset turnover ratio if revenue is $2,000,000 and average net fixed assets are $500,000?',
    answer: 'FAT = 2,000,000 / 500,000 = 4.00×.',
  },
];
