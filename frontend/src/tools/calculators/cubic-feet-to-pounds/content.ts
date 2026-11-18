import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { cubicFeetToPounds, formatMeasure, poundsToCubicFeet } from './calculation';
import {
  CONCRETE_DENSITY_LB_PER_FT3,
  CUBIC_METERS_PER_CUBIC_FOOT,
  KG_PER_POUND,
  WATER_DENSITY_LB_PER_FT3,
} from './types';

export const CU_FT_TO_LB_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'formula-cubic-feet-to-pounds', label: 'The Formula for Cubic Feet to Pound Calculation' },
  { id: 'density-lb-per-ft3', label: 'Expressing Density in Terms of Pounds and Cubic Foot' },
  { id: 'how-to-use', label: 'How to Use the Cubic Feet to Pounds Calculator' },
  { id: 'other-similar-tools', label: 'Other Similar Tools' },
  { id: 'cubic-feet-to-pounds-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CONCRETE_VOLUMES = [0, 0.5, 1, 2, 5, 10, 25, 50, 100] as const;
const WATER_VOLUMES = [1, 2, 5, 10, 20] as const;

export const CU_FT_TO_LB_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'formula-cubic-feet-to-pounds',
    title: 'The Formula for Cubic Feet to Pound Calculation',
    paragraphs: [
      'This calculator converts volume in cubic feet into mass in pounds using density. The same cubic-foot quantity of concrete, water, or sand does not weigh the same amount, because each material has a different density.',
      'Common uses include concrete pours, water tank capacity, sand and gravel estimates, construction planning, shipping, storage containers, and industrial material handling.',
      'The governing relationship is Mass = Density × Volume. With density in pounds per cubic foot and volume in cubic feet:',
      'Pounds = Cubic Feet × Density (lb/ft³).',
      `Concrete example using the calculator's reference density of ${CONCRETE_DENSITY_LB_PER_FT3} lb/ft³: 8 × ${CONCRETE_DENSITY_LB_PER_FT3} = ${formatMeasure(cubicFeetToPounds(8, CONCRETE_DENSITY_LB_PER_FT3))} lb.`,
      'Reverse the relationship when you know mass and density: Cubic Feet = Pounds ÷ Density (lb/ft³).',
      `For ${formatMeasure(1000)} lb of concrete at ${CONCRETE_DENSITY_LB_PER_FT3} lb/ft³: ${formatMeasure(poundsToCubicFeet(1000, CONCRETE_DENSITY_LB_PER_FT3))} ft³.`,
    ],
    formula: 'm = V × ρ   ·   V = m / ρ',
    tableHeaders: [`Cubic feet (concrete @ ${CONCRETE_DENSITY_LB_PER_FT3} lb/ft³)`, 'Pounds'],
    table: CONCRETE_VOLUMES.map((v) => [
      formatMeasure(v),
      formatMeasure(cubicFeetToPounds(v, CONCRETE_DENSITY_LB_PER_FT3)),
    ]),
  },
  {
    id: 'density-lb-per-ft3',
    title: 'Expressing Density in Terms of Pounds and Cubic Foot',
    paragraphs: [
      'A density of 100 lb/ft³ means that one cubic foot of the material has a mass of 100 pounds.',
      'Density can be written in several unit systems. Convert through kilograms per cubic meter using exact definitions: 1 lb = 0.45359237 kg and 1 ft³ = 0.028316846592 m³.',
      `ρ (lb/ft³) = ρ (kg/m³) × ${CUBIC_METERS_PER_CUBIC_FOOT} / ${KG_PER_POUND}.`,
      'This calculator also accepts kg/m³, g/cm³, lb/in³, and kg/L while preserving the same physical density when you change the unit label.',
      'Actual material density can vary with composition, moisture content, temperature, compaction, and porosity. Preset values are illustrative reference figures, not universal constants.',
    ],
    formula: `1 lb/ft³ = ${KG_PER_POUND} / ${CUBIC_METERS_PER_CUBIC_FOOT} kg/m³`,
    tableHeaders: [`Cubic feet (water @ ${WATER_DENSITY_LB_PER_FT3} lb/ft³)`, 'Pounds'],
    table: WATER_VOLUMES.map((v) => [
      formatMeasure(v),
      formatMeasure(cubicFeetToPounds(v, WATER_DENSITY_LB_PER_FT3)),
    ]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Cubic Feet to Pounds Calculator',
    paragraphs: [
      '1. Choose a material category (default: Non-metals).',
      '2. Select the material (default: Concrete).',
      '3. Review the automatically populated density (approximate when labeled).',
      '4. Adjust the density if your measured or specified value differs.',
      '5. Enter cubic feet or pounds — the other field updates instantly.',
      '6. Change density units if required; physical density is preserved.',
      '7. Use Share Result to copy or share the calculation.',
      'Changing the material updates density and recalculates from the last edited field.',
    ],
  },
  {
    id: 'other-similar-tools',
    title: 'Other Similar Tools',
    paragraphs: [
      'Related volume, mass, and density tools appear in the site catalog when they are active. Look for cubic feet converters, gallons-to-pounds tools, liters-to-pounds calculators, density calculators, and general weight converters from the category or search pages.',
      'Only tools that exist in the catalog are linked from the public site; unused placeholders are not invented here.',
    ],
  },
];

export const CU_FT_TO_LB_FAQS: readonly FAQItem[] = [
  {
    question: 'How many pounds are in a cubic foot?',
    answer: `It depends on the material density. Illustrative examples: water near 20 °C ≈ ${WATER_DENSITY_LB_PER_FT3} lb; concrete ≈ ${CONCRETE_DENSITY_LB_PER_FT3} lb; dry sand ≈ 100 lb; steel ≈ 490 lb; aluminum ≈ 168.5 lb. Actual values vary with conditions.`,
  },
  {
    question: 'How much does a cubic foot of water weigh?',
    answer: `Using the calculator's approximate density of ${WATER_DENSITY_LB_PER_FT3} lb/ft³ near 20 °C: 1 × ${WATER_DENSITY_LB_PER_FT3} = ${formatMeasure(cubicFeetToPounds(1, WATER_DENSITY_LB_PER_FT3))} lb.`,
  },
  {
    question: 'How many pounds are 5 cubic feet of sand?',
    answer: `Using an illustrative dry-sand density of 100 lb/ft³: 5 × 100 = ${formatMeasure(cubicFeetToPounds(5, 100))} lb. Results depend on sand type, moisture, and compaction.`,
  },
  {
    question: 'Can I convert cubic feet directly to pounds?',
    answer:
      'Only when the material density is known or assumed. Cubic feet measure volume; pounds measure mass. Density connects the two measurements.',
  },
  {
    question: 'How do I convert pounds back to cubic feet?',
    answer: `Divide mass by density: V = m / ρ. Example at 100 lb/ft³: 500 ÷ 100 = ${formatMeasure(poundsToCubicFeet(500, 100))} ft³.`,
  },
];
