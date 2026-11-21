import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const ROMAN_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-roman', label: 'What Are Roman Numerals?' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'roman-chart', label: 'Roman Numerals Chart' },
  { id: 'how-to-read', label: 'How Do I Read Roman Numerals?' },
  { id: 'how-to-convert', label: 'Convert Numbers to Roman Numerals' },
  { id: 'roman-rules', label: 'Rules of Roman Numerals' },
  { id: 'roman-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string }[];
  tableHeaders?: readonly [string, string];
}

export const ROMAN_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-are-roman',
    title: 'What Are Roman Numerals?',
    paragraphs: [
      'Roman numerals are an ancient numbering system that used letters of the Latin alphabet. Seven symbols cover the standard range used on clocks, book chapters, monarchs’ titles, and movie credits: I, V, X, L, C, D, and M.',
      'Values combine additively when a larger or equal symbol comes first, and subtractively for a few allowed pairs (IV, IX, XL, XC, CD, CM). Standard notation has no symbol for zero and does not represent negative numbers.',
    ],
    table: [
      { left: 'I', right: '1' },
      { left: 'V', right: '5' },
      { left: 'X', right: '10' },
      { left: 'L', right: '50' },
      { left: 'C', right: '100' },
      { left: 'D', right: '500' },
      { left: 'M', right: '1000' },
    ],
    tableHeaders: ['Symbol', 'Value'],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Roman Numerals Converter',
    paragraphs: [
      'Arabic → Roman: select Arabic numbers to Roman numerals, enter a whole number from 1 to 3999, and read the uppercase Roman result. Expand conversion steps to see each mapped chunk.',
      'Roman → Arabic: select Roman numerals to Arabic numbers, enter a canonical numeral (uppercase or lowercase), and read the integer. Invalid sequences such as IIII or IC show a clear error instead of a guessed value.',
    ],
  },
  {
    id: 'roman-chart',
    title: 'Roman Numerals Chart: 1 to 1000',
    paragraphs: ['Selected verified values for quick reference:'],
    table: [
      { left: '1', right: 'I' },
      { left: '2', right: 'II' },
      { left: '3', right: 'III' },
      { left: '4', right: 'IV' },
      { left: '5', right: 'V' },
      { left: '6', right: 'VI' },
      { left: '7', right: 'VII' },
      { left: '8', right: 'VIII' },
      { left: '9', right: 'IX' },
      { left: '10', right: 'X' },
      { left: '11', right: 'XI' },
      { left: '12', right: 'XII' },
      { left: '13', right: 'XIII' },
      { left: '14', right: 'XIV' },
      { left: '15', right: 'XV' },
      { left: '16', right: 'XVI' },
      { left: '17', right: 'XVII' },
      { left: '18', right: 'XVIII' },
      { left: '19', right: 'XIX' },
      { left: '20', right: 'XX' },
      { left: '30', right: 'XXX' },
      { left: '40', right: 'XL' },
      { left: '50', right: 'L' },
      { left: '60', right: 'LX' },
      { left: '70', right: 'LXX' },
      { left: '80', right: 'LXXX' },
      { left: '90', right: 'XC' },
      { left: '100', right: 'C' },
      { left: '200', right: 'CC' },
      { left: '300', right: 'CCC' },
      { left: '400', right: 'CD' },
      { left: '500', right: 'D' },
      { left: '600', right: 'DC' },
      { left: '700', right: 'DCC' },
      { left: '800', right: 'DCCC' },
      { left: '900', right: 'CM' },
      { left: '1000', right: 'M' },
    ],
    tableHeaders: ['Arabic', 'Roman'],
  },
  {
    id: 'how-to-read',
    title: 'How Do I Read Roman Numerals?',
    paragraphs: [
      'Read left to right. A symbol after an equal or larger one is added (VI = 5 + 1). Only these subtractive pairs are allowed: IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900.',
      'Examples: XIV = 10 + 4 = 14; XLIX = 40 + 9 = 49; MCMXCIV = 1000 + 900 + 90 + 4 = 1994.',
    ],
    formula: 'XIV = 14 · XLIX = 49 · MCMXCIV = 1994',
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Numbers to Roman Numerals?',
    paragraphs: [
      'Greedy-match the largest Roman value that fits, subtract it, and repeat. For 1987: 1000 → M, 900 → CM, 80 → LXXX, 7 → VII, so 1987 = MCMLXXXVII.',
      'Likewise 2026 = 2000 + 20 + 6 → MM + XX + VI → MMXXVI.',
    ],
    formula: '1987 = MCMLXXXVII · 2026 = MMXXVI',
  },
  {
    id: 'roman-rules',
    title: 'Rules of Roman Numerals',
    paragraphs: [
      'I, X, C, and M may repeat up to three times in a row (III, XXX, CCC, MMM). V, L, and D never repeat. Smaller-before-larger is allowed only for the six subtractive pairs listed above; IC, IL, XM, and VX are invalid.',
      'Correct: IV, XLIX, MCMXCIX. Incorrect: IIII, VV, IIV, MMMM. Without overline notation this converter supports 1 through 3999 (MMMCMXCIX).',
    ],
  },
];

export const ROMAN_FAQS: readonly FAQItem[] = [
  { question: 'What is 4 in Roman numerals?', answer: 'IV.' },
  { question: 'What is 9 in Roman numerals?', answer: 'IX.' },
  { question: 'What is 39 in Roman numerals?', answer: 'XXXIX.' },
  { question: 'What is 49 in Roman numerals?', answer: 'XLIX.' },
  { question: 'What is 99 in Roman numerals?', answer: 'XCIX.' },
  { question: 'What is 2024 in Roman numerals?', answer: 'MMXXIV.' },
  { question: 'What is 2026 in Roman numerals?', answer: 'MMXXVI.' },
  { question: 'What is 1990 in Roman numerals?', answer: 'MCMXC.' },
  { question: 'What is 1900 in Roman numerals?', answer: 'MCM.' },
  { question: 'What is 3000 in Roman numerals?', answer: 'MMM.' },
  {
    question: 'What is the highest standard Roman numeral?',
    answer:
      'Under the common 1–3999 convention used here, the largest value is 3999 = MMMCMXCIX. Extended historical notation can go higher, but this calculator’s default mode stays within standard notation.',
  },
  {
    question: 'Can Roman numerals represent zero?',
    answer: 'No. Standard Roman numeral notation has no symbol for zero.',
  },
  {
    question: 'Can Roman numerals represent negative numbers?',
    answer: 'Not in the standard notation supported by this converter.',
  },
];
