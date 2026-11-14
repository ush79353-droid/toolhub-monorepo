import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, poundsToOunces } from './calculation';
import { GRAMS_PER_POUND, OUNCES_PER_POUND, OUNCES_PER_STONE } from './types';

export const POUNDS_AND_OUNCES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'how-it-works', label: 'How the Calculator Works' },
  { id: 'what-is-a-pound', label: 'What Is a Pound?' },
  { id: 'what-is-an-ounce', label: 'What Is an Ounce?' },
  { id: 'pounds-to-ounces', label: 'Convert Pounds to Ounces' },
  { id: 'ounces-to-pounds', label: 'Convert Ounces to Pounds' },
  { id: 'grams-to-lb-oz', label: 'Grams to Pounds and Ounces' },
  { id: 'kg-to-lb-oz', label: 'Kilograms to Pounds and Ounces' },
  { id: 'add-lb-oz', label: 'How to Add Pounds and Ounces' },
  { id: 'normalize-ounces', label: 'Why Ounces Must Be Normalized' },
  { id: 'conversion-table', label: 'Conversion Table' },
  { id: 'decimal-vs-mixed', label: 'Decimal vs Mixed Weights' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'pounds-and-ounces-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  pounds: string;
  ounces: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
  tableNote?: string;
}

const TABLE_LB = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 5, 10, 14, 20, 50, 100] as const;

function tableRows(): readonly ConversionTableRow[] {
  return TABLE_LB.map((lb) => ({
    pounds: formatMeasure(lb),
    ounces: formatMeasure(poundsToOunces(lb)),
  }));
}

export const POUNDS_AND_OUNCES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Pounds and Ounces Calculator converts between decimal pounds, total ounces, mixed pounds-and-ounces, metric mass (mg, g, kg, t), and stones. A second section adds multiple mixed-weight measurements and normalizes the total.',
      `All conversions use the exact avoirdupois relationship 1 lb = ${OUNCES_PER_POUND} oz and 1 lb = ${GRAMS_PER_POUND} g.`,
    ],
  },
  {
    id: 'how-it-works',
    title: 'How the Pounds and Ounces Calculator Works',
    paragraphs: [
      `One pound contains exactly ${OUNCES_PER_POUND} avoirdupois ounces. Decimal pounds convert to ounces by multiplying by 16. Mixed weights convert to a canonical ounce total, then normalize so remaining ounces are in the range 0 ≤ oz < 16.`,
    ],
  },
  {
    id: 'what-is-a-pound',
    title: 'What Is a Pound?',
    paragraphs: [
      `A pound is a unit of mass. Its symbol is lb. One international avoirdupois pound equals exactly ${OUNCES_PER_POUND} ounces and exactly ${GRAMS_PER_POUND} grams. Pounds are used for body weight, food, shipping, and everyday mass measurements in some countries.`,
    ],
  },
  {
    id: 'what-is-an-ounce',
    title: 'What Is an Ounce?',
    paragraphs: [
      `An ounce is a unit of mass. Its symbol is oz. One avoirdupois ounce equals exactly ${GRAMS_PER_POUND / OUNCES_PER_POUND} grams, and sixteen ounces equal one pound. Mass ounces must not be confused with fluid ounces, which measure volume.`,
    ],
  },
  {
    id: 'pounds-to-ounces',
    title: 'How to Convert Pounds to Ounces',
    paragraphs: ['Multiply pounds by 16.', 'Example: 2.5 lb × 16 = 40 oz.'],
    formula: 'Ounces = Pounds × 16',
  },
  {
    id: 'ounces-to-pounds',
    title: 'How to Convert Ounces to Pounds',
    paragraphs: ['Divide ounces by 16.', 'Example: 48 oz ÷ 16 = 3 lb.'],
    formula: 'Pounds = Ounces / 16',
  },
  {
    id: 'grams-to-lb-oz',
    title: 'Convert Grams to Pounds and Ounces',
    paragraphs: [
      'Convert grams into total ounces using the exact ounce mass, then divide by 16 for whole pounds and keep the remainder as ounces.',
      `Example: ${formatMeasure(2.5 * GRAMS_PER_POUND)} g = 40 oz = 2 lb 8 oz.`,
    ],
  },
  {
    id: 'kg-to-lb-oz',
    title: 'Convert Kilograms to Pounds and Ounces',
    paragraphs: [
      'Convert kilograms to grams (× 1000), then to ounces, then normalize into pounds and ounces.',
    ],
    formula: 'Total ounces = kilograms × 1000 / 28.349523125',
  },
  {
    id: 'add-lb-oz',
    title: 'How to Add Pounds and Ounces',
    paragraphs: [
      'Convert each measurement to total ounces, add those totals, then normalize: whole pounds = floor(total ÷ 16), remaining ounces = total − whole pounds × 16.',
      'Example: 2 lb 10 oz + 3 lb 9 oz → 42 + 57 = 99 oz → 6 lb 3 oz.',
    ],
  },
  {
    id: 'normalize-ounces',
    title: 'Why Ounces Must Be Normalized',
    paragraphs: [
      'Because 16 oz = 1 lb, values such as 20 oz or 32 oz should be rewritten as mixed pounds and ounces for everyday reading: 20 oz = 1 lb 4 oz, and 32 oz = 2 lb 0 oz.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Pounds to Ounces Conversion Table',
    paragraphs: ['Exact conversions using 1 lb = 16 oz.'],
    table: tableRows(),
    tableNote: 'Avoirdupois mass only. Not fluid ounces or troy ounces.',
  },
  {
    id: 'decimal-vs-mixed',
    title: 'Decimal Pounds vs Mixed Pounds and Ounces',
    paragraphs: [
      'The fractional part of a decimal pound must be multiplied by 16 to obtain ounces. So 2.5 lb = 2 lb 8 oz, not 2 lb 5 oz. Likewise 3.75 lb = 3 lb 12 oz.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Use the calculator for cooking and food weights, shipping and packaging, fitness and body-weight tracking, classroom arithmetic, and general mass conversion between imperial and metric units.',
    ],
  },
];

export const POUNDS_AND_OUNCES_FAQS: readonly FAQItem[] = [
  {
    question: 'How many ounces are in one pound?',
    answer: 'Exactly 16 avoirdupois ounces.',
  },
  {
    question: 'How do I convert pounds to ounces?',
    answer: 'Multiply pounds by 16.',
  },
  {
    question: 'How do I convert ounces to pounds?',
    answer: 'Divide ounces by 16.',
  },
  {
    question: 'How many ounces are in 1.5 pounds?',
    answer: '1.5 × 16 = 24 oz.',
  },
  {
    question: 'How many ounces are in 2.5 pounds?',
    answer: '2.5 × 16 = 40 oz.',
  },
  {
    question: 'How do I convert pounds and ounces into decimal pounds?',
    answer:
      'Decimal pounds = pounds + ounces / 16. Example: 3 lb 8 oz = 3 + 8/16 = 3.5 lb.',
  },
  {
    question: 'How do I convert decimal pounds to pounds and ounces?',
    answer:
      'Keep the whole-pound portion and multiply the fractional part by 16 to get ounces.',
  },
  {
    question: 'How many pounds are in 40 ounces?',
    answer: '40 / 16 = 2.5 lb.',
  },
  {
    question: 'How do I add pounds and ounces?',
    answer:
      'Convert each measurement to ounces, add them, then normalize the total into pounds and ounces.',
  },
  {
    question: 'How many ounces are in a pound and a half?',
    answer: 'Exactly 24 ounces.',
  },
  {
    question: 'How many pounds are in one kilogram?',
    answer: `Approximately ${formatMeasure(1000 / GRAMS_PER_POUND)} pounds (exact grams per pound: ${GRAMS_PER_POUND}).`,
  },
  {
    question: 'How many grams are in one pound?',
    answer: `Exactly ${GRAMS_PER_POUND} grams.`,
  },
  {
    question: 'How many ounces are in one stone?',
    answer: `Exactly ${OUNCES_PER_STONE} ounces (14 lb).`,
  },
  {
    question: 'Are ounces and fluid ounces the same?',
    answer: 'No. Ounces measure mass, while fluid ounces measure volume.',
  },
  {
    question: 'Can I enter decimal ounces?',
    answer: 'Yes. The calculator supports fractional ounce measurements.',
  },
  {
    question: 'Can I add more than two weight measurements?',
    answer: 'Yes. Use Add Another Measurement to append more rows.',
  },
];
