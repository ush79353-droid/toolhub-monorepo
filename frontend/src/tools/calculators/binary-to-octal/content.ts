import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const BINARY_OCTAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'binary-octal-systems', label: 'Binary and Octal Number Systems' },
  { id: 'convert-binary-octal', label: 'Convert Binary to Octal' },
  { id: 'convert-octal-binary', label: 'Convert Octal to Binary' },
  { id: 'how-to-use', label: 'Using the Converter' },
  { id: 'conversion-chart', label: 'Binary to Octal Chart' },
  { id: 'why-convert', label: 'Why Convert Binary to Octal?' },
  { id: 'binary-octal-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { left: string; right: string }[];
  tableHeaders?: readonly [string, string];
}

export const BINARY_OCTAL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'binary-octal-systems',
    title: 'Binary and Octal Number Systems',
    paragraphs: [
      'Binary is base 2 and uses only the digits 0 and 1: the natural language of digital circuits. Octal is base 8 and uses digits 0–7. Because 8 = 2³, each octal digit maps exactly to three binary bits, so grouping bits in threes is an exact conversion method rather than an approximation.',
      'Computers store information as bits; octal is a compact reading aid for those bits in educational, historical, and some systems contexts (for example Unix permission modes).',
    ],
    formula: '1 octal digit = 3 binary bits',
    table: [
      { left: '0', right: '000' },
      { left: '1', right: '001' },
      { left: '2', right: '010' },
      { left: '3', right: '011' },
      { left: '4', right: '100' },
      { left: '5', right: '101' },
      { left: '6', right: '110' },
      { left: '7', right: '111' },
    ],
    tableHeaders: ['Octal Digit', 'Binary Equivalent'],
  },
  {
    id: 'convert-binary-octal',
    title: 'How to Convert Binary to Octal',
    paragraphs: [
      'Group binary digits into sets of three starting from the right. Pad the leftmost group with zeros if needed, convert each triad to an octal digit, then drop insignificant leading zeros from the result.',
      'Example: 11010110 → pad as 011 010 110 → 3, 2, 6 → 326₈.',
    ],
  },
  {
    id: 'convert-octal-binary',
    title: 'How to Convert Octal to Binary',
    paragraphs: [
      'Replace each octal digit with its three-bit binary group, concatenate the groups, and remove unnecessary leading zeros while keeping a single 0 when the value is zero.',
      'Example: 472₈ → 100 111 010 → 100111010₂.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'Using the Binary to Octal Converter; An Example',
    paragraphs: [
      '1) Choose Binary to octal or Octal to binary. 2) Enter a valid integer in the selected base. 3) Read the converted result. 4) Expand conversion steps for the triad table. 5) Switch direction to work the other way. 6) Share or reset as needed.',
      'This tool handles non-negative integers only. Fractional or signed two’s-complement inputs are not silently reinterpreted.',
    ],
  },
  {
    id: 'conversion-chart',
    title: 'Binary to Octal Conversion Chart',
    paragraphs: ['Selected verified conversions:'],
    table: [
      { left: '0', right: '0' },
      { left: '1', right: '1' },
      { left: '10', right: '2' },
      { left: '11', right: '3' },
      { left: '100', right: '4' },
      { left: '101', right: '5' },
      { left: '110', right: '6' },
      { left: '111', right: '7' },
      { left: '1000', right: '10' },
      { left: '1001', right: '11' },
      { left: '1010', right: '12' },
      { left: '1111', right: '17' },
      { left: '10000', right: '20' },
      { left: '111111', right: '77' },
      { left: '1000000', right: '100' },
      { left: '111111111', right: '777' },
    ],
    tableHeaders: ['Binary', 'Octal'],
  },
  {
    id: 'why-convert',
    title: 'Why Convert Binary to Octal?',
    paragraphs: [
      'Three-bit grouping helps students and engineers read bit patterns more quickly than long binary strings. Octal appears in computer science education, digital electronics teaching, and Unix-style permission notation where each octal digit stands for a three-bit permission group.',
      'Modern mainstream computing more often uses hexadecimal (four-bit groups). Octal remains useful where three-bit alignment matches the problem; it is not the universal machine representation.',
    ],
  },
];

export const BINARY_OCTAL_FAQS: readonly FAQItem[] = [
  {
    question: 'How do you convert binary to octal?',
    answer:
      'Group binary digits into sets of three from right to left, add leading zeros if needed, and convert each group to its corresponding octal digit.',
  },
  {
    question: 'How do you convert octal to binary?',
    answer:
      'Replace each octal digit with its three-bit binary representation, concatenate the groups, and remove unnecessary leading zeros.',
  },
  {
    question: 'What is the octal equivalent of 11010110?',
    answer: '11010110₂ = 326₈.',
  },
  {
    question: 'What is the octal equivalent of 101101?',
    answer: '101101₂ = 55₈ (groups 101 and 101 → 5 and 5).',
  },
  {
    question: 'What is the binary equivalent of octal 472?',
    answer: '472₈ = 100111010₂.',
  },
  {
    question: 'What is the base of the binary number system?',
    answer: 'Binary uses base 2 and contains only the digits 0 and 1.',
  },
  {
    question: 'What is the base of the octal number system?',
    answer: 'Octal uses base 8 and contains digits from 0 through 7.',
  },
  {
    question: 'Why are binary numbers grouped in threes for octal conversion?',
    answer: 'Because 8 equals 2 cubed, each octal digit corresponds exactly to three binary bits.',
  },
  {
    question: 'Can binary numbers contain the digit 2?',
    answer: 'No. Binary digits can only be 0 or 1.',
  },
  {
    question: 'Can octal numbers contain 8 or 9?',
    answer: 'No. Octal digits range from 0 to 7.',
  },
];
