import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, kgToLiters, litersToKg } from './calculation';
import { SUBSTANCES } from './substances';
import { WATER_DENSITY_KG_PER_L } from './types';

export const KG_TO_LITER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How to Convert kg to Liters' },
  { id: 'why-density', label: 'Why Does Density Matter?' },
  { id: 'water-table', label: 'kg to Liters Conversion for Water' },
  { id: 'density-formula', label: 'Formula Using Density' },
  { id: 'liters-to-kg', label: 'How to Convert Liters to Kilograms' },
  { id: 'common-liquids', label: 'Common Liquids and Their Densities' },
  { id: 'how-to-use', label: 'How to Use the kg to Liter Converter' },
  { id: 'applications', label: 'Common Applications' },
  { id: 'related-converters', label: 'Related Conversion Tools' },
  { id: 'kg-to-liter-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const WATER_MASS = [0.5, 1, 2, 5, 10, 20, 50, 100] as const;
const OLIVE = 0.918;
const MILK = 1.03;
const HONEY = 1.42;

export const KG_TO_LITER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How to Convert kg to Liters',
    paragraphs: [
      'This calculator converts kilograms to liters and liters to kilograms using substance density. Mass and volume are different physical quantities; density connects them.',
      'When density is in kg/L: Liters = Kilograms ÷ Density.',
      `Water example (reference ≈ ${WATER_DENSITY_KG_PER_L} kg/L): 5 kg ÷ ${WATER_DENSITY_KG_PER_L} = ${formatMeasure(kgToLiters(5, WATER_DENSITY_KG_PER_L))} L.`,
    ],
    formula: 'Liters = Kilograms ÷ Density (kg/L)',
  },
  {
    id: 'why-density',
    title: 'Why Does Density Matter?',
    paragraphs: [
      'Kilograms measure mass. Liters measure volume. Different substances pack different amounts of mass into the same volume.',
      `Equal masses occupy different volumes: 5 kg of water ≈ ${formatMeasure(kgToLiters(5, WATER_DENSITY_KG_PER_L))} L, while 5 kg of olive oil (≈ ${OLIVE} kg/L) ≈ ${formatMeasure(kgToLiters(5, OLIVE))} L, and 5 kg of honey (≈ ${HONEY} kg/L) ≈ ${formatMeasure(kgToLiters(5, HONEY))} L.`,
    ],
  },
  {
    id: 'water-table',
    title: 'kg to Liters Conversion for Water',
    paragraphs: [
      `Based on the simplifying assumed density of ${WATER_DENSITY_KG_PER_L} kg/L. This is a convenient reference, not an exact value at every temperature.`,
    ],
    tableHeaders: ['Water mass', 'Approx. volume'],
    table: WATER_MASS.map((kg) => [
      `${formatMeasure(kg)} kg`,
      `${formatMeasure(kgToLiters(kg, WATER_DENSITY_KG_PER_L))} L`,
    ]),
  },
  {
    id: 'density-formula',
    title: 'Formula for Converting kg to Liter Using Density',
    paragraphs: [
      'Density ρ = m / V. Rearranged with density in kg/L: V(L) = m(kg) / ρ(kg/L).',
      'Unit relationships: 1 kg/L = 1000 kg/m³ = 1 g/mL = 1 g/cm³. The calculator normalizes custom densities to kg/L internally.',
    ],
    formula: '1 kg/L = 1000 kg/m³ = 1 g/mL = 1 g/cm³',
  },
  {
    id: 'liters-to-kg',
    title: 'How to Convert Liters to Kilograms',
    paragraphs: [
      'Multiply volume in liters by density in kg/L: kg = L × Density.',
      `Water: 25 L × ${WATER_DENSITY_KG_PER_L} = ${formatMeasure(litersToKg(25, WATER_DENSITY_KG_PER_L))} kg.`,
      `Honey (≈ ${HONEY} kg/L): 2 L × ${HONEY} = ${formatMeasure(litersToKg(2, HONEY))} kg.`,
    ],
    formula: 'kg = L × Density (kg/L)',
  },
  {
    id: 'common-liquids',
    title: 'Common Liquids and Their Densities',
    paragraphs: [
      'Approximate reference densities used by this converter. Real values vary with temperature, composition, and product formulation.',
    ],
    tableHeaders: ['Substance', 'Approx. density (kg/L)'],
    table: SUBSTANCES.map((s) => [s.name, formatMeasure(s.densityKgPerL)]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the kg to Liter Converter',
    paragraphs: [
      '1. Select a substance (Liquid).',
      '2. Enter its weight in kilograms.',
      '3. Read the calculated volume in liters.',
      '4. Alternatively, enter liters to calculate kilograms.',
      '5. Select Custom density when you have a measured density, and choose a density unit if needed.',
    ],
  },
  {
    id: 'applications',
    title: 'Common Applications',
    paragraphs: [
      'Cooking and baking, ingredient measurements, food manufacturing, industrial liquids, shipping and logistics, laboratory measurements, and chemical mixing all need mass–volume conversion through density. Never treat kilograms and liters as universally interchangeable.',
    ],
  },
  {
    id: 'related-converters',
    title: 'Related Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Converter, Weight Converter, Grams in mL Converter, Gram to Liter Conversion, Grams to fl oz Converter, Gallons to Grams Conversion, Gallons to Tons Converter, Gallons to Cups Converter, mL to oz Converter, and Liter to Gram Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KG_TO_LITER_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Liters of Water Are Equal to 1 kg?',
    answer: `Under the simplified reference density of ${WATER_DENSITY_KG_PER_L} kg/L, 1 kilogram of water is approximately 1 liter.`,
  },
  {
    question: 'Is 1 kg Equal to 1 Liter?',
    answer:
      'Not generally. Kilograms measure mass, while liters measure volume. The relationship depends on density. For water near the reference conditions used here, 1 kg is approximately 1 L.',
  },
  {
    question: 'How Many Liters Are in 5 kg of Oil?',
    answer: `Using olive oil density of approximately ${OLIVE} kg/L: 5 ÷ ${OLIVE} ≈ ${formatMeasure(kgToLiters(5, OLIVE))} L.`,
  },
  {
    question: 'How Do I Convert kg to Liter for Milk?',
    answer: `Divide mass in kilograms by the approximate density of milk in kg/L. Using ${MILK} kg/L: 10 ÷ ${MILK} ≈ ${formatMeasure(kgToLiters(10, MILK))} L.`,
  },
  {
    question: 'How Do I Convert Liters to kg?',
    answer: 'Multiply volume in liters by substance density in kg/L.',
  },
  {
    question: 'How Many kg Are in 10 Liters of Water?',
    answer: `With the reference density of ${WATER_DENSITY_KG_PER_L} kg/L: 10 × ${WATER_DENSITY_KG_PER_L} = ${formatMeasure(litersToKg(10, WATER_DENSITY_KG_PER_L))} kg.`,
  },
  {
    question: 'Can I Convert kg to Liters Without Density?',
    answer:
      'Not accurately for an arbitrary substance. The substance’s density must be known or reasonably estimated.',
  },
];
