import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SORTINO_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-sortino-ratio', label: 'What Is Sortino Ratio?' },
  { id: 'sortino-ratio-formula', label: 'Sortino Ratio Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'sortino-ratio-faq', label: 'Frequently Asked Questions' },
];

export const SORTINO_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the Sortino ratio?',
    answer:
      'The Sortino ratio measures excess return over the risk-free rate per unit of downside deviation. Unlike Sharpe, it uses downside risk instead of total volatility.',
  },
  {
    question: 'How is Sortino ratio calculated?',
    answer:
      'Sortino Ratio = (Average Asset Return − Risk-Free Rate) ÷ Downside Deviation. Returns are in percent; downside deviation uses matching percentage-point units. The result is unitless.',
  },
  {
    question: 'Can Sortino ratio be negative?',
    answer:
      'Yes. If average return is below the risk-free rate, the Sortino ratio is negative.',
  },
  {
    question: 'Why must downside deviation be greater than zero?',
    answer:
      'Division by zero is undefined. Enter a positive downside deviation; blank or zero leaves the result empty instead of showing NaN.',
  },
];
