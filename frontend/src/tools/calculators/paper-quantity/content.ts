import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PAPER_QUANTITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'sheets-in-ream', label: 'How Many Sheets of Paper Are in a Ream?' },
  { id: 'sheets-in-quire', label: 'How Many Sheets Are in a Quire?' },
  { id: 'conversion-table', label: 'Paper Quantity Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the Paper Quantity Converter' },
  { id: 'reams-to-sheets', label: 'How to Convert Reams to Sheets' },
  { id: 'sheets-to-reams', label: 'How to Convert Sheets to Reams' },
  { id: 'bundles-bales', label: 'How to Convert Bundles and Bales' },
  { id: 'applications', label: 'Applications of Paper Quantity Conversion' },
  { id: 'paper-quantity-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const PAPER_QUANTITY_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'sheets-in-ream',
    title: 'How Many Sheets of Paper Are in a Ream?',
    paragraphs: [
      'A modern standard ream commonly contains 500 sheets. That is the default used by this converter.',
      'Other conventions exist. A short ream is often defined as 480 sheets. Historical and specialty packaging can differ by product line or region. These are paper-count conventions — they do not describe paper thickness, basis weight, or sheet size.',
    ],
    formula: '1 modern ream = 500 sheets · 1 short ream = 480 sheets (not used as this calculator’s default)',
  },
  {
    id: 'sheets-in-quire',
    title: 'How Many Sheets Are in a Quire?',
    paragraphs: [
      'Under the modern convention used here, one quire contains 25 sheets. Twenty quires make one 500-sheet ream.',
      'Historical or regional quire definitions may differ. This calculator does not mix those definitions with the modern 500-sheet system.',
    ],
    formula: '1 quire = 25 sheets · 20 quires = 500 sheets = 1 ream',
  },
  {
    id: 'conversion-table',
    title: 'Paper Quantity Conversion Table',
    paragraphs: [
      'Quick reference for the modern standard (500 sheets per ream, 25 sheets per quire):',
    ],
    tableHeaders: ['Quantity', 'Sheets', 'Quires', 'Reams'],
    table: [
      ['1 quire', '25', '1', '0.05'],
      ['1 ream', '500', '20', '1'],
      ['1 bundle', '1,000', '40', '2'],
      ['1 bale', '5,000', '200', '10'],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Paper Quantity Converter',
    paragraphs: [
      '1. Find the unit you already know (sheets, quires, reams, bundles, or bales).',
      '2. Enter the paper quantity in that field.',
      '3. Read the calculated values in the remaining fields.',
      '4. Edit any other field to reverse the conversion.',
      '5. Use Share Result to copy the answer, or Reload / Clear to start over.',
      'This converter uses the modern 500-sheet ream standard. Specialty short-ream packaging is described in the article but is not mixed into the default math.',
    ],
  },
  {
    id: 'reams-to-sheets',
    title: 'How to Convert Reams to Sheets',
    paragraphs: [
      'Multiply the number of reams by 500 under the modern standard. Example: 3 reams × 500 = 1,500 sheets.',
    ],
    formula: 'Sheets = Reams × 500',
  },
  {
    id: 'sheets-to-reams',
    title: 'How to Convert Sheets to Reams',
    paragraphs: [
      'Divide the number of sheets by 500. Example: 1,250 ÷ 500 = 2.5 reams. Fractional reams are valid mathematical results even when physical packs are whole.',
    ],
    formula: 'Reams = Sheets ÷ 500',
  },
  {
    id: 'bundles-bales',
    title: 'How to Convert Bundles and Bales',
    paragraphs: [
      'Under this calculator’s default convention: 1 bundle = 1,000 sheets (2 reams); 1 bale = 5,000 sheets (5 bundles or 10 reams).',
      'Commercial packaging from suppliers may differ. Always confirm packing counts for purchasing contracts.',
    ],
    formula: '1 bundle = 1,000 sheets · 1 bale = 5,000 sheets = 5 bundles = 10 reams',
  },
  {
    id: 'applications',
    title: 'Applications of Paper Quantity Conversion',
    paragraphs: [
      'Printing companies, publishers, schools, offices, wholesalers, packaging firms, and procurement teams use these conversions to plan inventory, compare quotes, and estimate how many sheets a job requires.',
      'Entering a known count in one unit instantly shows the equivalent counts in the others so you can match warehouse language (bales, bundles) with press-room language (reams, sheets).',
    ],
  },
];

export const PAPER_QUANTITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Sheets Are in One Ream?',
    answer: 'A modern standard ream contains 500 sheets.',
  },
  {
    question: 'How Many Sheets Are in One Quire?',
    answer: 'Under this calculator’s default convention, one quire contains 25 sheets.',
  },
  {
    question: 'How Many Quires Are in One Ream?',
    answer: 'One 500-sheet ream contains 20 quires of 25 sheets each.',
  },
  {
    question: 'How Many Reams Are in 1,000 Sheets?',
    answer: 'Under the modern 500-sheet standard, 1,000 sheets equal 2 reams.',
  },
  {
    question: 'How Many Sheets Are in One Bundle?',
    answer: 'Under the calculator’s default convention, one bundle contains 1,000 sheets.',
  },
  {
    question: 'How Many Reams Are in One Bale?',
    answer: 'Under the calculator’s default convention, one bale equals 10 reams.',
  },
  {
    question: 'Is Every Ream Always 500 Sheets?',
    answer:
      'No. The quantity may differ depending on historical standards, specialty paper products, or commercial packaging. This tool defaults to the modern 500-sheet ream.',
  },
  {
    question: 'Can I Convert Fractional Reams?',
    answer: 'Yes. Fractional values can represent part of a ream, such as 0.5 ream being 250 sheets.',
  },
  {
    question: 'How Do I Convert Sheets to Bales?',
    answer: 'Divide the number of sheets by 5,000 under the default convention.',
  },
];
