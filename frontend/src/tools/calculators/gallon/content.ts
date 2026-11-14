import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, fromLiters, toLiters } from './calculation';
import {
  KILOGRAMS_PER_POUND,
  LITERS_PER_IMPERIAL_GALLON,
  LITERS_PER_US_DRY_GALLON,
  LITERS_PER_US_LIQUID_GALLON,
} from './types';

export const GALLON_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-a-gallon', label: 'What Is a Gallon?' },
  { id: 'us-vs-imperial', label: 'US vs Imperial Gallon' },
  { id: 'gallons-to-liters', label: 'Gallons to Liters' },
  { id: 'liters-to-gallons', label: 'Liters to Gallons' },
  { id: 'liters-table', label: 'Liters Conversion Table' },
  { id: 'cubic-feet', label: 'Cubic Feet to Gallons' },
  { id: 'cubic-inches', label: 'Cubic Inches to Gallons' },
  { id: 'cubic-yards', label: 'Cubic Yards to Gallons' },
  { id: 'quarts', label: 'Quarts to Gallons' },
  { id: 'fluid-ounces', label: 'Fluid Ounces to Gallons' },
  { id: 'cups', label: 'Gallons to Cups' },
  { id: 'water-weight', label: 'Water Weight' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'pool-volume', label: 'Pool Volume Notes' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'gallon-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  liters: string;
  usGallons: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
  tableNote?: string;
}

const TABLE_L = [1, 2, 5, 10, 20, 50, 100] as const;

function litersTable(): readonly ConversionTableRow[] {
  return TABLE_L.map((L) => ({
    liters: formatMeasure(L),
    usGallons: formatMeasure(fromLiters(L, 'usLiquidGal')),
  }));
}

export const GALLON_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Gallon Calculator converts between gallons and common metric, US customary, and Imperial volume units. A separate mode estimates water mass from volume using density.',
      'Always choose the correct gallon standard—US liquid, Imperial, and US dry gallons are different volumes.',
    ],
  },
  {
    id: 'what-is-a-gallon',
    title: 'What Is a Gallon?',
    paragraphs: [
      'A gallon is a unit of volume used for liquids, fuel, beverages, and water storage. Multiple legal definitions exist, so conversions must name the standard in use.',
    ],
  },
  {
    id: 'us-vs-imperial',
    title: 'US Gallon vs Imperial Gallon',
    paragraphs: [
      `Exactly 1 US liquid gallon = ${LITERS_PER_US_LIQUID_GALLON} L. Exactly 1 Imperial gallon = ${LITERS_PER_IMPERIAL_GALLON} L. The Imperial gallon is larger.`,
      `A US dry gallon is about ${formatMeasure(LITERS_PER_US_DRY_GALLON)} L (from 268.8025 in³) and is not a US liquid gallon.`,
    ],
  },
  {
    id: 'gallons-to-liters',
    title: 'Gallons to Liters',
    paragraphs: [
      `Multiply US liquid gallons by ${LITERS_PER_US_LIQUID_GALLON}. Example: 2 US gal = ${formatMeasure(2 * LITERS_PER_US_LIQUID_GALLON)} L.`,
    ],
    formula: `Liters = US gallons × ${LITERS_PER_US_LIQUID_GALLON}`,
  },
  {
    id: 'liters-to-gallons',
    title: 'Liters to Gallons',
    paragraphs: [
      `Divide liters by ${LITERS_PER_US_LIQUID_GALLON} for US liquid gallons. Example: 10 L ≈ ${formatMeasure(fromLiters(10, 'usLiquidGal'))} US gal.`,
    ],
    formula: `US gallons = Liters / ${LITERS_PER_US_LIQUID_GALLON}`,
  },
  {
    id: 'liters-table',
    title: 'Convert Liters to Gallons – Metric Units',
    paragraphs: ['US liquid gallons generated from the shared conversion engine.'],
    table: litersTable(),
    tableNote: 'US liquid gallons only. Switch the calculator to Imperial for Imperial gallons.',
  },
  {
    id: 'cubic-feet',
    title: 'Convert Cubic Feet to Gallons',
    paragraphs: [
      `1 ft³ = 28.316846592 L. US gallons = ft³ × 28.316846592 / ${LITERS_PER_US_LIQUID_GALLON} ≈ ${formatMeasure(fromLiters(toLiters(1, 'ft3'), 'usLiquidGal'))} US gal per ft³.`,
    ],
  },
  {
    id: 'cubic-inches',
    title: 'Convert Cubic Inches to Gallons',
    paragraphs: [
      'Exactly 1 US liquid gallon = 231 in³. US gallons = cubic inches ÷ 231.',
    ],
    formula: 'US gallons = in³ / 231',
  },
  {
    id: 'cubic-yards',
    title: 'Convert Cubic Yards to Gallons',
    paragraphs: [
      `1 yd³ = 764.554857984 L. Divide by the selected gallon’s liters-per-unit factor.`,
    ],
  },
  {
    id: 'quarts',
    title: 'Convert Quarts to Gallons',
    paragraphs: [
      'For US liquid units: 1 US gal = 4 US qt, so US gallons = US quarts ÷ 4.',
    ],
  },
  {
    id: 'fluid-ounces',
    title: 'Convert Fluid Ounces to Gallons',
    paragraphs: [
      'For US liquid units: 1 US gal = 128 US fl oz. US gallons = US fluid ounces ÷ 128. Fluid ounces are volume, not mass ounces.',
    ],
  },
  {
    id: 'cups',
    title: 'Convert Gallons to Cups',
    paragraphs: [
      'For US customary cups: 1 US gal = 16 cups. Metric and Imperial cups use different milliliter definitions—select the matching cup standard in the calculator.',
    ],
  },
  {
    id: 'water-weight',
    title: 'Water – Gallons to Kilograms and Pounds',
    paragraphs: [
      'Mass = volume × density. Using an approximate density of 1 kg/L, 1 US liquid gallon ≈ 3.7854 kg ≈ 8.3454 lb. Real water density varies with temperature.',
    ],
    formula: 'Mass (kg) = Volume (L) × Density (kg/L)',
    formulaNote: `Pounds use the exact factor 1 lb = ${KILOGRAMS_PER_POUND} kg.`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Gallon Calculator',
    paragraphs: [
      'Choose Volume converter or Water gallons to weight. Enter any volume field (or water mass), pick units, and read the synchronized results. Copy or reset when finished.',
    ],
  },
  {
    id: 'pool-volume',
    title: 'Rectangular Pool Volume Notes',
    paragraphs: [
      'For a rectangular pool: Volume (ft³) = length × width × average depth (ft). Convert cubic feet to US gallons with the calculator. Irregular shapes need a geometry-specific model—this tool does not invent one.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Cooking, fuel volume, water storage, aquariums, construction, shipping liquids, laboratory conversion, and measurement education.',
    ],
  },
];

export const GALLON_FAQS: readonly FAQItem[] = [
  {
    question: 'How many liters are in one US gallon?',
    answer: `Exactly ${LITERS_PER_US_LIQUID_GALLON} liters.`,
  },
  {
    question: 'How many liters are in one Imperial gallon?',
    answer: `Exactly ${LITERS_PER_IMPERIAL_GALLON} liters.`,
  },
  {
    question: 'Are US and Imperial gallons the same?',
    answer: 'No. Imperial gallons are larger than US liquid gallons.',
  },
  {
    question: 'How do I convert gallons to liters?',
    answer: `Multiply US liquid gallons by ${LITERS_PER_US_LIQUID_GALLON}.`,
  },
  {
    question: 'How do I convert liters to gallons?',
    answer: `Divide liters by ${LITERS_PER_US_LIQUID_GALLON} for US liquid gallons.`,
  },
  {
    question: 'How many quarts are in a gallon?',
    answer: 'One US liquid gallon contains four US liquid quarts.',
  },
  {
    question: 'How many pints are in one gallon?',
    answer: 'One US liquid gallon contains eight US liquid pints.',
  },
  {
    question: 'How many cups are in a gallon?',
    answer: 'One US liquid gallon contains sixteen US customary cups.',
  },
  {
    question: 'How many fluid ounces are in a gallon?',
    answer: 'One US liquid gallon contains 128 US fluid ounces.',
  },
  {
    question: 'How many cubic inches are in a gallon?',
    answer: 'One US liquid gallon contains exactly 231 cubic inches.',
  },
  {
    question: 'How many gallons are in one cubic foot?',
    answer: `About ${formatMeasure(fromLiters(toLiters(1, 'ft3'), 'usLiquidGal'))} US liquid gallons.`,
  },
  {
    question: 'How do I calculate gallons in a rectangular pool?',
    answer:
      'Multiply length, width, and average depth in feet for cubic feet, then convert cubic feet into US gallons.',
  },
  {
    question: 'How much does one gallon of water weigh?',
    answer:
      'It depends on the gallon standard and density. At ≈1 kg/L, one US liquid gallon weighs about 3.7854 kg or 8.3454 lb.',
  },
  {
    question: 'How many kilograms are in one gallon?',
    answer:
      'Gallons measure volume and kilograms measure mass. The answer depends on density.',
  },
  {
    question: 'Can I convert Imperial gallons into US gallons?',
    answer: 'Yes. The calculator converts through canonical liters.',
  },
  {
    question: 'Can I convert dry gallons?',
    answer: 'Yes. Select US dry gal in the gallons dropdown.',
  },
  {
    question: 'Can I enter decimal gallon measurements?',
    answer: 'Yes. Decimal measurements are supported.',
  },
];
