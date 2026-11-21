import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MARGINAL_REVENUE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-marginal-revenue', label: 'What Is Marginal Revenue?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'marginal-revenue-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'marginal-revenue-faq', label: 'Frequently Asked Questions' },
];

export const MARGINAL_REVENUE_FAQS: readonly FAQItem[] = [
  {
    question: 'How is marginal revenue calculated?',
    answer:
      'This tool uses the discrete approximation MR = ΔTR / ΔQ, where ΔTR is final revenue minus initial revenue and ΔQ is final quantity minus initial quantity. It is labeled as ΔTR/ΔQ, not a continuous derivative.',
  },
  {
    question: 'What if quantity does not change?',
    answer:
      'If ΔQ is zero, marginal revenue is undefined: the calculator shows no MR value instead of dividing by zero. Change in total revenue and change in quantity still display.',
  },
  {
    question: 'Can changes or marginal revenue be negative?',
    answer:
      'Yes. Negative ΔTR, ΔQ, and MR are allowed when inputs produce them. Fractional quantities are supported.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Initial, final, ΔTR, and MR each have independent currencies. Initial and final revenue are normalized into one currency before subtraction. Quantities are never FX-converted. Missing rates block conversion; stale rates warn but still convert.',
  },
];
