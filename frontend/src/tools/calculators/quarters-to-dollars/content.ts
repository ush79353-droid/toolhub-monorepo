import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUARTERS_TO_DOLLARS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to Use the Quarters to Dollars Calculator' },
  { id: 'quarters-to-dollars', label: 'How to Convert Quarters to Dollars' },
  { id: 'dollars-to-quarters', label: 'How to Convert Dollars to Quarters' },
  { id: 'conversion-table', label: 'Common Quarters to Dollars Conversion Table' },
  { id: 'quarters-to-dollars-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const QUARTERS_TO_DOLLARS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'How to Use the Quarters to Dollars Calculator',
    paragraphs: [
      '1. Enter the number of quarters (whole numbers for a physical coin count).',
      '2. Read the equivalent dollar amount instantly.',
      '3. Alternatively, enter a dollar amount.',
      '4. Read the equivalent number of quarters or quarter-equivalents.',
      '5. Use Share Result to copy the answer, or Reload / Clear All Changes to start over.',
      'Example: 16 quarters × $0.25 = $4.00. The calculator is useful for counting spare change, budgeting coin savings, and preparing standard $10 quarter rolls (40 quarters).',
    ],
    formula: '16 quarters × $0.25 = $4.00',
  },
  {
    id: 'quarters-to-dollars',
    title: 'How to Convert Quarters to Dollars',
    paragraphs: [
      'A U.S. quarter is worth 25 cents; one-fourth of a dollar. Divide the number of quarters by 4, or multiply by 0.25, to get the dollar value.',
      'Examples: 4 quarters = $1, 12 quarters = $3, 20 quarters = $5, 40 quarters = $10, 100 quarters = $25.',
    ],
    formula: 'Dollars = Quarters ÷ 4   ·   Dollars = Quarters × 0.25',
  },
  {
    id: 'dollars-to-quarters',
    title: 'How to Convert Dollars to Quarters',
    paragraphs: [
      'Multiply the dollar amount by 4 to get quarter-equivalents. Examples: $1 = 4 quarters, $5 = 20, $10 = 40, $25 = 100, $100 = 400.',
      'Only amounts that are multiples of $0.25 can be made with whole quarters alone. Other amounts show a fractional quarter-equivalent plus whole quarters and remaining cents.',
    ],
    formula: 'Quarters = Dollars × 4',
  },
  {
    id: 'conversion-table',
    title: 'Common Quarters to Dollars Conversion Table',
    paragraphs: [
      'Use this chart for common quarter counts and their dollar values. Physical coin counts are whole numbers.',
    ],
    tableHeaders: ['Quarters', 'Value in USD'],
    table: [
      ['1', '$0.25'],
      ['4', '$1.00'],
      ['8', '$2.00'],
      ['12', '$3.00'],
      ['16', '$4.00'],
      ['20', '$5.00'],
      ['40', '$10.00'],
      ['80', '$20.00'],
      ['100', '$25.00'],
      ['200', '$50.00'],
      ['400', '$100.00'],
    ],
  },
];

export const QUARTERS_TO_DOLLARS_FAQS: readonly FAQItem[] = [
  {
    question: 'How many quarters are in one dollar?',
    answer: 'There are four US quarters in one dollar.',
  },
  {
    question: 'How many quarters make 10 dollars?',
    answer: 'Forty quarters make $10.',
  },
  {
    question: 'Is a quarter equal to 25 cents?',
    answer: 'Yes. One US quarter equals 25 cents, or $0.25.',
  },
  {
    question: 'How many dollars are 100 quarters?',
    answer: 'One hundred quarters equal $25.',
  },
  {
    question: 'How many quarters are in 20 dollars?',
    answer: 'There are 80 quarters in $20.',
  },
  {
    question: 'How many quarters make 100 dollars?',
    answer: 'Four hundred quarters equal $100.',
  },
  {
    question: 'How much is a roll of quarters worth?',
    answer: 'A standard US quarter roll contains 40 quarters worth $10.',
  },
  {
    question: 'How many quarters are in $50?',
    answer: 'There are 200 quarters in $50.',
  },
  {
    question: 'Can every dollar amount be made using only quarters?',
    answer:
      'No. An exact amount must be divisible by $0.25. Other amounts require different denominations or leave a remainder.',
  },
];
