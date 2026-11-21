import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  KILOGRAMS_PER_POUND,
  formatMass,
  kilogramsToPounds,
  poundsToKilograms,
} from './calculation';

export const LBS_TO_KG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How to Convert lbs to kg' },
  { id: 'how-to-use', label: 'How to Use This lbs to kg Converter' },
  { id: 'lookup-table', label: 'Pounds to Kilograms Conversion Table' },
  { id: 'related-converters', label: 'Other Weight Converters' },
  { id: 'lbs-to-kg-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_LB = [0.5, 1, 2, 5, 10, 20, 25, 50, 75, 100, 125, 150, 200] as const;
const LBS_PER_KG = 1 / KILOGRAMS_PER_POUND;

export const LBS_TO_KG_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How to Convert lbs to kg',
    paragraphs: [
      `One international avoirdupois pound equals exactly ${KILOGRAMS_PER_POUND} kilograms.`,
      `Multiply pounds by ${KILOGRAMS_PER_POUND}. Example; convert 25 lb: 25 × ${KILOGRAMS_PER_POUND} = ${formatMass(poundsToKilograms(25))}. Therefore 25 lb = ${formatMass(poundsToKilograms(25))} kg.`,
      `For the reverse conversion, divide kilograms by ${KILOGRAMS_PER_POUND}. Example; convert 50 kg: 50 ÷ ${KILOGRAMS_PER_POUND} ≈ ${formatMass(kilogramsToPounds(50))} lb.`,
    ],
    formula: `kg = lb × ${KILOGRAMS_PER_POUND} · lb = kg ÷ ${KILOGRAMS_PER_POUND}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use This lbs to kg Converter',
    paragraphs: [
      '1. Enter the weight in pounds in the first input.',
      '2. The equivalent kilograms appear immediately in the second input.',
      '3. Alternatively, enter kilograms to calculate pounds.',
      '4. Modify either value to recalculate instantly.',
      '5. Clear or reload the calculator when necessary.',
      '6. Use Share Result to share the current conversion.',
    ],
  },
  {
    id: 'lookup-table',
    title: 'Pounds to Kilograms Conversion Table',
    paragraphs: [
      'Values generated with the exact international avoirdupois conversion factor. Displayed decimals are rounded for readability.',
    ],
    tableHeaders: ['Pounds (lb)', 'Kilograms (kg)'],
    table: TABLE_LB.map((lb) => [formatMass(lb), formatMass(poundsToKilograms(lb))]),
  },
  {
    id: 'related-converters',
    title: 'Other Weight Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Weight Converter, kg to lbs Converter, lbs to g Converter, g to lbs Converter, kg to g Converter, Pounds and Ounces Calculator, Pounds to Ounces Converter, Pounds to Grams Converter, Stone to Pounds Converter, and Ounces to Grams Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const LBS_TO_KG_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 125 lbs to kg?',
    answer: `Multiply 125 by ${KILOGRAMS_PER_POUND}. 125 × ${KILOGRAMS_PER_POUND} = ${formatMass(poundsToKilograms(125))}. Therefore 125 pounds equals approximately ${formatMass(poundsToKilograms(125))} kilograms.`,
  },
  {
    question: 'How Many Kilograms Are in One Pound?',
    answer: `One international avoirdupois pound equals exactly ${KILOGRAMS_PER_POUND} kilograms.`,
  },
  {
    question: 'How Do I Convert 50 kg to lbs?',
    answer: `Divide 50 by ${KILOGRAMS_PER_POUND}. 50 ÷ ${KILOGRAMS_PER_POUND} ≈ ${formatMass(kilogramsToPounds(50))}. Therefore 50 kilograms is approximately ${formatMass(kilogramsToPounds(50))} pounds.`,
  },
  {
    question: 'How Much Is 200 lbs in kg?',
    answer: `200 × ${KILOGRAMS_PER_POUND} = ${formatMass(poundsToKilograms(200))}. Therefore 200 pounds equals approximately ${formatMass(poundsToKilograms(200))} kilograms.`,
  },
  {
    question: 'How Do I Convert Price per Pound to Price per Kilogram?',
    answer: `Multiply the price per pound by the number of pounds in one kilogram (about ${formatMass(LBS_PER_KG)}). Price/kg = Price/lb × ${formatMass(LBS_PER_KG)}. Example: if an item costs $10 per pound, 10 × ${formatMass(LBS_PER_KG)} ≈ ${formatMass(10 * LBS_PER_KG)}, so about $${formatMass(10 * LBS_PER_KG)} per kilogram. This is a unit-price conversion and does not depend on the weight of an individual item.`,
  },
  {
    question: 'Is 1 Kilogram Equal to 2 Pounds?',
    answer: `Not exactly. One kilogram equals approximately ${formatMass(LBS_PER_KG)} pounds, so 2 pounds is less than 1 kilogram.`,
  },
];
