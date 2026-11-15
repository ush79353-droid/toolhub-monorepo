import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MILLION_THOUSAND_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'why-names', label: 'Why Use Number Names?' },
  { id: 'naming-systems', label: 'Short Scale vs Long Scale' },
  { id: 'conversion', label: 'Million ↔ Thousand Conversion' },
  { id: 'keep-in-mind', label: 'Keep These Numbers in Mind' },
  { id: 'conversion-table', label: 'Common Conversion Table' },
  { id: 'million-thousand-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
}

export const MILLION_THOUSAND_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'How to Use the Million to Thousand Converter',
    paragraphs: [
      'Enter a value in millions to see thousands and the absolute decimal number. Enter thousands to solve for millions, or type a full decimal (or scientific notation such as 1e6) to update both scaled fields. Copy or share the result, and reload to restore 1 million = 1,000 thousands = 1,000,000.',
      'Example: 4.5 million → 4,500 thousands → 4,500,000.',
    ],
  },
  {
    id: 'why-names',
    title: 'Why Do We Need Words to Represent Numbers?',
    paragraphs: [
      'Long digit strings are hard to scan. Names such as thousand, million, billion, and trillion compress magnitude for science, finance, statistics, population studies, and economics. The same quantity can be written as 1,000,000, as 1 million, or as 1,000 thousands.',
    ],
    formula: '1,000,000 = 1 million = 1,000 thousands',
  },
  {
    id: 'naming-systems',
    title: 'Common Number Naming Systems',
    paragraphs: [
      'Contemporary short scale uses thousand (10³), million (10⁶), billion (10⁹), trillion (10¹²), and quadrillion (10¹⁵). Traditional long scale keeps million at 10⁶ but uses milliard for 10⁹ and billion for 10¹². The words billion and trillion therefore differ between systems; one million remains 1,000,000 in both.',
    ],
    table: [
      { left: '1,000', right: 'Thousand', third: 'Thousand' },
      { left: '1,000,000', right: 'Million', third: 'Million' },
      { left: '1,000,000,000', right: 'Billion', third: 'Milliard' },
      { left: '1,000,000,000,000', right: 'Trillion', third: 'Billion' },
      { left: '1,000,000,000,000,000', right: 'Quadrillion', third: 'Billiard' },
    ],
    tableHeaders: ['Numerical Value', 'Short Scale', 'Traditional Long Scale'],
  },
  {
    id: 'conversion',
    title: 'Million to Thousand and Thousand to Million Conversion',
    paragraphs: [
      'Multiply millions by 1,000 to get thousands (3.5 × 1,000 = 3,500). Divide thousands by 1,000 to get millions (7,500 ÷ 1,000 = 7.5).',
    ],
    formula: 'Thousands = Millions × 1000 · Millions = Thousands ÷ 1000',
  },
  {
    id: 'keep-in-mind',
    title: 'Keep These Numbers in Mind',
    paragraphs: [
      'Useful anchors: 1 thousand = 1,000; 1 million = 1,000,000; 1 million = 1,000 thousands; 1 thousand = 0.001 million; 10 million = 10,000 thousands; 100 million = 100,000 thousands. In short scale, 1 billion = 1,000 million = 1,000,000 thousands. These relationships help when reading population figures, budgets, and statistical reports.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Common Conversion Table',
    paragraphs: ['Selected exact million ↔ thousand conversions:'],
    table: [
      { left: '0.001', right: '1' },
      { left: '0.01', right: '10' },
      { left: '0.1', right: '100' },
      { left: '0.25', right: '250' },
      { left: '0.5', right: '500' },
      { left: '1', right: '1,000' },
      { left: '1.5', right: '1,500' },
      { left: '2', right: '2,000' },
      { left: '2.5', right: '2,500' },
      { left: '5', right: '5,000' },
      { left: '10', right: '10,000' },
      { left: '25', right: '25,000' },
      { left: '50', right: '50,000' },
      { left: '100', right: '100,000' },
      { left: '1,000', right: '1,000,000' },
    ],
    tableHeaders: ['Millions', 'Thousands'],
  },
];

export const MILLION_THOUSAND_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert millions to thousands?',
    answer: 'Multiply the number of millions by 1,000. Example: 5 × 1,000 = 5,000, so 5 million = 5,000 thousand.',
  },
  {
    question: 'How do I convert thousands to millions?',
    answer: 'Divide the number of thousands by 1,000. Example: 2,500 ÷ 1,000 = 2.5 million.',
  },
  {
    question: 'How many thousands are in one million?',
    answer: 'There are exactly 1,000 thousands in one million.',
  },
  {
    question: 'How many thousands equal 1.5 million?',
    answer: '1.5 × 1,000 = 1,500 thousands.',
  },
  {
    question: 'How do I turn 100 thousand into millions?',
    answer: '100 ÷ 1,000 = 0.1 million.',
  },
  {
    question: 'Is 1 million equal to 10 lakh?',
    answer: 'Yes. 1 million = 10 lakh = 1,000,000.',
  },
  {
    question: 'How many thousands are in 10 million?',
    answer: '10 × 1,000 = 10,000 thousands.',
  },
  {
    question: 'What is 0.25 million in thousands?',
    answer: '0.25 × 1,000 = 250 thousands.',
  },
  {
    question: 'How many millions are in 50,000 thousands?',
    answer: '50,000 ÷ 1,000 = 50 million.',
  },
  {
    question: 'How do I write one million in scientific notation?',
    answer: '1 million = 1 × 10⁶.',
  },
];
