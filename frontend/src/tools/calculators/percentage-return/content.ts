import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PERCENTAGE_RETURN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-percentage-return', label: 'What Is Percentage Return?' },
  { id: 'percentage-return-formulas', label: 'Formulas' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'percentage-return-faq', label: 'Frequently Asked Questions' },
];

export const PERCENTAGE_RETURN_FAQS: readonly FAQItem[] = [
  {
    question: 'What is percentage return?',
    answer:
      'Percentage return is the gain or loss relative to the amount invested: ((returned − invested) / invested) × 100.',
  },
  {
    question: 'How is annualized percentage return calculated?',
    answer:
      'Annualized return uses CAGR: ((returned / invested)^(1 / years) − 1) × 100. Date spans use calendar days ÷ 365.25.',
  },
  {
    question: 'How is time needed calculated?',
    answer:
      'Years = ln(returned / invested) / ln(1 + annualized rate). The rate must be greater than −100%, and returned must be greater than zero.',
  },
  {
    question: 'Can the return be negative?',
    answer:
      'Yes. If the returned amount is below the invested amount, gain/loss and percentage return are negative. A returned amount of zero annualizes to −100%.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. It only changes the currency label and grouping. Enter all money fields already in the selected currency.',
  },
];
