import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const HEX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-hex', label: 'What Is the Hexadecimal System?' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'how-it-works', label: 'How Does the Hex Calculator Work?' },
  { id: 'decimal-to-hex', label: 'Decimal to Hexadecimal' },
  { id: 'binary-to-hex', label: 'Binary to Hexadecimal' },
  { id: 'hex-to-decimal', label: 'Hexadecimal to Decimal' },
  { id: 'hex-to-binary', label: 'Hexadecimal to Binary' },
  { id: 'conversion-chart', label: 'Hexadecimal Conversion Chart' },
  { id: 'hex-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
}

export const HEX_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-hex',
    title: 'What Is the Hexadecimal System?',
    paragraphs: [
      'Hexadecimal is a base-16 number system. It uses sixteen symbols: digits 0–9 and letters A–F (for values 10–15). Binary is base 2, decimal is base 10, and hexadecimal is a compact bridge between them because 16 = 2⁴; each hex digit maps exactly to four binary bits.',
      'Programmers use hexadecimal for memory addresses, machine code dumps, RGB color codes (#FF5733), bit masks, and protocol fields. It shortens long binary strings without losing exact bit meaning.',
    ],
    table: [
      { left: '0', right: '0', third: '0000' },
      { left: '1', right: '1', third: '0001' },
      { left: '2', right: '2', third: '0010' },
      { left: '3', right: '3', third: '0011' },
      { left: '4', right: '4', third: '0100' },
      { left: '5', right: '5', third: '0101' },
      { left: '6', right: '6', third: '0110' },
      { left: '7', right: '7', third: '0111' },
      { left: '8', right: '8', third: '1000' },
      { left: '9', right: '9', third: '1001' },
      { left: '10', right: 'A', third: '1010' },
      { left: '11', right: 'B', third: '1011' },
      { left: '12', right: 'C', third: '1100' },
      { left: '13', right: 'D', third: '1101' },
      { left: '14', right: 'E', third: '1110' },
      { left: '15', right: 'F', third: '1111' },
    ],
    tableHeaders: ['Decimal', 'Hexadecimal', 'Binary'],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Hexadecimal Converter',
    paragraphs: [
      '1) Open Decimal to hexadecimal, enter a non-negative integer, and read the uppercase hex result. 2) Open Binary to hexadecimal, enter 0/1 digits, and read the hex grouping result. 3) Open Hexadecimal to decimal/binary, enter 0–9/A–F (case-insensitive), and read both decimal and binary. 4) Expand conversion steps for division remainders, nibble tables, or positional sums. 5) Share or clear with the action buttons.',
      'Each section keeps its own input. Results update as soon as a value is valid. Fractional and negative values are rejected with a clear message; this tool does not invent two’s-complement or fractional hex.',
    ],
  },
  {
    id: 'how-it-works',
    title: 'How Does the Hex Calculator Work?',
    paragraphs: [
      'Decimal→hex uses exact BigInt arithmetic: divide by 16, collect remainders, map 10–15 to A–F, and read remainders from last to first. Binary→hex pads bits on the left to a multiple of four, then looks up each nibble. Hex→decimal sums digit×16^position. Hex→binary replaces each digit with its four-bit pattern and strips unnecessary leading zeros.',
    ],
    formula: 'hex digit ↔ 4 bits · decimal = Σ(dᵢ × 16ⁱ)',
  },
  {
    id: 'decimal-to-hex',
    title: 'Decimal to Hexadecimal Conversion',
    paragraphs: [
      'Repeatedly divide by 16 and record remainders. For 255: 255÷16 = 15 rem 15 (F); 15÷16 = 0 rem 15 (F). Reading remainders upward yields FF, so 255₁₀ = FF₁₆.',
    ],
    formula: '255₁₀ = FF₁₆',
  },
  {
    id: 'binary-to-hex',
    title: 'Binary to Hexadecimal Conversion',
    paragraphs: [
      'Group bits in fours from the right. Example: 11010110 → 1101 0110 → D and 6 → D6, so 11010110₂ = D6₁₆. Left-pad with zeros when the leftmost group is short.',
    ],
    formula: '11010110₂ = D6₁₆',
  },
  {
    id: 'hex-to-decimal',
    title: 'Hexadecimal to Decimal Conversion',
    paragraphs: [
      'Use place values that are powers of 16. For 1A3F: 1×16³ + 10×16² + 3×16¹ + 15×16⁰ = 4096 + 2560 + 48 + 15 = 6719, so 1A3F₁₆ = 6719₁₀.',
    ],
    formula: '1A3F₁₆ = 6719₁₀',
  },
  {
    id: 'hex-to-binary',
    title: 'Hexadecimal to Binary Conversion',
    paragraphs: [
      'Replace each hex digit with four bits. FF → 1111 1111 → 11111111₂. For 1A3F: 0001 1010 0011 1111, then drop leading zeros to get 1101000111111₂.',
    ],
    formula: 'FF₁₆ = 11111111₂ · 1A3F₁₆ = 1101000111111₂',
  },
  {
    id: 'conversion-chart',
    title: 'Hexadecimal Conversion Chart',
    paragraphs: ['Selected verified decimal, binary, and hexadecimal values:'],
    table: [
      { left: '0', right: '0', third: '0' },
      { left: '1', right: '1', third: '1' },
      { left: '10', right: 'A', third: '1010' },
      { left: '15', right: 'F', third: '1111' },
      { left: '16', right: '10', third: '10000' },
      { left: '26', right: '1A', third: '11010' },
      { left: '100', right: '64', third: '1100100' },
      { left: '255', right: 'FF', third: '11111111' },
      { left: '256', right: '100', third: '100000000' },
      { left: '6719', right: '1A3F', third: '1101000111111' },
    ],
    tableHeaders: ['Decimal', 'Hexadecimal', 'Binary'],
  },
];

export const HEX_FAQS: readonly FAQItem[] = [
  {
    question: 'What is hexadecimal?',
    answer:
      'Hexadecimal is a base-16 number system using digits 0–9 and letters A–F for values ten through fifteen.',
  },
  {
    question: 'How do I convert decimal to hexadecimal?',
    answer:
      'Repeatedly divide the decimal number by 16, record the remainders, map 10–15 to A–F, and read the remainders from last to first.',
  },
  {
    question: 'How do I convert binary to hexadecimal?',
    answer:
      'Group binary digits into sets of four from right to left, pad the leftmost group if needed, then convert each group into its hexadecimal digit.',
  },
  {
    question: 'What is 255 in hexadecimal?',
    answer: '255₁₀ = FF₁₆.',
  },
  {
    question: 'What is 100 in hexadecimal?',
    answer: '100₁₀ = 64₁₆.',
  },
  {
    question: 'What is FF in decimal?',
    answer: 'FF₁₆ = 255₁₀.',
  },
  {
    question: 'What is 1A in decimal?',
    answer: '1A₁₆ = 26₁₀.',
  },
  {
    question: 'What is 1010 in hexadecimal?',
    answer: '1010₂ = A₁₆.',
  },
  {
    question: 'What is hexadecimal D6 in binary?',
    answer: 'D6₁₆ = 11010110₂.',
  },
  {
    question: 'Why is hexadecimal used in programming?',
    answer:
      'Hexadecimal is a compact way to write binary values. Each hexadecimal digit corresponds to exactly four binary bits, which makes masks, addresses, and color codes easier to read.',
  },
];
