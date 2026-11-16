import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CENTS_TO_DOLLARS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'cents-and-dollars', label: 'Cents and Dollars' },
  { id: 'cents-to-dollars', label: 'How to Convert Cents to Dollars' },
  { id: 'dollars-to-cents', label: 'How to Convert Dollars to Cents' },
  { id: 'how-to-use', label: 'How to Use the Cents to Dollars Calculator' },
  { id: 'coin-values', label: 'Common US Coin Values' },
  { id: 'practical-uses', label: 'Practical Uses of Cents to Dollars Conversion' },
  { id: 'reference-table', label: 'Cents to Dollars Conversion Table' },
  { id: 'cents-to-dollars-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const CENTS_TO_DOLLARS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'cents-and-dollars',
    title: 'Cents and Dollars',
    paragraphs: [
      'The US dollar is divided into 100 equal parts called cents. One cent is written 1¢ or $0.01. Everyday prices, coin counts, and many software money fields move between these two denominations of the same currency.',
      'This calculator converts cents and dollars within the US dollar system. It does not apply foreign exchange rates or convert to other currencies.',
    ],
    formula: '1 USD = 100 cents',
  },
  {
    id: 'cents-to-dollars',
    title: 'How to Convert Cents to Dollars',
    paragraphs: [
      'Divide cents by 100. That moves the decimal point two places to the left. Example: 375 ÷ 100 = $3.75. Another example: 1,250 ÷ 100 = $12.50.',
    ],
    formula: 'Dollars = Cents ÷ 100',
  },
  {
    id: 'dollars-to-cents',
    title: 'How to Convert Dollars to Cents',
    paragraphs: [
      'Multiply dollars by 100. That moves the decimal point two places to the right. Example: $24.75 × 100 = 2,475 cents.',
    ],
    formula: 'Cents = Dollars × 100',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Cents to Dollars Calculator',
    paragraphs: [
      '1. Enter an amount in the Cents field.',
      '2. The Dollars field updates automatically.',
      '3. Or enter an amount in Dollars — cents update immediately.',
      '4. Copy or share the result.',
      '5. Use Reload or Clear when you need a reset.',
      'Results update as you type; no form submission is required for the conversion.',
    ],
  },
  {
    id: 'coin-values',
    title: 'Common US Coin Values',
    paragraphs: [
      'US coins map directly to cents and dollars. Combining coins is just adding their cent values before converting to dollars.',
    ],
    tableHeaders: ['Coin', 'Cents', 'Dollars'],
    table: [
      ['Penny', '1¢', '$0.01'],
      ['Nickel', '5¢', '$0.05'],
      ['Dime', '10¢', '$0.10'],
      ['Quarter', '25¢', '$0.25'],
      ['Half dollar', '50¢', '$0.50'],
      ['Dollar coin', '100¢', '$1.00'],
    ],
  },
  {
    id: 'practical-uses',
    title: 'Practical Uses of Cents to Dollars Conversion',
    paragraphs: [
      'Use this conversion for shopping totals, budgeting, counting coins, teaching money, cash drawers, expense tracking, and interpreting amounts stored as integer cents in software.',
    ],
  },
  {
    id: 'reference-table',
    title: 'Cents to Dollars Conversion Table',
    paragraphs: ['Common equivalents:'],
    tableHeaders: ['Cents', 'Dollars'],
    table: [
      ['1¢', '$0.01'],
      ['5¢', '$0.05'],
      ['10¢', '$0.10'],
      ['25¢', '$0.25'],
      ['50¢', '$0.50'],
      ['75¢', '$0.75'],
      ['100¢', '$1.00'],
      ['250¢', '$2.50'],
      ['500¢', '$5.00'],
      ['1,000¢', '$10.00'],
      ['2,500¢', '$25.00'],
      ['5,000¢', '$50.00'],
      ['10,000¢', '$100.00'],
      ['100,000¢', '$1,000.00'],
    ],
  },
];

export const CENTS_TO_DOLLARS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Dollars to Cents?',
    answer: 'Multiply the dollar amount by 100. Example: $4.75 × 100 = 475 cents.',
  },
  {
    question: 'Is a Penny the Same as a Cent?',
    answer: 'Yes. In US currency, a penny is a coin worth one cent.',
  },
  {
    question: 'What Is 1000 Cents in Dollars?',
    answer: '1,000 cents equals $10.00. 1000 ÷ 100 = 10.',
  },
  {
    question: 'How Many Cents Are in One Dollar?',
    answer: 'There are 100 cents in one US dollar.',
  },
  {
    question: 'How Many Cents Are in 5 Dollars?',
    answer: 'Five dollars equals 500 cents.',
  },
  {
    question: 'What Is 250 Cents in Dollars?',
    answer: '250 cents equals $2.50.',
  },
  {
    question: 'How Much Is 50 Cents in Dollars?',
    answer: '50 cents equals $0.50.',
  },
  {
    question: 'How Many Cents Are in $12.75?',
    answer: '$12.75 equals 1,275 cents.',
  },
  {
    question: 'Can I Convert Cents to Dollars Without a Calculator?',
    answer: 'Yes. Divide the cents amount by 100.',
  },
  {
    question: 'Does This Calculator Convert Other Currencies?',
    answer:
      'No. This calculator converts between cents and dollars within the US dollar monetary system. It does not perform foreign exchange conversions.',
  },
];
