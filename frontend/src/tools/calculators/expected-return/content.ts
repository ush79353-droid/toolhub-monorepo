import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EXPECTED_RETURN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-expected-return', label: 'What Is Expected Return?' },
  { id: 'expected-return-formula', label: 'Expected Return Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'expected-return-faq', label: 'Frequently Asked Questions' },
];

export const EXPECTED_RETURN_FAQS: readonly FAQItem[] = [
  {
    question: 'What is expected return?',
    answer:
      'Expected return is the probability-weighted average of possible returns across scenarios. It summarizes what you might earn on average given each scenario’s chance of occurring.',
  },
  {
    question: 'How is expected return calculated?',
    answer:
      'For each stock, Expected Return (%) = Σ [(Probability_i ÷ 100) × Return_i]. Probabilities across scenarios must total 100%.',
  },
  {
    question: 'Why must probabilities equal 100%?',
    answer:
      'The scenarios should cover the full set of outcomes you are modeling. If probabilities do not sum to 100%, the weighted average would be incomplete or overstated.',
  },
  {
    question: 'Can stock returns be negative?',
    answer:
      'Yes. Negative returns are allowed so loss scenarios can pull expected return down.',
  },
];
