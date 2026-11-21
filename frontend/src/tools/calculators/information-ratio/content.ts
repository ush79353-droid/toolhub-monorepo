import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INFORMATION_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-information-ratio', label: 'What Is Information Ratio?' },
  { id: 'information-ratio-formula', label: 'Information Ratio Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'information-ratio-faq', label: 'Frequently Asked Questions' },
];

export const INFORMATION_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is information ratio?',
    answer:
      'Information ratio measures active return per unit of tracking error; how much excess return a portfolio earned relative to a benchmark, scaled by the volatility of that excess return.',
  },
  {
    question: 'How is portfolio return calculated here?',
    answer:
      'Portfolio Return (%) = ((Ending Value − Beginning Value) ÷ Beginning Value) × 100.',
  },
  {
    question: 'How is information ratio calculated?',
    answer:
      'Information Ratio = (Portfolio Return − Benchmark Return) ÷ Tracking Error. Tracking error is entered as the standard deviation of active returns.',
  },
  {
    question: 'Can information ratio be negative?',
    answer:
      'Yes. If the portfolio underperforms the benchmark, the information ratio is negative.',
  },
];
