import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMeasure,
  massToVolume,
  volumeToMass,
} from './calculation';
import {
  CUBIC_METERS_PER_UK_GALLON,
  CUBIC_METERS_PER_US_GALLON,
  KG_PER_METRIC_TONNE,
  KG_PER_UK_LONG_TON,
  KG_PER_US_SHORT_TON,
} from './types';

export const GAL_TO_TONS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'formula', label: 'The Formula to Convert Gallons to Tons' },
  { id: 'convert-by-hand', label: 'How to Convert Gallons to Tons by Hand' },
  { id: 'density-tons-per-gallon', label: 'Expressing Density as Tons per Gallon' },
  { id: 'tons-to-gallons', label: 'How to Convert Tons Back to Gallons' },
  { id: 'related-tools', label: 'Other Useful Calculators' },
  { id: 'gal-to-tons-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
}

const water1UsTon = volumeToMass(1, 'usGal', 1000, 'usTon');
const water1000UsTon = volumeToMass(1000, 'usGal', 1000, 'usTon');
const water10UsTon = volumeToMass(10, 'usGal', 1000, 'usTon');
const water500UsTon = volumeToMass(500, 'usGal', 1000, 'usTon');
const galPerUsTon = massToVolume(1, 'usTon', 1000, 'usGal');
const galPerMetricTon = massToVolume(1, 'metricTon', 1000, 'usGal');
const ukGalPerUkTon = massToVolume(1, 'ukTon', 1000, 'ukGal');
const tonPerUsGalFactor = CUBIC_METERS_PER_US_GALLON / KG_PER_US_SHORT_TON;

export const GAL_TO_TONS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'formula',
    title: 'The Formula to Convert Gallons to Tons',
    paragraphs: [
      'Gallons measure volume; tons measure mass. Converting between them always requires density: Mass = Density × Volume.',
      'Internally this calculator converts volume to cubic meters, multiplies by density in kg/m³ to get kilograms, then divides by the selected ton (or pound/kilogram) factor.',
      `For water at 1000 kg/m³: 1 US gallon ≈ ${formatMeasure(water1UsTon)} US short tons. US short tons (${KG_PER_US_SHORT_TON} kg), UK long tons (${KG_PER_UK_LONG_TON} kg), and metric tonnes (${KG_PER_METRIC_TONNE} kg) are not interchangeable.`,
    ],
    formula: 'm = ρ × V · then convert kilograms to the selected ton unit',
  },
  {
    id: 'convert-by-hand',
    title: 'How to Convert Gallons to Tons by Hand',
    paragraphs: [
      '1. Identify the substance. 2. Determine its density in kg/m³. 3. Identify the gallon system (US or UK). 4. Convert gallons to cubic meters. 5. Multiply volume by density to get kilograms. 6. Divide by the selected ton factor.',
      `Example: 10 US gallons of water at 1000 kg/m³. Volume = 10 × ${CUBIC_METERS_PER_US_GALLON} = ${formatMeasure(10 * CUBIC_METERS_PER_US_GALLON)} m³. Mass = ${formatMeasure(10 * CUBIC_METERS_PER_US_GALLON * 1000)} kg ≈ ${formatMeasure(water10UsTon)} US short tons.`,
      `1000 US gallons of water ≈ ${formatMeasure(water1000UsTon)} US short tons at the same density.`,
    ],
    formula: `US tons = (US gal × ${CUBIC_METERS_PER_US_GALLON} × ρ) / ${KG_PER_US_SHORT_TON}`,
  },
  {
    id: 'density-tons-per-gallon',
    title: 'Expressing Density as Tons per Gallon',
    paragraphs: [
      'Density can also be written as mass per gallon. For US short tons per US gallon:',
      `ρ_US ton/US gal = ρ_kg/m³ × (${CUBIC_METERS_PER_US_GALLON} / ${KG_PER_US_SHORT_TON}) = ρ_kg/m³ × ${formatMeasure(tonPerUsGalFactor)}.`,
      'Then Mass_US tons = Volume_US gal × ρ_US ton/US gal. This factor changes whenever density changes.',
    ],
    formula: `ρ_US ton/US gal = ρ_kg/m³ × ${formatMeasure(tonPerUsGalFactor)}`,
  },
  {
    id: 'tons-to-gallons',
    title: 'How to Convert Tons Back to Gallons',
    paragraphs: [
      'Volume = Mass / Density. Convert the selected ton unit to kilograms, divide by density in kg/m³, then convert cubic meters to the selected volume unit.',
      `Example: 1 US short ton of water at 1000 kg/m³ ≈ ${formatMeasure(galPerUsTon)} US gallons.`,
    ],
    formula: 'V = m / ρ',
  },
  {
    id: 'related-tools',
    title: 'Other Useful Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Cubic Meter to Ton Converter, Gallons to Grams Conversion, Fluid Ounces to Pounds Conversion, Gallons to Cubic Feet Converter, and other density-based volume-to-mass tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const GAL_TO_TONS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Gallons Are in a Ton?',
    answer: `There is no universal answer because the conversion depends on density and the type of ton. For water at 1000 kg/m³, approximately ${formatMeasure(galPerUsTon)} US gallons have a mass of one US short ton. Other substances require different volumes.`,
  },
  {
    question: 'How Many Gallons Are in a Ton of Water?',
    answer: `For fresh water at approximately 4 °C: 1 US short ton ≈ ${formatMeasure(galPerUsTon)} US gallons; 1 metric tonne ≈ ${formatMeasure(galPerMetricTon)} US gallons; 1 UK long ton ≈ ${formatMeasure(ukGalPerUkTon)} UK gallons. Results differ because ton definitions and gallon sizes differ.`,
  },
  {
    question: 'Can I Convert Gallons to Tons Without Knowing Density?',
    answer:
      'No, not accurately. Gallons are units of volume, while tons are units of mass. Density is needed to determine the mass of a given volume.',
  },
  {
    question: 'Are US Tons and Metric Tons the Same?',
    answer: `No. 1 US short ton = ${KG_PER_US_SHORT_TON} kg. 1 metric tonne = ${KG_PER_METRIC_TONNE} kg. 1 UK long ton = ${KG_PER_UK_LONG_TON} kg.`,
  },
  {
    question: 'How Do I Convert 500 Gallons of Water to Tons?',
    answer: `For 500 US gallons of water at density 1000 kg/m³: mass = 500 × ${CUBIC_METERS_PER_US_GALLON} × 1000 = ${formatMeasure(500 * CUBIC_METERS_PER_US_GALLON * 1000)} kg ≈ ${formatMeasure(water500UsTon)} US short tons.`,
  },
  {
    question: 'Does Temperature Affect Gallons-to-Tons Conversion?',
    answer:
      'Yes. Temperature can change a substance’s density, which changes its mass for a fixed volume. Use the density appropriate to the substance and conditions.',
  },
];
