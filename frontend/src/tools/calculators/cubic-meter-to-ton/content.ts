import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  cubicMetersToTons,
  formatMeasure,
  tonsToCubicMeters,
} from './calculation';
import { MATERIALS } from './materials';
import {
  KG_PER_METRIC_TONNE,
  KG_PER_UK_LONG_TON,
  KG_PER_US_SHORT_TON,
  WATER_DENSITY_KG_PER_M3,
} from './types';

export const CU_M_TO_TON_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'converting-by-hand', label: 'Converting Cubic Meters to Tons by Hand' },
  { id: 'metric-us-uk-tons', label: 'Metric Tons vs US and UK Tons' },
  { id: 'common-material-densities', label: 'Common Material Densities' },
  { id: 'other-similar-tools', label: 'Other Similar Tools' },
  { id: 'cubic-meter-to-ton-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const densityTableRows = MATERIALS.filter(
  (m) =>
    m.densityKgPerM3 != null &&
    m.id !== 'fresh-water-other' &&
    m.id !== 'steel-other' &&
    m.id !== 'custom',
).map((m) => [
  m.name,
  formatMeasure(m.densityKgPerM3!),
  formatMeasure(cubicMetersToTons(1, m.densityKgPerM3!)),
]);

export const CU_M_TO_TON_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'converting-by-hand',
    title: 'Converting Cubic Meters to Tons by Hand',
    paragraphs: [
      'Cubic meters measure volume. Tons measure mass. Density connects the two: Mass = Volume × Density.',
      `For metric tonnes: Tonnes = (m³ × kg/m³) / ${KG_PER_METRIC_TONNE}.`,
      `Example: 5 m³ of dry sand at an assumed bulk density of 1600 kg/m³ → 5 × 1600 = 8000 kg → 8000 ÷ 1000 = ${formatMeasure(cubicMetersToTons(5, 1600))} t.`,
      'Actual bulk density may vary with moisture, compaction, and grading. Always confirm the density that matches your material and conditions.',
      'Common applications include construction estimates, concrete pours, sand and gravel orders, soil transport, tank contents, industrial materials, and shipping logistics.',
    ],
    formula: `metric t = (V × ρ) / ${KG_PER_METRIC_TONNE}  ·  V = (metric t × ${KG_PER_METRIC_TONNE}) / ρ`,
  },
  {
    id: 'metric-us-uk-tons',
    title: 'What Is the Difference Between Metric, US, and UK Tons?',
    paragraphs: [
      `A metric tonne equals exactly ${KG_PER_METRIC_TONNE} kilograms.`,
      `A US short ton equals exactly 2000 avoirdupois pounds (${KG_PER_US_SHORT_TON} kg).`,
      `A UK long ton equals exactly 2240 avoirdupois pounds (${KG_PER_UK_LONG_TON} kg).`,
      `For 1 m³ of fresh water at 1000 kg/m³: ${formatMeasure(cubicMetersToTons(1, 1000, 'metricTonne'))} metric t ≈ ${formatMeasure(cubicMetersToTons(1, 1000, 'usShortTon'))} US short tons ≈ ${formatMeasure(cubicMetersToTons(1, 1000, 'ukLongTon'))} UK long tons.`,
      'Select the ton definition that matches your region or contract. Never treat the three as interchangeable.',
    ],
    formula: `1 metric t = ${KG_PER_METRIC_TONNE} kg  ·  1 US short ton = ${KG_PER_US_SHORT_TON} kg  ·  1 UK long ton = ${KG_PER_UK_LONG_TON} kg`,
  },
  {
    id: 'common-material-densities',
    title: 'Common Material Densities',
    paragraphs: [
      'The table below lists the approximate reference densities used by this calculator for one cubic meter converted to metric tonnes. Values can change with temperature, moisture, compaction, composition, air gaps, and porosity.',
      'Use Custom density when you have a measured or specification value for your material.',
    ],
    tableHeaders: ['Material', 'Density (kg/m³)', '1 m³ → metric t'],
    table: densityTableRows,
  },
  {
    id: 'other-similar-tools',
    title: 'Other Similar Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Cubic Feet to Pounds Calculator, Liters to Pounds Calculator, Density Calculator, Cubic Yards to Tons Calculator, Weight Converter, and other volume-to-mass tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CU_M_TO_TON_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Cubic Meters Are in One Ton?',
    answer: `There is no universal answer; it depends on density and which ton definition you use. For fresh water near 4 °C at ${WATER_DENSITY_KG_PER_M3} kg/m³, one metric tonne occupies about 1 m³.`,
  },
  {
    question: 'How Much Does One Cubic Meter of Water Weigh?',
    answer: `Near 4 °C, one cubic meter of fresh water has a mass of about ${WATER_DENSITY_KG_PER_M3} kg, equivalent to ${formatMeasure(cubicMetersToTons(1, WATER_DENSITY_KG_PER_M3))} metric tonne.`,
  },
  {
    question: 'How Many Tons Is One Cubic Meter of Concrete?',
    answer: `Using an assumed normal-weight concrete density of 2400 kg/m³: 1 × 2400 ÷ 1000 = ${formatMeasure(cubicMetersToTons(1, 2400))} metric tonnes.`,
  },
  {
    question: 'How Many Cubic Meters Is 10 Tons of Sand?',
    answer: `Using a bulk density of 1600 kg/m³ and metric tonnes: V = (10 × 1000) / 1600 = ${formatMeasure(tonsToCubicMeters(10, 1600))} m³.`,
  },
  {
    question: 'Can Cubic Meters Be Converted Directly to Tons?',
    answer:
      'Only when the material density is known or reasonably estimated. Cubic meters represent volume; tons represent mass. Density connects the two measurements.',
  },
];
