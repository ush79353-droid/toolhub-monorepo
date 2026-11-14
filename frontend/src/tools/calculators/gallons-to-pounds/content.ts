import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { calculateGallonsToPounds, formatMeasure } from './calculation';
import {
  DEFAULT_GALLONS_TO_POUNDS_INPUT,
  GRAMS_PER_POUND,
  ML_PER_IMPERIAL_GALLON,
  ML_PER_US_DRY_GALLON,
  ML_PER_US_LIQUID_GALLON,
} from './types';

export const GALLONS_TO_POUNDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'gallons-vs-pounds', label: 'Gallons vs Pounds' },
  { id: 'how-to-convert-gal-lb', label: 'How to Convert Gallons to Pounds' },
  { id: 'one-gallon', label: 'One Gallon to Pounds' },
  { id: 'how-to-convert-lb-gal', label: 'How to Convert Pounds to Gallons' },
  { id: 'which-is-heavier', label: 'Which Liquid Is Heavier?' },
  { id: 'water-oil-milk', label: 'Water, Oil, and Milk' },
  { id: 'pool-weight', label: 'Pool Water Weight' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'conversion-table', label: 'Conversion Table' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'gallons-to-pounds-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  gallons: string;
  pounds: string;
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

const TABLE_GALLONS = [0.5, 1, 2, 3, 4, 5, 10, 20, 50] as const;

function tableRows(): readonly ConversionTableRow[] {
  return TABLE_GALLONS.map((gal) => {
    const r = calculateGallonsToPounds({
      ...DEFAULT_GALLONS_TO_POUNDS_INPUT,
      volume: gal,
    });
    return {
      gallons: formatMeasure(gal),
      pounds: formatMeasure(r.mass),
    };
  });
}

const oneGalLb = ML_PER_US_LIQUID_GALLON / GRAMS_PER_POUND;
const fiveGalLb = (5 * ML_PER_US_LIQUID_GALLON) / GRAMS_PER_POUND;
const tenGalLb = (10 * ML_PER_US_LIQUID_GALLON) / GRAMS_PER_POUND;

export const GALLONS_TO_POUNDS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Gallons to Pounds Converter converts between gallons of volume and pounds of mass using liquid density. Because gallons and pounds measure different physical quantities, there is no universal conversion factor.',
      'Select a liquid, choose a gallon standard, and enter volume or mass. Enable Show Liquid Density when you need to review or edit the density assumption.',
    ],
  },
  {
    id: 'gallons-vs-pounds',
    title: 'What Is the Difference Between Measuring in Gallons and Pounds?',
    paragraphs: [
      'Gallons measure volume. Pounds measure mass. Density connects the two. US liquid and Imperial gallons also differ in size, which changes the resulting mass for the same numeric gallon count.',
      `Exactly 1 US liquid gallon = ${ML_PER_US_LIQUID_GALLON / 1000} L. Exactly 1 Imperial gallon = ${ML_PER_IMPERIAL_GALLON / 1000} L. A US dry gallon is about ${formatMeasure(ML_PER_US_DRY_GALLON / 1000)} L.`,
    ],
  },
  {
    id: 'how-to-convert-gal-lb',
    title: 'How Do I Convert Gallons to Pounds?',
    paragraphs: [
      `Convert gallons to liters, multiply by density in kg/L, then divide kilograms by ${GRAMS_PER_POUND / 1000}. Example with water at ≈1 kg/L: 1 US liquid gallon ≈ ${formatMeasure(oneGalLb)} lb.`,
    ],
    formula:
      'Pounds = Gallons × LitersPerGallon × Density (kg/L) ÷ 0.45359237',
  },
  {
    id: 'one-gallon',
    title: 'What Is the Conversion for One Gallon to Pounds?',
    paragraphs: [
      `The answer depends on density. For US liquid gallons and an assumed water density of 1 kg/L: 1 gallon = ${ML_PER_US_LIQUID_GALLON / 1000} L → ≈ ${formatMeasure(oneGalLb)} lb. That density is an approximation.`,
    ],
  },
  {
    id: 'how-to-convert-lb-gal',
    title: 'How to Convert Pounds to Gallons',
    paragraphs: [
      `Convert pounds to kilograms, divide by density, then convert liters into the selected gallon unit. Example: 10 lb of water at ≈1 kg/L ≈ ${formatMeasure((10 * GRAMS_PER_POUND) / ML_PER_US_LIQUID_GALLON)} US liquid gallons.`,
    ],
    formula:
      'Gallons = Pounds × 0.45359237 ÷ Density (kg/L) ÷ LitersPerGallon',
  },
  {
    id: 'which-is-heavier',
    title: 'Which Is Heavier, a Gallon of Different Liquids?',
    paragraphs: [
      'For the same gallon definition, denser liquids weigh more. Water, cooking oil, milk, and honey can differ substantially. Enter a measured density for each liquid rather than assuming one value fits all.',
    ],
  },
  {
    id: 'water-oil-milk',
    title: 'Water vs Oil vs Milk Density',
    paragraphs: [
      'Temperature, composition, and concentration affect density. Only water ships with a conventional approximate density preset here; oil, milk, fuels, and other liquids require your measured or labeled density.',
    ],
  },
  {
    id: 'pool-weight',
    title: 'How Much Does the Water in My Pool Weigh?',
    paragraphs: [
      'For a rectangular pool: Volume (ft³) = length × width × average depth. Convert cubic feet into US gallons with the calculator, then apply water density. Irregular pools need a geometry-specific model.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Gallons to Pounds Converter',
    paragraphs: [
      'Select the liquid, choose the gallon standard, enter gallons (or pounds), optionally show and edit density, then copy or reset the result.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Gallons to Pounds Conversion Table',
    paragraphs: [
      'Values below assume US liquid gallons and an approximate water density of 1 kg/L. They are not universal for every liquid.',
    ],
    table: tableRows(),
    tableNote: 'Assumed density: 1 kg/L · Gallon unit: US liquid gallon',
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Water storage, cooking, beverage prep, fuel measurements, liquid transport, aquariums, pools, industrial handling, and educational mass-volume conversions.',
    ],
  },
];

export const GALLONS_TO_POUNDS_FAQS: readonly FAQItem[] = [
  {
    question: 'How many pounds are in a gallon?',
    answer:
      'There is no universal answer. It depends on the liquid density and gallon standard.',
  },
  {
    question: 'How much does one US gallon of water weigh?',
    answer: `At an assumed density of 1 kg/L, approximately ${formatMeasure(oneGalLb)} pounds.`,
  },
  {
    question: 'How much do 5 gallons of water weigh?',
    answer: `Using US liquid gallons and 1 kg/L, about ${formatMeasure(fiveGalLb)} lb.`,
  },
  {
    question: 'How much do 10 gallons of water weigh?',
    answer: `Using the same assumptions, about ${formatMeasure(tenGalLb)} lb.`,
  },
  {
    question: 'How do I convert gallons to pounds?',
    answer:
      'Convert gallons into liters, multiply by density, and convert kilograms into pounds.',
  },
  {
    question: 'How do I convert pounds to gallons?',
    answer:
      'Convert pounds into kilograms, divide by density, and convert liters into gallons.',
  },
  {
    question: 'Are gallons and pounds the same measurement?',
    answer: 'No. Gallons measure volume and pounds measure mass.',
  },
  {
    question: 'Is a US gallon the same as an Imperial gallon?',
    answer: `No. US liquid gallon = ${ML_PER_US_LIQUID_GALLON / 1000} L. Imperial gallon = ${ML_PER_IMPERIAL_GALLON / 1000} L.`,
  },
  {
    question: 'How many pounds is a gallon of milk?',
    answer:
      'The result depends on the milk’s actual density, composition, temperature, and gallon standard.',
  },
  {
    question: 'How many pounds is a gallon of cooking oil?',
    answer:
      'The result depends on the type of oil, its density, temperature, and gallon standard.',
  },
  {
    question: 'How many pounds is a gallon of gasoline?',
    answer:
      'The result depends on the fuel’s density, composition, and temperature. Enter a measured density.',
  },
  {
    question: 'Which is heavier, one gallon of water or one gallon of oil?',
    answer:
      'For the same gallon definition, compare the densities of the specific water and oil samples under the stated conditions.',
  },
  {
    question: 'Can I convert gallons to kilograms?',
    answer:
      'Yes. Multiply volume in liters by density in kilograms per liter.',
  },
  {
    question: 'Can I convert pounds back to gallons?',
    answer: 'Yes, when a valid liquid density is available.',
  },
  {
    question: 'Does temperature affect gallons-to-pounds conversion?',
    answer:
      'Temperature can change liquid density, affecting the mass associated with a given volume.',
  },
  {
    question: 'Can I enter a custom density?',
    answer:
      'Yes. Enable Show Liquid Density or choose Custom liquid, then enter a positive density.',
  },
];
