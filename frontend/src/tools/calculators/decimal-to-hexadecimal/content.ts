import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DECIMAL_HEX_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-hex', label: 'What Is the Hexadecimal System?' },
  { id: 'decimal-to-hex-how', label: 'Convert Decimal to Hexadecimal' },
  { id: 'hex-to-decimal-how', label: 'Convert Hexadecimal to Decimal' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'conversion-chart', label: 'Decimal to Hexadecimal Chart' },
  { id: 'signed-vs-unsigned', label: 'Signed vs Unsigned Hex' },
  { id: 'decimal-hex-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string }[];
  tableHeaders?: readonly [string, string];
}

export const DECIMAL_HEX_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-hex',
    title: 'What Is the Hexadecimal System?',
    paragraphs: [
      'Hexadecimal is base 16. It uses digits 0–9 and letters A–F for values ten through fifteen. Decimal is base 10; hexadecimal packs more value into fewer digits and maps cleanly onto binary because 16 = 2⁴; each hex digit is exactly four bits.',
      'Programmers use hexadecimal for memory addresses, machine dumps, RGB colors (#FF5733), and bit masks. It is a human-friendly shorthand for binary patterns, not a different computer architecture.',
    ],
    table: [
      { left: '0', right: '0' },
      { left: '1', right: '1' },
      { left: '9', right: '9' },
      { left: '10', right: 'A' },
      { left: '11', right: 'B' },
      { left: '12', right: 'C' },
      { left: '13', right: 'D' },
      { left: '14', right: 'E' },
      { left: '15', right: 'F' },
      { left: '16', right: '10' },
    ],
    tableHeaders: ['Decimal', 'Hexadecimal'],
  },
  {
    id: 'decimal-to-hex-how',
    title: 'How Do I Convert Decimal to Hexadecimal?',
    paragraphs: [
      'Repeatedly divide by 16 and record remainders. Map remainders 10–15 to A–F, then read remainders from last division to first.',
      'Example: 4937 ÷ 16 = 308 rem 9; 308 ÷ 16 = 19 rem 4; 19 ÷ 16 = 1 rem 3; 1 ÷ 16 = 0 rem 1. Reading remainders upward gives 1349, so 4937₁₀ = 1349₁₆.',
    ],
    formula: '4937₁₀ = 1349₁₆',
  },
  {
    id: 'hex-to-decimal-how',
    title: 'How Do I Convert Hexadecimal to Decimal?',
    paragraphs: [
      'Multiply each digit by its place value (a power of 16) and add the products.',
      'Example 243A: 2×16³ + 4×16² + 3×16¹ + 10×16⁰ = 8192 + 1024 + 48 + 10 = 9274, so 243A₁₆ = 9274₁₀.',
    ],
    formula: '2×4096 + 4×256 + 3×16 + A×1 = 9274',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Decimal to Hexadecimal Converter',
    paragraphs: [
      '1) Choose Decimal to hexadecimal or Hexadecimal to decimal. 2) Enter a value in the selected base. 3) For decimal→hex, optionally enable fixed-width 4-digit padding. 4) For hex→decimal, pick unsigned or signed 16-bit interpretation. 5) Expand conversion steps, then share or reset.',
      'Decimal inputs are limited to the signed 16-bit range −32,768…32,767. Negatives always encode as four-digit two\'s-complement hex.',
    ],
  },
  {
    id: 'conversion-chart',
    title: 'Decimal to Hexadecimal Conversion Chart',
    paragraphs: ['Selected verified conversions:'],
    table: [
      { left: '0', right: '0' },
      { left: '1', right: '1' },
      { left: '2', right: '2' },
      { left: '9', right: '9' },
      { left: '10', right: 'A' },
      { left: '11', right: 'B' },
      { left: '12', right: 'C' },
      { left: '13', right: 'D' },
      { left: '14', right: 'E' },
      { left: '15', right: 'F' },
      { left: '16', right: '10' },
      { left: '26', right: '1A' },
      { left: '32', right: '20' },
      { left: '64', right: '40' },
      { left: '100', right: '64' },
      { left: '127', right: '7F' },
      { left: '255', right: 'FF' },
      { left: '256', right: '100' },
      { left: '512', right: '200' },
      { left: '1024', right: '400' },
      { left: '4095', right: 'FFF' },
    ],
    tableHeaders: ['Decimal', 'Hexadecimal'],
  },
  {
    id: 'signed-vs-unsigned',
    title: 'Signed vs Unsigned Hexadecimal Numbers',
    paragraphs: [
      'Unsigned hexadecimal is a pure place-value magnitude: FFFF₁₆ = 65,535₁₀. Signed 16-bit integers instead use two\'s complement at a fixed width of 16 bits (four hex digits). The same bit pattern FFFF then means −1.',
      'Encoding a negative decimal n in 16-bit two\'s complement uses (65,536 + n) written in hex: −10 → 65,526 → FFF6. Decoding: if the high bit is set, signed = unsigned − 65,536. The signed 16-bit range is −32,768…32,767.',
    ],
    formula: 'FFFF₁₆ → 65535 (unsigned) or −1 (signed 16-bit)',
  },
];

export const DECIMAL_HEX_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert 123 to hexadecimal?',
    answer:
      '123₁₀ = 7B₁₆. Divide 123 by 16 to get quotient 7 and remainder 11 (B), then read 7B.',
  },
  {
    question: 'How do I convert 3A to decimal?',
    answer: '3A₁₆ = 58₁₀ because 3 × 16 + 10 = 58.',
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
    question: 'What is 1000 in hexadecimal?',
    answer: '1000₁₀ = 3E8₁₆.',
  },
  {
    question: 'What is the hexadecimal value of 32767?',
    answer: '32767₁₀ = 7FFF₁₆: the maximum positive signed 16-bit integer.',
  },
  {
    question: 'How do negative decimal numbers convert to hexadecimal?',
    answer:
      'This converter uses 16-bit two\'s complement: add 65,536 to the negative value, then write that unsigned result in hex with four digits. Example: −10 → 65,526 → FFF6₁₆. The bit width matters; a different width yields a different hex pattern.',
  },
  {
    question: 'Is hexadecimal base 16?',
    answer:
      'Yes. Hexadecimal uses sixteen symbols: digits 0–9 and letters A–F.',
  },
];
