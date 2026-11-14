import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EAR_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-ear', label: 'What Is EAR?' },
  { id: 'ear-formula', label: 'EAR Formula' },
  { id: 'step-by-step-example', label: 'Step-by-Step Example' },
  { id: 'ear-faq', label: 'Frequently Asked Questions' },
];

export const EAR_FAQS: readonly FAQItem[] = [
  {
    question: 'What is Effective Annual Rate (EAR)?',
    answer:
      'EAR is the true annual interest rate after compounding. It converts a nominal annual rate and compounding frequency into an equivalent once-per-year rate.',
  },
  {
    question: 'How do you calculate EAR?',
    answer:
      'EAR (%) = [(1 + annual rate ÷ (100 × n))^n − 1] × 100, where n is compounds per year. Periodic rate (%) = annual rate ÷ n.',
  },
  {
    question: 'Why is monthly 12% higher than 12% EAR?',
    answer:
      'Because interest compounds within the year. At 12% nominal compounded monthly, EAR ≈ 12.6825%, not 12%.',
  },
  {
    question: 'Can the annual rate be negative or zero?',
    answer:
      'Yes. Zero yields zero periodic rate and EAR. Negatives are allowed when 1 + rate/(100×n) stays positive so the result is defined.',
  },
];
