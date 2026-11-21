import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMass,
  kgToOunces,
  kgToTroyOunces,
  normalizeLbOz,
  ouncesToKg,
  KG_PER_OUNCE,
  KG_PER_TROY_OUNCE,
  OZ_PER_KG,
} from './calculation';

export const KG_TO_OUNCE_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'converting-kg-to-ounces', label: 'Converting kg to Ounces' },
  { id: 'how-to-use', label: 'Using the kg to Ounces Converter' },
  { id: 'conversion-table', label: 'kg to Ounces Conversion Table' },
  { id: 'ounces-vs-troy', label: 'Difference Between Ounces and Troy Ounces' },
  { id: 'how-many-oz-in-1-kg', label: 'How Many Ounces Are in 1 kg?' },
  { id: 'related-converters', label: 'Other Weight Converters' },
  { id: 'kg-to-ounce-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const TABLE_KG = [0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100] as const;

export const KG_TO_OUNCE_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'converting-kg-to-ounces',
    title: 'Converting kg to Ounces',
    paragraphs: [
      'Kilograms (kg) are the SI base unit of mass. Avoirdupois ounces (oz) are a customary mass unit used widely in the United States and in some Imperial contexts. This converter uses the exact international avoirdupois ounce.',
      `One kilogram equals approximately ${formatMass(OZ_PER_KG)} avoirdupois ounces because exactly 1 oz = ${KG_PER_OUNCE} kg.`,
      `Example; convert 10 kg: 10 × ${OZ_PER_KG} ≈ ${formatMass(kgToOunces(10))} oz.`,
    ],
    formula: `oz = kg × ${OZ_PER_KG}   ·   kg = oz × ${KG_PER_OUNCE}`,
  },
  {
    id: 'how-to-use',
    title: 'Using the kg to Ounces Converter',
    paragraphs: [
      '1. Enter weight in kilograms.',
      '2. View the converted weight in ounces.',
      '3. Enter ounces for the reverse conversion.',
      '4. Expand Other units to view troy ounces.',
      '5. View the result in pounds and ounces.',
      '6. Select additional mass units when necessary.',
      'Negative mass values are rejected. Fluid ounces (volume) are not converted here.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'kg to Ounces Conversion Table',
    paragraphs: [
      'Common kilogram values converted with the same engine as the calculator.',
    ],
    tableHeaders: ['Kilograms (kg)', 'Ounces (oz)'],
    table: TABLE_KG.map((kg) => [formatMass(kg), formatMass(kgToOunces(kg))]),
  },
  {
    id: 'ounces-vs-troy',
    title: 'Difference Between Ounces and Troy Ounces',
    paragraphs: [
      `An avoirdupois ounce is exactly ${KG_PER_OUNCE * 1000} g (${KG_PER_OUNCE} kg). A troy ounce is exactly ${KG_PER_TROY_OUNCE * 1000} g (${KG_PER_TROY_OUNCE} kg).`,
      'Avoirdupois ounces are used for everyday goods and body mass. Troy ounces are used for precious metals such as gold and silver. This converter’s primary oz field is avoirdupois; expand Other units for troy ounces.',
    ],
  },
  {
    id: 'how-many-oz-in-1-kg',
    title: 'How Many Ounces Are in 1 kg?',
    paragraphs: [
      `1 kg × ${OZ_PER_KG} = ${formatMass(kgToOunces(1))} oz (avoirdupois).`,
      (() => {
        const mixed = normalizeLbOz(kgToOunces(1));
        return `As pounds and ounces: ${formatMass(mixed.pounds)} lb ${formatMass(mixed.ounces)} oz. In troy ounces: approximately ${formatMass(kgToTroyOunces(1))} oz t.`;
      })(),
    ],
  },
  {
    id: 'related-converters',
    title: 'Other Weight Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Weight Converter, kg to lbs Converter, g to lbs Converter, Pounds to Ounces Converter, Ounces to Pounds Converter, Ounces to Grams Converter, Grams to Ounces Converter, Stone to kg Converter, and kg to Stone Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KG_TO_OUNCE_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert kg to Ounces?',
    answer: `Multiply kilograms by approximately ${formatMass(OZ_PER_KG)}. Exactly: oz = kg ÷ ${KG_PER_OUNCE}.`,
  },
  {
    question: 'How Many Ounces Are in 1 kg?',
    answer: `One kilogram equals approximately ${formatMass(kgToOunces(1))} avoirdupois ounces.`,
  },
  {
    question: 'How Many Ounces Are in 5 kg?',
    answer: `Five kilograms equal approximately ${formatMass(kgToOunces(5))} ounces.`,
  },
  {
    question: 'How Many kg Are in 16 Ounces?',
    answer: `Sixteen avoirdupois ounces equal exactly ${formatMass(ouncesToKg(16))} kilograms (one international pound).`,
  },
  {
    question: 'How Many Troy Ounces Are in 1 kg?',
    answer: `One kilogram equals approximately ${formatMass(kgToTroyOunces(1))} troy ounces.`,
  },
  {
    question: 'Are Ounces and Fluid Ounces the Same?',
    answer:
      'No. Ounces measure mass, while fluid ounces measure volume. Converting between them requires density and identification of the fluid-ounce system.',
  },
  {
    question: 'How Do I Convert kg to Pounds and Ounces?',
    answer:
      'Convert kilograms into total avoirdupois ounces, divide by 16 for whole pounds, and use the remainder as ounces. Expand Other units in this calculator to see that breakdown.',
  },
];
