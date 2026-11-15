import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TREYNOR_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-treynor-ratio', label: 'What Is Treynor Ratio?' },
  { id: 'treynor-ratio-formula', label: 'Treynor Ratio Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'treynor-ratio-faq', label: 'Frequently Asked Questions' },
];

export const TREYNOR_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What is Treynor ratio?',
    answer:
      'Treynor ratio measures excess return per unit of systematic market risk (beta). It compares portfolio return above the risk-free rate to the portfolio’s beta.',
  },
  {
    question: 'How is portfolio return calculated here?',
    answer:
      'Portfolio Return (%) = ((Ending Value − Beginning Value) ÷ Beginning Value) × 100.',
  },
  {
    question: 'How is Treynor ratio calculated?',
    answer:
      'Treynor Ratio = (Portfolio Return − Risk-Free Rate) ÷ Portfolio Beta. This calculator uses percentage-point returns in the numerator and shows the result with a % unit, matching the screenshot convention.',
  },
  {
    question: 'Can Treynor ratio be negative?',
    answer:
      'Yes. If the portfolio return is below the risk-free rate, or if the period return is negative, the Treynor ratio can be negative.',
  },
];
