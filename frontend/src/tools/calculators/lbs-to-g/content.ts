import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  GRAMS_PER_POUND,
  formatMass,
  gramsToPounds,
  poundsToGrams,
} from './calculation';

export const LBS_TO_G_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-pound', label: 'What Is a Pound Unit of Mass?' },
  { id: 'what-is-gram', label: 'What Is a Gram Unit of Mass?' },
  { id: 'how-to-convert', label: 'How Do You Convert Pounds to Grams?' },
  { id: 'lookup-table', label: 'Quick lbs to g Conversion Lookup Table' },
  { id: 'how-to-use', label: 'How to Use the lbs to g Converter' },
  { id: 'related-converters', label: 'Other Weight Converters' },
  { id: 'lbs-to-g-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_LB = [0.5, 1, 2, 3, 4, 5, 10, 15, 20, 50, 100] as const;

export const LBS_TO_G_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-pound',
    title: 'What Is a Pound Unit of Mass?',
    paragraphs: [
      'The pound is a unit of mass used in the imperial and US customary systems. Its symbol is lb.',
      `One international avoirdupois pound equals exactly 0.45359237 kilograms, which is exactly ${GRAMS_PER_POUND} grams.`,
    ],
    formula: `1 lb = ${GRAMS_PER_POUND} g`,
  },
  {
    id: 'what-is-gram',
    title: 'What Is a Gram Unit of Mass?',
    paragraphs: [
      'The gram is a metric unit of mass. Its symbol is g. One gram is one-thousandth of a kilogram.',
      'Grams are commonly used in cooking, food packaging, laboratories, and small mass measurements.',
    ],
    formula: '1 g = 0.001 kg',
  },
  {
    id: 'how-to-convert',
    title: 'How Do You Convert Pounds to Grams?',
    paragraphs: [
      `Multiply pounds by ${GRAMS_PER_POUND}. Example; convert 3 lb: 3 × ${GRAMS_PER_POUND} = ${formatMass(poundsToGrams(3))}. Therefore 3 lb = ${formatMass(poundsToGrams(3))} g.`,
      `For the reverse conversion, divide grams by ${GRAMS_PER_POUND}. Example; convert 500 g: 500 ÷ ${GRAMS_PER_POUND} ≈ ${formatMass(gramsToPounds(500))} lb.`,
    ],
    formula: `g = lb × ${GRAMS_PER_POUND} · lb = g ÷ ${GRAMS_PER_POUND}`,
  },
  {
    id: 'lookup-table',
    title: 'Quick lbs to g Conversion Lookup Table',
    paragraphs: [
      'Values generated with the exact international avoirdupois conversion factor. Displayed decimals are rounded for readability.',
    ],
    tableHeaders: ['Pounds (lb)', 'Grams (g)'],
    table: TABLE_LB.map((lb) => [formatMass(lb), formatMass(poundsToGrams(lb))]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the lbs to g Converter',
    paragraphs: [
      '1. Locate the pounds input.',
      '2. Enter the mass in pounds.',
      '3. Read the automatically calculated grams value.',
      '4. Alternatively, enter grams to calculate pounds.',
      '5. Edit or clear values whenever needed.',
      '6. Use Share Result if you want to share the conversion.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Weight Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Weight Converter, kg to lbs Converter, g to lbs Converter, kg to g Converter, Pounds and Ounces Calculator, Pounds to Ounces Converter, Ounces to Grams Converter, Grams to Kilograms Converter, and Stone to Pounds Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const LBS_TO_G_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Grams Are Equal to 1 Pound?',
    answer: `One international avoirdupois pound equals exactly ${GRAMS_PER_POUND} grams.`,
  },
  {
    question: 'How Do You Convert 500 Grams to Pounds?',
    answer: `Divide 500 by ${GRAMS_PER_POUND}. 500 ÷ ${GRAMS_PER_POUND} ≈ ${formatMass(gramsToPounds(500))}. Therefore 500 grams is approximately ${formatMass(gramsToPounds(500))} pounds.`,
  },
  {
    question: 'How Many Grams Are in 2 Pounds?',
    answer: `2 × ${GRAMS_PER_POUND} = ${formatMass(poundsToGrams(2))}. Therefore 2 pounds equals ${formatMass(poundsToGrams(2))} grams.`,
  },
  {
    question: 'How Much Is 10 Pounds in Grams?',
    answer: `10 × ${GRAMS_PER_POUND} = ${formatMass(poundsToGrams(10))}. Therefore 10 pounds equals ${formatMass(poundsToGrams(10))} grams.`,
  },
  {
    question: 'Is One Pound Equal to 500 Grams?',
    answer: `No. One international avoirdupois pound equals exactly ${GRAMS_PER_POUND} grams, which is less than 500 grams.`,
  },
  {
    question: 'How Do I Convert Grams Back to Pounds?',
    answer: `Divide the number of grams by ${GRAMS_PER_POUND}. For example, 1,000 ÷ ${GRAMS_PER_POUND} ≈ ${formatMass(gramsToPounds(1000))}. Therefore 1,000 grams is approximately ${formatMass(gramsToPounds(1000))} pounds.`,
  },
];
