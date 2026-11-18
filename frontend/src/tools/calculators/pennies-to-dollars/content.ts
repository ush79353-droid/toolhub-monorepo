import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PENNIES_TO_DOLLARS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'understanding', label: 'Pennies to Dollars: Understanding US Currency' },
  { id: 'pennies-to-dollars', label: 'How to Calculate Pennies to Dollars' },
  { id: 'dollars-to-pennies', label: 'How to Convert Dollars to Pennies' },
  { id: 'how-to-use', label: 'How to Use the Pennies to Dollars Calculator' },
  { id: 'conversion-chart', label: 'Pennies to Dollars Conversion Chart' },
  { id: 'pennies-to-dollars-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const PENNIES_TO_DOLLARS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'understanding',
    title: 'Pennies to Dollars: Understanding US Currency',
    paragraphs: [
      'A US penny is a one-cent coin. One penny has a face value of $0.01. The US dollar is a decimal currency with 100 cents in each dollar, so 100 pennies equal exactly one dollar.',
      'Converting pennies to dollars helps when counting coin jars, teaching money math, reconciling cash drawers, and turning a pile of coins into a bankable dollar amount.',
      'The penny has been part of American coinage for centuries as the smallest circulating denomination by face value. This calculator converts face values only — it does not estimate metal melt value or collector premiums.',
    ],
    formula: '1 penny = $0.01 · 100 pennies = $1.00',
  },
  {
    id: 'pennies-to-dollars',
    title: 'How to Calculate Pennies to Dollars',
    paragraphs: [
      'Divide the number of pennies by 100. Example: 500 ÷ 100 = $5.00. Another: 2,000 ÷ 100 = $20.00. And 12,345 ÷ 100 = $123.45.',
    ],
    formula: 'Dollars = Pennies ÷ 100',
  },
  {
    id: 'dollars-to-pennies',
    title: 'How to Convert Dollars to Pennies',
    paragraphs: [
      'Multiply dollars by 100. Examples: $1 = 100 pennies, $5 = 500, $20 = 2,000, $50 = 5,000, and $100 = 10,000 pennies.',
    ],
    formula: 'Pennies = Dollars × 100',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Pennies to Dollars Calculator',
    paragraphs: [
      '1. Enter a penny amount in the Pennies field.',
      '2. View the dollar value automatically.',
      '3. Or enter a dollar amount in the Dollars field.',
      '4. View the corresponding number of pennies.',
      '5. Use Share Result to copy the answer.',
      '6. Use Reload or Clear to start another conversion.',
    ],
  },
  {
    id: 'conversion-chart',
    title: 'Pennies to Dollars Conversion Chart',
    paragraphs: ['Common face-value equivalents under the 100-pennies-per-dollar rule:'],
    tableHeaders: ['Pennies', 'Dollars'],
    table: [
      ['1', '$0.01'],
      ['5', '$0.05'],
      ['10', '$0.10'],
      ['25', '$0.25'],
      ['50', '$0.50'],
      ['100', '$1.00'],
      ['200', '$2.00'],
      ['500', '$5.00'],
      ['1,000', '$10.00'],
      ['2,000', '$20.00'],
      ['10,000', '$100.00'],
      ['100,000', '$1,000.00'],
      ['1,000,000', '$10,000.00'],
    ],
  },
];

export const PENNIES_TO_DOLLARS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Pennies Are There in One Dollar?',
    answer: 'There are 100 pennies in one US dollar.',
  },
  {
    question: 'How Many Pennies Make 100 Dollars?',
    answer: '10,000 pennies equal $100.',
  },
  {
    question: 'How Do I Convert 1 Million Pennies to Dollars?',
    answer: 'Divide one million by 100: 1,000,000 ÷ 100 = 10,000. Result: $10,000.',
  },
  {
    question: 'How Many Dollars Are 100,000 Pennies?',
    answer: '100,000 pennies equal $1,000.',
  },
  {
    question: 'How Many Pennies Are in $50?',
    answer: 'There are 5,000 pennies in $50.',
  },
  {
    question: 'How Much Is 2,000 Pennies?',
    answer: '2,000 pennies equal $20.',
  },
  {
    question: 'How Much Is One Penny Worth?',
    answer: 'One US penny has a face value of one cent, or $0.01.',
  },
];
