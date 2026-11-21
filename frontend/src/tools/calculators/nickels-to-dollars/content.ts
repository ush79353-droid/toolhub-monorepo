import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NICKELS_TO_DOLLARS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'nickels-to-dollars', label: 'Nickels to Dollars' },
  { id: 'two-thousand-nickels', label: '2,000 Nickels to Dollars' },
  { id: 'how-to-use', label: 'How to Use the Nickels to Dollars Calculator' },
  { id: 'how-many-nickels', label: 'How Many Nickels Make a Dollar?' },
  { id: 'conversion-chart', label: 'Nickel Conversion Chart' },
  { id: 'nickels-to-dollars-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const NICKELS_TO_DOLLARS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'nickels-to-dollars',
    title: 'Nickels to Dollars',
    paragraphs: [
      'A U.S. nickel is a five-cent coin; one-twentieth of a dollar. The name comes from the copper-nickel alloy used in the coin for much of its history. Each nickel has a face value of 5¢, written $0.05.',
      'Because 100 cents make one dollar and each nickel is worth five cents, twenty nickels equal exactly one dollar. Converting nickels to dollars helps when counting change, managing coin collections, teaching classroom money math, cash drawers, and simple budgeting.',
      'This calculator converts between a count of nickels and U.S. dollars. It does not convert foreign currencies or other coin denominations.',
    ],
    formula: 'Dollars = Nickels ÷ 20   ·   Nickels = Dollars × 20',
  },
  {
    id: 'two-thousand-nickels',
    title: '2,000 Nickels to Dollars',
    paragraphs: [
      'Suppose you have 2,000 nickels. Each nickel is worth $0.05. Multiply the count by the face value: 2,000 × 0.05 = 100. Therefore, 2,000 nickels equal $100.00.',
      'Another check: 200 nickels × $0.05 = $10.00. The same rule scales to larger counts, for example, one billion nickels equal $50,000,000.',
    ],
    formula: '2,000 × $0.05 = $100.00',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Nickels to Dollars Calculator',
    paragraphs: [
      '1. Enter the number of nickels (whole numbers only for a physical coin count).',
      '2. View the dollar value instantly.',
      '3. Or enter a dollar amount to see the equivalent nickel units.',
      '4. If the dollar amount is not a multiple of five cents, review the whole-coin count and remainder explanation.',
      '5. Use Share Result to copy the answer.',
      '6. Use Reload Calculator or Clear All Changes to start over.',
      'Results update as you type; no separate submit step is required for the conversion.',
    ],
  },
  {
    id: 'how-many-nickels',
    title: 'How Many Nickels Make a Dollar?',
    paragraphs: [
      'A nickel is worth five cents. A dollar contains 100 cents. Dividing 100 by 5 gives 20. So 20 nickels make one U.S. dollar.',
      'Common equivalents: $1 = 20 nickels, $2 = 40, $5 = 100, $10 = 200, $20 = 400, $50 = 1,000, and $100 = 2,000 nickels.',
    ],
    formula: '100 ÷ 5 = 20 nickels per dollar',
  },
  {
    id: 'conversion-chart',
    title: 'Nickel Conversion Chart',
    paragraphs: [
      'Use this chart for common nickel counts and their dollar values. Physical coin counts are whole numbers; amounts that are not multiples of five cents leave a remainder that is not a full nickel.',
    ],
    tableHeaders: ['Nickels', 'Dollars'],
    table: [
      ['1', '$0.05'],
      ['2', '$0.10'],
      ['5', '$0.25'],
      ['10', '$0.50'],
      ['20', '$1.00'],
      ['50', '$2.50'],
      ['100', '$5.00'],
      ['200', '$10.00'],
      ['500', '$25.00'],
      ['1,000', '$50.00'],
      ['2,000', '$100.00'],
      ['10,000', '$500.00'],
      ['20,000', '$1,000.00'],
      ['100,000', '$5,000.00'],
      ['1,000,000', '$50,000.00'],
      ['1,000,000,000', '$50,000,000.00'],
    ],
  },
];

export const NICKELS_TO_DOLLARS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 1 Nickel to Dollars?',
    answer: 'One U.S. nickel is worth five cents. 1 × 0.05 = $0.05. Therefore, one nickel equals $0.05.',
  },
  {
    question: 'What Is 1 Billion Nickels in Dollars?',
    answer:
      '1,000,000,000 × 0.05 = 50,000,000. One billion nickels equal $50 million.',
  },
  {
    question: 'What Is a Nickel?',
    answer:
      'A nickel is a United States coin with a face value of five cents, or one-twentieth of a dollar. The term refers to its historical copper-nickel composition.',
  },
  {
    question: 'How Many Nickels Equal One Dollar?',
    answer: '20 nickels equal one dollar.',
  },
  {
    question: 'How Many Nickels Are in $10?',
    answer: '10 × 20 = 200. There are 200 nickels in $10.',
  },
  {
    question: 'How Many Dollars Are 500 Nickels?',
    answer: '500 × 0.05 = $25. 500 nickels equal $25.',
  },
  {
    question: 'How Much Are 2,000 Nickels Worth?',
    answer: '2,000 nickels are worth $100.',
  },
  {
    question: 'Can I Convert Dollars Back to Nickels?',
    answer:
      'Yes. Multiply the dollar amount by 20 to calculate equivalent nickel units. A physical coin count must be a whole number; amounts that are not multiples of five cents leave a remainder.',
  },
];
