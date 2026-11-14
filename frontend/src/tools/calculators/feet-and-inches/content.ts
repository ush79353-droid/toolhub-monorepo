import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const FEET_AND_INCHES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'add', label: 'How to Add Feet and Inches' },
  { id: 'subtract', label: 'How to Subtract Feet and Inches' },
  { id: 'multiply', label: 'How to Multiply Feet and Inches' },
  { id: 'divide', label: 'How to Divide Feet and Inches' },
  { id: 'fractions', label: 'How to Add Feet and Fractional Inches' },
  { id: 'precision', label: 'Understanding Fractional-Inch Precision' },
  { id: 'conversion-table', label: 'Feet and Inches Conversion Table' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'feet-and-inches-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  feet: string;
  inches: string;
}

export interface FeetAndInchesGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
}

export const FEET_AND_INCHES_GUIDE_SECTIONS: readonly FeetAndInchesGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Feet and Inches Calculator performs arithmetic on mixed imperial lengths—feet, inches, and fractions of an inch. Add or subtract two lengths, or multiply and divide a length by a dimensionless number, then read a normalized feet-and-inches result with decimal and metric equivalents.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Calculator',
    paragraphs: [
      'Enter the first feet-and-inches measurement. Choose addition, subtraction, multiplication, or division. For +/− enter a second length; for ×/÷ enter a scalar. Pick fractional-inch precision (default 1/16). Read the mixed result, decimal feet, total inches, and optional metric conversions. Copy or reset when finished.',
    ],
  },
  {
    id: 'add',
    title: 'How to Add Feet and Inches',
    paragraphs: [
      'Convert both lengths to total inches, add, then convert back. Example: 3 ft 8 in + 2 ft 7 in = 44 in + 31 in = 75 in = 6 ft 3 in.',
    ],
    formula: 'total inches = feet × 12 + inches',
  },
  {
    id: 'subtract',
    title: 'How to Subtract Feet and Inches',
    paragraphs: [
      'Convert both lengths to inches, subtract, and normalize. Example: 6 ft 2 in − 3 ft 8 in = 74 − 44 = 30 in = 2 ft 6 in. If the second length is larger, the result is a negative signed measurement such as −1 ft 6 in.',
    ],
  },
  {
    id: 'multiply',
    title: 'How to Multiply Feet and Inches',
    paragraphs: [
      'Multiply a length by a dimensionless scalar—not by another length (that would be area). Example: 4 ft 3 in × 3 = 51 in × 3 = 153 in = 12 ft 9 in.',
    ],
  },
  {
    id: 'divide',
    title: 'How to Divide Feet and Inches',
    paragraphs: [
      'Divide total inches by a nonzero scalar, then normalize. Example: 8 ft 6 in ÷ 3 = 102 ÷ 3 = 34 in = 2 ft 10 in. Division by zero is rejected.',
    ],
  },
  {
    id: 'fractions',
    title: 'How to Add Feet and Fractional Inches',
    paragraphs: [
      'Fractions and mixed numbers are allowed in the inches fields. Example: 2 ft 3 1/2 in + 1 ft 4 1/4 in = 27.5 + 16.25 = 43.75 in = 3 ft 7 3/4 in at 1/16 precision.',
    ],
  },
  {
    id: 'precision',
    title: 'Understanding Fractional-Inch Precision',
    paragraphs: [
      'Precision choices from 1/2 through 1/256 set the smallest fraction used when displaying the result. Values that are not exact at that step are rounded to the nearest tick. Metric and decimal-foot totals always use the exact unrounded length so rounding the display does not change the underlying math.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Feet and Inches Conversion Table',
    paragraphs: ['Whole-foot values use the exact relationship 1 foot = 12 inches.'],
    table: [
      { feet: '1', inches: '12' },
      { feet: '2', inches: '24' },
      { feet: '3', inches: '36' },
      { feet: '4', inches: '48' },
      { feet: '5', inches: '60' },
      { feet: '6', inches: '72' },
      { feet: '8', inches: '96' },
      { feet: '10', inches: '120' },
      { feet: '12', inches: '144' },
    ],
  },
  {
    id: 'practical-applications',
    title: 'Practical Applications',
    paragraphs: [
      'Use the calculator for construction takeoffs, carpentry and woodworking cuts, home renovation layouts, interior design clearances, architecture sketches, engineering notes, and DIY measurement planning.',
      'This page performs length arithmetic only. It does not replace calibrated measuring tools or building-code checks.',
    ],
  },
];

export const FEET_AND_INCHES_FAQS: readonly FAQItem[] = [
  {
    question: 'How should I write feet and inches?',
    answer: 'Common notation uses ft and in, or the prime and double-prime symbols—for example 5 ft 8 in or 5′ 8″.',
  },
  {
    question: 'How many feet are in 12 inches?',
    answer: 'Exactly one foot.',
  },
  {
    question: 'How many inches are in one foot?',
    answer: 'Exactly 12 inches.',
  },
  {
    question: 'How do I add feet and inches?',
    answer:
      'Convert both measurements to inches, add them, and convert the total back into feet and remaining inches.',
  },
  {
    question: 'How do I subtract feet and inches?',
    answer: 'Convert both lengths to a common unit, subtract, and normalize the result.',
  },
  {
    question: 'Can I add fractional inches?',
    answer: 'Yes. The calculator supports fractions such as 1/2, 3/8, and 7/16, plus mixed numbers.',
  },
  {
    question: 'How do I convert 62 inches into feet and inches?',
    answer: '62 ÷ 12 = 5 remainder 2, so the result is 5 ft 2 in.',
  },
  {
    question: 'How do I multiply feet and inches?',
    answer:
      'Convert the length to total inches, multiply by a dimensionless number, and normalize.',
  },
  {
    question: 'How do I divide feet and inches?',
    answer:
      'Convert the length to total inches, divide by a nonzero scalar, and convert back.',
  },
  {
    question: 'Can the calculator produce negative measurements?',
    answer: 'Yes. Subtraction may produce a negative signed length result.',
  },
  {
    question: 'What happens when inches exceed 12?',
    answer: 'The calculator automatically converts complete groups of 12 inches into feet.',
  },
  {
    question: 'How do I convert feet and inches to meters?',
    answer:
      'First calculate total inches, then multiply by exactly 0.0254 meters per inch.',
  },
];
