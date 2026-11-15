import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SHARPE_RATIO_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-sharpe-ratio', label: 'What Is the Sharpe Ratio?' },
  { id: 'sharpe-ratio-formula', label: 'Sharpe Ratio Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'sharpe-ratio-faq', label: 'Frequently Asked Questions' },
];

export const SHARPE_RATIO_FAQS: readonly FAQItem[] = [
  {
    question: 'What does the Sharpe ratio measure?',
    answer:
      'It measures excess return (risk premium) earned per unit of total volatility (standard deviation). Higher is generally better for the same period and return convention.',
  },
  {
    question: 'How are risk premium and Sharpe ratio calculated?',
    answer:
      'Risk premium = investment return − risk-free return. Sharpe ratio = risk premium ÷ standard deviation. Use the same period and percent scale for all inputs.',
  },
  {
    question: 'Can the Sharpe ratio be negative?',
    answer:
      'Yes. When the investment return is below the risk-free return, the risk premium and Sharpe ratio are negative.',
  },
  {
    question: 'Why must standard deviation be greater than zero?',
    answer:
      'Division by zero is undefined. A zero or blank standard deviation leaves the Sharpe ratio empty until a positive volatility is entered.',
  },
];
