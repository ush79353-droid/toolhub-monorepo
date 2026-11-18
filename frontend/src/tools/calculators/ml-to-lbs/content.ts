import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, lbsToMl, mlToLbs } from './calculation';
import { SUBSTANCES } from './substances';
import { KG_PER_POUND, WATER_DENSITY_KG_PER_M3 } from './types';

export const MLLBS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'mL to lbs Conversion' },
  { id: 'ml-to-lbs-formula', label: 'The Formula for mL to lbs Conversion' },
  { id: 'lbs-to-ml-formula', label: 'The Formula for Pounds to mL Conversion' },
  { id: 'density-lb-ml', label: 'Expressing Density in lb/mL Units' },
  { id: 'how-to-use', label: 'How to Use the mL to lbs Converter' },
  { id: 'related-tools', label: 'Other Similar Calculators' },
  { id: 'how-it-works', label: 'How Does the Calculator Work?' },
  { id: 'mllbs-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const LB_PER_KG_M3_AS_LB_PER_ML = 1 / (KG_PER_POUND * 1_000_000);

export const MLLBS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'mL to lbs Conversion',
    paragraphs: [
      'Milliliters measure volume and pounds measure mass. Two liquids can share the same volume yet have different masses because their densities differ. Converting mL to pounds therefore always requires density — there is no fixed mL-to-lb factor that works for every substance.',
      'This converter lets you pick a reference substance, confirm or enter density, then convert volume to mass or mass to volume in either direction.',
    ],
  },
  {
    id: 'ml-to-lbs-formula',
    title: 'The Formula for mL to lbs Conversion',
    paragraphs: [
      'Mass equals density times volume: m = ρ × V. With density in kg/m³ and volume in milliliters, mass in kilograms is (mL × ρ) ÷ 1,000,000. Divide by the exact pound definition 0.45359237 kg to obtain pounds:',
      'Mass(lb) = (Volume(mL) × Density(kg/m³)) ÷ 453592.37.',
      `Worked example: 500 mL of water at approximately ${WATER_DENSITY_KG_PER_M3} kg/m³ → lb = (500 × 1000) ÷ 453592.37 ≈ ${formatMeasure(mlToLbs(500, WATER_DENSITY_KG_PER_M3))} lb.`,
      'Volume is the amount of space occupied; density is mass per unit volume; the constant 453592.37 comes from 1 lb = 0.45359237 kg combined with converting mL to cubic meters.',
    ],
    formula:
      'Mass(lb) = (Volume(mL) × Density(kg/m³)) / 453592.37\n(500 × 1000) / 453592.37 ≈ 1.102311 lb',
  },
  {
    id: 'lbs-to-ml-formula',
    title: 'The Formula for Pounds to mL Conversion',
    paragraphs: [
      'Rearranging the same relationship gives volume from mass and density:',
      'Volume(mL) = (Mass(lb) × 453592.37) ÷ Density(kg/m³).',
      `For 1 pound of water at approximately ${WATER_DENSITY_KG_PER_M3} kg/m³, volume ≈ ${formatMeasure(lbsToMl(1, WATER_DENSITY_KG_PER_M3))} mL (about 453.6 mL).`,
    ],
    formula: 'Volume(mL) = (Mass(lb) × 453592.37) / Density(kg/m³)\n1 lb → ≈ 453.59237 mL (water ≈ 1000 kg/m³)',
  },
  {
    id: 'density-lb-ml',
    title: 'Expressing Density in lb/mL Units',
    paragraphs: [
      'Density may be written as pounds per milliliter (lb/mL). That unit is uncommon but useful when mass and volume are already in lb and mL: then lb = mL × Density(lb/mL).',
      `One kilogram per cubic meter equals ${formatMeasure(LB_PER_KG_M3_AS_LB_PER_ML)} lb/mL. Water near 1000 kg/m³ is therefore about ${formatMeasure(1000 * LB_PER_KG_M3_AS_LB_PER_ML)} lb/mL.`,
      'Density is also commonly expressed in g/mL, g/cm³, kg/L, and lb/ft³. This calculator normalizes supported density units to kg/m³ internally before converting.',
    ],
    formula: '1 kg/m³ = 0.00000220462262 lb/mL\nlb = mL × Density(lb/mL)',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mL to lbs Converter',
    paragraphs: [
      '1. Select a substance from the ingredient list (or Custom).',
      '2. Confirm or enter its density and density unit.',
      '3. Enter the volume in milliliters (or another volume unit).',
      '4. Read the calculated mass in pounds (or switch mass units).',
      '5. Alternatively, enter pounds to calculate milliliters.',
      'Changing units preserves the physical quantity. Changing the ingredient or density recalculates from the field you last edited.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Similar Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Volume to Mass Calculator, mL to kg Converter, kg to mL Converter, mg to cc Converter, Grams to mL Converter, kg to lbs Converter, lbs to kg Converter, and Liter to Pounds Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
  {
    id: 'how-it-works',
    title: 'How Does the Calculator Work?',
    paragraphs: [
      'You choose a substance (or custom density), enter volume or mass, and optionally switch units. The calculator normalizes volume to milliliters and mass to kilograms, converts density to kg/m³, applies m = ρV (or the reverse), then displays mass in your selected unit (default pounds). Preset densities are approximate reference values — not certifications.',
    ],
    tableHeaders: ['Substance', 'Approx. density (kg/m³)'],
    table: SUBSTANCES.map((s) => [s.name, formatMeasure(s.densityKgPerM3)]),
  },
];

export const MLLBS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many mL Are in 1 lb?',
    answer: `There is no universal answer because pounds measure mass while milliliters measure volume. For water at approximately ${WATER_DENSITY_KG_PER_M3} kg/m³, 1 lb ≈ ${formatMeasure(lbsToMl(1, WATER_DENSITY_KG_PER_M3))} mL. Other substances differ.`,
  },
  {
    question: 'How Many mL Are in a Pound of Water?',
    answer: `Approximately ${formatMeasure(lbsToMl(1, WATER_DENSITY_KG_PER_M3))} mL using a water density near 1 g/mL (${WATER_DENSITY_KG_PER_M3} kg/m³). Actual values may vary slightly with temperature.`,
  },
  {
    question: 'How Many mL Are in a Pound of Oil?',
    answer: `It depends on the oil's density. For an oil near 910 kg/m³, mL = 453592.37 ÷ 910 ≈ ${formatMeasure(lbsToMl(1, 910))} mL. Use the olive oil or vegetable oil preset (or a measured density) for a closer estimate.`,
  },
  {
    question: 'How Do I Convert 250 mL to Pounds?',
    answer: `Determine the substance's density. For water at approximately ${WATER_DENSITY_KG_PER_M3} kg/m³: lb = (250 × 1000) ÷ 453592.37 ≈ ${formatMeasure(mlToLbs(250, WATER_DENSITY_KG_PER_M3))} lb.`,
  },
  {
    question: 'Can I Convert mL to Pounds Without Density?',
    answer:
      'No. A mass–volume conversion requires density. Milliliters and pounds measure different physical quantities.',
  },
  {
    question: 'Is 1 mL Equal to 1 Pound?',
    answer: `No. For water near 1 g/mL, 1 mL has a mass of approximately ${formatMeasure(mlToLbs(1, WATER_DENSITY_KG_PER_M3))} lb.`,
  },
];
