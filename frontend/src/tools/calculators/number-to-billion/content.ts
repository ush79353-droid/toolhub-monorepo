import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NUMBER_BILLION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'Convert Any Number to Billions' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'formula', label: 'Billion Conversion Formula' },
  { id: 'conversion-table', label: 'Number to Billion Table' },
  { id: 'million-trillion', label: 'Million, Billion, and Trillion' },
  { id: 'indian-system', label: 'Billion in the Indian System' },
  { id: 'number-billion-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
}

export const NUMBER_BILLION_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How to Convert Any Number to Billions',
    paragraphs: [
      'In the international short-scale system, one billion equals one thousand million, or 1,000,000,000 (10⁹). Expressing large counts in billions keeps population figures, budgets, and scientific totals readable.',
      'Divide the original number by 1,000,000,000. Example: 7,500,000,000 ÷ 1,000,000,000 = 7.5 billion. Other anchors: 500,000,000 = 0.5 billion; 2,250,000,000 = 2.25 billion; 12,000,000,000 = 12 billion.',
    ],
    formula: 'Billions = Number ÷ 1,000,000,000',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Number to Billion Converter',
    paragraphs: [
      'Enter a value in Number to see billions and scientific notation. Enter billions to expand back to the full number, or type scientific notation such as 1e9. Example: 8,750,000,000 → 8.75 billion → 8.75 × 10⁹.',
    ],
  },
  {
    id: 'formula',
    title: 'Billion Conversion Formula',
    paragraphs: [
      '1 billion = 1,000,000,000. Number to billions: divide by 1,000,000,000. Billions to number: multiply by 1,000,000,000. Example: 32,400,000,000 ÷ 1,000,000,000 = 32.4 billion. Reverse: 0.075 × 1,000,000,000 = 75,000,000.',
    ],
    formula:
      'Billions = Number / 1,000,000,000 · Number = Billions × 1,000,000,000',
  },
  {
    id: 'conversion-table',
    title: 'Number to Billion Conversion Table',
    paragraphs: ['Selected short-scale conversions:'],
    table: [
      { left: '1,000', right: '0.000001' },
      { left: '10,000', right: '0.00001' },
      { left: '100,000', right: '0.0001' },
      { left: '1,000,000', right: '0.001' },
      { left: '10,000,000', right: '0.01' },
      { left: '100,000,000', right: '0.1' },
      { left: '500,000,000', right: '0.5' },
      { left: '1,000,000,000', right: '1' },
      { left: '2,500,000,000', right: '2.5' },
      { left: '5,000,000,000', right: '5' },
      { left: '10,000,000,000', right: '10' },
      { left: '50,000,000,000', right: '50' },
      { left: '100,000,000,000', right: '100' },
      { left: '1,000,000,000,000', right: '1,000' },
    ],
    tableHeaders: ['Number', 'Billions'],
  },
  {
    id: 'million-trillion',
    title: 'Million, Billion, and Trillion Explained',
    paragraphs: [
      'Short-scale ladder: 1 million = 1,000,000; 1 billion = 1,000 million; 1 trillion = 1,000 billion. These units appear in population statistics, national budgets, economic data, and large-scale scientific measurements.',
    ],
    table: [
      { left: 'Thousand', right: '1,000', third: '10³' },
      { left: 'Million', right: '1,000,000', third: '10⁶' },
      { left: 'Billion', right: '1,000,000,000', third: '10⁹' },
      { left: 'Trillion', right: '1,000,000,000,000', third: '10¹²' },
      { left: 'Quadrillion', right: '1,000,000,000,000,000', third: '10¹⁵' },
    ],
    tableHeaders: ['Unit', 'Number', 'Scientific Notation'],
  },
  {
    id: 'indian-system',
    title: 'Billion in the Indian Numbering System',
    paragraphs: [
      'The same absolute value can be named with Indian units: 1 billion = 100 crore = 10,000 lakh; 1 crore = 0.01 billion; 1 lakh = 0.0001 billion. International grouping writes 1,000,000,000; Indian grouping writes 1,00,00,00,000. This calculator uses the short-scale definition of billion.',
    ],
  },
];

export const NUMBER_BILLION_FAQS: readonly FAQItem[] = [
  {
    question: 'How much is 5 billion?',
    answer: '5 billion = 5,000,000,000. Five billion is five thousand million.',
  },
  {
    question: 'How do I convert 100,000,000,000 to billions?',
    answer:
      'Divide by 1,000,000,000. 100,000,000,000 ÷ 1,000,000,000 = 100, so the result is 100 billion.',
  },
  {
    question: 'What does one billion equal?',
    answer: 'One billion equals 1,000,000,000, or 1,000 million, or 100 crore, or 10⁹.',
  },
  {
    question: 'How do I convert any number to billions?',
    answer: 'Divide the original number by 1,000,000,000. Billions = Number ÷ 1,000,000,000.',
  },
  {
    question: 'How many millions are in one billion?',
    answer: 'There are exactly 1,000 million in one billion.',
  },
  {
    question: 'How many billions are in one trillion?',
    answer: 'There are exactly 1,000 billion in one trillion.',
  },
  {
    question: 'How many crores are in one billion?',
    answer: 'One billion equals 100 crores.',
  },
  {
    question: 'What is 750 million in billions?',
    answer: '750,000,000 ÷ 1,000,000,000 = 0.75, so the answer is 0.75 billion.',
  },
  {
    question: 'Is one billion the same as one thousand million?',
    answer: 'Yes, in the international short-scale numbering system.',
  },
];
