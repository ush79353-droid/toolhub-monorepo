import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BINARY_HEX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'binary-hex-numbers', label: 'Binary and Hexadecimal Numbers' },
  { id: 'why-hexadecimal', label: 'Why Hexadecimal?' },
  { id: 'convert-binary-hex', label: 'Convert Binary to Hexadecimal' },
  { id: 'convert-hex-binary', label: 'Convert Hexadecimal to Binary' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'examples', label: 'Conversion Examples' },
  { id: 'binary-hex-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
}

export const BINARY_HEX_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'binary-hex-numbers',
    title: 'Binary and Hexadecimal Numbers',
    paragraphs: [
      'Binary is base 2 and uses digits 0 and 1. Hexadecimal is base 16 and uses 0–9 plus A–F for values ten through fifteen. Exactly four binary bits map to one hexadecimal digit, so hex is a compact way to write the same integer.',
      'Hexadecimal appears in programming, digital electronics, memory addresses, networking, debugging, and color codes (for example #FF8800).',
    ],
  },
  {
    id: 'why-hexadecimal',
    title: 'Why Do We Need Hexadecimal Numbers?',
    paragraphs: [
      'Long binary strings are hard to read and compare. Hexadecimal shortens them without losing information, because each hex digit is one nibble. Example: binary 11111111 is hexadecimal FF.',
      'Engineers and developers use hex when inspecting machine words, opcodes, and registers because the four-bit alignment matches common hardware boundaries.',
    ],
    formula: '1 hex digit = 4 binary bits (one nibble)',
  },
  {
    id: 'convert-binary-hex',
    title: 'How Do You Convert Binary to Hexadecimal?',
    paragraphs: [
      'Group bits in fours from the right, pad the leftmost group with zeros if needed, replace each group with its hex digit, then drop insignificant leading zeros from the result.',
      'Example: 101101101011 → 1011 0110 1011 → B, 6, B → B6B.',
    ],
    table: [
      { left: '0000', right: '0', third: '0' },
      { left: '0001', right: '1', third: '1' },
      { left: '0010', right: '2', third: '2' },
      { left: '0011', right: '3', third: '3' },
      { left: '0100', right: '4', third: '4' },
      { left: '0101', right: '5', third: '5' },
      { left: '0110', right: '6', third: '6' },
      { left: '0111', right: '7', third: '7' },
      { left: '1000', right: '8', third: '8' },
      { left: '1001', right: '9', third: '9' },
      { left: '1010', right: '10', third: 'A' },
      { left: '1011', right: '11', third: 'B' },
      { left: '1100', right: '12', third: 'C' },
      { left: '1101', right: '13', third: 'D' },
      { left: '1110', right: '14', third: 'E' },
      { left: '1111', right: '15', third: 'F' },
    ],
    tableHeaders: ['Binary', 'Decimal', 'Hexadecimal'],
  },
  {
    id: 'convert-hex-binary',
    title: 'How Do You Convert Hexadecimal to Binary?',
    paragraphs: [
      'Read each hex digit, expand it to its four-bit group, concatenate the groups, and remove insignificant leading zeros if you want the shortest binary form.',
      'Example: 2AF → 0010 1010 1111 → 001010101111 → normalized 1010101111.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Binary to Hexadecimal Converter',
    paragraphs: [
      '1) Enter a binary integer (0 and 1 only). 2) The converter validates the input. 3) Hexadecimal appears automatically with decimal and octal. 4) Expand conversion steps for the nibble table. 5) Optionally open reverse conversion and enter hex (0–9, A–F). 6) Share or reset as needed.',
      'Leading zeros in binary do not change the numerical value; default outputs drop unnecessary leading zeros while steps still show padded nibbles.',
    ],
  },
  {
    id: 'examples',
    title: 'Binary to Hexadecimal Conversion Examples',
    paragraphs: [
      'Selected verified conversions. Padded binary forms such as 00001010 still equal hexadecimal A; padding is not a different number.',
    ],
    table: [
      { left: '0', right: '0' },
      { left: '1', right: '1' },
      { left: '10', right: '2' },
      { left: '1010', right: 'A' },
      { left: '1111', right: 'F' },
      { left: '10000', right: '10' },
      { left: '101010', right: '2A' },
      { left: '11111111', right: 'FF' },
      { left: '10110110', right: 'B6' },
      { left: '100000000', right: '100' },
      { left: '111111111111', right: 'FFF' },
      { left: '1000000000000', right: '1000' },
    ],
    tableHeaders: ['Binary', 'Hexadecimal'],
  },
];

export const BINARY_HEX_FAQS: readonly FAQItem[] = [
  {
    question: 'What is the hexadecimal number F equal to in binary?',
    answer: 'The hexadecimal digit F equals 15 in decimal and 1111 in binary.',
  },
  {
    question: 'How do I convert binary to hexadecimal?',
    answer:
      'Group the binary digits into sets of four starting from the right, add leading zeros when needed, and replace each group with the corresponding hexadecimal digit.',
  },
  {
    question: 'How do I convert hexadecimal to binary?',
    answer:
      'Convert each hexadecimal digit into its four-bit binary equivalent, combine the groups, and remove insignificant leading zeros if desired.',
  },
  {
    question: 'What is 1010 in hexadecimal?',
    answer: 'Binary 1010 equals hexadecimal A.',
  },
  {
    question: 'What is 1111 in hexadecimal?',
    answer: 'Binary 1111 equals hexadecimal F.',
  },
  {
    question: 'What is 11111111 in hexadecimal?',
    answer: 'Binary 11111111 equals hexadecimal FF.',
  },
  {
    question: 'What is 1000 in hexadecimal?',
    answer: 'Binary 1000 equals hexadecimal 8.',
  },
  {
    question: 'Why does hexadecimal use letters A to F?',
    answer:
      'Hexadecimal needs 16 distinct digit symbols. Digits 0–9 represent zero through nine, and A–F represent ten through fifteen.',
  },
  {
    question: 'How many binary digits make one hexadecimal digit?',
    answer: 'Four binary digits (four bits) correspond to one hexadecimal digit.',
  },
  {
    question: 'Can hexadecimal represent large binary numbers?',
    answer:
      'Yes. Hexadecimal can represent arbitrarily large non-negative integers when the converter uses precision-safe integer arithmetic such as BigInt or direct nibble mapping.',
  },
];
