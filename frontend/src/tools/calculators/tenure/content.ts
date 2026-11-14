import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const TENURE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-tenure', label: 'What Tenure Means' },
  { id: 'tenure-formulas', label: 'Formulas' },
  { id: 'tenure-example', label: 'Examples' },
  { id: 'tenure-faq', label: 'Frequently Asked Questions' },
];

export const TENURE_FAQS: readonly FAQItem[] = [
  {
    question: 'What is average tenure?',
    answer:
      'Average tenure is combined duration of service divided by the total number of employees. With 650 combined years and 100 employees, average tenure is 6.5 years.',
  },
  {
    question: 'How is specific duration calculated?',
    answer:
      'Specific duration is the calendar difference between the ending date and the starting date, expressed in whole years, months, and days — not a fixed 365-day approximation.',
  },
  {
    question: 'Can the ending date be before the starting date?',
    answer:
      'No. The calculator rejects that combination so tenure stays non-negative.',
  },
  {
    question: 'Does the duration unit change the average result?',
    answer:
      'Yes. Combined service is converted to years (months ÷ 12, days ÷ 365.2425) before dividing by headcount. The average is always shown in years.',
  },
];
