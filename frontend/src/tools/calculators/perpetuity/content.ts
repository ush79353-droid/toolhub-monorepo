import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PERPETUITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-perpetuity', label: 'What Is a Perpetuity?' },
  { id: 'perpetuity-formula', label: 'Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'perpetuity-faq', label: 'Frequently Asked Questions' },
];

export const PERPETUITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this calculator compute?',
    answer:
      'It estimates the present value of a constant or constantly growing stream of payments that continues forever, using the Gordon Growth / growing-perpetuity formula.',
  },
  {
    question: 'Is the dividend D₀ or D₁?',
    answer:
      'Dividend is treated as the payment expected at the end of the next period (D₁). Both the discount rate and growth rate must refer to the same period.',
  },
  {
    question: 'Why must the discount rate exceed the growth rate?',
    answer:
      'The formula divides by (discount − growth). If growth is greater than or equal to the discount rate, the model has no finite present value.',
  },
  {
    question: 'Can growth be zero or negative?',
    answer:
      'Yes. Zero growth is a level perpetuity (PV = Dividend / discount). Negative growth is allowed whenever the discount rate is still higher.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter money fields already in the selected currency.',
  },
];
