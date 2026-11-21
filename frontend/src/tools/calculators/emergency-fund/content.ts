import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const EMERGENCY_FUND_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-emergency-fund', label: 'What is an emergency fund?' },
  { id: 'calculator-example', label: 'Calculator example' },
  { id: 'how-much-funding', label: 'How much emergency funding should I have?' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'emergency-fund-faq', label: 'Frequently asked questions' },
];

export const EMERGENCY_FUND_FAQS: readonly FAQItem[] = [
  {
    question: 'How can I calculate the emergency fund amount?',
    answer:
      'Add up essential monthly expenses, choose how many months of coverage you want, then multiply: Emergency Fund = Monthly Expenses × Number of Months.',
  },
  {
    question: 'Can the emergency fund be negative?',
    answer:
      'No. An emergency fund is a savings target, so enter positive monthly expenses and a positive coverage period. Negative inputs are rejected.',
  },
  {
    question: 'What is the optimal emergency funding?',
    answer:
      'A common guideline is three to six months of essential living expenses. Job security, dependents, income variability, and support networks may justify a smaller or larger cushion.',
  },
  {
    question: 'What is emergency funding used for?',
    answer:
      'Genuine surprises that threaten essentials (job loss, medical bills, urgent repairs, or temporary income gaps) not routine discretionary spending.',
  },
  {
    question: 'How much emergency fund should I have with $2,500 monthly expenses?',
    answer:
      'Three months ≈ $7,500; four ≈ $10,000; six ≈ $15,000; nine ≈ $22,500; twelve ≈ $30,000. Pick a coverage period that matches your risk and income stability.',
  },
];
