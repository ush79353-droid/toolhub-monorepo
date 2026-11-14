import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BUSINESS_BUDGET_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-business-budget', label: 'What This Calculator Does' },
  { id: 'business-budget-formulas', label: 'Formulas' },
  { id: 'business-budget-periods', label: 'Periods & One-time Costs' },
  { id: 'business-budget-example', label: 'Example' },
  { id: 'business-budget-faq', label: 'Frequently Asked Questions' },
];

export const BUSINESS_BUDGET_FAQS: readonly FAQItem[] = [
  {
    question: 'What is budget balance?',
    answer:
      'Budget balance is total monthly income minus total monthly recurring expenses (salaries + monthly expenses). A positive figure means the plan covers recurring costs; a negative figure means recurring costs exceed income.',
  },
  {
    question: 'Are one-time costs included in total expenses?',
    answer:
      'No. One-time costs become Initial investment only. They are not added again into Total expenses or Budget balance, so startup capital is not double-counted against the monthly operating plan.',
  },
  {
    question: 'How are different periods combined?',
    answer:
      'Recurring amounts are normalized to a monthly equivalent before they are summed. Daily uses 365÷12, weekly uses 52÷12, yearly divides by 12, and monthly is unchanged.',
  },
  {
    question: 'Does currency convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter every amount in the same currency.',
  },
];
