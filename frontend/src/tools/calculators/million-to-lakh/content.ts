import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const MILLION_LAKH_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'why-convert', label: 'Why Convert Millions to Lakhs?' },
  { id: 'what-is-lakh', label: 'What Is a Lakh?' },
  { id: 'place-value', label: 'Place Value Systems' },
  { id: 'million-to-lakh', label: 'Convert Million to Lakh' },
  { id: 'lakh-to-million', label: 'Convert Lakh to Million' },
  { id: 'conversion-table', label: 'Million to Lakh Table' },
  { id: 'related-units', label: 'Lakh, Crore, Million, Billion' },
  { id: 'applications', label: 'Real-World Applications' },
  { id: 'million-lakh-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
}

export const MILLION_LAKH_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'why-convert',
    title: 'Why Convert Millions to Lakhs?',
    paragraphs: [
      'International reports often use millions, while many South Asian contexts use lakhs and crores. Converting between them keeps financial statements, budgets, and population figures comparable without changing the underlying quantity.',
      'Because 1 million equals 10 lakh, the conversion is an exact factor of ten—useful when teams share numbers across numbering systems.',
    ],
  },
  {
    id: 'what-is-lakh',
    title: 'What Is a Lakh?',
    paragraphs: [
      'One lakh equals 100,000. In Indian grouping it is written 1,00,000; internationally it is 100,000. Lakh names a quantity, not a currency. The term is widely used in India, Pakistan, Bangladesh, Nepal, and related reporting contexts.',
    ],
    formula: '1 lakh = 100,000 = 0.1 million',
  },
  {
    id: 'place-value',
    title: 'Place Value Systems',
    paragraphs: [
      'The international system groups digits in threes. The Indian system groups the last three digits, then pairs. The same absolute value therefore shows different comma patterns.',
    ],
    table: [
      { left: 'One', right: 'One', third: '1' },
      { left: 'Ten', right: 'Ten', third: '10' },
      { left: 'Hundred', right: 'Hundred', third: '100' },
      { left: 'Thousand', right: 'Thousand', third: '1,000' },
      { left: 'Ten Thousand', right: 'Ten Thousand', third: '10,000' },
      { left: 'Hundred Thousand', right: 'One Lakh', third: '100,000' },
      { left: 'One Million', right: 'Ten Lakh', third: '1,000,000' },
      { left: 'Ten Million', right: 'One Crore', third: '10,000,000' },
      { left: 'Hundred Million', right: 'Ten Crore', third: '100,000,000' },
      { left: 'One Billion', right: 'One Hundred Crore', third: '1,000,000,000' },
    ],
    tableHeaders: ['International System', 'Indian System', 'Value'],
  },
  {
    id: 'million-to-lakh',
    title: 'How to Convert Million to Lakh?',
    paragraphs: [
      'Multiply the million value by 10. Example: 5 million × 10 = 50 lakh.',
    ],
    formula: 'Lakh = Million × 10',
  },
  {
    id: 'lakh-to-million',
    title: 'How to Convert Lakh to Million?',
    paragraphs: [
      'Divide the lakh value by 10. Example: 75 lakh ÷ 10 = 7.5 million.',
    ],
    formula: 'Million = Lakh / 10',
  },
  {
    id: 'conversion-table',
    title: 'Million to Lakh Conversion Table',
    paragraphs: ['Selected exact conversions:'],
    table: [
      { left: '0.1', right: '1' },
      { left: '0.5', right: '5' },
      { left: '1', right: '10' },
      { left: '2', right: '20' },
      { left: '2.5', right: '25' },
      { left: '5', right: '50' },
      { left: '7.5', right: '75' },
      { left: '10', right: '100' },
      { left: '20', right: '200' },
      { left: '50', right: '500' },
      { left: '100', right: '1,000' },
      { left: '1,000', right: '10,000' },
    ],
    tableHeaders: ['Million', 'Lakh'],
  },
  {
    id: 'related-units',
    title: 'Lakh, Crore, Million, and Billion',
    paragraphs: [
      'Related short facts: 1 lakh = 100,000; 10 lakh = 1 million; 100 lakh = 1 crore; 1 crore = 10 million; 100 crore = 1 billion (short scale).',
    ],
  },
  {
    id: 'applications',
    title: 'Real-World Applications',
    paragraphs: [
      'Use million↔lakh conversion for business reporting, financial statements, population figures, property listings, government budgets, investment summaries, cross-border communication, and data analysis that mixes international and Indian numbering styles.',
    ],
  },
];

export const MILLION_LAKH_FAQS: readonly FAQItem[] = [
  {
    question: 'How many lakhs are in one million?',
    answer: 'One million equals 10 lakh.',
  },
  {
    question: 'What is one lakh in millions?',
    answer: 'One lakh equals 0.1 million.',
  },
  {
    question: 'Is 10 lakh equal to 1 million?',
    answer: 'Yes. Ten lakh equals one million.',
  },
  {
    question: 'How many lakhs are in 20 million?',
    answer: '20 million equals 200 lakh.',
  },
  {
    question: 'What is 50 lakh in million?',
    answer: '50 lakh equals 5 million.',
  },
  {
    question: 'What is 25 lakh in million?',
    answer: '25 lakh equals 2.5 million.',
  },
  {
    question: 'How much is 1 lakh?',
    answer: 'One lakh equals 100,000.',
  },
  {
    question: 'Is 1 lakh the same as 100 thousand?',
    answer: 'Yes. Both represent 100,000.',
  },
  {
    question: 'How many zeros are in a lakh?',
    answer: 'One lakh is 100,000 and contains five zeros.',
  },
  {
    question: 'How many zeros are in a million?',
    answer: 'One million is 1,000,000 and contains six zeros.',
  },
  {
    question: 'What is the difference between a lakh and a million?',
    answer: 'A million is ten times larger than a lakh.',
  },
  {
    question: 'How many lakh make one crore?',
    answer: '100 lakh equals one crore.',
  },
  {
    question: 'How many million make one crore?',
    answer: '10 million equals one crore.',
  },
  {
    question: 'Is 100 lakh equal to one crore?',
    answer: 'Yes.',
  },
  {
    question: 'How do I convert million to lakh?',
    answer: 'Multiply the million value by 10.',
  },
  {
    question: 'How do I convert lakh to million?',
    answer: 'Divide the lakh value by 10.',
  },
];
