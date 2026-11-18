import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, gramsToMilliliters, millilitersToGrams } from './calculation';

export const GRAMS_IN_ML_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-convert-grams-to-ml', label: 'How Do I Convert Grams to mL?' },
  { id: 'grams-to-ml-water', label: 'Grams to mL Conversion for Water' },
  { id: 'how-to-use', label: 'How to Use This Gram to Milliliter Converter' },
  { id: 'related-tools', label: 'Related Conversion Calculators' },
  { id: 'grams-in-ml-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { grams: string; ml: string }[];
}

const honey100 = gramsToMilliliters(100, 1.42);
const milk200 = gramsToMilliliters(200, 1.03);
const oil150 = millilitersToGrams(150, 0.92);

export const WATER_GRAMS_ML_TABLE: readonly { grams: string; ml: string }[] = [
  { grams: '1 g', ml: '1 mL' },
  { grams: '5 g', ml: '5 mL' },
  { grams: '10 g', ml: '10 mL' },
  { grams: '25 g', ml: '25 mL' },
  { grams: '50 g', ml: '50 mL' },
  { grams: '100 g', ml: '100 mL' },
  { grams: '250 g', ml: '250 mL' },
  { grams: '500 g', ml: '500 mL' },
  { grams: '1000 g', ml: '1000 mL' },
];

export const GRAMS_IN_ML_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-convert-grams-to-ml',
    title: 'How Do I Convert Grams to mL?',
    paragraphs: [
      'Grams measure mass. Milliliters measure volume. The same mass of different ingredients can occupy different volumes because their densities differ.',
      'When mass is in grams and density is in g/mL, volume in milliliters is mass divided by density.',
      `Example: convert 100 grams of honey at an approximate density of 1.42 g/mL. Volume = 100 ÷ 1.42 ≈ ${formatMeasure(Number(honey100.toFixed(2)))} mL (${formatMeasure(honey100)} mL before display rounding).`,
      'The reverse conversion multiplies volume by density: mass (g) = density (g/mL) × volume (mL).',
      `Example: 150 mL of vegetable oil at 0.92 g/mL has a mass of ${formatMeasure(oil150)} g.`,
    ],
    formula: 'Volume (mL) = Mass (g) ÷ Density (g/mL)\nMass (g) = Density (g/mL) × Volume (mL)',
  },
  {
    id: 'grams-to-ml-water',
    title: 'Grams to mL Conversion for Water',
    paragraphs: [
      'Water near 4 °C has a convenient approximate density of 1 g/mL (1000 kg/m³). Under that approximation, grams and milliliters match numerically.',
      'These values are approximate and based on water at about 1 g/mL. Real density varies slightly with temperature and purity.',
      `For milk near 1.03 g/mL, 200 g occupies about ${formatMeasure(Number(milk200.toFixed(2)))} mL — not 200 mL — because milk is denser than the water reference.`,
    ],
    formula: 'For water ≈ 1 g/mL: mL ≈ g',
    table: WATER_GRAMS_ML_TABLE,
  },
  {
    id: 'how-to-use',
    title: 'How to Use This Gram to Milliliter Converter',
    paragraphs: [
      '1. Select an ingredient from the dropdown (Water is the default).',
      '2. Check the suggested density — presets are approximate.',
      '3. Enter a custom density if your substance or conditions differ.',
      '4. Enter a mass (default unit: grams).',
      '5. Read the automatically calculated volume (default unit: milliliters).',
      '6. Or enter volume to calculate mass instead.',
      '7. Change density, mass, or volume units with the selectors; physical quantities are preserved when units change.',
      'Compare ingredients by keeping mass fixed and switching the preset — different densities produce different volumes for the same mass.',
    ],
  },
  {
    id: 'related-tools',
    title: 'Related Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Gallons to Grams Conversion, Gal to kg Converter, Fluid Ounces to Pounds Conversion, Gallons to Tons Converter, Volume Conversion, and other density-based mass–volume tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const GRAMS_IN_ML_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 100 g of Honey to Milliliters?',
    answer: `Using an approximate density of 1.42 g/mL: Volume = 100 ÷ 1.42 ≈ ${formatMeasure(Number(honey100.toFixed(2)))} mL. Therefore, 100 grams of honey occupies approximately ${formatMeasure(Number(honey100.toFixed(2)))} milliliters.`,
  },
  {
    question: 'Is 1 Gram Equal to 1 mL?',
    answer:
      'Not always. For water near a density of 1 g/mL, 1 gram occupies approximately 1 milliliter. Other materials have different densities, so the relationship changes.',
  },
  {
    question: 'How Many Milliliters Are in 250 Grams?',
    answer:
      'It depends on the ingredient. For water at approximately 1 g/mL, 250 g = 250 mL. For other ingredients, divide 250 by the ingredient’s density in g/mL.',
  },
  {
    question: 'How Do I Convert mL Back to Grams?',
    answer: `Multiply the volume in mL by the material’s density in g/mL. For example, 150 mL of oil with a density of 0.92 g/mL has a mass of ${formatMeasure(oil150)} grams.`,
  },
  {
    question: 'Why Do Flour and Water Have Different Gram-to-mL Conversions?',
    answer:
      'Because they have different densities. Water is approximately 1 g/mL, while the bulk density of flour varies with how tightly it is packed. Consequently, 100 grams of flour can occupy a different volume than 100 grams of water.',
  },
];
