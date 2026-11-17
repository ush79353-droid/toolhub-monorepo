import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, gallonsToGrams, gramsToGallons } from './calculation';
import { LITERS_PER_US_GALLON } from './types';

export const GAL_TO_GRAMS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'converting-by-hand', label: 'Converting from Gallons to Grams by Hand' },
  { id: 'gallons-to-grams', label: 'Gallons to Grams Conversion' },
  { id: 'grams-to-gallons', label: 'Grams to Gallons Conversion' },
  { id: 'density-grams-per-gallon', label: 'Expressing Density as Grams per Gallon' },
  { id: 'related-tools', label: 'Other Similar Tools' },
  { id: 'gal-to-grams-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

const water1 = gallonsToGrams(1, 1000);
const water3 = gallonsToGrams(3, 1000);
const water5 = gallonsToGrams(5, 1000);
const milk1 = gallonsToGrams(1, 1030);
const reverse5000 = gramsToGallons(5000, 1000);

export const GAL_TO_GRAMS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'converting-by-hand',
    title: 'Converting from Gallons to Grams by Hand',
    paragraphs: [
      'Gallons measure volume. Grams measure mass. You cannot convert one into the other without density — mass per unit volume of the substance you are measuring.',
      'The basic relationship is Mass = Density × Volume. Units must be compatible before you multiply.',
      `Exact US liquid gallon definition: 1 US gallon = ${LITERS_PER_US_GALLON} liters = 0.003785411784 m³.`,
      'Steps: (1) identify the substance, (2) determine its density, (3) convert gallons into a compatible volume unit, (4) multiply volume by density, (5) express the result in grams.',
      'Common uses include cooking liquids, milk and oils, beverage batching, and laboratory liquid measurements where a known density is available.',
    ],
    formula: 'Mass = Density × Volume',
  },
  {
    id: 'gallons-to-grams',
    title: 'Gallons to Grams Conversion',
    paragraphs: [
      `When density is in g/mL: m_g = V_gal × ${LITERS_PER_US_GALLON × 1000} × ρ_g/mL (since 1 L = 1000 mL). Equivalently with density in kg/m³: m_g = V_gal × ${LITERS_PER_US_GALLON} × ρ_kg/m³.`,
      `Example: mass of 3 US gallons of water at 1 g/mL (1000 kg/m³). 3 × ${LITERS_PER_US_GALLON × 1000} = ${formatMeasure(water3)}. Approximately ${formatMeasure(Number(water3.toFixed(2)))} grams.`,
      'Equal volumes of different liquids do not share the same mass. One gallon of honey weighs more than one gallon of gasoline because honey is denser.',
    ],
    formula: `m_g = V_gal × ${LITERS_PER_US_GALLON} × ρ_kg/m³`,
  },
  {
    id: 'grams-to-gallons',
    title: 'Grams to Gallons Conversion',
    paragraphs: [
      `Reverse formula with density in g/mL: V_gal = m_g / (${LITERS_PER_US_GALLON × 1000} × ρ_g/mL). With density in kg/m³: V_gal = m_g / (${LITERS_PER_US_GALLON} × ρ_kg/m³).`,
      `Example: convert 5000 g of water at 1000 kg/m³ into US gallons. V_gal = 5000 / ${LITERS_PER_US_GALLON × 1000} ≈ ${formatMeasure(reverse5000)}. Approximately ${formatMeasure(Number(reverse5000.toFixed(3)))} US gallons.`,
    ],
    formula: `V_gal = m_g / (${LITERS_PER_US_GALLON} × ρ_kg/m³)`,
  },
  {
    id: 'density-grams-per-gallon',
    title: 'Expressing Density as Grams per Gallon',
    paragraphs: [
      'Density can be written as kg/m³, kg/L, g/mL, g/L, or grams per US gallon. The calculator keeps a canonical kg/m³ value internally and converts display units without changing the physical density.',
      `ρ_g/gal = ρ_kg/m³ × ${LITERS_PER_US_GALLON}. For water at the reference 1000 kg/m³, ρ_g/gal = ${formatMeasure(water1)}.`,
      'Changing the substance or density changes grams per gallon. Milk near 1030 kg/m³ is denser than the water reference, so one gallon of milk has a larger mass than one gallon of water at 1000 kg/m³.',
    ],
    formula: `ρ_g/gal = ρ_kg/m³ × ${LITERS_PER_US_GALLON}`,
  },
  {
    id: 'related-tools',
    title: 'Other Similar Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Fluid Ounces to Pounds Conversion, Gallons to Cubic Feet Converter, Gallons to Cups Converter, Volume Conversion, and other liquid density tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const GAL_TO_GRAMS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Grams Are in a Gallon of Water?',
    answer: `Using a reference density of 1000 kg/m³, one US liquid gallon of water has a mass of approximately ${formatMeasure(Number(water1.toFixed(2)))} grams (${formatMeasure(water1)} g exactly at that density). Actual mass varies slightly with temperature.`,
  },
  {
    question: 'How Many Grams Are in a Gallon of Milk?',
    answer: `Using an approximate milk density of 1030 kg/m³: 1 × ${LITERS_PER_US_GALLON} × 1030 ≈ ${formatMeasure(Number(milk1.toFixed(2)))} grams. The exact value depends on the milk’s composition and temperature.`,
  },
  {
    question: 'Can I Convert Gallons to Grams Without Density?',
    answer:
      'No. Gallons measure volume, whereas grams measure mass. The density of the material is required to convert between them.',
  },
  {
    question: 'How Do I Convert 5 Gallons of Water to Grams?',
    answer: `Using a reference density of 1000 kg/m³: 5 × ${LITERS_PER_US_GALLON × 1000} = ${formatMeasure(water5)}. Approximately ${formatMeasure(Number(water5.toFixed(2)))} grams.`,
  },
  {
    question: 'Is One Gallon Always 3,785 Grams?',
    answer:
      'No. That value is approximately correct for one US gallon of water at a density of 1 g/mL. Other substances have different densities and therefore different masses for the same volume.',
  },
];
