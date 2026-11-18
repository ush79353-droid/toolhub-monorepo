import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INTEREST_COVERAGE_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-interest-coverage-ratio', label: 'What Is Interest Coverage Ratio?' },
  { id: 'interest-coverage-ratio-formula', label: 'Interest Coverage Ratio Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'interest-coverage-ratio-faq', label: 'Frequently Asked Questions' },
];

export const INTEREST_COVERAGE_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What does the interest coverage ratio measure?',
    answer:
      'It shows how many times earnings before interest and taxes (EBIT) can cover interest expense. A higher ratio generally means more cushion to service debt interest; it is not a complete credit analysis.',
  },
  {
    question: 'Can EBIT be zero or negative?',
    answer:
      'Yes. Zero EBIT yields a coverage ratio of 0. Negative EBIT yields a negative ratio. Interest expense must still be greater than zero, and the calculator never shows NaN or Infinity.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. EBIT and interest expense each have an independent currency. Changing a field’s currency converts that amount using the stored exchange-rate snapshot. Both amounts are normalized into the EBIT currency before dividing, so a currency-only change does not alter the coverage ratio. If rates are unavailable, cross-currency switching is blocked.',
  },
];
