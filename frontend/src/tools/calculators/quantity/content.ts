import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const QUANTITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'dozen-bakers-dozen', label: "How Much Is a Dozen and a Baker's Dozen?" },
  { id: 'cheaper-by-the-dozen', label: 'Cheaper by the Dozen' },
  { id: 'dozen-gross-score', label: 'A Dozen, a Gross, and a Score' },
  { id: 'how-to-use', label: 'How to Use Our Quantity Converter' },
  { id: 'quantity-converter-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const QUANTITY_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'dozen-bakers-dozen',
    title: "How Much Is a Dozen and a Baker's Dozen?",
    paragraphs: [
      'A dozen is a group of 12 items. Eggs, rolls, cookies, and many packaged goods are still sold by the dozen because twelve divides evenly into halves, thirds, and quarters.',
      "A baker's dozen is 13 items. Historical explanations often point to bakers adding an extra piece to avoid short-weight penalties or to keep customers satisfied — whatever the origin, the modern counting meaning is fixed at thirteen.",
      'Standardized groups speed counting in kitchens, shops, and warehouses: three dozens are 36 units; two baker’s dozens are 26 units.',
    ],
    formula: "1 dozen = 12 units · 1 baker's dozen = 13 units · 3 dozens = 36 units",
  },
  {
    id: 'cheaper-by-the-dozen',
    title: 'Cheaper by the Dozen',
    paragraphs: [
      'Grouping goods by dozens simplifies bulk purchasing, packaging, inventory counts, and unit pricing. Staff can count boxes of dozens instead of every individual piece.',
      'Example: a carton holds 6 dozens of pencils → 6 × 12 = 72 pencils. Converting between units, pairs, dozens, scores, and grosses makes stock checks faster and reduces arithmetic mistakes.',
    ],
    formula: '6 dozens = 72 units',
  },
  {
    id: 'dozen-gross-score',
    title: 'A Dozen, a Gross, and a Score',
    paragraphs: [
      'Common counting groups relate through individual units. A pair (or couple/brace) is 2; a half-dozen is 6; a decade of items is 10; a dozen is 12; a baker’s dozen is 13; a score is 20; a gross is 144 (twelve dozens); a great gross is 1,728 (twelve grosses).',
      'In this converter, “decade” means a group of ten items — not a ten-year time period.',
    ],
    formula: '1 gross = 12 dozens · 1 great gross = 12 grosses · 1 score = 20 units',
    tableHeaders: ['Number of Units', 'Quantity'],
    table: [
      ['2', '1 pair'],
      ['6', '1 half-dozen'],
      ['10', '1 decade'],
      ['12', '1 dozen'],
      ['13', "1 baker's dozen"],
      ['20', '1 score'],
      ['144', '1 gross'],
      ['1,728', '1 great gross'],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use Our Quantity Converter',
    paragraphs: [
      '1. Open the Quantity Converter.',
      '2. Enter a number in any quantity field.',
      '3. Read the automatically calculated equivalents in the other fields.',
      '4. Edit a different field to convert in another direction.',
      '5. Use Reload Calculator or Clear All Changes to start over.',
      'Example: Scores = 25 → Units = 500, Dozens ≈ 41.666667, Grosses ≈ 3.472222. Fractional group counts are mathematical equivalents; a physical count of whole packs may still need rounding or remainder notes.',
    ],
  },
];

export const QUANTITY_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Items Are in a Dozen?',
    answer: 'One dozen contains 12 items.',
  },
  {
    question: "How Many Items Are in a Baker's Dozen?",
    answer: "A baker's dozen contains 13 items.",
  },
  {
    question: 'How Many Items Are in a Pair?',
    answer: 'A pair contains 2 items.',
  },
  {
    question: 'How Many Units Are in a Score?',
    answer: 'One score equals 20 units.',
  },
  {
    question: 'How Many Dozens Are in a Gross?',
    answer: 'One gross contains 12 dozens, equivalent to 144 individual items.',
  },
  {
    question: 'How Many Units Are in a Great Gross?',
    answer: 'One great gross contains 1728 individual units.',
  },
  {
    question: 'How Many Pairs Are in One Dozen?',
    answer: 'One dozen contains 6 pairs.',
  },
  {
    question: 'How Many Dozens Are in 100 Units?',
    answer: '100 units equal approximately 8.333333 dozens.',
  },
  {
    question: 'What Is a Decade in Quantity Conversion?',
    answer:
      'A decade is a group of 10 items, although the same word commonly describes a period of 10 years.',
  },
  {
    question: 'How Do I Convert Dozens to Units?',
    answer: 'Multiply the number of dozens by 12.',
  },
  {
    question: 'How Do I Convert Units to Dozens?',
    answer: 'Divide the number of individual units by 12.',
  },
  {
    question: 'What Is the Difference Between a Gross and a Great Gross?',
    answer: 'A gross contains 144 units, while a great gross contains 1728 units.',
  },
];
