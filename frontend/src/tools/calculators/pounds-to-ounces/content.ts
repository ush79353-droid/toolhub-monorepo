import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  OUNCES_PER_POUND,
  formatMass,
  ouncesToPounds,
  poundsToOunces,
} from './calculation';
import { GRAMS_PER_OUNCE, KG_PER_POUND } from './types';

export const POUNDS_TO_OUNCES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Pounds to Ounces Converter' },
  { id: 'converting', label: 'Converting Pounds to Ounces' },
  { id: 'how-to-use', label: 'How to Use the Pounds to Ounces Converter' },
  { id: 'lb-to-oz-table', label: 'Pounds to Ounces Conversion Chart' },
  { id: 'oz-to-lb-table', label: 'Ounces to Pounds Conversion Chart' },
  { id: 'difference', label: 'What Is the Difference Between Pounds and Ounces?' },
  { id: 'related-converters', label: 'Other Related Calculators' },
  { id: 'pounds-to-ounces-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_LB = [0.25, 0.5, 1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 100] as const;
const TABLE_OZ = [1, 2, 4, 8, 16, 24, 32, 48, 64, 80, 160] as const;

export const POUNDS_TO_OUNCES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Pounds to Ounces Converter',
    paragraphs: [
      'Convert mass between avoirdupois pounds (lb) and avoirdupois ounces (oz). Each pound contains exactly 16 ounces in the US customary and British imperial avoirdupois systems.',
      'Enter either pounds or ounces and see the equivalent value instantly. This tool measures mass — not fluid ounces (volume).',
    ],
  },
  {
    id: 'converting',
    title: 'Converting Pounds to Ounces',
    paragraphs: [
      `One pound equals ${OUNCES_PER_POUND} ounces. Both units belong to the avoirdupois system.`,
      `For context, 1 lb = ${KG_PER_POUND} kg and 1 oz = ${GRAMS_PER_OUNCE} g. Those SI equivalents describe mass but are not required for the primary pounds-to-ounces calculation.`,
      `Example — convert 15 pounds: 15 × ${OUNCES_PER_POUND} = ${formatMass(poundsToOunces(15))}. Therefore 15 pounds = ${formatMass(poundsToOunces(15))} ounces.`,
      `Example — convert 48 ounces: 48 ÷ ${OUNCES_PER_POUND} = ${formatMass(ouncesToPounds(48))}. Therefore 48 ounces = ${formatMass(ouncesToPounds(48))} pounds.`,
    ],
    formula: `oz = lb × ${OUNCES_PER_POUND}\nlb = oz ÷ ${OUNCES_PER_POUND}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Pounds to Ounces Converter',
    paragraphs: [
      '1. Enter the weight in pounds in the first field.',
      `2. The calculator automatically multiplies the value by ${OUNCES_PER_POUND}.`,
      '3. The equivalent weight in ounces appears in the second field.',
      '4. Alternatively, enter a value in ounces.',
      `5. The calculator automatically divides by ${OUNCES_PER_POUND} to display pounds.`,
      '6. Use Reload Calculator to restore the default of 1 lb, or Clear All Changes to empty both fields.',
      'No separate Convert button is required — both directions update as you type.',
    ],
  },
  {
    id: 'lb-to-oz-table',
    title: 'Pounds to Ounces Conversion Chart',
    paragraphs: [
      `Values use the exact factor of ${OUNCES_PER_POUND} ounces per pound.`,
    ],
    tableHeaders: ['Pounds (lb)', 'Ounces (oz)'],
    table: TABLE_LB.map((lb) => [formatMass(lb), formatMass(poundsToOunces(lb))]),
  },
  {
    id: 'oz-to-lb-table',
    title: 'Ounces to Pounds Conversion Chart',
    paragraphs: [
      `Divide ounces by ${OUNCES_PER_POUND} to obtain pounds.`,
    ],
    tableHeaders: ['Ounces (oz)', 'Pounds (lb)'],
    table: TABLE_OZ.map((oz) => [formatMass(oz), formatMass(ouncesToPounds(oz))]),
  },
  {
    id: 'difference',
    title: 'What Is the Difference Between Pounds and Ounces?',
    paragraphs: [
      'A pound is a larger unit of mass. An ounce is a smaller unit of mass. One pound contains exactly 16 ounces.',
      'Both units are commonly used in the United States. Ounces suit smaller quantities; pounds are common for larger weights.',
      'Do not confuse mass ounces (oz) with fluid ounces (fl oz). Fluid ounces measure volume. You cannot convert between them without density information for the substance.',
    ],
    formula: `1 lb = ${OUNCES_PER_POUND} oz (mass)`,
  },
  {
    id: 'related-converters',
    title: 'Other Related Calculators',
    paragraphs: [
      'Related Omega Calculators pages include Weight Converter, Pounds to Grams Converter, lbs to kg Converter, kg to lbs Converter, Ounces to Pounds Converter, Ounces to Grams Converter, Ounce to kg Converter, Pounds and Ounces Calculator, and lbs to Stone Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const POUNDS_TO_OUNCES_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert Pounds to Ounces?',
    answer: `Multiply the number of pounds by ${OUNCES_PER_POUND}. For example, 7 × ${OUNCES_PER_POUND} = ${formatMass(poundsToOunces(7))}. Therefore 7 pounds = ${formatMass(poundsToOunces(7))} ounces.`,
  },
  {
    question: 'How Many Pounds Make 4 Ounces?',
    answer: `Divide 4 by ${OUNCES_PER_POUND}: 4 ÷ ${OUNCES_PER_POUND} = ${formatMass(ouncesToPounds(4))}. Therefore 4 ounces = ${formatMass(ouncesToPounds(4))} pounds.`,
  },
  {
    question: 'How Many Ounces Are in 1 Pound?',
    answer: `There are exactly ${OUNCES_PER_POUND} avoirdupois ounces in 1 avoirdupois pound.`,
  },
  {
    question: 'How Many Ounces Are in 5 Pounds?',
    answer: `5 × ${OUNCES_PER_POUND} = ${formatMass(poundsToOunces(5))}. Therefore 5 pounds = ${formatMass(poundsToOunces(5))} ounces.`,
  },
  {
    question: 'How Do I Convert 32 Ounces to Pounds?',
    answer: `32 ÷ ${OUNCES_PER_POUND} = ${formatMass(ouncesToPounds(32))}. Therefore 32 ounces = ${formatMass(ouncesToPounds(32))} pounds.`,
  },
  {
    question: 'Are Ounces and Fluid Ounces the Same?',
    answer:
      'No. An ounce (oz) measures mass. A fluid ounce (fl oz) measures volume. They cannot be converted directly without additional information about the substance and its density.',
  },
  {
    question: 'How Many Ounces Are in Half a Pound?',
    answer: `0.5 × ${OUNCES_PER_POUND} = ${formatMass(poundsToOunces(0.5))}. Therefore half a pound contains ${formatMass(poundsToOunces(0.5))} ounces.`,
  },
];
