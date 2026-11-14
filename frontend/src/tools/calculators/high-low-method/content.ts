import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HIGH_LOW_METHOD_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-high-low', label: 'What the High-Low Method Means' },
  { id: 'high-low-formulas', label: 'Formulas' },
  { id: 'high-low-example', label: 'Example' },
  { id: 'high-low-faq', label: 'Frequently Asked Questions' },
];

export const HIGH_LOW_METHOD_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the high-low method?',
    answer:
      'It separates mixed costs into variable cost per unit and total fixed cost using the highest and lowest activity observations in a data set.',
  },
  {
    question: 'Why must high volume exceed low volume?',
    answer:
      'Variable cost per unit divides the cost difference by the volume difference. Equal volumes would divide by zero.',
  },
  {
    question: 'What is number of units (x)?',
    answer:
      'The activity level used to estimate total cost after fixed and variable costs are known: TC = FC + VC × x.',
  },
  {
    question: 'Does changing currency convert my numbers?',
    answer:
      'No. The selector only changes the currency label and formatting. Amounts stay in the denomination you entered.',
  },
];
