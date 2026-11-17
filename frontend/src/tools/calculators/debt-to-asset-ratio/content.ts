import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DEBT_TO_ASSET_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-debt-to-asset-ratio', label: 'What Is Debt to Asset Ratio?' },
  { id: 'debt-to-asset-ratio-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'debt-to-asset-ratio-faq', label: 'Frequently Asked Questions' },
];

export const DEBT_TO_ASSET_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the debt to assets ratio calculated?',
    answer:
      'Total Debt = Long-term Debt + Short-term Debt. Debt to Assets Ratio (%) = (Total Debt / Total Assets) × 100. Debts are normalized into the total-assets currency before the ratio. Total assets must be greater than zero. Zero debt yields 0%. Ratios above 100% are shown when valid.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Long-term debt, short-term debt, total debt, and total assets each have an independent currency. Changing an input currency converts that amount using stored MongoDB rates. Total-debt currency only re-expresses the calculated sum. Currency-only changes do not alter the debt-to-assets ratio. The ratio percentage is never FX-converted.',
  },
  {
    question: 'What if total assets are zero?',
    answer:
      'The ratio divides by total assets, so zero or negative assets are rejected. Enter a positive total assets amount.',
  },
];
