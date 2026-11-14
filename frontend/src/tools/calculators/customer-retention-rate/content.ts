import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CUSTOMER_RETENTION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-retention', label: 'What Retention Rate Means' },
  { id: 'retention-formulas', label: 'Formulas' },
  { id: 'retention-example', label: 'Example' },
  { id: 'retention-faq', label: 'Frequently Asked Questions' },
];

export const CUSTOMER_RETENTION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is customer retention rate?',
    answer:
      'The share of existing customers still with you at period end: ((total − new) ÷ existing) × 100.',
  },
  {
    question: 'How is attrition rate related?',
    answer: 'Attrition rate is the complement of retention: 100 − retention rate.',
  },
  {
    question: 'Why must existing customers be greater than zero?',
    answer: 'Retention divides by existing customers, so a zero start would be undefined.',
  },
  {
    question: 'Can retained customers exceed existing customers?',
    answer:
      'No. Retained = total − new must be between 0 and existing customers for a coherent period.',
  },
];
