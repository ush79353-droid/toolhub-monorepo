import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FINANCIAL_LEVERAGE_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] =
  [
    { id: 'what-is-fl', label: 'What Is the Financial Leverage Ratio?' },
    { id: 'formula', label: 'Financial Leverage Ratio Formula' },
    { id: 'total-assets', label: 'How to Calculate Total Assets' },
    { id: 'how-to-calculate', label: 'How to Calculate Financial Leverage' },
    { id: 'worked-example', label: 'Complete Financial Leverage Example' },
    { id: 'interpret', label: 'How to Interpret Financial Leverage' },
    { id: 'good-ratio', label: 'What Is a Good Financial Leverage Ratio?' },
    { id: 'vs-dte', label: 'Financial Leverage vs Debt-to-Equity' },
    { id: 'vs-equity-ratio', label: 'Financial Leverage vs Equity Ratio' },
    { id: 'vs-debt-ratio', label: 'Financial Leverage vs Debt Ratio' },
    { id: 'roe', label: 'Financial Leverage and ROE' },
    { id: 'advantages', label: 'Advantages of Financial Leverage' },
    { id: 'risks', label: 'Risks of High Financial Leverage' },
    { id: 'negative', label: 'Can Financial Leverage Be Negative?' },
    { id: 'mistakes', label: 'Common Calculation Mistakes' },
    { id: 'limitations', label: 'Limitations' },
    { id: 'flr-faq', label: 'Frequently Asked Questions' },
  ];

export const FINANCIAL_LEVERAGE_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is financial leverage?',
    answer:
      'Financial leverage describes using liabilities (including debt) to finance assets. In this calculator, the financial leverage ratio means the equity multiplier: Total Assets ÷ Total Equity.',
  },
  {
    question: 'What is the financial leverage ratio?',
    answer:
      'Here it is Total Assets divided by Total Equity; also called the equity multiplier. Other sources may use the same name for debt-to-equity or debt-to-assets measures.',
  },
  {
    question: 'What is the formula for financial leverage?',
    answer: 'Financial Leverage = Total Assets / Total Equity.',
  },
  {
    question: 'How do I calculate financial leverage?',
    answer:
      'Add current and non-current assets for total assets, identify total equity, then divide assets by equity. Do not divide by zero equity.',
  },
  {
    question: 'What is an equity multiplier?',
    answer:
      'The equity multiplier is Total Assets ÷ Total Equity: the same primary ratio this calculator computes.',
  },
  {
    question: 'Is financial leverage the same as debt-to-equity?',
    answer:
      'No. Debt-to-equity compares debt (or liabilities) to equity. The equity multiplier compares total assets to equity. Under Assets = Liabilities + Equity, Equity Multiplier = 1 + Liabilities/Equity.',
  },
  {
    question: 'What is a good financial leverage ratio?',
    answer:
      'It depends on industry, asset intensity, debt structure, earnings stability, and liquidity. Avoid universal benchmarks.',
  },
  {
    question: 'What does financial leverage of 2 mean?',
    answer:
      'About $2 of assets for every $1 of book equity; often consistent with substantial liability financing relative to equity.',
  },
  {
    question: 'What does financial leverage of 3 mean?',
    answer:
      'About $3 of assets per $1 of book equity. Higher multipliers amplify both potential ROE and financial risk.',
  },
  {
    question: 'Can financial leverage be negative?',
    answer:
      'Yes, when total equity is negative and assets are positive. Conventional positive-ratio interpretations do not apply.',
  },
  {
    question: 'Can financial leverage be zero?',
    answer:
      'With positive equity, zero leverage would require zero assets. That combination is usually inconsistent with a normal balance sheet.',
  },
  {
    question: 'What happens when total equity is zero?',
    answer:
      'The ratio is undefined. Do not display Infinity; show that leverage is unavailable.',
  },
  {
    question: 'Can financial leverage be less than 1?',
    answer:
      'With positive equity and nonnegative liabilities, a multiplier below 1 is generally inconsistent with the accounting equation and should be reviewed.',
  },
  {
    question: 'How do current and non-current assets affect leverage?',
    answer:
      'They sum to total assets, the numerator of the equity multiplier.',
  },
  {
    question: 'What is total equity?',
    answer:
      'The residual interest in assets after liabilities; share capital, retained earnings, and other equity components.',
  },
  {
    question: 'How do I calculate total equity?',
    answer: 'Total Equity = Total Assets − Total Liabilities.',
  },
  {
    question: 'Why is a high financial leverage ratio risky?',
    answer:
      'A small equity base relative to assets often means more liability obligations, refinancing risk, and less financial flexibility.',
  },
  {
    question: 'How does financial leverage affect ROE?',
    answer:
      'In DuPont analysis, ROE ≈ Profit Margin × Asset Turnover × Equity Multiplier. A higher multiplier can raise ROE but also raises risk.',
  },
  {
    question: 'What is the difference between financial leverage and equity ratio?',
    answer:
      'Equity Ratio = Equity / Assets. For positive nonzero figures, Equity Multiplier = 1 / Equity Ratio (when the equity ratio is a decimal).',
  },
  {
    question: 'How does financial leverage relate to liabilities?',
    answer:
      'Equity Multiplier = 1 + Liabilities/Equity when Assets = Liabilities + Equity and equity ≠ 0.',
  },
  {
    question: 'What is the difference between current and non-current assets?',
    answer:
      'Current assets are short-term operating assets; non-current assets provide longer-term benefits (PP&E, intangibles, long-term investments).',
  },
  {
    question: 'Does high leverage always indicate poor financial performance?',
    answer:
      'No. Capital-intensive industries often carry higher multipliers. Evaluate with coverage, liquidity, and profitability; not the ratio alone.',
  },
  {
    question:
      'What is the financial leverage ratio if total assets are $1,000,000 and total equity is $400,000?',
    answer: 'Financial leverage = 1,000,000 / 400,000 = 2.50×.',
  },
];
