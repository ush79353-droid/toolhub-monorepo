import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const COST_FUNCTION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-a-cost-function', label: 'What Is a Cost Function?' },
  { id: 'cost-function-formulas', label: 'Formulas' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'cost-function-example', label: 'Worked Example' },
  { id: 'cost-function-faq', label: 'Frequently Asked Questions' },
];

export const COST_FUNCTION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a cost function?',
    answer:
      'A cost function expresses total cost as a function of quantity. The linear form used here is TC(Q) = Fixed Cost + Variable Cost per Unit × Q.',
  },
  {
    question: 'When should I use fixed and variable costs?',
    answer:
      'Use that mode when you already know fixed overhead and the variable cost of one unit. Enter quantity to get total cost and the cost-function equation.',
  },
  {
    question: 'When should I use two point costs?',
    answer:
      'Use two observed total costs at different quantities. The calculator estimates variable cost as the slope between the points and fixed cost as the intercept.',
  },
  {
    question: 'What if the two quantities are equal?',
    answer:
      'Variable cost cannot be estimated: dividing by zero is undefined. Enter two different quantities.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter all money values in one currency; the calculator does not convert between currencies.',
  },
];
