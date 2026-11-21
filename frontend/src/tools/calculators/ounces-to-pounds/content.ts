import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMass,
  kilogramsToOunces,
  ouncesToKilograms,
  ouncesToPounds,
  poundsToOunces,
  KG_PER_OUNCE,
  OUNCES_PER_POUND,
} from './calculation';

export const OUNCES_TO_POUNDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Ounces to Pounds Converter' },
  { id: 'how-to-convert', label: 'How to Convert Ounces to Pounds' },
  { id: 'how-to-use', label: 'How to Use Our Ounces to Pounds Converter' },
  { id: 'conversion-table', label: 'Ounces to Pounds Conversion Table' },
  { id: 'pounds-to-ounces', label: 'How to Convert Pounds to Ounces' },
  { id: 'ounces-to-kg', label: 'Converting Ounces to Kilograms' },
  { id: 'related-tools', label: 'Other Related Tools' },
  { id: 'ounces-to-pounds-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_OZ = [1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 48, 64, 80, 100] as const;

export const OUNCES_TO_POUNDS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Ounces to Pounds Converter',
    paragraphs: [
      'Convert ounces (oz) to pounds (lb) and pounds back to ounces instantly, with a linked kilograms (kg) field for SI mass.',
      'Useful for shipping labels, recipes and packaging, product weights, and everyday avoirdupois mass checks. This tool uses mass ounces; not fluid ounces.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Ounces to Pounds',
    paragraphs: [
      `Exactly 1 lb = ${OUNCES_PER_POUND} oz, so 1 oz = ${formatMass(ouncesToPounds(1))} lb.`,
      `Formula: lb = oz ÷ ${OUNCES_PER_POUND} (or lb = oz × ${formatMass(1 / OUNCES_PER_POUND)}).`,
      `Example; 24 oz: 24 ÷ ${OUNCES_PER_POUND} = ${formatMass(ouncesToPounds(24))} lb.`,
      `Example; 8 oz: 8 ÷ ${OUNCES_PER_POUND} = ${formatMass(ouncesToPounds(8))} lb.`,
      `Example; 48 oz: 48 ÷ ${OUNCES_PER_POUND} = ${formatMass(ouncesToPounds(48))} lb.`,
    ],
    formula: `1 lb = ${OUNCES_PER_POUND} oz\nlb = oz ÷ ${OUNCES_PER_POUND}\n24 oz = ${formatMass(ouncesToPounds(24))} lb`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use Our Ounces to Pounds Converter',
    paragraphs: [
      '1. Enter the weight in ounces.',
      '2. Read the automatically calculated weight in pounds.',
      '3. View the equivalent mass in kilograms.',
      '4. Alternatively, edit pounds or kilograms.',
      '5. The remaining measurements update instantly.',
      '6. Use Share Result to share a calculation.',
      '7. Use Reload Calculator to restore 16 oz / 1 lb, or Clear All Changes to empty all fields.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Ounces to Pounds Conversion Table',
    paragraphs: [
      'Common ounce values converted with the exact factor 16 oz = 1 lb.',
    ],
    tableHeaders: ['Ounces (oz)', 'Pounds (lb)'],
    table: TABLE_OZ.map((oz) => [formatMass(oz), formatMass(ouncesToPounds(oz))]),
  },
  {
    id: 'pounds-to-ounces',
    title: 'How to Convert Pounds to Ounces',
    paragraphs: [
      `Multiply pounds by ${OUNCES_PER_POUND}: oz = lb × ${OUNCES_PER_POUND}.`,
      `Example; 2.5 lb: 2.5 × ${OUNCES_PER_POUND} = ${formatMass(poundsToOunces(2.5))} oz.`,
    ],
    formula: `oz = lb × ${OUNCES_PER_POUND}\n2.5 lb = ${formatMass(poundsToOunces(2.5))} oz`,
  },
  {
    id: 'ounces-to-kg',
    title: 'Converting Ounces to Kilograms',
    paragraphs: [
      `The third field links SI mass: kg = oz × ${KG_PER_OUNCE}.`,
      `Example; 16 oz: 16 × ${KG_PER_OUNCE} = ${formatMass(ouncesToKilograms(16))} kg (exactly one international pound).`,
      `Reverse: oz = kg ÷ ${KG_PER_OUNCE}. Example; 1 kg ≈ ${formatMass(kilogramsToOunces(1))} oz.`,
    ],
    formula: `kg = oz × ${KG_PER_OUNCE}\n16 oz = ${formatMass(ouncesToKilograms(16))} kg`,
  },
  {
    id: 'related-tools',
    title: 'Other Related Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Weight Converter, Ounces to Grams Converter, Grams to Ounces Converter, lbs to kg Converter, lbs to g Converter, and Pounds and Ounces Calculator. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const OUNCES_TO_POUNDS_FAQS: readonly FAQItem[] = [
  {
    question: 'Is 8 Ounces Half a Pound?',
    answer: `Yes. Because 1 lb = ${OUNCES_PER_POUND} oz, 8 ÷ ${OUNCES_PER_POUND} = ${formatMass(ouncesToPounds(8))} lb.`,
  },
  {
    question: 'How Do I Convert 24 oz to lbs?',
    answer: `Divide by ${OUNCES_PER_POUND}: 24 ÷ ${OUNCES_PER_POUND} = ${formatMass(ouncesToPounds(24))} lb.`,
  },
  {
    question: 'How Many Pounds Are 48 Ounces?',
    answer: `48 ÷ ${OUNCES_PER_POUND} = ${formatMass(ouncesToPounds(48))} lb.`,
  },
  {
    question: 'How Many Ounces Are in 2 Pounds?',
    answer: `2 × ${OUNCES_PER_POUND} = ${formatMass(poundsToOunces(2))} oz.`,
  },
  {
    question: 'How Many Ounces Are in a Quarter Pound?',
    answer: `A quarter pound is ${formatMass(poundsToOunces(0.25))} oz (${OUNCES_PER_POUND} ÷ 4).`,
  },
  {
    question: 'Are Weight Ounces and Fluid Ounces the Same?',
    answer:
      'No. Weight ounces measure mass. Fluid ounces measure volume. Converting fluid ounces into mass requires the density of the substance.',
  },
];
