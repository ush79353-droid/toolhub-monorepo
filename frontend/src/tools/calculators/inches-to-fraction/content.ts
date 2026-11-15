import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const INCHES_TO_FRACTION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'decimal-to-fraction', label: 'Decimal Inches to Fractions' },
  { id: 'fraction-to-decimal', label: 'Fractional Inches to Decimal' },
  { id: 'mixed-to-decimal', label: 'Mixed Numbers to Decimal' },
  { id: 'fractional-precision', label: 'Understanding Fractional Precision' },
  { id: 'conversion-table', label: 'Fraction to Inches Table' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'inches-to-fraction-faq', label: 'Frequently Asked Questions' },
];

export interface FractionTableRow {
  fraction: string;
  decimal: string;
  millimeters: string;
}

export interface InchesToFractionGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly FractionTableRow[];
}

export const INCHES_TO_FRACTION_GUIDE_SECTIONS: readonly InchesToFractionGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'Many rulers and construction drawings still mark inches in halves, quarters, eighths, and sixteenths. This calculator turns a decimal-inch measurement into the nearest readable fractional inch at a precision you choose, and it also accepts fractions or mixed numbers and shows their decimal value.',
      'Metric conversions in the expandable section use the exact international inch (25.4 mm) applied to the original entered length, not the rounded fraction.',
    ],
  },
  {
    id: 'decimal-to-fraction',
    title: 'How to Convert Decimal Inches to Fractions',
    paragraphs: [
      'Pick a denominator D that matches your precision (for 1/16 inch, D = 16). Multiply the decimal by D, round to the nearest whole number, then reduce the fraction.',
      'Example: convert 0.625 inches at 1/16 precision. 0.625 × 16 = 10. Then 10/16 reduces by dividing by 2, giving 5/8 inch.',
    ],
    formula: 'rounded = round(inches × D) / D',
    formulaNote: 'Reduce the fractional part with the greatest common divisor.',
  },
  {
    id: 'fraction-to-decimal',
    title: 'How to Convert Fractional Inches to Decimal Inches',
    paragraphs: [
      'Divide the numerator by the denominator. Example: 3/8 = 3 ÷ 8 = 0.375 inches. Improper fractions such as 7/4 become 1.75 inches, which this calculator also shows as 1 3/4 at 1/16 precision.',
    ],
  },
  {
    id: 'mixed-to-decimal',
    title: 'How to Convert Mixed Numbers to Decimal Inches',
    paragraphs: [
      'Add the whole number to the fractional part. Example: 2 3/4 = 2 + 3/4 = 2 + 0.75 = 2.75 inches. Enter mixed numbers with a space between the whole and the fraction.',
    ],
  },
  {
    id: 'fractional-precision',
    title: 'Understanding Fractional Precision',
    paragraphs: [
      'A 1/8-inch scale is coarser than 1/16, which is coarser than 1/32 or 1/64. Finer precision keeps more of the original decimal; coarser precision rounds to fewer marks and may label the result as approximate.',
      'Choose the increment that matches the tape, caliper, or drawing you are using so the displayed fraction can actually be marked.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Fraction to Inches Conversion Table',
    paragraphs: [
      'Common fractional inches with decimal and millimeter equivalents (1 inch = 25.4 mm).',
    ],
    table: [
      { fraction: '1/16', decimal: '0.0625', millimeters: '1.5875' },
      { fraction: '1/8', decimal: '0.125', millimeters: '3.175' },
      { fraction: '1/4', decimal: '0.25', millimeters: '6.35' },
      { fraction: '3/8', decimal: '0.375', millimeters: '9.525' },
      { fraction: '1/2', decimal: '0.5', millimeters: '12.7' },
      { fraction: '5/8', decimal: '0.625', millimeters: '15.875' },
      { fraction: '3/4', decimal: '0.75', millimeters: '19.05' },
      { fraction: '7/8', decimal: '0.875', millimeters: '22.225' },
      { fraction: '1', decimal: '1', millimeters: '25.4' },
    ],
  },
  {
    id: 'practical-applications',
    title: 'Practical Applications',
    paragraphs: [
      'Woodworking cut lists, construction layouts, machining drawings, manufacturing tolerances, and DIY projects often mix decimal printouts with fractional rulers. Converting between the two keeps shop notes and cut marks consistent.',
      'When a drawing specifies a tolerance tighter than your chosen increment, keep the decimal or pick a finer precision instead of forcing a coarse fraction.',
    ],
  },
];

export const INCHES_TO_FRACTION_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert decimal inches to fractions?',
    answer:
      'Multiply by the precision denominator (for example 16 for sixteenths), round to the nearest whole number, then reduce the fraction.',
  },
  {
    question: 'What is 0.125 inches as a fraction?',
    answer: '0.125 inches equals 1/8 inch.',
  },
  {
    question: 'What is 0.375 inches as a fraction?',
    answer: '0.375 inches equals 3/8 inch.',
  },
  {
    question: 'What is 1.375 inches as a fraction?',
    answer: '1.375 inches equals 1 3/8 inches at 1/16-inch precision (and is exact).',
  },
  {
    question: 'How do I convert fractional inches to decimal inches?',
    answer: 'Divide the numerator by the denominator. For example, 3/8 = 0.375 inches.',
  },
  {
    question: 'What is the difference between 1/16 and 1/32 precision?',
    answer:
      '1/32 is twice as fine as 1/16. A value that falls between sixteenth marks can land on a thirty-second mark without as much rounding.',
  },
  {
    question: 'How do I convert fractions of an inch to millimeters?',
    answer:
      'Convert to decimal inches first, then multiply by 25.4. This calculator’s other-units list does that from the original measurement.',
  },
  {
    question: 'Can I enter mixed numbers such as 2 3/8?',
    answer: 'Yes. Enter the whole number, a space, then the fraction—for example 2 3/8.',
  },
];
