import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const CRORE_LAKH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'overview', label: 'Crore to Lakh Converter' },
  { id: 'indian-system', label: 'Crore and the Indian Numbering System' },
  { id: 'crore-to-lakh', label: 'Convert Crore to Lakh' },
  { id: 'lakh-to-crore', label: 'Convert Lakh to Crore' },
  { id: 'conversion-table', label: 'Crore to Lakh Table' },
  { id: 'comparison', label: 'Crore, Lakh, Million, Billion' },
  { id: 'crore-lakh-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string }[];
  tableHeaders?: readonly [string, string];
}

export const CRORE_LAKH_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'overview',
    title: 'Crore to Lakh Converter',
    paragraphs: [
      'This calculator converts between crores and lakhs—Indian numbering units used for budgets, population figures, property values, and business reports. Enter either field and the other updates instantly.',
      'The fixed relationship is 1 crore = 100 lakh. Examples: 2 crore = 200 lakh; 3.5 crore = 350 lakh.',
    ],
    formula: '1 crore = 100 lakh = 10,000,000',
  },
  {
    id: 'indian-system',
    title: 'What Is Crore? The Indian Numbering System',
    paragraphs: [
      'The Indian numbering system is common in India, Pakistan, Bangladesh, Nepal, and related South Asian contexts. One crore equals ten million (10,000,000), written 1,00,00,000 with Indian grouping. One lakh equals one hundred thousand (100,000), written 1,00,000.',
      'Further anchors: 1 crore = 100 lakh; 10 crore = 1,000 lakh; 100 crore = 10,000 lakh. Digits for 2, 5, and 10 crore are 2,00,00,000; 5,00,00,000; and 10,00,00,000.',
    ],
    formula: '1 crore = 10,000,000 · 1 lakh = 100,000',
  },
  {
    id: 'crore-to-lakh',
    title: 'How to Convert Crore to Lakh',
    paragraphs: [
      'Multiply crores by 100. Examples: 4.8 × 100 = 480 lakh; 0.75 × 100 = 75 lakh; 12.5 × 100 = 1,250 lakh. Steps: enter crores, multiply by 100, read lakhs.',
    ],
    formula: 'Lakhs = Crores × 100',
  },
  {
    id: 'lakh-to-crore',
    title: 'How to Convert Lakh to Crore',
    paragraphs: [
      'Divide lakhs by 100. Examples: 100 lakh = 1 crore; 250 lakh = 2.5 crore; 750 lakh = 7.5 crore; 1,250 lakh = 12.5 crore. Steps: enter lakhs, divide by 100, read crores.',
    ],
    formula: 'Crores = Lakhs ÷ 100',
  },
  {
    id: 'conversion-table',
    title: 'Crore to Lakh Conversion Table',
    paragraphs: ['Selected exact conversions:'],
    table: [
      { left: '0.01', right: '1' },
      { left: '0.1', right: '10' },
      { left: '0.25', right: '25' },
      { left: '0.5', right: '50' },
      { left: '1', right: '100' },
      { left: '1.5', right: '150' },
      { left: '2', right: '200' },
      { left: '2.7', right: '270' },
      { left: '3', right: '300' },
      { left: '5', right: '500' },
      { left: '10', right: '1,000' },
      { left: '25', right: '2,500' },
      { left: '50', right: '5,000' },
      { left: '100', right: '10,000' },
    ],
    tableHeaders: ['Crore', 'Lakh'],
  },
  {
    id: 'comparison',
    title: 'Crore, Lakh, Million, and Billion Comparison',
    paragraphs: [
      'Indian and international (short-scale) names describe the same absolute values with different grouping. Digits do not change when the label changes.',
    ],
    table: [
      { left: '1 lakh', right: '100 thousand' },
      { left: '10 lakh', right: '1 million' },
      { left: '1 crore', right: '10 million' },
      { left: '10 crore', right: '100 million' },
      { left: '100 crore', right: '1 billion (short scale)' },
      { left: '1,000 crore', right: '10 billion (short scale)' },
    ],
    tableHeaders: ['Indian Number', 'International Equivalent'],
  },
];

export const CRORE_LAKH_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the definition of crore?',
    answer:
      'A crore is a number unit equal to ten million, or 10,000,000. In the Indian numbering system, it is written as 1,00,00,000.',
  },
  {
    question: 'What is the ratio of crore to lakh?',
    answer: 'The ratio is 1 crore : 100 lakh. One crore contains 100 lakhs.',
  },
  {
    question: 'What does 1 lakh mean?',
    answer: 'One lakh equals 100,000, or one hundred thousand. It can also be expressed as 1 lakh = 0.01 crore.',
  },
  {
    question: 'How many lakhs are there in 2.7 crore?',
    answer: '2.7 × 100 = 270 lakh.',
  },
  {
    question: 'How many crores are in 500 lakh?',
    answer: '500 ÷ 100 = 5 crore.',
  },
  {
    question: 'How many lakhs are there in 1 crore?',
    answer: 'There are exactly 100 lakhs in one crore.',
  },
  {
    question: 'Is 1 crore equal to 10 million?',
    answer: 'Yes. 1 crore = 10 million = 10,000,000.',
  },
  {
    question: 'How many crores are in 1 billion?',
    answer: 'Using the short-scale billion: 1 billion = 100 crore.',
  },
  {
    question: 'What is 0.5 crore in lakhs?',
    answer: '0.5 × 100 = 50 lakh.',
  },
];
