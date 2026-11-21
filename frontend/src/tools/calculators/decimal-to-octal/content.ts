import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DECIMAL_OCTAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-octal', label: 'What Is the Octal Number System?' },
  { id: 'decimal-to-octal-how', label: 'Convert Decimal to Octal' },
  { id: 'octal-to-decimal-how', label: 'Convert Octal to Decimal' },
  { id: 'conversion-chart', label: 'Decimal to Octal Chart' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'number-systems', label: 'Decimal, Binary, Octal, Hex' },
  { id: 'why-octal', label: 'Why Is Octal Used in Computing?' },
  { id: 'decimal-octal-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
}

const CHART_0_TO_32: { left: string; right: string }[] = Array.from(
  { length: 33 },
  (_, n) => ({ left: String(n), right: n.toString(8) })
);

export const DECIMAL_OCTAL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-octal',
    title: 'What Is the Octal Number System?',
    paragraphs: [
      'Octal is base 8. It uses digits 0–7 only; there is no digit 8 or 9. Each place value is a power of eight: …, 512, 64, 8, 1. Decimal is base 10; octal packs values using fewer digits when groups of three binary bits matter.',
      'Historically, octal appeared on machines whose word sizes were multiples of three bits. Today it still shows up as a compact reading of binary and in Unix-style file permission modes.',
    ],
    formula: '10₈ = 8₁₀ · 100₈ = 64₁₀',
  },
  {
    id: 'decimal-to-octal-how',
    title: 'How to Convert Decimal to Octal',
    paragraphs: [
      'Repeatedly divide by 8 and record remainders. Read remainders from last division to first.',
      'Examples: 10 → 12₈; 25 → 31₈; 100 → 144₈; 125 → 175₈; 255 → 377₈. For 125: 125÷8 = 15 rem 5; 15÷8 = 1 rem 7; 1÷8 = 0 rem 1 → 175₈.',
    ],
    formula: '125₁₀ = 175₈',
  },
  {
    id: 'octal-to-decimal-how',
    title: 'How to Convert Octal to Decimal',
    paragraphs: [
      'Expand each digit by its power of eight and add. 175₈ = 1×8² + 7×8¹ + 5×8⁰ = 64 + 56 + 5 = 125₁₀. Likewise 377₈ = 255₁₀.',
    ],
    formula: '175₈ = 125₁₀ · 377₈ = 255₁₀',
  },
  {
    id: 'conversion-chart',
    title: 'Decimal to Octal Conversion Chart',
    paragraphs: [
      'Decimal values 0–32 and selected larger values (verified):',
    ],
    table: [
      ...CHART_0_TO_32,
      { left: '64', right: '100' },
      { left: '100', right: '144' },
      { left: '125', right: '175' },
      { left: '128', right: '200' },
      { left: '255', right: '377' },
      { left: '256', right: '400' },
      { left: '512', right: '1000' },
      { left: '1000', right: '1750' },
      { left: '1024', right: '2000' },
      { left: '2026', right: '3752' },
    ],
    tableHeaders: ['Decimal', 'Octal'],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Decimal to Octal Converter',
    paragraphs: [
      '1) Choose Decimal to Octal or Octal to Decimal. 2) Enter a non-negative whole number in the selected base. 3) Read the exact result (BigInt precision for large integers). 4) Expand calculation steps for division remainders or positional sums. 5) Share or reset as needed.',
      'Switching direction clears the input so labels and validation stay consistent. Empty input is not treated as zero.',
    ],
  },
  {
    id: 'number-systems',
    title: 'Decimal, Binary, Octal, and Hexadecimal',
    paragraphs: [
      'Binary (base 2) uses 0–1; octal (base 8) uses 0–7; decimal (base 10) uses 0–9; hexadecimal (base 16) uses 0–9 and A–F. Because 8 = 2³, each octal digit maps to exactly three binary bits.',
      'Example: binary 111101 → groups 111 101 → octal 7 5 → 75₈.',
    ],
    table: [
      { left: 'Binary', right: '2', third: '0–1' },
      { left: 'Octal', right: '8', third: '0–7' },
      { left: 'Decimal', right: '10', third: '0–9' },
      { left: 'Hexadecimal', right: '16', third: '0–9, A–F' },
    ],
    tableHeaders: ['System', 'Base', 'Allowed Digits'],
    formula: '111101₂ = 75₈',
  },
  {
    id: 'why-octal',
    title: 'Why Is Octal Used in Computing?',
    paragraphs: [
      'Octal shortens binary by grouping bits in threes. Older systems and some documentation still show octal dumps. On Unix-like systems, file permission modes such as 755 and 644 are octal numbers: each digit encodes a three-bit rwx mask for owner, group, and others; not ordinary decimal place values.',
    ],
  },
];

export const DECIMAL_OCTAL_FAQS: readonly FAQItem[] = [
  {
    question: 'What is 10 in octal?',
    answer: '10₁₀ = 12₈.',
  },
  {
    question: 'What is 25 in octal?',
    answer: '25₁₀ = 31₈.',
  },
  {
    question: 'What is 100 in octal?',
    answer: '100₁₀ = 144₈.',
  },
  {
    question: 'What is 125 in octal?',
    answer: '125₁₀ = 175₈.',
  },
  {
    question: 'What is 255 in octal?',
    answer: '255₁₀ = 377₈.',
  },
  {
    question: 'What is 1000 in octal?',
    answer: '1000₁₀ = 1750₈.',
  },
  {
    question: 'How do I convert octal to decimal?',
    answer:
      'Multiply each octal digit by its corresponding power of 8, starting with power zero at the rightmost digit, then add the products.',
  },
  {
    question: 'Can octal numbers contain 8 or 9?',
    answer: 'No. Valid octal digits range from 0 to 7.',
  },
  {
    question: 'What is the difference between decimal and octal?',
    answer: 'Decimal uses base 10, while octal uses base 8.',
  },
  {
    question: 'Why is octal useful in programming?',
    answer:
      'It provides a compact representation of groups of three binary bits and appears in contexts such as Unix-style file permissions.',
  },
];
