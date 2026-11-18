import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';

export const DENSITY_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'density-units', label: 'Density Units' },
  { id: 'water-lb-gal', label: 'Density of Water in lb/gal' },
  { id: 'water-g-cm3', label: 'Density of Water in Grams per Cubic Centimeter' },
  { id: 'how-to-use', label: 'How to Use the Density Conversion Calculator' },
  { id: 'common-examples', label: 'Common Density Conversion Examples' },
  { id: 'density-conversion-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

export const DENSITY_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'density-units',
    title: 'Density Units',
    paragraphs: [
      'Density is mass per unit volume. It describes how much matter fits into a given space and is fundamental in engineering, chemistry, materials science, and manufacturing.',
      'The SI unit of density is kilogram per cubic meter (kg/m³). Related metric units include kg/dm³ and g/cm³. Imperial and US customary practice often uses pounds per cubic foot, pounds per cubic yard, or pounds per US liquid gallon.',
      'Metric and imperial density units differ because they combine different mass and volume standards. Converting between them requires consistent definitions of the pound, foot, yard, and gallon.',
    ],
    formula: 'ρ = m / V   (ρ = density, m = mass, V = volume)',
    tableHeaders: ['Unit', 'Symbol', 'kg/m³ factor'],
    table: [
      ['Kilograms per cubic decimeter', 'kg/dm³', '1000'],
      ['Kilograms per cubic meter', 'kg/m³', '1'],
      ['Pounds per cubic foot', 'lb/cu ft', '≈ 16.01846337'],
      ['Pounds per cubic yard', 'lb/cu yd', '≈ 0.59327642'],
      ['Pounds per US gallon', 'lb/US gal', '≈ 119.82642732'],
    ],
  },
  {
    id: 'water-lb-gal',
    title: 'Density of Water in lb/gal',
    paragraphs: [
      'Water density depends on temperature and composition. Freshwater near 20°C is often taken as about 998.2 kg/m³, which corresponds to roughly 8.33 lb per US liquid gallon.',
      'This converter uses the US liquid gallon (exactly 0.003785411784 m³), not the imperial gallon. Heating, cooling, dissolved solids, and salinity all change the actual density, so treat water-density examples as approximate unless you specify conditions.',
    ],
  },
  {
    id: 'water-g-cm3',
    title: 'Density of Water in Grams per Cubic Centimeter',
    paragraphs: [
      'One gram per cubic centimeter equals exactly 1000 kilograms per cubic meter and exactly one kilogram per cubic decimeter. Water is often approximated as 1 g/cm³ near room temperature, but the precise value depends on temperature.',
      'For rough estimates, 1 g/cm³ ≈ 1 kg/dm³ ≈ 1000 kg/m³. For higher accuracy, use a temperature-specific water density and convert with this tool.',
    ],
    formula: '1 g/cm³ = 1000 kg/m³ = 1 kg/dm³',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Density Conversion Calculator',
    paragraphs: [
      '1. Open the Density Conversion calculator on this page.',
      '2. Expand Metric Units or Imperial Units as needed.',
      '3. Enter a density in any field you already know.',
      '4. Read the synchronized values in every other unit.',
      '5. Edit another field to reverse the conversion.',
      '6. Use Share Result to copy the answer, Reload Calculator to restore defaults, or Clear All Changes to empty the fields while keeping accordion state.',
    ],
  },
  {
    id: 'common-examples',
    title: 'Common Density Conversion Examples',
    paragraphs: [
      '1 g/cm³ → 1000 kg/m³ (exact via 1 kg/dm³).',
      '1 kg/dm³ → 1000 kg/m³ ≈ 62.428 lb/cu ft ≈ 1685.555 lb/cu yd ≈ 8.345 lb/US gal.',
      '1000 kg/m³ → 1 kg/dm³ ≈ 62.428 lb/cu ft ≈ 8.345 lb/US gal.',
      '50 lb/cu ft ≈ 800.923 kg/m³.',
      '10 lb/US gal ≈ 1198.264 kg/m³.',
    ],
  },
];

export const DENSITY_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is the SI Unit of Density?',
    answer: 'The SI unit of density is kilogram per cubic meter (kg/m³).',
  },
  {
    question: 'How Do I Convert kg/m³ to lb/cu ft?',
    answer:
      'Divide the kg/m³ value by approximately 16.01846337 (the kg/m³ equivalent of 1 lb/cu ft).',
  },
  {
    question: 'How Many kg/m³ Are in 1 g/cm³?',
    answer: '1 g/cm³ equals exactly 1000 kg/m³.',
  },
  {
    question: 'How Many Pounds per Gallon Does Water Weigh?',
    answer:
      'At about 20°C, freshwater is near 8.33 pounds per US liquid gallon. Temperature and composition change the result.',
  },
  {
    question: 'What Is the Difference Between Density and Specific Gravity?',
    answer:
      'Density is mass per unit volume. Specific gravity is a dimensionless ratio of a substance’s density to a reference density.',
  },
  {
    question: 'How Do I Calculate Density from Mass and Volume?',
    answer: 'Divide mass by volume using consistent units: ρ = m / V.',
  },
  {
    question: 'Can Density Be Negative?',
    answer:
      'Ordinary physical mass density cannot be negative. This calculator rejects negative values.',
  },
];
