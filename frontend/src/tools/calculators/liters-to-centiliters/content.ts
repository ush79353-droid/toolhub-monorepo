import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatVolume, litersToCentiliters } from './calculation';
import { CENTILITERS_PER_LITER } from './types';

export const LITERS_TO_CENTILITERS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-a-liter', label: 'What Is a Liter?' },
  { id: 'what-is-a-centiliter', label: 'What Is a Centiliter?' },
  { id: 'l-to-cl', label: 'How to Convert Liters to Centiliters' },
  { id: 'cl-to-l', label: 'How to Convert Centiliters to Liters' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'conversion-table', label: 'Liters to Centiliters Conversion Table' },
  { id: 'difference', label: 'Difference Between Liters and Centiliters' },
  { id: 'metric-units', label: 'Common Metric Volume Units' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'liters-to-centiliters-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  liters: string;
  centiliters: string;
}

export interface LitersToCentilitersGuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
}

const TABLE_LITERS = [
  0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 5, 10, 25, 100,
] as const;

export const LITERS_TO_CENTILITERS_GUIDE_SECTIONS: readonly LitersToCentilitersGuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This converter turns metric volume between liters (L) and centiliters (cL). Enter either unit and read the matching value instantly.',
      'The factor is exact: one liter equals one hundred centiliters. Expand More conversion options for milliliters, deciliters, cubic units, and US liquid measures.',
    ],
  },
  {
    id: 'what-is-a-liter',
    title: 'What Is a Liter?',
    paragraphs: [
      'A liter is a metric volume unit with symbol L. One liter equals exactly 1000 milliliters, exactly 100 centiliters, and exactly one cubic decimeter (1 dm³). Liters are common for beverages, containers, and everyday liquid measurements.',
    ],
  },
  {
    id: 'what-is-a-centiliter',
    title: 'What Is a Centiliter?',
    paragraphs: [
      'A centiliter is one-hundredth of a liter. Its symbol is cL. The prefix centi- means one-hundredth. One centiliter equals exactly 10 milliliters and is useful for smaller liquid volumes such as servings and lab aliquots.',
    ],
  },
  {
    id: 'l-to-cl',
    title: 'How to Convert Liters to Centiliters',
    paragraphs: [
      'Multiply liters by 100. Example: 0.5 L × 100 = 50 cL.',
    ],
    formula: 'centiliters = liters × 100',
  },
  {
    id: 'cl-to-l',
    title: 'How to Convert Centiliters to Liters',
    paragraphs: [
      'Divide centiliters by 100. Example: 25 cL ÷ 100 = 0.25 L.',
    ],
    formula: 'liters = centiliters / 100',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Converter',
    paragraphs: [
      'Enter a volume in liters to fill centiliters, or enter centiliters to fill liters. Open More conversion options for mL, dL, cm³, m³, US gal, and US fl oz. Copy result places a short summary on the clipboard; Reset clears both fields.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Liters to Centiliters Conversion Table',
    paragraphs: [
      `Common values below use the same engine as the calculator. Every row follows 1 L = ${CENTILITERS_PER_LITER} cL exactly.`,
    ],
    table: TABLE_LITERS.map((liters) => ({
      liters: formatVolume(liters),
      centiliters: formatVolume(litersToCentiliters(liters)),
    })),
  },
  {
    id: 'difference',
    title: 'Difference Between Liters and Centiliters',
    paragraphs: [
      'Both units measure volume. A liter is exactly 100 times larger than a centiliter, so 1 L = 100 cL and 1 cL = 0.01 L.',
    ],
  },
  {
    id: 'metric-units',
    title: 'Common Metric Volume Units',
    paragraphs: [
      'Within the metric ladder: 1 L = 1000 mL = 100 cL = 10 dL = 1000 cm³ = 0.001 m³. Centiliters sit between milliliters and deciliters: 1 cL = 10 mL and 1 dL = 10 cL.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Use the converter for cooking and beverage measures, food prep, chemistry and lab notes, classroom metric drills, container capacities, and everyday L ↔ cL checks.',
      'This page converts volume only. It is not a full Volume Converter substitute for every unit.',
    ],
  },
];

export const LITERS_TO_CENTILITERS_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert liters to centiliters?',
    answer: 'Multiply liters by 100.',
  },
  {
    question: 'How do I convert centiliters to liters?',
    answer: 'Divide centiliters by 100.',
  },
  {
    question: 'How many centiliters are in one liter?',
    answer: 'Exactly 100 centiliters.',
  },
  {
    question: 'How many liters are in one centiliter?',
    answer: 'Exactly 0.01 liters.',
  },
  {
    question: 'How many cL make one L?',
    answer: '100 cL make one L.',
  },
  {
    question: 'How many centiliters are in 0.5 liters?',
    answer: '0.5 × 100 = 50 cL.',
  },
  {
    question: 'How many liters are in 25 centiliters?',
    answer: '25 ÷ 100 = 0.25 L.',
  },
  {
    question: 'How many centiliters are in 2.5 liters?',
    answer: '2.5 × 100 = 250 cL.',
  },
  {
    question: 'Which is bigger: 50 cL or 500 mL?',
    answer: 'They are equal. 50 cL = 500 mL = 0.5 L.',
  },
  {
    question: 'Is a centiliter the same as a milliliter?',
    answer: 'No. One centiliter equals 10 milliliters.',
  },
  {
    question: 'What is the difference between cL and mL?',
    answer: 'A centiliter is ten times larger than a milliliter.',
  },
  {
    question: 'Can I convert decimal liter values?',
    answer: 'Yes. The calculator supports integers and decimal measurements.',
  },
];
