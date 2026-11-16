import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const PPM_MGL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-ppm-mgl', label: 'What Are PPM and mg/L?' },
  { id: 'converting', label: 'Converting Between PPM and mg/L' },
  { id: 'water-case', label: 'Special Case: Water' },
  { id: 'molarity', label: 'Calculating Molar Concentration' },
  { id: 'how-to-use', label: 'How to Use the PPM to mg/L Converter' },
  { id: 'applications', label: 'Applications of PPM to mg/L Conversion' },
  { id: 'ppm-to-mgl-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

export const PPM_MGL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-are-ppm-mgl',
    title: 'What Are PPM and mg/L?',
    paragraphs: [
      'Mass-based parts per million (ppm) describes a ratio of solute mass to solution mass: 1 ppm = 1 mg of solute per kilogram of solution (mg/kg).',
      'Milligrams per liter (mg/L) is a mass concentration — solute mass per unit volume of solution. Density is required to convert a mass fraction into a mass-per-volume concentration.',
    ],
  },
  {
    id: 'converting',
    title: 'Converting Between PPM and mg/L',
    paragraphs: [
      'With density ρ in kg/m³: mg/L = ppm × ρ / 1000. Equivalently, multiply ppm by density in kg/L.',
      'Reverse: ppm = mg/L × 1000 / ρ. Example at 1000 kg/m³: 100 ppm → 100 mg/L. At 1200 kg/m³: 100 ppm → 120 mg/L.',
    ],
    formula: 'mg/L = ppm × ρ(kg/m³) / 1000 · ppm = mg/L × 1000 / ρ(kg/m³)',
  },
  {
    id: 'water-case',
    title: 'Special Case: Water',
    paragraphs: [
      'For dilute aqueous solutions, density is often approximated as 1000 kg/m³ (≈ 1 kg/L). Then mg/L ≈ ppm numerically.',
      'That 1:1 shortcut depends on density and on the mass-based ppm definition. Real water density varies with temperature, pressure, and dissolved solids — this converter uses the density you enter.',
    ],
    formula: 'ρ ≈ 1000 kg/m³ → mg/L ≈ ppm',
  },
  {
    id: 'molarity',
    title: 'Calculating Molar Concentration',
    paragraphs: [
      'With molar mass M in g/mol: mol/L = (mg/L) / (1000 × M). Reverse: mg/L = mol/L × M × 1000.',
      'Example: 1000 mg/L NaCl with M = 58.44 g/mol → ≈ 0.0171116 mol/L. Molarity is amount of substance per liter; molar mass is mass per mole of the solute.',
    ],
    formula: 'mol/L = (mg/L) / (1000 × M) · M in g/mol',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the PPM to mg/L Converter',
    paragraphs: [
      '1. Enter a mass-based ppm value, or start from mg/L or molarity.',
      '2. Enter or adjust the solution density and unit.',
      '3. Read the synchronized mg/L (and ppm) results.',
      '4. Optionally enter the solute molar mass to obtain molar concentration.',
      '5. Edit molar concentration (with molar mass set) to reverse-convert to mg/L and ppm.',
      '6. Use Share, Reload, or Clear as needed.',
    ],
  },
  {
    id: 'applications',
    title: 'Applications of PPM to mg/L Conversion',
    paragraphs: [
      'These conversions appear in water quality work, environmental chemistry, laboratory analysis, industrial solutions, wastewater treatment, and chemical concentration reporting.',
      'Always state whether ppm is mass-based and report the density (and temperature when relevant). This tool does not invent regulatory limits.',
    ],
  },
];

export const PPM_MGL_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert PPM to Milligrams per Liter?',
    answer:
      'Multiply mass-based ppm by density in kg/L, or use mg/L = ppm × density(kg/m³) / 1000.',
  },
  {
    question: 'How Do I Calculate PPM and mg/L for Water?',
    answer:
      'When water density is about 1 kg/L (1000 kg/m³), mass-based ppm and mg/L are approximately equal numerically.',
  },
  {
    question: 'Is PPM the Same as mg/L?',
    answer:
      'No. PPM is a ratio; mg/L is mass per volume. They match numerically only under specific density assumptions for mass-based ppm.',
  },
  {
    question: 'What Is 50 PPM in mg/L?',
    answer: 'At 1000 kg/m³ → 50 mg/L. At 1200 kg/m³ → 60 mg/L.',
  },
  {
    question: 'How Do I Convert mg/L to PPM?',
    answer: 'ppm = mg/L × 1000 / density(kg/m³).',
  },
  {
    question: 'Can I Convert PPM to Molarity?',
    answer:
      'Yes for mass-based ppm: convert ppm → mg/L with density, then mol/L = (mg/L) / (1000 × M).',
  },
  {
    question: 'Does Temperature Affect PPM to mg/L Conversion?',
    answer:
      'Temperature can change solution density, which changes the ppm ↔ mg/L conversion. Enter the density for your conditions.',
  },
];
