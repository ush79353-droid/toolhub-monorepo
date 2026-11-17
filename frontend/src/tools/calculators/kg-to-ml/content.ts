import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, kgToMl, mlToKg } from './calculation';
import { SUBSTANCES } from './substances';
import { WATER_DENSITY_KG_PER_M3 } from './types';

export const KG_TO_ML_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'formula', label: 'kg to mL Conversion Formula' },
  { id: 'example', label: 'kg to mL Conversion Example' },
  { id: 'how-to-use', label: 'How to Use the kg to mL Converter' },
  { id: 'water-1kg', label: 'How Many mL Are in 1 kg of Water?' },
  { id: 'water-table', label: 'kg to mL Conversion Table for Water' },
  { id: 'why-density', label: 'Why Does Density Matter?' },
  { id: 'related-converters', label: 'Other Mass-to-Volume Converters' },
  { id: 'kg-to-ml-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const WATER_KG = [0.1, 0.25, 0.5, 1, 2, 5, 10, 25] as const;
const MILK = 1030;
const OLIVE = 918;
const HONEY = 1420;

export const KG_TO_ML_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'formula',
    title: 'kg to mL Conversion Formula',
    paragraphs: [
      'This calculator converts kilograms of a substance into milliliters using density. Kilograms measure mass; milliliters measure volume — density connects them.',
      'With density ρ in kg/m³: V(mL) = m(kg) × 1,000,000 / ρ(kg/m³). Variables: m = mass in kilograms, ρ = density in kilograms per cubic meter, V = volume in milliliters.',
    ],
    formula: 'V(mL) = m(kg) × 1,000,000 / ρ(kg/m³)',
  },
  {
    id: 'example',
    title: 'kg to mL Conversion Example',
    paragraphs: [
      `Milk example: mass 1 kg, approximate density ${MILK} kg/m³.`,
      `Step 1: Divide mass by density — 1 ÷ ${MILK}.`,
      'Step 2: Multiply by 1,000,000 to express the volume in milliliters.',
      `Result: 1 kg of milk ≈ ${formatMeasure(kgToMl(1, MILK))} mL.`,
      `Olive oil: 2 kg at ≈ ${OLIVE} kg/m³ ≈ ${formatMeasure(kgToMl(2, OLIVE))} mL. Honey: 1 kg at ≈ ${HONEY} kg/m³ ≈ ${formatMeasure(kgToMl(1, HONEY))} mL.`,
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the kg to mL Converter',
    paragraphs: [
      '1. Select a substance in the density lookup section.',
      '2. Check its density (edit or switch units if needed).',
      '3. Enter the mass in kilograms.',
      '4. Read the corresponding volume in milliliters.',
      '5. Alternatively, enter volume to calculate mass.',
      '6. Choose Custom density for substances not in the list.',
    ],
  },
  {
    id: 'water-1kg',
    title: 'How Many mL Are in 1 kg of Water?',
    paragraphs: [
      `Using the reference approximation of ${WATER_DENSITY_KG_PER_M3} kg/m³: 1 kg of water ≈ ${formatMeasure(kgToMl(1, WATER_DENSITY_KG_PER_M3))} mL.`,
      'This 1 kg ≈ 1000 mL relationship is not generally valid for other substances.',
    ],
  },
  {
    id: 'water-table',
    title: 'kg to mL Conversion Table for Water',
    paragraphs: [
      `Based on the assumed density of ${WATER_DENSITY_KG_PER_M3} kg/m³. A convenient reference — not exact at every temperature.`,
    ],
    tableHeaders: ['Kilograms', 'Milliliters'],
    table: WATER_KG.map((kg) => [
      `${formatMeasure(kg)} kg`,
      `${formatMeasure(kgToMl(kg, WATER_DENSITY_KG_PER_M3))} mL`,
    ]),
  },
  {
    id: 'why-density',
    title: 'Why Does Density Matter?',
    paragraphs: [
      'Equal masses of different substances occupy different volumes.',
      `Compare 1 kg: water ≈ ${formatMeasure(kgToMl(1, WATER_DENSITY_KG_PER_M3))} mL; milk (≈ ${MILK} kg/m³) ≈ ${formatMeasure(kgToMl(1, MILK))} mL; olive oil (≈ ${OLIVE} kg/m³) ≈ ${formatMeasure(kgToMl(1, OLIVE))} mL; honey (≈ ${HONEY} kg/m³) ≈ ${formatMeasure(kgToMl(1, HONEY))} mL.`,
      'Approximate reference densities used by this converter:',
    ],
    tableHeaders: ['Substance', 'Approx. density (kg/m³)'],
    table: SUBSTANCES.map((s) => [s.name, formatMeasure(s.densityKgPerM3)]),
  },
  {
    id: 'related-converters',
    title: 'Other Mass-to-Volume Converters',
    paragraphs: [
      'Related Omega Calculators pages may include kg to Liter Converter, Grams in mL Converter, Gram to Liter Conversion, Grams to fl oz Converter, Gallons to Grams Conversion, Gallons to Tons Converter, Volume Converter, Weight Converter, mL to oz Converter, and Gallons to Cups Converter. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const KG_TO_ML_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert kg to mL?',
    answer:
      'Divide the mass in kilograms by density in kg/m³, then multiply by 1,000,000.',
  },
  {
    question: 'How Many mL Are in 1 kg of Water?',
    answer: `Approximately ${formatMeasure(kgToMl(1, WATER_DENSITY_KG_PER_M3))} mL when using the reference water density of ${WATER_DENSITY_KG_PER_M3} kg/m³.`,
  },
  {
    question: 'Is 1 kg Equal to 1000 mL?',
    answer:
      'Only for substances with a density of 1 kg/L (1000 kg/m³), such as water under the reference approximation.',
  },
  {
    question: 'How Many mL Are in 1 kg of Milk?',
    answer: `Using an approximate milk density of ${MILK} kg/m³, 1 kg corresponds to approximately ${formatMeasure(kgToMl(1, MILK))} mL.`,
  },
  {
    question: 'How Many mL Are in 2 kg of Oil?',
    answer: `Using olive oil density of ${OLIVE} kg/m³, 2 kg corresponds to approximately ${formatMeasure(kgToMl(2, OLIVE))} mL.`,
  },
  {
    question: 'Can I Convert kg to mL Without Density?',
    answer:
      'Not accurately for an arbitrary substance. Density is necessary because kg and mL measure different physical quantities.',
  },
  {
    question: 'How Do I Convert mL Back to kg?',
    answer: `Multiply volume in milliliters by density in kg/m³ and divide by 1,000,000. Example: 1000 mL of honey at ${HONEY} kg/m³ ≈ ${formatMeasure(mlToKg(1000, HONEY))} kg.`,
  },
];
