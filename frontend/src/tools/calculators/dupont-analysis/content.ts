import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DUPONT_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Introduction' },
  { id: 'what-is', label: 'What Is DuPont Analysis?' },
  { id: 'how-works', label: 'How Does DuPont Analysis Work?' },
  { id: 'how-to-calculate', label: 'How to Calculate ROE Using DuPont' },
  { id: 'interpret', label: 'How to Interpret the Calculation' },
  { id: 'three-vs-five', label: 'Three-Step vs Five-Step DuPont' },
  { id: 'why-important', label: 'Why Is DuPont Analysis Important?' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'improve-roe', label: 'How Can Companies Improve ROE?' },
  { id: 'example', label: 'DuPont Analysis Example' },
  { id: 'compare', label: 'Comparing Companies with DuPont' },
  { id: 'da-faq', label: 'Frequently Asked Questions' },
];

export const DUPONT_FAQS: readonly FAQItem[] = [
  {
    question: 'What is ROE?',
    answer:
      'Return on equity measures net income relative to shareholders’ equity: ROE = Net Income ÷ Equity. DuPont analysis splits that result into margin, turnover, and leverage.',
  },
  {
    question: 'What is a good ROE?',
    answer:
      'Benchmarks vary by industry, leverage, company stage, and accounting practices. There is no single universal “good” ROE.',
  },
  {
    question: 'What is net profit margin?',
    answer: 'Net income divided by sales: the share of revenue kept as profit.',
  },
  {
    question: 'What is total asset turnover?',
    answer:
      'Sales divided by total assets; how many dollars of sales are generated per dollar of assets.',
  },
  {
    question: 'What is financial leverage?',
    answer:
      'Total assets divided by total equity (equity multiplier). Higher values mean more assets per dollar of equity, often via liabilities.',
  },
  {
    question: 'How do you calculate ROE using DuPont analysis?',
    answer:
      'ROE = (Net Income ÷ Sales) × (Sales ÷ Assets) × (Assets ÷ Equity).',
  },
  {
    question: 'Can ROE be negative?',
    answer:
      'Yes: from net losses and/or negative equity. The economic meaning differs, so inspect which driver is negative.',
  },
  {
    question: 'Is higher ROE always better?',
    answer:
      'No. Leverage can inflate ROE while raising risk, and accounting choices can distort book equity and earnings.',
  },
  {
    question: 'What is the difference between ROA and ROE?',
    answer:
      'ROA relates earnings to assets; ROE relates earnings to equity. Leverage links the two when equity is positive.',
  },
  {
    question: 'What is the difference between DuPont analysis and basic ROE?',
    answer:
      'Basic ROE is a single ratio. DuPont analysis explains whether ROE comes from profitability, asset use, or leverage.',
  },
  {
    question: 'Can DuPont analysis be used across industries?',
    answer:
      'Yes, but comparisons need industry context; capital intensity and typical leverage differ widely.',
  },
  {
    question: 'Why does financial leverage increase ROE?',
    answer:
      'With positive earnings and equity, financing more assets with less equity raises Assets/Equity and can raise ROE while increasing financial risk.',
  },
  {
    question: 'What happens if total equity is zero?',
    answer:
      'Financial leverage and ROE are undefined because division by zero is not allowed.',
  },
  {
    question: 'Can net profit margin be negative?',
    answer: 'Yes, when net income is negative and sales are positive.',
  },
  {
    question: 'What is the main limitation of DuPont analysis?',
    answer:
      'It relies on historical book figures, can be skewed by one-time items or capital structure, and ignores market value of equity.',
  },
];
