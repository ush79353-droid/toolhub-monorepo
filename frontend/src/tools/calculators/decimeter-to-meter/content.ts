import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { decimetersToMeters, formatLength } from './calculation';

export const DECIMETER_TO_METER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-a-decimeter', label: 'What Does Decimeter Mean?' },
  { id: 'what-is-a-meter', label: 'What Is a Meter?' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'dm-to-m', label: 'How to Convert Decimeters to Meters' },
  { id: 'm-to-dm', label: 'How to Convert Meters to Decimeters' },
  { id: 'conversion-table', label: 'Decimeter to Meter Conversion Table' },
  { id: 'practical-applications', label: 'Practical Applications' },
  { id: 'decimeter-to-meter-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  decimeters: string;
  meters: string;
}

export interface DecimeterToMeterGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
}

const TABLE_DM = [1, 5, 10, 20, 25, 50, 100, 250, 500, 1000] as const;

export const DECIMETER_TO_METER_GUIDE_SECTIONS: readonly DecimeterToMeterGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Decimeter to Meter Converter switches lengths between two metric units related by an exact factor of ten. Enter decimeters or meters and read the matching value instantly.',
      'Open More conversion options for millimeters, centimeters, kilometers, inches, feet, and yards from the same length. The conversion runs in your browser with no account required.',
    ],
  },
  {
    id: 'what-is-a-decimeter',
    title: 'What Does Decimeter Mean?',
    paragraphs: [
      'A decimeter is one-tenth of a meter. The SI prefix deci- means one-tenth, and the symbol is dm. One decimeter equals exactly 10 centimeters and exactly 100 millimeters.',
      'A ruler mark at 10 cm is one decimeter. Ten of those marks end-to-end make one full meter.',
    ],
  },
  {
    id: 'what-is-a-meter',
    title: 'What Is a Meter?',
    paragraphs: [
      'The meter is the SI base unit of length. Its symbol is m. One meter contains exactly ten decimeters, 100 centimeters, and 1,000 millimeters.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Converter',
    paragraphs: [
      'Type a length in decimeters to fill meters, or type meters to fill decimeters. The field you are editing keeps your raw text—including a trailing decimal—until the number is complete.',
      'Expand More conversion options for additional units. Copy result places a short summary on the clipboard. Reset clears both fields.',
    ],
  },
  {
    id: 'dm-to-m',
    title: 'How to Convert Decimeters to Meters',
    paragraphs: [
      'Divide decimeters by 10. Example: 43 dm ÷ 10 = 4.3 m. Another example from the calculator default: 34.6 dm ÷ 10 = 3.46 m.',
    ],
    formula: 'meters = decimeters / 10',
    formulaNote: 'Equivalent: meters = decimeters × 0.1. The factor is exact.',
  },
  {
    id: 'm-to-dm',
    title: 'How to Convert Meters to Decimeters',
    paragraphs: [
      'Multiply meters by 10. Example: 7.8 m × 10 = 78 dm.',
    ],
    formula: 'decimeters = meters × 10',
  },
  {
    id: 'conversion-table',
    title: 'Decimeter to Meter Conversion Table',
    paragraphs: [
      'Common whole-decimeter values are listed below. Every row uses meters = decimeters ÷ 10.',
    ],
    table: TABLE_DM.map((dm) => ({
      decimeters: formatLength(dm),
      meters: formatLength(decimetersToMeters(dm)),
    })),
  },
  {
    id: 'practical-applications',
    title: 'Practical Applications',
    paragraphs: [
      'Use the converter for classroom metric practice, scientific notes, engineering sketches, construction takeoffs, and everyday length comparisons when plans mix decimeters and meters.',
      'This page only scales a known length. It does not replace calibrated measuring tools.',
    ],
  },
];

export const DECIMETER_TO_METER_FAQS: readonly FAQItem[] = [
  {
    question: 'How many decimeters are in one meter?',
    answer: 'Exactly 10 decimeters.',
  },
  {
    question: 'How many meters are in one decimeter?',
    answer: 'Exactly 0.1 meters.',
  },
  {
    question: 'What is a decimeter?',
    answer: 'A decimeter is a metric unit of length equal to one-tenth of a meter.',
  },
  {
    question: 'How do I convert decimeters to meters?',
    answer: 'Divide the decimeter value by 10.',
  },
  {
    question: 'How do I convert meters to decimeters?',
    answer: 'Multiply the meter value by 10.',
  },
  {
    question: 'How many meters are in 43 decimeters?',
    answer: '43 ÷ 10 = 4.3 meters.',
  },
  {
    question: 'How many decimeters are in 7.8 meters?',
    answer: '7.8 × 10 = 78 decimeters.',
  },
  {
    question: 'How do I convert 77.8 dm to meters?',
    answer: '77.8 ÷ 10 = 7.78 meters.',
  },
  {
    question: 'Is a decimeter larger than a centimeter?',
    answer: 'Yes. One decimeter equals 10 centimeters.',
  },
  {
    question: 'Is one decimeter equal to one meter?',
    answer: 'No. One decimeter equals 0.1 meter.',
  },
];
