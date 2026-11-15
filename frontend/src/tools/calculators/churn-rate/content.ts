import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CHURN_RATE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-churn-rate', label: 'What Churn Rate Means' },
  { id: 'churn-formulas', label: 'Formulas' },
  { id: 'customer-lifetime', label: 'Customer Lifetime' },
  { id: 'churn-example', label: 'Example' },
  { id: 'churn-rate-faq', label: 'Frequently Asked Questions' },
];

export const CHURN_RATE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is churn rate?',
    answer:
      'Churn rate is the share of customers lost during a period relative to the starting customer count: (customers lost ÷ starting customers) × 100.',
  },
  {
    question: 'What does customer lifetime mean here?',
    answer:
      'It is a simple estimate of how many periods a customer lasts if churn stays constant: starting customers ÷ customers lost. It is not a cohort survival model.',
  },
  {
    question: 'What if no customers are lost?',
    answer:
      'Churn rate is 0%. Customer lifetime shows “No finite estimate” because dividing by zero would invent an infinite lifetime.',
  },
  {
    question: 'Can lost customers exceed starting customers?',
    answer:
      'No. The calculator rejects that combination so the period definition stays consistent with the starting headcount.',
  },
];
