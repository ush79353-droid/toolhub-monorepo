import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const NUMBER_MILLION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-million', label: 'What Does One Million Equal?' },
  { id: 'how-to-use', label: 'Using the Converter' },
  { id: 'formula', label: 'Million Conversion Formula' },
  { id: 'how-to-convert', label: 'How to Convert a Number to Million' },
  { id: 'example-500k', label: "Convert 500,000 to Million" },
  { id: 'conversion-table', label: 'Number to Million Table' },
  { id: 'number-million-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string }[];
  tableHeaders?: readonly [string, string];
}

export const NUMBER_MILLION_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-million',
    title: 'What Does One Million Equal?',
    paragraphs: [
      'One million is one thousand thousand: 1,000,000, or 10⁶. Related anchors: 1 million = 10 lakh = 1,000 thousand = 0.001 billion (short scale). Millions appear in population statistics, business reports, finance, and scientific measurements.',
      'International grouping writes 1,000,000 as one million. In the Indian system the same absolute value is ten lakh, written 10,00,000.',
    ],
    formula: '1 million = 1,000,000 = 10 lakh = 10⁶',
  },
  {
    id: 'how-to-use',
    title: 'Using the Number to Million Converter',
    paragraphs: [
      'Enter a value in Number to divide by 1,000,000 and read Million(s). Or enter millions to expand back to the full number. Example: 7,500,000 ÷ 1,000,000 = 7.5 million. The tool works in both directions.',
    ],
  },
  {
    id: 'formula',
    title: 'Million Conversion Formula',
    paragraphs: [
      'Millions = Number ÷ 1,000,000. Reverse: Number = Millions × 1,000,000. Example: 24,000,000 ÷ 1,000,000 = 24 million. Reverse: 3.75 × 1,000,000 = 3,750,000. Division by one million moves the decimal point six places left.',
    ],
    formula: 'Millions = Number / 1,000,000 · Number = Millions × 1,000,000',
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert a Number to Million',
    paragraphs: [
      'Convert 36,500,000 into millions: identify the number, divide by 1,000,000 (36,500,000 ÷ 1,000,000 = 36.5), then express the result as 36.5 million. Converting to millions makes large values easier to scan.',
    ],
  },
  {
    id: 'example-500k',
    title: "Let's Convert 500,000 to Million",
    paragraphs: [
      '500,000 ÷ 1,000,000 = 0.5, so 500,000 = 0.5 million. Values below one million produce decimals. More examples: 250,000 = 0.25 million; 750,000 = 0.75 million; 125,000 = 0.125 million.',
    ],
    formula: '500,000 = 0.5 million',
  },
  {
    id: 'conversion-table',
    title: 'Number to Million Conversion Table',
    paragraphs: ['Selected short-scale conversions:'],
    table: [
      { left: '1,000', right: '0.001' },
      { left: '10,000', right: '0.01' },
      { left: '50,000', right: '0.05' },
      { left: '100,000', right: '0.1' },
      { left: '250,000', right: '0.25' },
      { left: '500,000', right: '0.5' },
      { left: '750,000', right: '0.75' },
      { left: '1,000,000', right: '1' },
      { left: '2,500,000', right: '2.5' },
      { left: '5,000,000', right: '5' },
      { left: '10,000,000', right: '10' },
      { left: '25,000,000', right: '25' },
      { left: '50,000,000', right: '50' },
      { left: '100,000,000', right: '100' },
      { left: '1,000,000,000', right: '1,000' },
    ],
    tableHeaders: ['Number', 'Millions'],
  },
];

export const NUMBER_MILLION_FAQS: readonly FAQItem[] = [
  {
    question: 'How much is 2 million?',
    answer: '2 million = 2,000,000. Two million contains six zeros after the digit 2.',
  },
  {
    question: 'How can I write a number in millions?',
    answer: 'Divide the original number by 1,000,000. Example: 8,500,000 ÷ 1,000,000 = 8.5 million.',
  },
  {
    question: 'How much is 3,500,000 in millions?',
    answer: '3,500,000 ÷ 1,000,000 = 3.5 million.',
  },
  {
    question: 'Can I convert any number to a million?',
    answer:
      'Yes. Divide any finite numerical value by 1,000,000. Example: 75,000 ÷ 1,000,000 = 0.075 million.',
  },
  {
    question: 'How is 1,500,000 written in millions?',
    answer: '1,500,000 = 1.5 million.',
  },
  {
    question: 'How many zeros are in one million?',
    answer: 'One million contains six zeros: 1,000,000.',
  },
  {
    question: 'Is 10 lakh equal to 1 million?',
    answer: 'Yes. 10 lakh = 1,000,000 = 1 million.',
  },
  {
    question: 'What is 100 million in numbers?',
    answer: '100 million = 100,000,000.',
  },
  {
    question: 'How many millions are in one billion?',
    answer: '1 billion = 1,000 million.',
  },
];
