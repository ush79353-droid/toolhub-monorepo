import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FCFE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-fcfe', label: 'What Is FCFE?' },
  { id: 'fcfe-formula', label: 'FCFE Formula' },
  { id: 'from-net-income', label: 'FCFE From Net Income' },
  { id: 'from-ebit', label: 'FCFE From EBIT' },
  { id: 'from-ebitda', label: 'FCFE From EBITDA' },
  { id: 'from-cfo', label: 'FCFE From CFO' },
  { id: 'from-fcff', label: 'FCFE From FCFF' },
  { id: 'net-borrowing', label: 'How to Calculate Net Borrowing' },
  { id: 'worked-example', label: 'Complete FCFE Calculation Example' },
  { id: 'what-it-tells', label: 'What Does FCFE Tell Investors?' },
  { id: 'vs-fcff', label: 'FCFE vs FCFF' },
  { id: 'vs-dividends', label: 'FCFE vs Dividends' },
  { id: 'vs-net-income', label: 'FCFE vs Net Income' },
  { id: 'vs-cfo', label: 'FCFE vs Operating Cash Flow' },
  { id: 'valuation', label: 'Why Is FCFE Important in Valuation?' },
  { id: 'good-fcfe', label: 'What Is a Good FCFE?' },
  { id: 'negative-fcfe', label: 'Can FCFE Be Negative?' },
  { id: 'improve', label: 'How Can a Company Improve FCFE?' },
  { id: 'mistakes', label: 'Common FCFE Calculation Mistakes' },
  { id: 'limitations', label: 'Limitations of FCFE' },
  { id: 'fcfe-faq', label: 'Frequently Asked Questions' },
];

export const FCFE_FAQS: readonly FAQItem[] = [
  {
    question: 'What does FCFE stand for?',
    answer: 'FCFE stands for Free Cash Flow to Equity.',
  },
  {
    question: 'What is Free Cash Flow to Equity?',
    answer:
      'FCFE estimates residual cash flow potentially available to common equity holders after operating cash generation, reinvestment, and net borrowing.',
  },
  {
    question: 'How do I calculate FCFE?',
    answer:
      'A common starting point is FCFE = Net income + D&A − CapEx − ΔNWC + Net borrowing. Other starting points include EBIT, EBITDA, CFO, and FCFF with consistent interest and tax adjustments.',
  },
  {
    question: 'What is the FCFE formula?',
    answer:
      'From net income: FCFE = NI + D&A − CapEx − ΔNWC + NB. From FCFF: FCFE = FCFF − Interest(1 − t) + NB.',
  },
  {
    question: 'What is the difference between FCFE and FCFF?',
    answer:
      'FCFF is cash flow to all capital providers (unlevered). FCFE is residual cash flow to equity after after-tax interest and net borrowing effects.',
  },
  {
    question: 'Can FCFE be negative?',
    answer:
      'Yes. High CapEx, working-capital buildup, debt repayment, or weak operations can produce negative FCFE without implying bankruptcy by itself.',
  },
  {
    question: 'Is high FCFE always good?',
    answer:
      'Not automatically. Absolute FCFE depends on size, growth, reinvestment needs, and financing. Compare with history, peers, and strategy.',
  },
  {
    question: 'Is FCFE the same as dividends?',
    answer:
      'No. FCFE estimates residual equity cash generation; dividends depend on board policy, liquidity, covenants, and strategy.',
  },
  {
    question: 'Is FCFE the same as net income?',
    answer:
      'No. Net income is accrual earnings. FCFE adds back D&A and adjusts for CapEx, working capital, and net borrowing.',
  },
  {
    question: 'How do I calculate net borrowing?',
    answer:
      'Ideally Debt issued − Debt repaid. A simplified estimate is Ending debt − Beginning debt, which may differ due to FX, acquisitions, or noncash items.',
  },
  {
    question: 'How does debt affect FCFE?',
    answer:
      'Positive net borrowing increases FCFE; debt repayment decreases FCFE. Borrowing can raise FCFE without improving operations.',
  },
  {
    question: 'How do capital expenditures affect FCFE?',
    answer: 'Positive CapEx reduces FCFE in NI/EBIT/EBITDA/CFO modes.',
  },
  {
    question: 'How does working capital investment affect FCFE?',
    answer:
      'Positive ΔNWC reduces FCFE; negative ΔNWC (cash release) increases FCFE.',
  },
  {
    question: 'How do I calculate FCFE from EBIT?',
    answer:
      'Estimate NI = (EBIT − Interest) × (1 − t) for positive pretax earnings, then FCFE = NI + D&A − CapEx − ΔNWC + NB.',
  },
  {
    question: 'How do I calculate FCFE from EBITDA?',
    answer:
      'EBIT = EBITDA − D&A, then follow the EBIT path with interest and tax.',
  },
  {
    question: 'How do I calculate FCFE from CFO?',
    answer:
      'Under an after-interest CFO convention: FCFE = CFO − CapEx + Net borrowing.',
  },
  {
    question: 'How do I calculate FCFE from FCFF?',
    answer: 'FCFE = FCFF − Interest(1 − t) + Net borrowing.',
  },
  {
    question: 'Why is depreciation added back?',
    answer:
      'D&A is a noncash expense already deducted from NI or EBIT; adding it back restores cash earnings before CapEx.',
  },
  {
    question: 'Why is FCFE useful for company valuation?',
    answer:
      'Expected FCFE can be discounted at the cost of equity in an equity DCF. Do not mix FCFE with WACC without a consistent model.',
  },
  {
    question: 'What discount rate should be used for FCFE?',
    answer:
      'A cost of equity appropriate to the equity cash-flow risk — not WACC used for FCFF enterprise valuation.',
  },
  {
    question: 'How is FCFE different from operating cash flow?',
    answer:
      'CFO reflects operating activities. FCFE also subtracts CapEx and adds net borrowing under the after-interest CFO convention.',
  },
  {
    question: 'Does positive FCFE guarantee dividends?',
    answer: 'No. Boards may retain cash, repurchase shares, or face payout constraints.',
  },
  {
    question: 'Why can a growing business have negative FCFE?',
    answer:
      'Growth often requires CapEx and working capital ahead of cash generation, producing temporary negative FCFE.',
  },
  {
    question: 'Can FCFE be used for companies with high debt?',
    answer:
      'Yes, but net borrowing can dominate the figure. Interpret carefully alongside leverage and interest coverage.',
  },
  {
    question: 'Does FCFE include interest payments?',
    answer:
      'Interest is already reflected in NI-based paths and in after-interest CFO. From FCFF, after-tax interest is subtracted explicitly.',
  },
  {
    question:
      'What is FCFE if net income is $300,000, depreciation is $40,000, capital expenditures are $80,000, working capital investment is $20,000, and net borrowing is $30,000?',
    answer: 'FCFE = 300,000 + 40,000 − 80,000 − 20,000 + 30,000 = $270,000.',
  },
];
