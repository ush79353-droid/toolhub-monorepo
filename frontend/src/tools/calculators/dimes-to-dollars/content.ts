import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DIMES_TO_DOLLARS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'dimes-to-dollars', label: 'Dimes to Dollars' },
  { id: 'one-dime-to-dollars', label: 'One Dime to Dollars' },
  { id: 'how-to-use', label: 'How to Use the Dimes to Dollars Calculator' },
  { id: 'conversion-chart', label: 'Dimes to Dollars Conversion Chart' },
  { id: 'dimes-to-dollars-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const DIMES_TO_DOLLARS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'dimes-to-dollars',
    title: 'Dimes to Dollars',
    paragraphs: [
      'A dime is a United States coin with a face value of ten cents; one-tenth of a dollar. Among circulating U.S. coins, the modern dime is the smallest by physical diameter. Circulating dimes use a copper-nickel clad construction around a copper core.',
      'Because ten dimes equal one dollar, converting between dime counts and dollar amounts is useful for counting change, savings jars, classroom money math, cash drawers, and everyday cash calculations.',
      'This calculator converts between a count of dimes and U.S. dollars. It does not convert foreign currencies or other coin denominations.',
    ],
    formula: 'Dollars = Dimes ÷ 10   ·   Dollars = Dimes × 0.10   ·   Dimes = Dollars × 10',
  },
  {
    id: 'one-dime-to-dollars',
    title: 'One Dime to Dollars',
    paragraphs: [
      'One dime equals 10 cents, written as $0.10. That single-coin value scales cleanly for larger piles: multiply the number of dimes by 0.10, or divide by 10.',
      'For example, 200 dimes equal $20.00, and 2,000 dimes equal $200.00. Large collections convert the same way; keep the count exact and apply the fixed 10¢ face value rather than estimating by weight alone.',
    ],
    formula: '1 dime = 10¢ = $0.10   ·   75 dimes ÷ 10 = $7.50',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Dimes to Dollars Calculator',
    paragraphs: [
      '1. Enter the number of dimes (whole numbers only for a physical coin count).',
      '2. Read the automatically calculated dollar amount.',
      '3. Alternatively, enter a dollar amount.',
      '4. Read the equivalent number of dimes or dime-equivalents.',
      '5. Use the calculator for large quantities without manual counting.',
      '6. Use Share Result to copy the answer, or Reload / Clear All Changes to start over.',
      'Fractional dime-equivalents appear when a dollar amount is not divisible by 10 cents. That mathematical result is not a count of whole physical coins; the summary also shows whole dimes and remaining cents.',
    ],
  },
  {
    id: 'conversion-chart',
    title: 'Dimes to Dollars Conversion Chart',
    paragraphs: [
      'Use this chart for common dime counts and their dollar values. Physical coin counts are whole numbers; amounts that are not multiples of ten cents leave a remainder that is not a full dime.',
    ],
    tableHeaders: ['Number of Dimes', 'Dollar Value'],
    table: [
      ['1', '$0.10'],
      ['5', '$0.50'],
      ['10', '$1.00'],
      ['25', '$2.50'],
      ['50', '$5.00'],
      ['100', '$10.00'],
      ['250', '$25.00'],
      ['500', '$50.00'],
      ['1,000', '$100.00'],
      ['2,000', '$200.00'],
    ],
  },
];

export const DIMES_TO_DOLLARS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 1 Dime to Dollars?',
    answer: 'One dime equals 10 cents, or $0.10.',
  },
  {
    question: 'How Many Dimes Are in a Dollar?',
    answer: 'There are 10 dimes in one U.S. dollar.',
  },
  {
    question: 'How Much Are 100 Dimes Worth?',
    answer: '100 dimes are worth $10.00.',
  },
  {
    question: 'How Much Are 2000 Dimes Worth?',
    answer: '2000 dimes are worth $200.00.',
  },
  {
    question: 'How Many Dimes Make $20?',
    answer: 'There are 200 dimes in $20.',
  },
  {
    question: 'What Is a Dime?',
    answer:
      'A dime is a U.S. coin worth one-tenth of a dollar, or 10 cents. Modern circulating dimes use copper-nickel clad construction and are the smallest circulating U.S. coin by diameter.',
  },
  {
    question: 'Can I Convert Dollars Back to Dimes?',
    answer:
      'Yes. Multiply the dollar value by 10 to obtain the number of dime-equivalents. If the amount is not a multiple of $0.10, the result may be fractional; that is a mathematical equivalent, not a count of whole physical dimes. The calculator also shows whole dimes and remaining cents.',
  },
];
