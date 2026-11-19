import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SABBATICAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'sabbatical-definition', label: 'Sabbatical definition' },
  { id: 'plan-your-sabbatical-leave', label: 'Plan your sabbatical leave' },
  {
    id: 'what-else-before-sabbatical',
    label: 'What else to do before sabbatical leave?',
  },
  { id: 'sabbatical-faq', label: 'Frequently asked questions' },
];

export const SABBATICAL_FAQS: readonly FAQItem[] = [
  {
    question: 'What does this Sabbatical Calculator estimate?',
    answer:
      'It estimates how much you can accumulate while saving, how much a desired sabbatical would cost (including an optional buffer), whether you are on track, and roughly how many months away your fund could support.',
  },
  {
    question: 'How is monthly savings calculated?',
    answer:
      'By default, Monthly Savings = Monthly Income × Savings Percentage ÷ 100. You can override the monthly savings amount manually; changing income or percentage while in auto mode updates it again.',
  },
  {
    question: 'How are weeks converted to months?',
    answer:
      'Weeks are converted with months = weeks × 12 ÷ 52 so a year of weeks aligns with 12 months. Years convert as years × 12.',
  },
  {
    question: 'Does the currency selector convert money between currencies?',
    answer:
      'No. The selector only changes the symbol and formatting. Enter every amount in the same selected currency.',
  },
];

export const BUDGET_CALCULATOR_HREF = '/tools/business-budget-calculator';
export const SAVINGS_CALCULATOR_HREF = '/tools/savings-calculator';
export const SAVINGS_GOAL_CALCULATOR_HREF = '/tools/savings-goal-calculator';
