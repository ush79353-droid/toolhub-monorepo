import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  GRAMS_PER_POUND,
  formatMass,
  gramsToPounds,
  poundsToGrams,
} from './calculation';
import { KG_PER_POUND, POUNDS_PER_KG } from './types';

export const POUNDS_TO_GRAMS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Pounds to Grams Converter' },
  { id: 'how-to-convert', label: 'How Do I Convert Pounds to Grams?' },
  { id: 'how-to-use', label: 'How Do I Use This Pounds to Grams Converter?' },
  { id: 'conversion-table', label: 'Pounds to Grams Conversion Table' },
  { id: 'grams-to-pounds', label: 'How to Convert Grams to Pounds' },
  { id: 'pounds-vs-grams', label: 'Pounds vs Grams; What\'s the Difference?' },
  { id: 'related-converters', label: 'Other Weight Converters' },
  { id: 'pounds-to-grams-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_LB = [0.1, 0.25, 0.5, 1, 2, 3, 5, 10, 15, 20, 25, 50, 100] as const;

export const POUNDS_TO_GRAMS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Pounds to Grams Converter',
    paragraphs: [
      'Convert mass between pounds (lb) and grams (g) instantly. Pounds are common in the US customary system; grams are metric. Useful for cooking, food measurement, package weights, fitness tracking, and scientific calculations.',
      `Exact international avoirdupois relationship: 1 lb = ${GRAMS_PER_POUND} g = ${KG_PER_POUND} kg.`,
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert Pounds to Grams?',
    paragraphs: [
      `Multiply pounds by ${GRAMS_PER_POUND}: grams = pounds × ${GRAMS_PER_POUND}.`,
      `Example 1: convert 2 pounds: 2 × ${GRAMS_PER_POUND} = ${formatMass(poundsToGrams(2))} g.`,
      `Example 2: convert 5 pounds: 5 × ${GRAMS_PER_POUND} = ${formatMass(poundsToGrams(5))} g.`,
      `Example 3: convert 0.5 pounds: 0.5 × ${GRAMS_PER_POUND} = ${formatMass(poundsToGrams(0.5))} g.`,
    ],
    formula: `g = lb × ${GRAMS_PER_POUND}`,
  },
  {
    id: 'how-to-use',
    title: 'How Do I Use This Pounds to Grams Converter?',
    paragraphs: [
      '1. Enter the weight in pounds in the first field.',
      '2. The equivalent weight in grams appears automatically.',
      '3. Alternatively, enter a weight in grams.',
      '4. The calculator automatically converts grams to pounds.',
      '5. Use Reload Calculator to restore the default 1 lb, or Clear All Changes to empty both fields.',
      'No separate Convert button is required; both directions update as you type.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Pounds to Grams Conversion Table',
    paragraphs: [
      'Values generated with the exact international avoirdupois conversion factor. Displayed decimals are rounded for readability.',
    ],
    tableHeaders: ['Pounds (lb)', 'Grams (g)'],
    table: TABLE_LB.map((lb) => [formatMass(lb), formatMass(poundsToGrams(lb))]),
  },
  {
    id: 'grams-to-pounds',
    title: 'How to Convert Grams to Pounds',
    paragraphs: [
      `Divide grams by ${GRAMS_PER_POUND}: pounds = grams ÷ ${GRAMS_PER_POUND}.`,
      `Example: 1000 ÷ ${GRAMS_PER_POUND} ≈ ${formatMass(gramsToPounds(1000))} lb. Therefore 1,000 grams is approximately ${formatMass(gramsToPounds(1000))} pounds.`,
      'One kilogram contains 1,000 grams.',
    ],
    formula: `lb = g ÷ ${GRAMS_PER_POUND}`,
  },
  {
    id: 'pounds-vs-grams',
    title: "Pounds vs Grams; What's the Difference?",
    paragraphs: [
      `Pound (lb): a customary unit of mass commonly used in the United States. The internationally defined avoirdupois pound equals exactly ${KG_PER_POUND} kilograms.`,
      'Gram (g): a metric unit of mass equal to one-thousandth of a kilogram.',
      `Quick comparison: 1 pound = ${GRAMS_PER_POUND} grams = ${KG_PER_POUND} kilograms; 1 kilogram ≈ ${formatMass(POUNDS_PER_KG)} pounds; 1 gram ≈ ${formatMass(gramsToPounds(1))} pounds.`,
    ],
    formula: `1 lb = ${GRAMS_PER_POUND} g = ${KG_PER_POUND} kg`,
    tableHeaders: ['Unit', 'Equivalent'],
    table: [
      ['1 pound', `${GRAMS_PER_POUND} grams`],
      ['1 pound', `${KG_PER_POUND} kilograms`],
      ['1 kilogram', `approximately ${formatMass(POUNDS_PER_KG)} pounds`],
      ['1 gram', `approximately ${formatMass(gramsToPounds(1))} pounds`],
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Weight Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Weight Converter, kg to lbs Converter, lbs to kg Converter, lbs to g Converter, Pounds and Ounces Calculator, Ounces to Grams Converter, Grams to Ounces Calculator, and lbs to Stone Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const POUNDS_TO_GRAMS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 1 Pound to Grams?',
    answer: `Multiply one pound by ${GRAMS_PER_POUND}: 1 × ${GRAMS_PER_POUND} = ${formatMass(poundsToGrams(1))} g. Therefore one pound equals exactly ${GRAMS_PER_POUND} grams.`,
  },
  {
    question: 'How Do I Convert Grams to Pounds?',
    answer: `Divide the weight in grams by ${GRAMS_PER_POUND}. For example, 500 ÷ ${GRAMS_PER_POUND} ≈ ${formatMass(gramsToPounds(500))} lb.`,
  },
  {
    question: 'How Many Grams Are in 3 Pounds?',
    answer: `3 × ${GRAMS_PER_POUND} = ${formatMass(poundsToGrams(3))} g. Three pounds equal ${formatMass(poundsToGrams(3))} grams.`,
  },
  {
    question: 'How Many Grams Are in 5 Pounds?',
    answer: `5 × ${GRAMS_PER_POUND} = ${formatMass(poundsToGrams(5))} g.`,
  },
  {
    question: 'Is 500 Grams Equal to 1 Pound?',
    answer: `No. One pound equals ${GRAMS_PER_POUND} grams, so 500 grams is approximately ${formatMass(gramsToPounds(500))} pounds.`,
  },
  {
    question: 'How Many Pounds Are in 1 Kilogram?',
    answer: `One kilogram is approximately ${formatMass(POUNDS_PER_KG)} pounds.`,
  },
  {
    question: 'Is a Pound the Same as a Kilogram?',
    answer: `No. A kilogram is a larger unit of mass than a pound. One kilogram is approximately ${formatMass(POUNDS_PER_KG)} pounds.`,
  },
];
