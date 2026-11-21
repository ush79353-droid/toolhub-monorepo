import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const AVERAGE_FIXED_COST_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-average-fixed-cost', label: 'What Is Average Fixed Cost?' },
  { id: 'average-fixed-cost-formula', label: 'Average Fixed Cost Formula' },
  { id: 'how-to-calculate-afc', label: 'How to Calculate' },
  { id: 'afc-example', label: 'Worked Example' },
  { id: 'fixed-vs-variable', label: 'Fixed vs Variable Costs' },
  { id: 'afc-faq', label: 'Frequently Asked Questions' },
];

export const AVERAGE_FIXED_COST_FAQS: readonly FAQItem[] = [
  {
    question: 'What is average fixed cost?',
    answer:
      'Average fixed cost (AFC) is total fixed cost divided by the number of units produced or sold. It shows how much fixed overhead is allocated to each unit.',
  },
  {
    question: 'What counts as a fixed cost?',
    answer:
      'Fixed costs stay the same in the short run regardless of output, examples include rent, salaried staff, insurance premiums, and equipment leases. Variable costs such as materials are not included in this calculator.',
  },
  {
    question: 'Why does average fixed cost fall as output rises?',
    answer:
      'Total fixed cost is spread over more units, so AFC declines as production increases (until capacity constraints force new fixed costs).',
  },
  {
    question: 'Can number of units be zero?',
    answer:
      'No. Dividing by zero is undefined. Enter a positive number of units so the average has a finite meaning.',
  },
  {
    question: 'Does the currency selector convert amounts?',
    answer:
      'No. Currency changes the symbol and grouping only. Enter total fixed cost in one currency; the calculator does not convert between currencies.',
  },
  {
    question: 'Example: 10,000 fixed cost and 200 units?',
    answer: 'Average fixed cost = 10,000 ÷ 200 = 50.00 per unit.',
  },
];
