import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const SEVENTY_TWENTY_TEN_TOC: readonly TableOfContentsItem[] = [
  { id: 'what-is-70-20-10', label: 'What Is the 70/20/10 Rule?' },
  { id: 'how-the-rule-works', label: 'How the Rule Works' },
  { id: 'calculate-each-category', label: 'How to Calculate Each Category' },
  { id: 'monthly-and-annual-examples', label: 'Monthly and Annual Examples' },
  { id: 'what-belongs-where', label: 'What Belongs in Each Category' },
  { id: 'compare-actual-spending', label: 'Compare Actual Spending' },
  { id: 'advantages-and-limits', label: 'Advantages and Limitations' },
  { id: 'versus-50-30-20', label: '70/20/10 vs 50/30/20' },
  { id: 'irregular-income', label: 'Irregular Income' },
  { id: 'budget-faq', label: 'Frequently Asked Questions' },
];

export const SEVENTY_TWENTY_TEN_FAQS: FAQItem[] = [
  {
    question: 'What is the 70/20/10 money rule?',
    answer:
      'It is a budgeting guideline that assigns 70% of after-tax income to needs, 20% to savings and debt repayment, and 10% to lifestyle spending. It is not a legal requirement, and it will not fit every household.',
  },
  {
    question: 'Should I use take-home pay or gross pay?',
    answer:
      'Use after-tax income, the amount you can actually assign. Gross pay still has tax to come out, so a 70% needs figure based on gross pay is larger than the cash you have.',
  },
  {
    question: 'Where do debt payments go?',
    answer:
      'Put debt repayment with savings, in the 20% category. Minimum payments you cannot skip may feel like a need, but this split keeps repayment visible instead of burying it inside ordinary bills.',
  },
  {
    question: 'What if my percentages do not add up to 100%?',
    answer:
      'The calculator will not build a custom budget until the three percentages add up to 100%. Turn custom percentages off to return to 70/20/10.',
  },
  {
    question: 'Does changing monthly to annual change my budget?',
    answer:
      'No. Switching frequency multiplies or divides the amounts you already entered so the same money is shown per month or per year. It does not apply that factor twice.',
  },
  {
    question: 'What happens if I spend more than I earn?',
    answer:
      'The page shows the overspending amount and which categories are over their allocation. It does not hide the gap or call the plan a success.',
  },
  {
    question: 'Does the currency selector convert my income?',
    answer:
      'No. It changes the symbol and grouping only. Enter income and spending in the same currency. This calculator does not look up an exchange rate.',
  },
];
