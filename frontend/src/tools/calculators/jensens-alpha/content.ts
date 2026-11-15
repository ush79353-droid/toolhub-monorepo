import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const JENSENS_ALPHA_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-jensens-alpha', label: "What Is Jensen's Alpha?" },
  { id: 'jensens-alpha-formula', label: "Jensen's Alpha Formula" },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'jensens-alpha-faq', label: 'Frequently Asked Questions' },
];

export const JENSENS_ALPHA_FAQS: readonly FAQItem[] = [
  {
    question: "What is Jensen's alpha?",
    answer:
      "Jensen's alpha measures a portfolio's excess return over the return predicted by the Capital Asset Pricing Model (CAPM) for its beta. Positive alpha indicates outperformance; negative alpha indicates underperformance.",
  },
  {
    question: 'How is portfolio return calculated here?',
    answer:
      'Portfolio Return (%) = ((Ending Value − Beginning Value) ÷ Beginning Value) × 100.',
  },
  {
    question: "How is Jensen's alpha calculated?",
    answer:
      "Expected Return (%) = Risk-Free Rate + Beta × (Market Return − Risk-Free Rate). Jensen's Alpha (%) = Portfolio Return − Expected Return.",
  },
  {
    question: 'Can Jensen\'s alpha be negative?',
    answer:
      'Yes. If the portfolio underperforms the CAPM expected return, alpha is negative.',
  },
];
