import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DEBT_TO_CAPITAL_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-debt-to-capital-ratio', label: 'What Is Debt-to-Capital Ratio?' },
  { id: 'debt-to-capital-ratio-formula', label: 'Debt-to-Capital Ratio Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'debt-to-capital-ratio-faq', label: 'Frequently Asked Questions' },
];

export const DEBT_TO_CAPITAL_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What does the debt-to-capital ratio measure?',
    answer:
      'It shows how much of a company’s capital structure is funded by interest-bearing debt versus shareholder’s equity. A higher ratio means more leverage; it is a simple balance-sheet metric, not a full credit analysis.',
  },
  {
    question: 'What happens if debt plus equity is zero?',
    answer:
      'The calculator blocks that case to prevent divide-by-zero. It never shows NaN or Infinity.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Interest-bearing debt and shareholder’s equity each have an independent currency. Changing a field’s currency converts that amount using the stored exchange-rate snapshot. Both amounts are normalized into the debt currency before dividing, so a currency-only change does not alter the ratio. If rates are unavailable, cross-currency switching is blocked.',
  },
];
