import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CRORE_MILLION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'overview', label: 'Crore and Million Converter' },
  { id: 'how-to-convert', label: 'How to Convert Crore to Million' },
  { id: 'what-is-crore', label: 'What Is a Crore?' },
  { id: 'place-value', label: 'Place-Value Systems' },
  { id: 'conversion-table', label: 'Crore to Million Table' },
  { id: 'crore-million-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
}

export const CRORE_MILLION_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'overview',
    title: 'Crore to Million Converter',
    paragraphs: [
      'Crore is widely used in the Indian numbering system across South Asia, while million is the international short-scale unit. Both name the same kind of quantity, only the scale label changes, so converting between them helps when reading finance, population, budgets, and business reports.',
      'Enter either crores or millions and the other field updates instantly. Useful anchors: 10 million = 1 crore; 25 million = 2.5 crore; 100 million = 10 crore; 500 million = 50 crore.',
    ],
    formula: '1 crore = 10 million = 10,000,000',
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Crore to Million',
    paragraphs: [
      'Multiply crores by 10. Example: 4.5 × 10 = 45 million. Another: 12.75 × 10 = 127.5 million. Reverse: divide millions by 10 (85 ÷ 10 = 8.5 crore).',
    ],
    formula: 'Millions = Crores × 10 · Crores = Millions ÷ 10',
  },
  {
    id: 'what-is-crore',
    title: 'What Is a Crore? Crore Definition',
    paragraphs: [
      'A crore is ten million: 1 crore = 10,000,000 = 100 lakh = 10 million = 0.01 billion (short scale). Indian grouping writes 1,00,00,000; international grouping writes 10,000,000. Crores often appear in large financial figures, government budgets, property prices, company valuations, and population statistics.',
    ],
    formula: '1 crore = 10,000,000 = 100 lakh = 10 million',
  },
  {
    id: 'place-value',
    title: 'Place-Value System',
    paragraphs: [
      'Indian and international systems name the same absolute values with different digit grouping. International: 1,234,567,890. Indian: 1,23,45,67,890. Switching labels matters when comparing financial statements and international reports.',
    ],
    table: [
      { left: '1,000', right: 'Thousand', third: 'Thousand' },
      { left: '10,000', right: 'Ten thousand', third: 'Ten thousand' },
      { left: '100,000', right: 'One lakh', third: 'One hundred thousand' },
      { left: '1,000,000', right: 'Ten lakh', third: 'One million' },
      { left: '10,000,000', right: 'One crore', third: 'Ten million' },
      { left: '100,000,000', right: 'Ten crore', third: 'One hundred million' },
      { left: '1,000,000,000', right: 'One hundred crore', third: 'One billion' },
      { left: '10,000,000,000', right: 'One thousand crore', third: 'Ten billion' },
    ],
    tableHeaders: ['Numerical Value', 'Indian System', 'International System'],
  },
  {
    id: 'conversion-table',
    title: 'Crore to Million Conversion Table',
    paragraphs: [
      'Selected exact conversions. The factor is always ×10 from crore to million.',
    ],
    table: [
      { left: '0.1', right: '1' },
      { left: '0.5', right: '5' },
      { left: '1', right: '10' },
      { left: '2', right: '20' },
      { left: '5', right: '50' },
      { left: '10', right: '100' },
      { left: '20', right: '200' },
      { left: '25', right: '250' },
      { left: '50', right: '500' },
      { left: '75', right: '750' },
      { left: '100', right: '1,000' },
      { left: '500', right: '5,000' },
      { left: '1,000', right: '10,000' },
    ],
    tableHeaders: ['Crore', 'Million'],
  },
];

export const CRORE_MILLION_FAQS: readonly FAQItem[] = [
  {
    question: 'How many millions are in 1 crore?',
    answer: 'There are exactly 10 million in 1 crore. 1 crore = 10 million.',
  },
  {
    question: 'What is the ratio of crore to million?',
    answer:
      'The ratio is 1 crore : 10 million. Multiply crores by 10 to get millions; divide millions by 10 to get crores.',
  },
  {
    question: 'How many zeros are there in 1 crore?',
    answer: 'One crore has seven zeros: 1 crore = 10,000,000.',
  },
  {
    question: 'Can I convert million to crore?',
    answer: 'Yes. Crores = Millions ÷ 10. Example: 120 million ÷ 10 = 12 crore.',
  },
  {
    question: 'How many crores are in 1 billion?',
    answer: 'One billion equals 100 crore. 1,000,000,000 ÷ 10,000,000 = 100.',
  },
  {
    question: 'How many millions are in 25 crore?',
    answer: '25 × 10 = 250 million.',
  },
  {
    question: 'What is 100 million in crore?',
    answer: '100 ÷ 10 = 10 crore.',
  },
  {
    question: 'Is 1 crore equal to 100 million?',
    answer: 'No. 1 crore = 10 million, and 10 crore = 100 million.',
  },
  {
    question: 'What is 2.7 crore in million?',
    answer: '2.7 × 10 = 27 million.',
  },
];
