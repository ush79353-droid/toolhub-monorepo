import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ROA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is', label: 'What Is Return on Assets (ROA)?' },
  { id: 'formula', label: 'Return on Assets Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate Return on Assets' },
  { id: 'good-roa', label: 'What Is a Good Return on Assets?' },
  { id: 'interpret', label: 'How to Interpret ROA' },
  { id: 'roa-vs-roe', label: 'Return on Assets vs. Return on Equity' },
  { id: 'roa-vs-turnover', label: 'ROA vs. Asset Turnover' },
  { id: 'advantages', label: 'Advantages and Limitations of ROA' },
  { id: 'example', label: 'Practical Example' },
  { id: 'roa-faq', label: 'Frequently Asked Questions' },
];

export const ROA_FAQS: readonly FAQItem[] = [
  {
    question: 'What is ROA?',
    answer:
      'Return on assets (ROA) measures how much net income a company earns relative to its asset base, expressed as a percentage.',
  },
  {
    question: 'How do you calculate ROA?',
    answer:
      'ROA = (net income ÷ total assets) × 100. Some analysts use average total assets = (beginning + ending) ÷ 2 as the denominator.',
  },
  {
    question: 'What is a good ROA percentage?',
    answer:
      'There is no universal benchmark. Asset-light and asset-heavy industries differ widely. Compare peers, history, and margins rather than a single absolute cutoff.',
  },
  {
    question: 'Can ROA be negative?',
    answer:
      'Yes. Negative net income with positive assets produces a negative ROA, indicating a net loss relative to the asset base.',
  },
  {
    question: 'Is a higher ROA always better?',
    answer:
      'Not always. Context matters: industry norms, leverage, accounting policies, one-time items, and sustainability of earnings all affect whether a high ROA is meaningful.',
  },
  {
    question: 'What is the difference between ROA and ROE?',
    answer:
      'ROA divides net income by assets; ROE divides net income by shareholder equity. Leverage can lift ROE without improving asset profitability.',
  },
  {
    question: 'What is the difference between ROA and ROI?',
    answer:
      'ROA is a company-level ratio of earnings to assets. ROI usually refers to the return on a specific investment or project, with its own cost and payoff definitions.',
  },
  {
    question: 'Should ROA use average total assets?',
    answer:
      'Average assets can better match a period’s income with the assets used during that period, especially when the balance sheet changed materially. Ending assets alone may misrepresent mid-period levels.',
  },
  {
    question: 'Can ROA exceed 100%?',
    answer:
      'Yes, mathematically, when net income exceeds the selected asset amount. That outcome warrants checking accounting context, asset definitions, and whether the figures are comparable.',
  },
  {
    question: 'How can a company improve ROA?',
    answer:
      'By improving profitability, using assets more efficiently, reducing unproductive investments, or a mix of both, without relying on temporary accounting effects that inflate the ratio.',
  },
];
