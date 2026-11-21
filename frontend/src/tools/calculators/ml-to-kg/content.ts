import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, mlToKg } from './calculation';
import { SUBSTANCES } from './substances';
import { WATER_DENSITY_KG_PER_M3 } from './types';

export const MLKG_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'How to Use the Calculator' },
  { id: 'density-formula', label: 'How Do I Find Mass with Density and Volume?' },
  { id: 'convert-ml-to-kg', label: 'How Do I Convert Milliliters to Kilograms?' },
  { id: 'example', label: 'An Example of the mL to kg Converter' },
  { id: 'related-tools', label: 'More Volume–Mass Converters' },
  { id: 'how-it-works', label: 'How Does the Calculator Work?' },
  { id: 'mlkg-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const MLKG_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'How to Use the mL to kg Calculator',
    paragraphs: [
      'The mL to kg Converter converts between milliliters and kilograms using the density of a selected substance. Milliliters measure volume; kilograms measure mass; density connects them. Common uses include cooking, chemistry, laboratory work, and material calculations.',
      '1. Select the substance from the dropdown.',
      '2. Review or enter its density (and density unit if needed).',
      '3. Enter the volume in milliliters or another supported volume unit.',
      '4. Read the automatically calculated mass in kilograms (or another mass unit).',
      '5. Alternatively, enter mass to calculate volume.',
      'Selecting a different substance changes the result because density changes. There is no universal mL-to-kg factor.',
    ],
  },
  {
    id: 'density-formula',
    title: 'How Do I Find Mass with Density and Volume?',
    paragraphs: [
      'Mass equals density times volume: m = ρ × V.',
      'Units must be consistent. With density in kg/m³ and volume in milliliters:',
      'm(kg) = V(mL) × ρ(kg/m³) ÷ 1,000,000.',
      'Example: 500 mL of a liquid with density 800 kg/m³ → m = (500 × 800) ÷ 1,000,000 = 0.4 kg.',
    ],
    formula: 'm = ρ × V\nkg = (mL × kg/m³) / 1,000,000\n(500 × 800) / 1,000,000 = 0.4 kg',
  },
  {
    id: 'convert-ml-to-kg',
    title: 'How Do I Convert Milliliters to Kilograms?',
    paragraphs: [
      '1. Identify the liquid or material.',
      '2. Determine its density in kg/m³ (or convert from kg/L, g/mL, or g/cm³).',
      '3. Enter the volume in milliliters.',
      '4. Multiply volume by density.',
      '5. Divide by 1,000,000.',
      'Formula: kg = (mL × Density) / 1,000,000 when density is in kg/m³.',
    ],
    formula: 'kg = (mL × Density kg/m³) / 1,000,000',
  },
  {
    id: 'example',
    title: 'An Example of the mL to kg Converter',
    paragraphs: [
      'Suppose a liquid has volume 2,500 mL and density 880 kg/m³.',
      'm = (2500 × 880) ÷ 1,000,000 = 2.2 kg.',
      'A different density for the same volume would produce a different mass, for example 1000 kg/m³ would give 2.5 kg.',
    ],
    formula: 'm = (2500 × 880) / 1,000,000 = 2.2 kg',
  },
  {
    id: 'related-tools',
    title: 'Looking for More Volume–Mass Converters?',
    paragraphs: [
      'Related Omega Calculators pages may include kg to mL Converter, mg to cc Conversion, mg to Teaspoon Converter, mg to Tablespoon Converter, kg to Liter Converter, Gallons to Grams Conversion, and mL to cc Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
  {
    id: 'how-it-works',
    title: 'How Does the mL to kg Calculator Work?',
    paragraphs: [
      'You choose a substance (or custom density), enter volume or mass, and optionally switch units. The calculator normalizes volume to milliliters and mass to kilograms, converts density to kg/m³, then applies m = ρV (or the reverse). Results update as you type. Preset densities are approximate reference values; not certifications or clinical dose guidance.',
    ],
    tableHeaders: ['Substance', 'Approx. density (kg/m³)'],
    table: SUBSTANCES.map((s) => [s.name, formatMeasure(s.densityKgPerM3)]),
  },
];

export const MLKG_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many kg Is 1,000 mL of Water?',
    answer: `Using a reference density of ${WATER_DENSITY_KG_PER_M3} kg/m³, 1,000 mL of water ≈ ${formatMeasure(mlToKg(1000, WATER_DENSITY_KG_PER_M3))} kg. Actual mass depends on water density at the relevant temperature.`,
  },
  {
    question: 'Can I Convert mL to kg Without Density?',
    answer:
      'No. Milliliters measure volume and kilograms measure mass. The conversion requires the density of the substance.',
  },
  {
    question: 'How Do I Convert 500 mL to kg?',
    answer: `Determine the substance's density. For water using approximately ${WATER_DENSITY_KG_PER_M3} kg/m³, 500 mL ≈ ${formatMeasure(mlToKg(500, WATER_DENSITY_KG_PER_M3))} kg. Other substances may have different masses for the same volume.`,
  },
  {
    question: 'Does 1 mL Always Equal 1 Gram?',
    answer:
      'No. One milliliter of water has approximately one gram of mass under common reference conditions, but other substances have different densities.',
  },
  {
    question: 'What Is the Formula for Converting mL to kg?',
    answer:
      'When density is measured in kg/m³: kg = (mL × Density) / 1,000,000.',
  },
  {
    question: 'Can I Convert kg Back to mL?',
    answer:
      'Yes. Use mL = (kg × 1,000,000) / Density, with density expressed in kg/m³.',
  },
  {
    question: 'Why Does Density Matter?',
    answer:
      'Density describes how much mass exists in a particular volume. Different materials can occupy the same volume while having different masses.',
  },
];
