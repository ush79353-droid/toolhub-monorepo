import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatVolume, fromLiters, toLiters } from './calculation';
import {
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
} from './types';

export const VOLUME_CONVERSION_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-volume', label: 'What Is Volume?' },
  { id: 'volume-units', label: 'Volume Units' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'conversion-chart', label: 'Volume Conversion Chart' },
  { id: 'liters-to-gallons', label: 'Liters to Gallons' },
  { id: 'gallons-to-liters', label: 'Gallons to Liters' },
  { id: 'cubic-feet', label: 'Cubic Feet to Liters' },
  { id: 'cups-to-ml', label: 'Cups to Milliliters' },
  { id: 'how-to-find', label: 'How to Find Volume in Another Unit' },
  { id: 'metric-us-imperial', label: 'Metric vs US vs Imperial' },
  { id: 'volume-vs-mass', label: 'Volume vs Mass' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'volume-conversion-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionChartRow {
  unit: string;
  milliliters: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionChartRow[];
  tableNote?: string;
}

function chart(): readonly ConversionChartRow[] {
  const rows: { label: string; unit: Parameters<typeof toLiters>[1] }[] = [
    { label: '1 mL', unit: 'mL' },
    { label: '1 cL', unit: 'cL' },
    { label: '1 dL', unit: 'dL' },
    { label: '1 L', unit: 'L' },
    { label: '1 US customary cup', unit: 'usCup' },
    { label: '1 US liquid pint', unit: 'usPt' },
    { label: '1 US liquid quart', unit: 'usQt' },
    { label: '1 US liquid gallon', unit: 'usLiquidGal' },
    { label: '1 Imperial gallon', unit: 'imperialGal' },
  ];
  return rows.map((row) => ({
    unit: row.label,
    milliliters: formatVolume(toLiters(1, row.unit) * 1000),
  }));
}

export const VOLUME_CONVERSION_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Volume Conversion Calculator converts between metric, US customary, Imperial, cooking, US dry, and cubic volume measurements. Enter a value in any primary field to update all equivalents from one canonical volume in liters.',
    ],
  },
  {
    id: 'what-is-volume',
    title: 'What Is Volume?',
    paragraphs: [
      'Volume describes the amount of three-dimensional space occupied by a substance or object. Liquid volume is often expressed in liters, milliliters, gallons, or cups. Geometric volume often uses cubic meters, cubic feet, or cubic inches. Volume differs from mass, weight, and area.',
    ],
  },
  {
    id: 'volume-units',
    title: 'Volume Units',
    paragraphs: [
      'Common units include microliters through kiloliters, cubic millimeters through cubic yards, US liquid and dry gallons/quarts/pints, Imperial gallons and related units, cups (US customary, US legal, metric, Imperial), fluid ounces, tablespoons, and teaspoons.',
      'US liquid and Imperial gallons are different sizes. Do not mix systems without converting through liters.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Volume Converter',
    paragraphs: [
      'Choose a field’s unit, enter a numeric value, and read the synchronized equivalents. Change dropdowns to switch standards without changing the physical volume. Expand More Conversion Options for additional units, then copy or reset.',
    ],
  },
  {
    id: 'conversion-chart',
    title: 'Volume Conversion Chart',
    paragraphs: [
      'Equivalents in milliliters generated from the shared conversion registry.',
    ],
    table: chart(),
    tableNote: 'Values use exact unit definitions. Cooking cups differ by standard.',
  },
  {
    id: 'liters-to-gallons',
    title: 'Convert Liters to Gallons',
    paragraphs: [
      `US gallons = liters ÷ ${LITERS_PER_US_LIQUID_GALLON}. Example: 10 L ≈ ${formatVolume(fromLiters(10, 'usLiquidGal'))} US gal.`,
    ],
    formula: `US gallons = Liters / ${LITERS_PER_US_LIQUID_GALLON}`,
  },
  {
    id: 'gallons-to-liters',
    title: 'Convert Gallons to Liters',
    paragraphs: [
      `Liters = US gallons × ${LITERS_PER_US_LIQUID_GALLON}. Example: 5 US gal = ${formatVolume(5 * LITERS_PER_US_LIQUID_GALLON)} L.`,
    ],
    formula: `Liters = US gallons × ${LITERS_PER_US_LIQUID_GALLON}`,
  },
  {
    id: 'cubic-feet',
    title: 'Convert Cubic Feet to Liters',
    paragraphs: [
      `Liters = cubic feet × 28.316846592. Example: 2 ft³ = ${formatVolume(toLiters(2, 'ft3'))} L.`,
    ],
    formula: 'Liters = Cubic feet × 28.316846592',
  },
  {
    id: 'cups-to-ml',
    title: 'Convert Cups to Milliliters',
    paragraphs: [
      'For US customary cups: mL = cups × 236.5882365. Metric cups use 250 mL; US legal cups use 240 mL; Imperial cups use 284.130625 mL.',
    ],
  },
  {
    id: 'how-to-find',
    title: 'How to Find Volume in a Different Unit',
    paragraphs: [
      'Identify the source unit, convert into liters, then convert liters into the target unit. Target = source × source factor ÷ target factor.',
    ],
    formula: 'Target = Source × LitersPerSource / LitersPerTarget',
  },
  {
    id: 'metric-us-imperial',
    title: 'Metric vs US vs Imperial Volume Measurements',
    paragraphs: [
      `Metric liters relate exactly to milliliters and cubic meters. US liquid gallon = ${LITERS_PER_US_LIQUID_GALLON} L. Imperial gallon = ${LITERS_PER_IMPERIAL_GALLON} L. Cooking cups and spoons also differ by region.`,
    ],
  },
  {
    id: 'volume-vs-mass',
    title: 'Difference Between Volume and Mass',
    paragraphs: [
      'Volume measures space; mass measures quantity of matter. Density is required for volume-to-mass conversion and belongs in a dedicated density-based calculator—not this general volume converter.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Cooking, baking, recipe scaling, liquid storage, water and fuel measurement, aquariums, pools, construction, laboratory work, and international unit conversion.',
    ],
  },
];

export const VOLUME_CONVERSION_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert liters to gallons?',
    answer: `Divide liters by ${LITERS_PER_US_LIQUID_GALLON} to obtain US liquid gallons.`,
  },
  {
    question: 'How do I convert gallons to liters?',
    answer: `Multiply US liquid gallons by ${LITERS_PER_US_LIQUID_GALLON}.`,
  },
  {
    question: 'How many milliliters are in one liter?',
    answer: 'Exactly 1000 mL.',
  },
  {
    question: 'How many liters are in one cubic meter?',
    answer: 'Exactly 1000 liters.',
  },
  {
    question: 'How many liters are in one US gallon?',
    answer: `Exactly ${LITERS_PER_US_LIQUID_GALLON} liters.`,
  },
  {
    question: 'How many liters are in one Imperial gallon?',
    answer: `Exactly ${LITERS_PER_IMPERIAL_GALLON} liters.`,
  },
  {
    question: 'How many cups are in one US gallon?',
    answer: 'Exactly 16 US customary cups.',
  },
  {
    question: 'How many pints are in one US gallon?',
    answer: 'Exactly 8 US liquid pints.',
  },
  {
    question: 'How many quarts are in one US gallon?',
    answer: 'Exactly 4 US liquid quarts.',
  },
  {
    question: 'How many fluid ounces are in one US cup?',
    answer: 'Exactly 8 US fluid ounces.',
  },
  {
    question: 'How many teaspoons are in one US tablespoon?',
    answer: 'Exactly 3 US customary teaspoons.',
  },
  {
    question: 'How many milliliters are in one US fluid ounce?',
    answer: 'Exactly 29.5735295625 mL.',
  },
  {
    question: 'How do I convert cubic feet into gallons?',
    answer:
      'Convert cubic feet into liters, then divide by the selected gallon’s liters-per-unit factor.',
  },
  {
    question: 'How much is 5 liters in cubic feet?',
    answer: `About ${formatVolume(fromLiters(5, 'ft3'))} ft³.`,
  },
  {
    question: 'Why are cubic meters used to measure volume?',
    answer:
      'Cubic meters are the SI-derived unit for three-dimensional volume and suit larger spaces and quantities.',
  },
  {
    question: 'Are US and Imperial gallons the same?',
    answer: 'No. One Imperial gallon contains more liters than one US liquid gallon.',
  },
  {
    question: 'Is a US customary cup equal to a metric cup?',
    answer: 'No. US customary cup = 236.5882365 mL. Metric cup = 250 mL.',
  },
  {
    question: 'Can I convert volume to weight?',
    answer:
      'Yes, but volume-to-mass conversion requires density and should use a dedicated density-based calculator.',
  },
  {
    question: 'Can I enter a value in any conversion field?',
    answer:
      'Yes. Every main field is independently editable and updates the other fields automatically.',
  },
];
