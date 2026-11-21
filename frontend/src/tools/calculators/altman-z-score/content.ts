import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ALTMAN_Z_SCORE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Altman Z-Score Calculator' },
  { id: 'what-is', label: 'What Is Altman Z-Score?' },
  { id: 'formula', label: 'Altman Z-Score Formula' },
  { id: 'how-to-calculate', label: 'How to Calculate' },
  { id: 'five-ratios', label: 'The Five Financial Ratios' },
  { id: 'interpret', label: 'How to Interpret' },
  { id: 'good-score', label: 'What Is a Good Score?' },
  { id: 'negative', label: 'Can Z-Score Be Negative?' },
  { id: 'example', label: 'Calculation Example' },
  { id: 'public-private', label: 'Public vs Private Companies' },
  { id: 'vs-ratios', label: 'Vs Other Financial Ratios' },
  { id: 'advantages', label: 'Advantages' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'how-to-use', label: 'How to Use in Analysis' },
  { id: 'related', label: 'Related Calculators' },
  { id: 'altman-z-score-faq', label: 'Frequently Asked Questions' },
];

export const ALTMAN_Z_SCORE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Altman Z-Score?',
    answer:
      'The Altman Z-Score is a weighted combination of five financial ratios designed as a financial distress screen, originally for publicly traded manufacturing firms. It is a model output, not a guaranteed bankruptcy probability.',
  },
  {
    question: 'How do you calculate the Altman Z-Score?',
    answer:
      'Compute X1–X5 from working capital, retained earnings, EBIT, market equity, total assets, total liabilities, and sales, then apply Z = 1.2X1 + 1.4X2 + 3.3X3 + 0.6X4 + 1.0X5.',
  },
  {
    question: 'What is the Altman Z-Score formula?',
    answer:
      'Z = 1.2(WC/TA) + 1.4(RE/TA) + 3.3(EBIT/TA) + 0.6(MVE/TL) + 1.0(Sales/TA), using market value of equity (not book equity) in the original model.',
  },
  {
    question: 'What is a good Altman Z-Score?',
    answer:
      'Under commonly cited original thresholds, scores above 2.99 are in the safer zone and scores below 1.81 in the distress zone, with 1.81–2.99 grey. “Good” is relative to the model’s sample and industry — not a universal grade.',
  },
  {
    question: 'What does an Altman Z-Score below 1.81 mean?',
    answer:
      'It falls in the distress zone of the original classification scheme, indicating elevated financial distress risk according to the model — not a certainty of bankruptcy.',
  },
  {
    question: 'What does the grey zone mean?',
    answer:
      'Scores from 1.81 through 2.99 are inconclusive under the original cutoffs. Additional analysis of cash flow, leverage, liquidity, and industry context is needed.',
  },
  {
    question: 'Can an Altman Z-Score be negative?',
    answer:
      'Yes. Negative working capital, retained earnings, or EBIT can pull the score below zero. Negative RE is allowed and can legitimately reduce Z.',
  },
  {
    question: 'What is EBIT?',
    answer:
      'Earnings before interest and taxes — a measure of operating earnings used in X3 (EBIT / Total assets). It may be negative.',
  },
  {
    question: 'How is working capital calculated?',
    answer:
      'Accounting NWC = Current assets − Current liabilities. A simplified AR + Inventory − AP estimate omits other current items. This calculator defaults to the full balance-sheet method.',
  },
  {
    question: 'How do you calculate market value of equity?',
    answer:
      'MVE = Shares outstanding × Share price (market capitalization). The original Altman Z-Score uses market equity, not book equity.',
  },
  {
    question: 'What is retained earnings?',
    answer:
      'Cumulative undistributed profits on the balance sheet. Ending RE = Beginning RE + Net income − Dividends. It may be negative.',
  },
  {
    question: 'What is the difference between the Altman Z-Score and Z′-Score?',
    answer:
      'Z′ (and related variants) use different coefficients and often book equity for private or other firm types. This tool implements only the original public-manufacturing Z-Score and does not silently substitute Z′ coefficients.',
  },
  {
    question: 'Can Altman Z-Score predict bankruptcy?',
    answer:
      'It is a screening model for relative distress risk, not a guaranteed prediction or calibrated probability of bankruptcy for every firm and period.',
  },
  {
    question: 'Does Altman Z-Score work for private companies?',
    answer:
      'The original coefficients assume market equity and were calibrated mainly on public manufacturers. Private firms typically need alternative formulations (e.g., Z′) rather than the original weights.',
  },
  {
    question: 'What industries can use the Altman Z-Score?',
    answer:
      'The original model is best matched to publicly traded manufacturing firms. Nonmanufacturing and emerging-market applications often use differently calibrated models.',
  },
  {
    question: 'What is the difference between market equity and book equity?',
    answer:
      'Market equity is capitalization from share price; book equity is accounting equity. Original Altman X4 uses market value of equity over total liabilities.',
  },
  {
    question: 'What are the five Altman Z-Score ratios?',
    answer:
      'X1 WC/TA, X2 RE/TA, X3 EBIT/TA, X4 MVE/TL, and X5 Sales/TA.',
  },
  {
    question: 'How often should a company calculate its Altman Z-Score?',
    answer:
      'Many users recompute after each reporting period or when capital structure changes materially. Frequency depends on monitoring needs — the model itself does not prescribe a schedule.',
  },
  {
    question: 'What happens when total liabilities equal zero?',
    answer:
      'X4 = MVE / TL is undefined. This calculator does not show Infinity or substitute a fake denominator; total liabilities must be greater than zero.',
  },
  {
    question: 'Why is the Altman Z-Score important to investors?',
    answer:
      'It condenses liquidity, cumulative profitability, operating return, market leverage, and asset turnover into one comparable screen that can flag firms for deeper credit and equity analysis.',
  },
];
