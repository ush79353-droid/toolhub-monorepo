import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FIFTY_THIRTY_TWENTY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-rule', label: 'What is the 50/30/20 rule?' },
  { id: 'what-are-necessities', label: 'What are necessities?' },
  { id: 'what-are-wants', label: 'What are wants?' },
  { id: 'what-counts-as-savings', label: 'What counts as savings?' },
  { id: 'how-calculator-works', label: 'How does the calculator work?' },
  { id: 'budgeting-example', label: 'An example of the 50/30/20 rule' },
  { id: 'how-to-adjust', label: 'How to adjust the 50/30/20 rule' },
  { id: 'budgeting-tips', label: 'Tips for following the rule' },
  { id: 'related-calculators', label: 'Related calculators' },
  { id: 'budget-faq', label: 'Frequently asked questions' },
];

export const FIFTY_THIRTY_TWENTY_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I make a budget for a month according to the 50/30/20 rule?',
    answer:
      'Start with monthly after-tax income. Allocate 50% to necessities, 30% to wants, and 20% to savings. Track spending in each bucket and adjust as needed.',
  },
  {
    question: 'How much of my salary should I spend according to the 50/30/20 rule?',
    answer:
      'The guideline is 50% needs, 30% wants, and 20% savings — based on take-home (after-tax) income, not gross salary.',
  },
  {
    question: 'What is an ideal budget allocation?',
    answer:
      'It depends on income, costs, goals, location, and household size. 50/30/20 is a useful starting point, not a universal requirement.',
  },
  {
    question: 'Is the 50/30/20 budget rule suitable for me?',
    answer:
      'It works well as a simple framework for many households. High housing costs, debt, or irregular income may require different percentages.',
  },
  {
    question: 'What is included in the 50% needs category?',
    answer:
      'Essential living costs such as housing, groceries, utilities, transportation, basic healthcare, insurance, essential communication, and minimum debt payments.',
  },
  {
    question: 'What is included in the 30% wants category?',
    answer:
      'Discretionary spending such as dining out, entertainment, vacations, hobbies, streaming, shopping, and other non-essential upgrades.',
  },
  {
    question: 'What should I include in the 20% savings category?',
    answer:
      'Emergency funds, retirement contributions, investments, education savings, future purchases, and extra debt payments beyond minimums — depending on your goals.',
  },
  {
    question: 'Does the 50/30/20 rule use gross or net income?',
    answer:
      'The standard method uses after-tax (net / take-home) income so taxes are not double-counted in the budget.',
  },
  {
    question: 'Can I change the 50/30/20 percentages?',
    answer:
      'Yes. Treat the rule as a guideline. Shift percentages when housing is expensive, debt is high, or you want to save more aggressively.',
  },
  {
    question: 'Should debt repayment be included in the 50/30/20 rule?',
    answer:
      'Minimum payments on essential debts are usually treated as necessities. Extra payments toward debt reduction often fit in the savings / financial-goals portion.',
  },
  {
    question: 'How much should I save every month?',
    answer:
      'The rule suggests about 20% of after-tax income. Increase that when you can, especially for emergency reserves and retirement.',
  },
  {
    question: 'Can I follow the 50/30/20 rule with a low income?',
    answer:
      'Prioritize necessities first. Even a small, automatic savings habit can help; adjust wants and savings percentages to stay realistic.',
  },
];
