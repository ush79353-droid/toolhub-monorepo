import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const OPTIMAL_HEDGE_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-optimal-hedge-ratio', label: 'What Is the Optimal Hedge Ratio?' },
  { id: 'optimal-hedge-ratio-formula', label: 'Optimal Hedge Ratio Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'optimal-hedge-ratio-faq', label: 'Frequently Asked Questions' },
];

export const OPTIMAL_HEDGE_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What does the optimal hedge ratio mean?',
    answer:
      'It is the minimum-variance hedge size: how many futures contracts (as a fraction of the spot exposure) minimize the variance of the hedged portfolio, given correlation and the two volatilities.',
  },
  {
    question: 'Can the hedge ratio be greater than 1 or negative?',
    answer:
      'Yes. Values above 1 mean hedging more than the spot exposure; negative values reverse the hedge direction when correlation is negative. This calculator does not clamp the result to 0–1.',
  },
  {
    question: 'What units should I use for the standard deviations?',
    answer:
      'Any consistent units work (for example both in dollars or both in percent). The ratio σs / σf is unitless when both use the same measure of price change.',
  },
];
