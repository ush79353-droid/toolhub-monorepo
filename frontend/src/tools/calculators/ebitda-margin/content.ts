import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EBITDA_MARGIN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ebitda-margin', label: 'What Is EBITDA Margin?' },
  { id: 'ebitda-margin-formula', label: 'EBITDA Margin Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ebitda-margin-faq', label: 'Frequently Asked Questions' },
];

export const EBITDA_MARGIN_FAQS: readonly FAQItem[] = [
  {
    question: 'What does EBITDA margin measure?',
    answer:
      'It shows EBITDA as a percentage of total revenues for the same period. A higher margin generally means more operating cash-flow cushion before interest, taxes, depreciation, and amortization. It is a screening ratio, not a full credit or valuation analysis.',
  },
  {
    question: 'Can EBITDA be negative?',
    answer:
      'Yes. Negative EBITDA yields a negative margin. Total revenues must be nonzero. The calculator never shows NaN or Infinity.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Total revenues and EBITDA each have an independent currency. Changing a field’s currency converts that amount using the stored exchange-rate snapshot. EBITDA is normalized into the total-revenues currency before dividing, so a currency-only change does not alter the margin. The percentage itself is never currency-converted. If rates are unavailable, cross-currency switching is blocked.',
  },
];
