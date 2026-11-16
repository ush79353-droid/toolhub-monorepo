import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, massToVolume, volumeToMass } from './calculation';

export const CC_TO_GRAMS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-is-density', label: 'What Is Density?' },
  { id: 'how-to-convert-cc-to-grams', label: 'How to Convert CC to Grams' },
  { id: 'how-to-convert-grams-to-cc', label: 'How to Convert Grams to CC' },
  { id: 'cc-vs-ml-vs-grams', label: 'CC vs Milliliters vs Grams' },
  { id: 'why-different-weights', label: 'Why Different Substances Have Different Weights' },
  { id: 'how-to-use', label: 'How to Use the CC to Grams Converter' },
  { id: 'related-density-tools', label: 'Related Density Conversion Tools' },
  { id: 'cc-to-grams-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const CC_TO_GRAMS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-is-density',
    title: 'What Is Density?',
    paragraphs: [
      'Density is mass per unit volume. It answers how much matter fits in a given space.',
      'Mass (for example in grams) is an amount of matter. Volume (for example in cubic centimeters) is how much space that matter occupies. Density links the two.',
      'You cannot convert cc to grams without density, because different substances pack different mass into the same volume.',
      'Common density units include g/cm³, g/mL, kg/m³, kg/L, lb/ft³, and lb per US gallon. Numerically, 1 g/cm³ = 1 g/mL = 1 kg/L = 1000 kg/m³.',
      'Water near 4 °C is often taken as about 1 g/cm³. Honey is denser; olive oil is lighter. Temperature and composition change the real value.',
    ],
    formula: 'ρ = m / V',
    tableHeaders: ['Substance (illustrative)', 'Approx. density (g/cm³)', 'Mass of 100 cc'],
    table: [
      ['Water', '1.00', `${formatMeasure(volumeToMass(100, 1))} g`],
      ['Honey', '1.42', `${formatMeasure(volumeToMass(100, 1.42))} g`],
      ['Olive oil', '0.91', `${formatMeasure(volumeToMass(100, 0.91))} g`],
    ],
  },
  {
    id: 'how-to-convert-cc-to-grams',
    title: 'How to Convert CC to Grams',
    paragraphs: [
      'Rearrange density to solve for mass: Mass = Volume × Density.',
      'When volume is in cc (cm³) and density is in g/cm³, the product is grams directly: Grams = CC × Density (g/cm³).',
      `Worked example: volume 200 cc, density 1.03 g/cm³ (typical milk). Mass = 200 × 1.03 = ${formatMeasure(volumeToMass(200, 1.03))} g.`,
      'If density rises and volume stays fixed, mass rises. If density falls, mass falls. Always match density units to the volume unit basis.',
    ],
    formula: 'm = V × ρ',
  },
  {
    id: 'how-to-convert-grams-to-cc',
    title: 'How to Convert Grams to CC',
    paragraphs: [
      'Solve density for volume: Volume = Mass / Density.',
      'With mass in grams and density in g/cm³: CC = Grams / Density (g/cm³).',
      `Worked example: mass 284 g, density 1.42 g/cm³ (typical honey). Volume = 284 / 1.42 = ${formatMeasure(massToVolume(284, 1.42))} cc.`,
      'Division by zero is undefined — density must be greater than zero for this calculator.',
    ],
    formula: 'V = m / ρ',
  },
  {
    id: 'cc-vs-ml-vs-grams',
    title: 'CC, Cubic Centimeters, and Milliliters',
    paragraphs: [
      'In everyday laboratory and culinary use, 1 cc = 1 cm³ = 1 mL. These are volume units.',
      'Grams measure mass. They are not the same physical quantity as cubic centimeters.',
      'Only with density can you move between volume and mass. For water near 4 °C, 1 cc has approximately 1 g of mass — a convenient approximation, not a universal identity for every liquid or temperature.',
      'This converter also accepts liters, cubic meters, and US liquid units (fluid ounce, cup, pint, quart, gallon). US liquid measures are not Imperial.',
    ],
    formula: '1 cc = 1 cm³ = 1 mL · 1000 cc = 1 L',
  },
  {
    id: 'why-different-weights',
    title: 'Why Different Ingredients Have Different Weights',
    paragraphs: [
      `At the same 100 cc volume: water ≈ ${formatMeasure(volumeToMass(100, 1))} g, honey ≈ ${formatMeasure(volumeToMass(100, 1.42))} g, olive oil ≈ ${formatMeasure(volumeToMass(100, 0.91))} g (illustrative densities).`,
      'Composition, temperature, and measurement technique all matter. Oils expand with heat; honey moisture varies; powders introduce bulk density rather than solid material density.',
      'Treat preset densities as starting points. Prefer a measured density when precision matters.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use Omega\'s CC to Grams Converter',
    paragraphs: [
      '1. Choose the substance from the ingredient list, or select Custom Density.',
      '2. Verify or enter density, and pick a density unit if needed.',
      '3. Select volume and mass units.',
      '4. Enter volume in cc (or another volume unit) to read mass.',
      '5. Or enter mass to calculate volume.',
      '6. Use Reload to restore Water at 1 g/cm³ with empty measures, or Clear to wipe entered values.',
      '7. Share or copy the current ingredient, density, volume, and mass.',
    ],
  },
  {
    id: 'related-density-tools',
    title: 'Other Interesting Density Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages include Density Conversion, Liters to Pounds Calculator, Volume Conversion, Weight Converter, and mg to mL Calculator. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const CC_TO_GRAMS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do You Convert Cubic Centimeters (cm³) to Grams?',
    answer: `Use Mass (g) = Volume (cm³) × Density (g/cm³). Example with water at a nominal 1 g/cm³: 100 cm³ × 1 = ${formatMeasure(volumeToMass(100, 1))} g.`,
  },
  {
    question: 'Does 1 cm³ Equal 1 Gram?',
    answer:
      'No, not universally. One cm³ equals one mL — a volume. Its mass depends on density. For water near 4 °C, 1 cm³ has approximately 1 gram of mass.',
  },
  {
    question: 'Are CC and Grams the Same?',
    answer:
      'No. CC (cubic centimeters) measure volume. Grams measure mass. Density connects them.',
  },
  {
    question: 'How Many Grams Are in 100 CC of Water?',
    answer: `Using this calculator's nominal water density of 1 g/cm³: about ${formatMeasure(volumeToMass(100, 1))} g. Real water density varies slightly with temperature.`,
  },
  {
    question: 'How Many Grams Are in 50 CC of Honey?',
    answer: `Using an illustrative honey density of 1.42 g/cm³: 50 × 1.42 = ${formatMeasure(volumeToMass(50, 1.42))} g.`,
  },
  {
    question: 'How Do I Convert Grams Back to CC?',
    answer: `Use Volume (cc) = Mass (g) / Density (g/cm³). Example: ${formatMeasure(massToVolume(142, 1.42))} cc for 142 g of honey at 1.42 g/cm³.`,
  },
  {
    question: 'Does Temperature Affect Density?',
    answer:
      'Yes. Many substances expand or contract as temperature changes, which changes density. Treat a single preset value as approximate for ordinary conditions, not laboratory-exact for every temperature.',
  },
];
