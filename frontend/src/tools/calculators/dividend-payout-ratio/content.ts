import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DIVIDEND_PAYOUT_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-dividend-payout-ratio', label: 'What Is Dividend Payout Ratio?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'payout-ratio-formulas', label: 'Payout Ratio Formulas' },
  { id: 'above-100-and-negative', label: 'Above 100% and Negative Ratios' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'dividend-payout-ratio-faq', label: 'Frequently Asked Questions' },
];

export const DIVIDEND_PAYOUT_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'How is the dividend payout ratio calculated?',
    answer:
      'Company payout ratio (%) = Total Dividends ÷ Net Income × 100. Per-share payout (%) = Declared Dividends Per Share ÷ Diluted EPS × 100. Use the same period and consistent monetary units for each pair.',
  },
  {
    question: 'What happens when net income or diluted EPS is zero?',
    answer:
      'Division by zero is undefined. The calculator reports an error and does not show 0%. Fill a non-zero denominator for that ratio.',
  },
  {
    question: 'Can the payout ratio be above 100% or negative?',
    answer:
      'Yes. Above 100% means dividends exceed earnings for the period. A negative ratio can appear when dividends and earnings have opposite signs (for example negative net income). Those figures are mathematically valid but are not a conventional “sustainable” payout — treat them as diagnostic, not as a target.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Total dividends, net income, DPS, and diluted EPS each have independent currencies. Each pair is normalized into one currency before the ratio runs. Payout percentages are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
  {
    question: 'What is inside “Diluted earnings per share”?',
    answer:
      'The disclosure matches the reference layout. No extra diluted-EPS builder fields are unlocked here because sibling dividend tools do not define verified fields for that section.',
  },
];
