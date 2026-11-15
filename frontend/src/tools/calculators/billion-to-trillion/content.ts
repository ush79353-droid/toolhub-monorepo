import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BILLION_TRILLION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'billions-in-trillion', label: 'How Many Billions Equal a Trillion?' },
  { id: 'trillion-to-billion', label: 'One Trillion in Billions' },
  { id: 'zeros', label: 'How Many Zeros?' },
  { id: 'conversion-table', label: 'Large Number Conversion Table' },
  { id: 'billion-to-trillion', label: 'Convert Billion to Trillion' },
  { id: 'trillion-to-billion-how', label: 'Convert Trillion to Billion' },
  { id: 'standard-form', label: 'Numbers in Standard Form' },
  { id: 'short-vs-long', label: 'Short Scale vs Long Scale' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'billion-trillion-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
}

export const BILLION_TRILLION_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'A billion and a trillion are named large numbers used in finance, demographics, science, and everyday reporting. This converter translates between billions and trillions using the modern short-scale system and shows the same absolute value in scientific notation.',
      'In short scale, one billion is one thousand million (10⁹) and one trillion is one thousand billion (10¹²). Scientific notation keeps very large absolute counts readable.',
    ],
  },
  {
    id: 'billions-in-trillion',
    title: 'How Many Billions Equal a Trillion?',
    paragraphs: [
      'Exactly 1,000 billions equal one trillion, because 1,000,000,000,000 ÷ 1,000,000,000 = 1,000. This calculator uses that short-scale relationship throughout.',
    ],
    formula: '1 trillion = 1,000 billion = 10¹²',
  },
  {
    id: 'trillion-to-billion',
    title: 'One Trillion Is Equal to How Many Billion?',
    paragraphs: [
      'One trillion equals 1,000 billion. Half a trillion is 500 billion, two trillion is 2,000 billion, and ten trillion is 10,000 billion.',
    ],
  },
  {
    id: 'zeros',
    title: 'How Many Zeros Are in a Billion and Trillion?',
    paragraphs: [
      'In short-scale notation, one million (10⁶) has six zeros, one billion (10⁹) has nine zeros, and one trillion (10¹²) has twelve zeros. Each step up the short-scale ladder multiplies by one thousand.',
    ],
    formula: 'Million 10⁶ · Billion 10⁹ · Trillion 10¹²',
  },
  {
    id: 'conversion-table',
    title: 'Large Number Conversion Table',
    paragraphs: ['Short-scale names with standard and scientific forms:'],
    table: [
      { left: 'Million', right: '1,000,000', third: '10⁶' },
      { left: 'Ten Million', right: '10,000,000', third: '10⁷' },
      { left: 'Hundred Million', right: '100,000,000', third: '10⁸' },
      { left: 'Billion', right: '1,000,000,000', third: '10⁹' },
      { left: 'Ten Billion', right: '10,000,000,000', third: '10¹⁰' },
      { left: 'Hundred Billion', right: '100,000,000,000', third: '10¹¹' },
      { left: 'Trillion', right: '1,000,000,000,000', third: '10¹²' },
      { left: 'Ten Trillion', right: '10,000,000,000,000', third: '10¹³' },
      { left: 'Hundred Trillion', right: '100,000,000,000,000', third: '10¹⁴' },
      { left: 'Quadrillion', right: '1,000,000,000,000,000', third: '10¹⁵' },
    ],
    tableHeaders: ['Number Name', 'Standard Number', 'Scientific Notation'],
  },
  {
    id: 'billion-to-trillion',
    title: 'How to Convert Billion to Trillion',
    paragraphs: [
      'Divide the number of billions by 1,000. Example: 500 billion ÷ 1,000 = 0.5 trillion. Another: 2,500 billion ÷ 1,000 = 2.5 trillion.',
    ],
    formula: 'Trillion = Billion / 1000',
  },
  {
    id: 'trillion-to-billion-how',
    title: 'How to Convert Trillion to Billion',
    paragraphs: [
      'Multiply the number of trillions by 1,000. Example: 3 trillion × 1,000 = 3,000 billion.',
    ],
    formula: 'Billion = Trillion × 1000',
  },
  {
    id: 'standard-form',
    title: 'How to Convert Numbers to Standard Form',
    paragraphs: [
      'Standard form (scientific notation) writes a number as a mantissa times a power of ten, with 1 ≤ |mantissa| < 10 for nonzero values. Examples: 1,000,000,000 = 1 × 10⁹; 1,000,000,000,000 = 1 × 10¹²; 2,500,000,000,000 = 2.5 × 10¹².',
      'Positive exponents mark large absolute values; negative exponents mark fractions of one.',
    ],
  },
  {
    id: 'short-vs-long',
    title: 'Short Scale vs Long Scale',
    paragraphs: [
      'Large-number names are not universal. This tool uses short-scale definitions: billion = 10⁹ and trillion = 10¹². Some languages and older long-scale conventions assign different magnitudes to the same words, so always confirm the naming system when comparing international sources.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Billion and trillion conversions appear in national budgets, economic reporting, market capitalization summaries, population and demographic statistics, scientific measurements, astronomy orders of magnitude, large datasets, and business dashboards that mix named large units.',
    ],
  },
];

export const BILLION_TRILLION_FAQS: readonly FAQItem[] = [
  {
    question: 'What is a billion?',
    answer:
      'In the short-scale system, a billion equals one thousand million, or 10⁹.',
  },
  {
    question: 'What is a trillion?',
    answer:
      'In the short-scale system, a trillion equals one thousand billion, or 10¹².',
  },
  {
    question: 'How many billions are in one trillion?',
    answer: 'There are exactly 1000 billions in one trillion.',
  },
  {
    question: 'How many trillions are in one billion?',
    answer: 'One billion equals 0.001 trillion.',
  },
  {
    question: 'How do I convert billion to trillion?',
    answer: 'Divide the number of billions by 1000.',
  },
  {
    question: 'How do I convert trillion to billion?',
    answer: 'Multiply the number of trillions by 1000.',
  },
  {
    question: 'Is 500 billion half a trillion?',
    answer: 'Yes. 500 billion equals 0.5 trillion because 500 ÷ 1000 = 0.5.',
  },
  {
    question: 'Is 100 billion equal to one trillion?',
    answer: 'No. 100 billion equals 0.1 trillion.',
  },
  {
    question: 'How many zeros are in a billion?',
    answer: 'A billion has nine zeros in the short-scale system.',
  },
  {
    question: 'How many zeros are in a trillion?',
    answer: 'A trillion has twelve zeros in the short-scale system.',
  },
  {
    question: 'What is one trillion in scientific notation?',
    answer: 'One trillion is 1 × 10¹².',
  },
  {
    question: 'What is 1.5 trillion in billions?',
    answer: '1.5 trillion equals 1500 billion.',
  },
  {
    question: 'What is 250 billion in trillions?',
    answer: '250 billion equals 0.25 trillion.',
  },
  {
    question: 'What is 50 billion in trillions?',
    answer: '50 billion equals 0.05 trillion.',
  },
  {
    question: 'Is a trillion a thousand times larger than a billion?',
    answer: 'Yes, in the short-scale numbering system.',
  },
  {
    question: 'What is the difference between a million, billion, and trillion?',
    answer:
      'Each successive short-scale name is 1000 times the previous one: million 10⁶, billion 10⁹, trillion 10¹².',
  },
];
