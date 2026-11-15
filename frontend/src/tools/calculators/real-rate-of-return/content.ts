import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const REAL_RATE_OF_RETURN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-real-rate', label: 'What Is Real Rate of Return?' },
  { id: 'fisher-equation', label: 'Fisher Equation' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'real-rate-faq', label: 'Frequently Asked Questions' },
];

export const REAL_RATE_OF_RETURN_FAQS: readonly FAQItem[] = [
  {
    question: 'Why not just subtract inflation from the nominal return?',
    answer:
      'Nominal − inflation is a rough approximation. The Fisher equation divides growth factors so the inflation adjustment compounds correctly, especially when rates are larger.',
  },
  {
    question: 'Can inflation or nominal returns be negative?',
    answer:
      'Yes. Negative inflation is deflation. Negative nominal returns are allowed down to −100%. Inflation must stay above −100% so the denominator stays positive.',
  },
  {
    question: 'What does a negative real rate mean?',
    answer:
      'Purchasing power fell: inflation outpaced the nominal return, so the investment lost value in real terms.',
  },
];
