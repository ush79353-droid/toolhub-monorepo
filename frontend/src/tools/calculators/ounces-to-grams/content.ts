import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMass,
  gramsToOunces,
  ouncesToGrams,
  GRAMS_PER_OUNCE,
} from './calculation';
import { GRAMS_PER_TROY_OUNCE } from './types';

export const OUNCES_TO_GRAMS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Ounces to Grams Converter' },
  { id: 'relationship', label: 'What Is the Relationship Between Ounces and Grams?' },
  { id: 'how-to-use', label: 'How Do I Use the Ounces to Grams Converter?' },
  { id: 'conversion-table', label: 'Ounces to Grams Conversion Table' },
  { id: 'grams-to-ounces', label: 'Grams to Ounces Conversion' },
  { id: 'related-tools', label: 'Other Conversion Tools' },
  { id: 'ounces-to-grams-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_OZ = [0.5, 1, 2, 3, 4, 5, 8, 10, 12, 14, 16, 20] as const;

function tableGrams(oz: number): string {
  return Number(ouncesToGrams(oz).toFixed(6)).toString();
}

export const OUNCES_TO_GRAMS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Ounces to Grams Converter',
    paragraphs: [
      'Convert ounces (oz) to grams (g) and grams back to ounces instantly. Enter a value in either field and the other updates automatically.',
      'Useful for cooking and recipes, food packaging, shipping weights, product specs, classroom SI practice, and everyday mass checks.',
    ],
  },
  {
    id: 'relationship',
    title: 'What Is the Relationship Between Ounces and Grams?',
    paragraphs: [
      'Ounces and grams are both units of mass. The ounce is common in US customary measurements; the gram belongs to the metric system.',
      `Exactly 1 international avoirdupois ounce = ${GRAMS_PER_OUNCE} g.`,
      `Ounces to grams: g = oz × ${GRAMS_PER_OUNCE}. Grams to ounces: oz = g ÷ ${GRAMS_PER_OUNCE}.`,
      `Example; convert 5 ounces: 5 × ${GRAMS_PER_OUNCE} = ${formatMass(ouncesToGrams(5))} g (about 141.75 g).`,
    ],
    formula: `1 oz = ${GRAMS_PER_OUNCE} g\ng = oz × ${GRAMS_PER_OUNCE}\noz = g ÷ ${GRAMS_PER_OUNCE}\n5 oz = ${formatMass(ouncesToGrams(5))} g`,
  },
  {
    id: 'how-to-use',
    title: 'How Do I Use the Ounces to Grams Converter?',
    paragraphs: [
      '1. Enter the mass in ounces in the first input.',
      '2. Read the converted mass in grams.',
      '3. Alternatively, enter a mass in grams.',
      '4. The equivalent value in ounces updates instantly.',
      '5. Use Share Result to share a conversion.',
      '6. Use Reload Calculator to restore 1 oz, or Clear All Changes to empty both fields.',
      'Both inputs are editable. No Calculate button is required.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Ounces to Grams Conversion Table',
    paragraphs: [
      'Values generated from the exact avoirdupois factor; grams shown to six decimal places for readability.',
    ],
    tableHeaders: ['Ounces (oz)', 'Grams (g)'],
    table: TABLE_OZ.map((oz) => [formatMass(oz), tableGrams(oz)]),
  },
  {
    id: 'grams-to-ounces',
    title: 'Grams to Ounces Conversion',
    paragraphs: [
      `Divide grams by ${GRAMS_PER_OUNCE}: oz = g ÷ ${GRAMS_PER_OUNCE}.`,
      `Example; convert 250 g: 250 ÷ ${GRAMS_PER_OUNCE} ≈ ${formatMass(gramsToOunces(250))} oz.`,
      'Enter grams directly in this calculator to convert in the reverse direction.',
    ],
    formula: `oz = g ÷ ${GRAMS_PER_OUNCE}\n250 g ≈ ${formatMass(gramsToOunces(250))} oz`,
  },
  {
    id: 'related-tools',
    title: 'Other Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Grams to Ounces Converter, Ounces to Pounds Converter, kg to Ounce Converter, Grams to Cups Converter, Grams to Tablespoons Converter, lbs to g Converter, lbs to kg Converter, and Weight Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const OUNCES_TO_GRAMS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Grams Is 14 oz?',
    answer: `14 × ${GRAMS_PER_OUNCE} = ${formatMass(ouncesToGrams(14))} g; about 396.89 grams.`,
  },
  {
    question: 'Which Is More: 1 oz or 1 g?',
    answer: `One ounce is heavier. Exactly 1 oz = ${GRAMS_PER_OUNCE} g, so one ounce is about 28.35 times one gram.`,
  },
  {
    question: 'How Many Grams Are in 8 oz?',
    answer: `8 × ${GRAMS_PER_OUNCE} = ${formatMass(ouncesToGrams(8))} g; about 226.80 grams.`,
  },
  {
    question: 'How Do I Convert 100 Grams to Ounces?',
    answer: `Divide by ${GRAMS_PER_OUNCE}: 100 ÷ ${GRAMS_PER_OUNCE} ≈ ${formatMass(gramsToOunces(100))} oz.`,
  },
  {
    question: 'Is an Ounce the Same as a Fluid Ounce?',
    answer:
      'No. An ounce (oz) measures mass. A fluid ounce (fl oz) measures volume. Converting fluid ounces to grams requires the substance’s density.',
  },
  {
    question: 'Is a Troy Ounce the Same as a Regular Ounce?',
    answer: `No. A standard avoirdupois ounce equals ${GRAMS_PER_OUNCE} g. A troy ounce equals ${GRAMS_PER_TROY_OUNCE} g. This calculator uses the avoirdupois ounce.`,
  },
];
