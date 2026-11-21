import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, litersToPounds, poundsToLiters } from './calculation';
import { KG_PER_POUND } from './types';

export const LITERS_TO_POUNDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'liters-to-pounds-conversion', label: 'Liters-to-Pounds Conversion' },
  { id: 'pounds-to-liters-conversion', label: 'Pounds to Liters Conversion' },
  { id: 'density-as-lb-per-l', label: 'Expressing Density as lb/L' },
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'other-similar-tools', label: 'Other Similar Tools' },
  { id: 'liters-to-pounds-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const WATER_TABLE_LITERS = [0, 1, 2, 5, 10, 20, 50, 100] as const;

export const LITERS_TO_POUNDS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'liters-to-pounds-conversion',
    title: 'Liters-to-Pounds Conversion',
    paragraphs: [
      'Liters measure volume. Pounds measure mass. You cannot convert one into the other without knowing the substance density.',
      'The governing relationship is Mass = Density × Volume. With density in kilograms per liter and the exact international pound (1 lb = 0.45359237 kg):',
      `Pounds = Liters × Density (kg/L) / ${KG_PER_POUND}.`,
      `Water example at an assumed 1 kg/L: 5 L × 1 / ${KG_PER_POUND} ≈ ${formatMeasure(litersToPounds(5, 1))} lb.`,
      'Always match the density to the real material and conditions (temperature, composition). Preset values in the calculator are illustrative.',
    ],
    formula: `lb = L × ρ(kg/L) / ${KG_PER_POUND}`,
    tableHeaders: ['Liters (water @ 1 kg/L)', 'Pounds'],
    table: WATER_TABLE_LITERS.map((L) => [formatMeasure(L), formatMeasure(litersToPounds(L, 1))]),
  },
  {
    id: 'pounds-to-liters-conversion',
    title: 'Pounds to Liters Conversion',
    paragraphs: [
      'Reverse the formula when you know mass and density:',
      `Liters = Pounds × ${KG_PER_POUND} / Density (kg/L).`,
      `Water example: 10 lb × ${KG_PER_POUND} / 1 ≈ ${formatMeasure(poundsToLiters(10, 1))} L.`,
      'Steps: convert pounds to kilograms with the exact pound, then divide by density in kg/L.',
    ],
    formula: `L = lb × ${KG_PER_POUND} / ρ(kg/L)`,
  },
  {
    id: 'density-as-lb-per-l',
    title: 'Expressing Density as lb/L',
    paragraphs: [
      'Density can be written in several unit systems. Convert to kg/L for a common internal basis:',
      `Density (lb/L) = Density (kg/L) / ${KG_PER_POUND}, and Density (kg/L) = Density (lb/L) × ${KG_PER_POUND}.`,
      'If density is already in lb/L, the conversion collapses to Pounds = Liters × Density (lb/L).',
      'This calculator also accepts kg/m³, g/mL, g/cm³, and lb/ft³ while preserving the same physical density when you change the unit label.',
    ],
    formula: `1 kg/L = 1000 kg/m³ = 1 g/mL = 1 g/cm³`,
    tableHeaders: ['Unit', 'Equals'],
    table: [
      ['1 kg/L', '1000 kg/m³'],
      ['1 g/mL', '1 kg/L'],
      ['1 g/cm³', '1 kg/L'],
      ['1 lb/L', `${KG_PER_POUND} kg/L`],
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use Our Liters-to-Pounds Calculator',
    paragraphs: [
      '1. Choose a substance category.',
      '2. Select an ingredient or material.',
      '3. Review the automatically populated density (approximate when labeled).',
      '4. Adjust the density or unit if your measured value differs.',
      '5. Enter the volume in liters. pounds update instantly.',
      '6. Or enter pounds to calculate liters.',
      '7. Change the substance or density to run another scenario.',
      '8. Share or copy the current substance, density, volume, and weight.',
      'The numerical result always depends on the density you supply.',
    ],
  },
  {
    id: 'other-similar-tools',
    title: 'Other Similar Tools',
    paragraphs: [
      'Related Omega Calculators pages that already exist include Volume Conversion, Weight Converter, Gallons to Pounds Converter, Quarts to Pounds Conversion, Pint to Pound Conversion, and kg to Gallons Converter.',
    ],
  },
];

export const LITERS_TO_POUNDS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Pounds Are 5 Liters of Fat?',
    answer: `Fat density varies. For an illustrative 0.92 kg/L: mass = 5 × 0.92 = 4.6 kg; pounds ≈ ${formatMeasure(litersToPounds(5, 0.92))} lb. A different density produces a different result.`,
  },
  {
    question: 'How Many Pounds Are in 10 Liters?',
    answer: `It depends on the substance. Water at 1 kg/L: ≈ ${formatMeasure(litersToPounds(10, 1))} lb. Olive oil at an illustrative 0.91 kg/L: ≈ ${formatMeasure(litersToPounds(10, 0.91))} lb.`,
  },
  {
    question: 'Can Liters Be Converted Directly to Pounds?',
    answer:
      'No. Density is required because liters measure volume and pounds measure mass.',
  },
  {
    question: 'How Many Pounds Are in One Liter of Water?',
    answer: `At an assumed 1 kg/L, 1 L ≈ ${formatMeasure(litersToPounds(1, 1))} lb. Actual water density depends on temperature.`,
  },
  {
    question: 'Why Do Different Liquids Have Different Weights for the Same Volume?',
    answer:
      'Density differs. Water is near 1 kg/L, oils are often lighter, and honey is denser, so the same volume has different mass.',
  },
  {
    question: 'How Do I Convert Pounds Back to Liters?',
    answer: `Use Liters = Pounds × ${KG_PER_POUND} / Density (kg/L). Example: 10 lb of water at 1 kg/L ≈ ${formatMeasure(poundsToLiters(10, 1))} L.`,
  },
];
