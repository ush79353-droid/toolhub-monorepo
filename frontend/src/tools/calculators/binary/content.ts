import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BINARY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-binary', label: 'What Is the Binary System?' },
  { id: 'decimal-to-binary', label: 'Converting Decimal to Binary' },
  { id: 'binary-to-decimal', label: 'Converting Binary to Decimal' },
  { id: 'negative-numbers', label: 'Converting Negative Numbers' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'reference-table', label: 'Decimal to Binary Table' },
  { id: 'binary-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string; third?: string }[];
  tableHeaders?: readonly [string, string] | readonly [string, string, string];
}

export const BINARY_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-binary',
    title: 'What Is the Binary System?',
    paragraphs: [
      'Binary is the base-2 numeral system. It uses only two digits — 0 and 1 — and each position corresponds to a power of two. Computers, memory chips, processors, and digital electronics rely on binary patterns to store and process information.',
      'Example: binary 1011 means 1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11, so 1011₂ = 11₁₀.',
    ],
    table: [
      { left: '0', right: '2⁰', third: '1' },
      { left: '1', right: '2¹', third: '2' },
      { left: '2', right: '2²', third: '4' },
      { left: '3', right: '2³', third: '8' },
      { left: '4', right: '2⁴', third: '16' },
      { left: '5', right: '2⁵', third: '32' },
      { left: '6', right: '2⁶', third: '64' },
      { left: '7', right: '2⁷', third: '128' },
    ],
    tableHeaders: ['Position', 'Power of Two', 'Value'],
  },
  {
    id: 'decimal-to-binary',
    title: 'Converting from Decimal to Binary',
    paragraphs: [
      'One common method is repeated division by two. Convert 19: 19÷2 = 9 rem 1; 9÷2 = 4 rem 1; 4÷2 = 2 rem 0; 2÷2 = 1 rem 0; 1÷2 = 0 rem 1. Reading remainders bottom to top gives 10011₂, so 19₁₀ = 10011₂.',
      'In signed 8-bit representation the same nonnegative value is padded to eight bits as 00010011. Leading zeros keep every pattern the same width so the sign bit and place values stay aligned.',
    ],
    formula: 'Read remainders from last ÷2 step to first · pad to n bits for fixed width',
  },
  {
    id: 'binary-to-decimal',
    title: 'Converting from Binary to Decimal',
    paragraphs: [
      'Multiply each binary digit by its power of two and add the products. Example: 1101 → 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13, so 1101₂ = 13₁₀.',
      'That positional sum is the unsigned interpretation. This calculator’s fixed-width mode instead treats the bit pattern as signed two’s complement: the most significant bit is the sign bit, so the same digits can mean a different integer once width and signedness are fixed.',
    ],
  },
  {
    id: 'negative-numbers',
    title: 'Converting Negative Numbers',
    paragraphs: [
      'Computer hardware usually represents negative integers with two’s complement at a fixed bit width. To encode −5 in signed 8-bit form: start with +5 = 00000101, invert the bits to 11111010, then add one to get 11111011.',
      'Equivalently, encoded = 2ⁿ + decimal when decimal is negative (256 − 5 = 251 → 11111011). The leftmost bit is the sign bit. The signed 8-bit range is −128 to 127. The pattern 11111111 is −1 in signed 8-bit two’s complement, but 255 if read as unsigned 8-bit.',
    ],
    formula: 'If value ≥ 0: binary = value · If value < 0: encode = 2ⁿ + value (two’s complement)',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Binary Converter',
    paragraphs: [
      '1) Choose 8-bit, 16-bit, 32-bit, or 64-bit. 2) Enter an integer in Decimal to get fixed-width binary. 3) Or enter exactly that many 0/1 digits in Binary to get the signed decimal. 4) Read the result in the same section. 5) Change width to compare encodings — values that no longer fit show a clear range error. 6) Copy or share with the action buttons.',
      'Examples: decimal 42 → 8-bit 00101010; binary 11111110 → signed 8-bit decimal −2. The two conversion sections stay independent so one input does not overwrite the other.',
    ],
  },
  {
    id: 'reference-table',
    title: 'Decimal to Binary Conversion Table',
    paragraphs: [
      'Unsigned binary values with the matching signed 8-bit padded pattern for nonnegative integers in range:',
    ],
    table: [
      { left: '0', right: '0', third: '00000000' },
      { left: '1', right: '1', third: '00000001' },
      { left: '2', right: '10', third: '00000010' },
      { left: '3', right: '11', third: '00000011' },
      { left: '4', right: '100', third: '00000100' },
      { left: '5', right: '101', third: '00000101' },
      { left: '8', right: '1000', third: '00001000' },
      { left: '10', right: '1010', third: '00001010' },
      { left: '15', right: '1111', third: '00001111' },
      { left: '16', right: '10000', third: '00010000' },
      { left: '32', right: '100000', third: '00100000' },
      { left: '42', right: '101010', third: '00101010' },
      { left: '64', right: '1000000', third: '01000000' },
      { left: '100', right: '1100100', third: '01100100' },
      { left: '127', right: '1111111', third: '01111111' },
    ],
    tableHeaders: ['Decimal', 'Binary', 'Signed 8-bit'],
  },
];

export const BINARY_FAQS: readonly FAQItem[] = [
  {
    question: 'What is binary?',
    answer:
      'Binary is a base-2 numbering system that uses only the digits 0 and 1. Computers use binary to represent and process digital information.',
  },
  {
    question: 'How do you convert decimal to binary?',
    answer:
      'Repeatedly divide the decimal integer by two, record the remainders, and read them from bottom to top. For signed negative numbers, use two’s-complement encoding for the selected bit width.',
  },
  {
    question: 'How do you convert binary to decimal?',
    answer:
      'Multiply each binary digit by its corresponding power of two and add the results. For fixed-width signed binary, also account for the sign bit using two’s-complement interpretation.',
  },
  {
    question: 'What is 1010 in decimal?',
    answer:
      'As an unsigned binary value, 1010₂ = 10₁₀. In signed 8-bit form, 00001010 also represents 10. The four-bit pattern 1010 represents −6 when interpreted as signed 4-bit two’s complement.',
  },
  {
    question: 'What is 255 in binary?',
    answer:
      '255 = 11111111. That pattern needs unsigned 8-bit interpretation or a wider signed width. 255 is outside the signed 8-bit range (−128 to 127).',
  },
  {
    question: 'What is −1 in 8-bit binary?',
    answer: '11111111 — the signed 8-bit two’s-complement representation of −1.',
  },
  {
    question: 'How many values can 8 bits represent?',
    answer:
      'Eight bits can represent 256 distinct patterns. Signed 8-bit range: −128 to 127. Unsigned 8-bit range: 0 to 255.',
  },
  {
    question: 'What is the difference between signed and unsigned binary?',
    answer:
      'Signed binary can represent negative and positive values, whereas unsigned binary represents only nonnegative integers. For the same bit width, their numerical ranges differ.',
  },
  {
    question: "What is two's complement?",
    answer:
      'Two’s complement is a common representation of signed integers in computer systems. To encode a negative value at a fixed width, invert the bits of its positive magnitude and add one, provided the magnitude is representable.',
  },
  {
    question: 'Can binary numbers contain decimals?',
    answer:
      'Yes — binary fractions exist (for example 0.1₂ = 0.5₁₀). This calculator is specifically for fixed-width integer conversion and does not support binary fractions.',
  },
];
