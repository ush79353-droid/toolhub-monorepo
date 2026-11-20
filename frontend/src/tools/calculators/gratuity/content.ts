import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const GRATUITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-gratuity', label: 'What Is Gratuity?' },
  { id: 'how-to-use', label: 'How to Use This Calculator' },
  { id: 'gratuity-formulas', label: 'Gratuity Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'gratuity-faq', label: 'Frequently Asked Questions' },
];

export const GRATUITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How is total gratuity calculated?',
    answer:
      'This tool uses the Indian Payment of Gratuity Act, 1972 style formula: (Final month’s salary + D.A.) × 15 ÷ 26 × eligible years. Eligible years count each completed year, and any leftover service exceeding six months counts as one more year. Exactly six months does not round up.',
  },
  {
    question: 'When is service too short for a payout?',
    answer:
      'Ordinary entitlement under the Act requires at least five years of continuous service (60 months). Below that gate this calculator shows ₹0 / 0.00. Death or disablement exceptions are not modeled. This is a formula estimate — not a Pakistan or global statutory payout.',
  },
  {
    question: 'Do the currency selectors convert amounts?',
    answer:
      'Yes. Final salary + D.A. and total gratuity each have independent currencies. Money converts with stored FX rates. Years and months never convert. Missing rates block conversion; stale rates warn but still convert.',
  },
];
