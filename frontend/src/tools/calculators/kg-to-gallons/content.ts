import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { calculateKgToGallons, formatMeasure } from './calculation';
import {
  DEFAULT_KG_TO_GALLONS_INPUT,
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
} from './types';

export const KG_TO_GALLONS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'kg-to-gallons-calculator', label: 'kg to Gallons Calculator' },
  { id: 'how-kg-to-gal', label: 'How to Convert kg to Gallons' },
  { id: 'how-gal-to-kg', label: 'How to Convert Gallons to kg' },
  { id: 'water-example', label: 'kg to Gallons of Water' },
  { id: 'density-role', label: 'Density and Conversion' },
  { id: 'conversion-table', label: 'Conversion Table' },
  { id: 'us-vs-imperial', label: 'US vs Imperial Gallons' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'kg-to-gallons-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  kg: string;
  gallons: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly ConversionTableRow[];
  tableNote?: string;
}

const TABLE_KG = [1, 2, 3, 5, 10, 20, 50, 100] as const;

function tableRows(): readonly ConversionTableRow[] {
  return TABLE_KG.map((kg) => {
    const r = calculateKgToGallons({
      ...DEFAULT_KG_TO_GALLONS_INPUT,
      mass: kg,
    });
    return {
      kg: formatMeasure(kg),
      gallons: formatMeasure(r.volume),
    };
  });
}

export const KG_TO_GALLONS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The kg to Gallons Converter calculates volume from mass using the selected substance’s density, and the reverse: gallons of volume to kilograms of mass. There is no universal kilograms-to-gallons factor.',
    ],
  },
  {
    id: 'kg-to-gallons-calculator',
    title: 'kg to Gallons Conversion Calculator',
    paragraphs: [
      'Kilograms measure mass. Gallons measure volume. Density (mass per volume) connects them. Different substances have different densities, and US liquid gallons differ from Imperial gallons, so the result depends on both the substance and the gallon standard you select.',
    ],
  },
  {
    id: 'how-kg-to-gal',
    title: 'How to Convert kg to Gallons',
    paragraphs: [
      `Divide mass in kilograms by density in kg/L to get liters, then divide by liters per gallon. For US liquid gallons use ${LITERS_PER_US_LIQUID_GALLON} L/gal.`,
      `Example: 1 kg of water at ≈ 1 kg/L → 1 L → ≈ ${formatMeasure(1 / LITERS_PER_US_LIQUID_GALLON)} US gal.`,
    ],
    formula: `US Gallons = Mass (kg) ÷ Density (kg/L) ÷ ${LITERS_PER_US_LIQUID_GALLON}`,
  },
  {
    id: 'how-gal-to-kg',
    title: 'How to Convert Gallons to kg',
    paragraphs: [
      `Convert gallons to liters, then multiply by density in kg/L. Example: 1 US liquid gallon of water at ≈ 1 kg/L → ${LITERS_PER_US_LIQUID_GALLON} kg.`,
    ],
    formula: `Mass (kg) = US Gallons × ${LITERS_PER_US_LIQUID_GALLON} × Density (kg/L)`,
  },
  {
    id: 'water-example',
    title: 'Converting kg to Gallons of Water',
    paragraphs: [
      'Using the conventional approximate density 1 kg/L, 1 kg of water occupies about 1 L, which is about 0.264172 US liquid gallons. Real water density varies with temperature and dissolved solids, so treat this as an approximation.',
    ],
  },
  {
    id: 'density-role',
    title: 'Density and Its Role in Conversion',
    paragraphs: [
      'Density = Mass / Volume. Choosing a denser substance yields a smaller volume for the same mass. Temperature affects liquid density; bulk solids and powders depend on packing; gas density depends strongly on temperature and pressure. Presets in this tool are labeled approximate where appropriate.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'kg to Gallons Conversion Table',
    paragraphs: [
      'Water at approximate density 1 kg/L, converted to US liquid gallons using the shared engine.',
    ],
    table: tableRows(),
    tableNote: `Exact: 1 US liquid gallon = ${LITERS_PER_US_LIQUID_GALLON} L. Water density ≈ 1 kg/L (approximate).`,
  },
  {
    id: 'us-vs-imperial',
    title: 'US vs Imperial Gallons',
    paragraphs: [
      `Exactly 1 US liquid gallon = ${LITERS_PER_US_LIQUID_GALLON} L. Exactly 1 Imperial gallon = ${LITERS_PER_IMPERIAL_GALLON} L. The same mass therefore produces different gallon counts under each standard.`,
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Converter',
    paragraphs: [
      'Select a substance category and item, choose mass and volume units, then enter weight or volume. Open Show substance density when you need to review or enter density. Expand More conversion options for related units, then copy or reset.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Water storage, fuel estimates, cooking ingredients, dairy products, liquid transport, industrial materials, aquariums, pools, laboratory work, and engineering calculations all need density-aware mass–volume conversion.',
    ],
  },
];

export const KG_TO_GALLONS_FAQS: readonly FAQItem[] = [
  {
    question: 'How many gallons are in 1 kg of water?',
    answer: `Using density ≈ 1 kg/L, 1 kg of water occupies approximately ${formatMeasure(1 / LITERS_PER_US_LIQUID_GALLON)} US liquid gallons.`,
  },
  {
    question: 'How many kilograms are in one US gallon of water?',
    answer: `Using density ≈ 1 kg/L, one US liquid gallon of water has a mass of approximately ${LITERS_PER_US_LIQUID_GALLON} kg.`,
  },
  {
    question: 'How do I convert kilograms to gallons?',
    answer:
      'Divide kilograms by the substance density in kg/L, then divide liters by the selected gallon’s liters-per-unit factor.',
  },
  {
    question: 'How do I convert gallons to kilograms?',
    answer:
      'Convert gallons to liters, then multiply by the substance density in kg/L.',
  },
  {
    question: 'Are kilograms and gallons the same unit?',
    answer: 'No. Kilograms measure mass, while gallons measure volume.',
  },
  {
    question: 'What is the ratio between kilograms and gallons?',
    answer:
      'There is no universal ratio. It depends on substance density and which gallon standard you use.',
  },
  {
    question: 'Can I convert 20 kg of water to gallons?',
    answer: `Yes. At ≈ 1 kg/L, 20 kg ≈ 20 L ≈ ${formatMeasure(20 / LITERS_PER_US_LIQUID_GALLON)} US liquid gallons.`,
  },
  {
    question: 'Can I convert kilograms of oil to gallons?',
    answer: 'Yes, when the oil’s density is known. Enter a measured density if no preset is provided.',
  },
  {
    question: 'How many gallons are in 2 kg of ketchup?',
    answer:
      'The answer depends on the ketchup’s density. Enter a verified or measured density as a custom substance.',
  },
  {
    question: 'How do I convert 1 kg of milk into gallons?',
    answer:
      'Use milk’s density to calculate liters, then convert liters into the selected gallon unit.',
  },
  {
    question: 'Can I use this converter for metals?',
    answer:
      'Yes, when a material density is available. Metal presets in this tool are approximate handbook values.',
  },
  {
    question: 'Can I use this converter for gases?',
    answer:
      'Yes if the gas density matches specified temperature and pressure conditions. Gas densities change strongly with T and P.',
  },
  {
    question: 'Why does temperature matter?',
    answer:
      'Temperature can change density and therefore the calculated volume for a given mass.',
  },
  {
    question: 'Can I enter custom density?',
    answer: 'Yes. Choose Custom substance or edit density in supported units (kg/L, g/mL, kg/m³, and more).',
  },
  {
    question: 'Can I convert gallons back to kilograms?',
    answer: 'Yes. Enter gallons (or another volume unit) and the converter calculates mass from density.',
  },
];
