import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const US_INCOME_PERCENTILE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  {
    id: 'individual-and-household-percentiles',
    label: 'What are individual and household income percentiles?',
  },
  {
    id: 'what-percentile-is-my-income',
    label: 'What percentile is my income? The US income percentile calculator',
  },
  {
    id: 'how-to-interpret',
    label: 'How to interpret my individual and household income percentile?',
  },
  { id: 'us-income-percentile-faq', label: 'FAQs' },
];

export const US_INCOME_PERCENTILE_FAQS: readonly FAQItem[] = [
  {
    question: 'Can I have negative income?',
    answer:
      'Yes in some definitions, especially when self-employment or business losses exceed other money income. This calculator does not rank negative amounts. The Census person-income table folds losses into the same $1 to $2,499 bin, so a separate negative percentile is not published there.',
  },
  {
    question: 'What is household income?',
    answer:
      'In the 2024 CPS ASEC tables used here, household money income is the combined pretax cash income of people living in the same household. It is not the same figure as one person’s income.',
  },
  {
    question: 'What is the meaning of individual income?',
    answer:
      'Here it means person money income for people age 15 and older who had income in 2024, from CPS PINC-01. It is one person’s income, not the household total, and it is not limited to full-time workers.',
  },
  {
    question: "What factors affect an employee's income?",
    answer:
      'Pay varies with education, experience and credentials, occupation, industry, performance, where the job is located, and years on the job. Those factors are context for a paycheck. They are not inputs in this percentile comparison.',
  },
  {
    question: 'What income percentile am I in with $50,000 income?',
    answer:
      'It depends on whether you select individual or household income, and on the 2024 reference tables. Enter 50000 and switch the income type. The page does not publish a single percentile for $50,000 outside that calculation.',
  },
];
