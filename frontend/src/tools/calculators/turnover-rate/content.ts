import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TURNOVER_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-turnover-rate', label: 'What Is Turnover Rate?' },
  { id: 'turnover-rate-formula', label: 'Turnover Rate Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'turnover-rate-faq', label: 'Frequently Asked Questions' },
];

export const TURNOVER_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is employee turnover rate?',
    answer:
      'Employee turnover rate is the percentage of workers who left during a period relative to the average number of employees in that period.',
  },
  {
    question: 'How do you calculate turnover rate?',
    answer:
      'Turnover Rate (%) = (employees who left ÷ average employees) × 100. Average employees can be entered directly or calculated as (employees at start + employees at end) ÷ 2.',
  },
  {
    question: 'Can turnover rate exceed 100%?',
    answer:
      'Yes. If more people leave during the period than the average headcount, the rate can be above 100%. This calculator does not cap the result.',
  },
  {
    question: 'Why must average employees be greater than zero?',
    answer:
      'Turnover divides by average headcount. A zero average would make the rate undefined, so the calculator requires a positive average.',
  },
  {
    question: 'Should employee counts be whole numbers?',
    answer:
      'Yes. This calculator expects non-negative whole-number headcounts for start, end, average, and employees who left.',
  },
];
