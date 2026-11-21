import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMass,
  kilogramsToOunces,
  ouncesToKilograms,
  ouncesToPounds,
  KG_PER_OUNCE,
  OUNCES_PER_POUND,
} from './calculation';

export const OUNCE_TO_KG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Ounce to kg Converter' },
  { id: 'how-to-calculate', label: 'How to Calculate Ounces to kg' },
  { id: 'how-to-use', label: 'How to Convert oz to kg Using Our Converter' },
  { id: 'conversion-table', label: 'Ounces to Kilograms Conversion Table' },
  { id: 'kg-to-oz', label: 'How to Convert Kilograms to Ounces' },
  { id: 'methods', label: 'How Do I Convert oz to kg?' },
  { id: 'related-tools', label: 'Other Related Tools' },
  { id: 'ounce-to-kg-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_OZ = [1, 2, 4, 5, 8, 10, 12, 16, 18, 20, 24, 32, 40, 48, 64, 100] as const;

export const OUNCE_TO_KG_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Ounce to kg Converter',
    paragraphs: [
      'Convert ounces (oz) to kilograms (kg) and kilograms back to ounces instantly, with a linked pounds (lb) field for avoirdupois mass.',
      'Useful for cooking and packaging, shipping weights, scientific measurements, and everyday US customary ↔ SI comparisons. This tool uses mass ounces; not fluid ounces.',
    ],
  },
  {
    id: 'how-to-calculate',
    title: 'How to Calculate Ounces to kg',
    paragraphs: [
      'An ounce is a mass unit in the US customary and imperial systems. A kilogram is the SI base unit of mass.',
      `Exactly 1 avoirdupois ounce = ${KG_PER_OUNCE} kg.`,
      `Formula: kg = oz × ${KG_PER_OUNCE}.`,
      `Example; 8 oz: 8 × ${KG_PER_OUNCE} = ${formatMass(ouncesToKilograms(8))} kg.`,
      `Example; 16 oz: 16 × ${KG_PER_OUNCE} = ${formatMass(ouncesToKilograms(16))} kg.`,
      `Example; 18 oz: 18 × ${KG_PER_OUNCE} = ${formatMass(ouncesToKilograms(18))} kg.`,
    ],
    formula: `1 oz = ${KG_PER_OUNCE} kg\nkg = oz × ${KG_PER_OUNCE}\n8 oz = ${formatMass(ouncesToKilograms(8))} kg`,
  },
  {
    id: 'how-to-use',
    title: 'How to Convert oz to kg Using Our Ounce to kg Converter',
    paragraphs: [
      '1. Enter the weight in ounces.',
      '2. The equivalent kilograms appear instantly.',
      '3. View the equivalent weight in pounds.',
      '4. Alternatively, enter kilograms or pounds.',
      '5. The remaining values update automatically.',
      '6. Use Share Result, Reload Calculator (restores 16 oz), or Clear All Changes as needed.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Ounces to Kilograms Conversion Table',
    paragraphs: [
      'Common ounce values converted with the exact factor 1 oz = 0.028349523125 kg.',
    ],
    tableHeaders: ['Ounces (oz)', 'Kilograms (kg)'],
    table: TABLE_OZ.map((oz) => [formatMass(oz), formatMass(ouncesToKilograms(oz))]),
  },
  {
    id: 'kg-to-oz',
    title: 'How to Convert Kilograms to Ounces',
    paragraphs: [
      `Divide kilograms by ${KG_PER_OUNCE}: oz = kg ÷ ${KG_PER_OUNCE}.`,
      `Example; 1 kg ≈ ${formatMass(kilogramsToOunces(1))} oz.`,
      `Example; 2 kg ≈ ${formatMass(kilogramsToOunces(2))} oz.`,
    ],
    formula: `oz = kg ÷ ${KG_PER_OUNCE}\n1 kg ≈ ${formatMass(kilogramsToOunces(1))} oz`,
  },
  {
    id: 'methods',
    title: 'How Do I Convert oz to kg?',
    paragraphs: [
      `Method 1; direct: multiply ounces by ${KG_PER_OUNCE}.`,
      `Method 2; through pounds: lb = oz ÷ ${OUNCES_PER_POUND}, then kg = lb × 0.45359237.`,
      `Both methods agree. Example; 16 oz → ${formatMass(ouncesToPounds(16))} lb → ${formatMass(ouncesToKilograms(16))} kg.`,
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Related Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Weight Converter, Ounces to Pounds Converter, Ounces to Grams Converter, lbs to kg Converter, lbs to g Converter, and Grams to Ounces Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const OUNCE_TO_KG_FAQS: readonly FAQItem[] = [
  {
    question: 'How Much Is 8 oz in kg?',
    answer: `8 × ${KG_PER_OUNCE} = ${formatMass(ouncesToKilograms(8))} kg.`,
  },
  {
    question: 'How Many kg Is 18 oz?',
    answer: `18 × ${KG_PER_OUNCE} = ${formatMass(ouncesToKilograms(18))} kg.`,
  },
  {
    question: 'How Many Ounces Are in 1 kg?',
    answer: `About ${formatMass(kilogramsToOunces(1))} avoirdupois ounces.`,
  },
  {
    question: 'How Do I Convert 32 oz to kg?',
    answer: `32 × ${KG_PER_OUNCE} = ${formatMass(ouncesToKilograms(32))} kg.`,
  },
  {
    question: 'Is 16 oz Equal to 1 Pound?',
    answer: `Yes. In the avoirdupois mass system, ${OUNCES_PER_POUND} ounces equal exactly 1 pound.`,
  },
  {
    question: 'Are Ounces and Fluid Ounces the Same?',
    answer:
      'No. Ounces measure mass, while fluid ounces measure volume. A fluid-ounce-to-kilogram conversion requires density and the fluid-ounce definition in use.',
  },
];
