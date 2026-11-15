import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { calculateQuartsToPounds, formatMeasure } from './calculation';
import {
  DEFAULT_QUARTS_TO_POUNDS_INPUT,
  GRAMS_PER_POUND,
  ML_PER_IMPERIAL_QUART,
  ML_PER_US_DRY_QUART,
  ML_PER_US_LIQUID_QUART,
} from './types';

export const QUARTS_TO_POUNDS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'quarts-vs-pounds', label: 'Quarts vs Pounds' },
  { id: 'what-is-a-quart', label: 'What Is a Quart?' },
  { id: 'what-is-a-pound', label: 'What Is a Pound?' },
  { id: 'how-to-convert-qt-lb', label: 'How to Convert Quarts to Pounds' },
  { id: 'how-to-convert-lb-qt', label: 'How to Convert Pounds to Quarts' },
  { id: 'why-density', label: 'Why Ingredient Density Matters' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'conversion-table', label: 'Conversion Table' },
  { id: 'us-vs-imperial', label: 'US vs Imperial Quarts' },
  { id: 'dry-ingredients', label: 'Dry Ingredients' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'quarts-to-pounds-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  quarts: string;
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

const TABLE_QUARTS = [0.5, 1, 2, 3, 4, 5, 8, 10] as const;

function tableRows(): readonly ConversionTableRow[] {
  return TABLE_QUARTS.map((qt) => {
    const r = calculateQuartsToPounds({
      ...DEFAULT_QUARTS_TO_POUNDS_INPUT,
      volume: qt,
    });
    return {
      quarts: formatMeasure(qt),
      pounds: formatMeasure(r.mass),
    };
  });
}

const oneQtWaterLb = ML_PER_US_LIQUID_QUART / GRAMS_PER_POUND;
const fourQtWaterLb = (4 * ML_PER_US_LIQUID_QUART) / GRAMS_PER_POUND;

export const QUARTS_TO_POUNDS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Quarts to Pounds Conversion Calculator converts between quarts of volume and pounds of mass using ingredient density. Because quarts and pounds measure different physical quantities, there is no universal conversion factor.',
      'Select an ingredient, choose a quart standard, and enter volume or mass. Enable Show Ingredient Density when you need to review or edit the density assumption.',
    ],
  },
  {
    id: 'quarts-vs-pounds',
    title: 'Measuring in Quarts and Pounds – What’s the Difference?',
    paragraphs: [
      'Quarts measure volume. Pounds measure mass. Converting between them requires density. US liquid and Imperial liquid quarts also differ in size, which changes the resulting mass for the same numeric quart count.',
    ],
  },
  {
    id: 'what-is-a-quart',
    title: 'What Is a Quart?',
    paragraphs: [
      `Exactly 1 US liquid quart = ${ML_PER_US_LIQUID_QUART} mL (${ML_PER_US_LIQUID_QUART / 1000} L). Exactly 1 Imperial liquid quart = ${ML_PER_IMPERIAL_QUART} mL. A US dry quart is ${ML_PER_US_DRY_QUART} mL and must not reuse liquid-quart factors.`,
    ],
  },
  {
    id: 'what-is-a-pound',
    title: 'What Is a Pound?',
    paragraphs: [
      `One international avoirdupois pound equals exactly ${GRAMS_PER_POUND} g (${GRAMS_PER_POUND / 1000} kg) and contains 16 avoirdupois ounces. Do not confuse mass ounces with fluid ounces.`,
    ],
  },
  {
    id: 'how-to-convert-qt-lb',
    title: 'How to Convert Quarts to Pounds',
    paragraphs: [
      `Convert quarts to liters, multiply by density in kg/L, then divide kilograms by ${GRAMS_PER_POUND / 1000}. Example with water at ≈1 kg/L: 1 US liquid quart ≈ ${formatMeasure(oneQtWaterLb)} lb.`,
    ],
    formula:
      'Pounds = Quarts × LitersPerQuart × Density (kg/L) ÷ 0.45359237',
  },
  {
    id: 'how-to-convert-lb-qt',
    title: 'How to Convert Pounds to Quarts',
    paragraphs: [
      `Convert pounds to kilograms, divide by density, then convert liters into the selected quart unit. Example: 5 lb of water at ≈1 kg/L ≈ ${formatMeasure((5 * GRAMS_PER_POUND) / ML_PER_US_LIQUID_QUART)} US liquid quarts.`,
    ],
    formula:
      'Quarts = Pounds × 0.45359237 ÷ Density (kg/L) ÷ LitersPerQuart',
  },
  {
    id: 'why-density',
    title: 'Why Ingredient Density Matters',
    paragraphs: [
      'The same quart volume of water, milk, cooking oil, honey, flour, or sugar can weigh differently. Only water ships with a conventional approximate density preset here; other ingredients require your measured or labeled density so the calculator never invents bulk densities.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Quarts to Pounds Calculator',
    paragraphs: [
      'Select the ingredient, choose the quart standard, enter quarts (or pounds), optionally show and edit density, then copy or reset the result.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Quarts to Pounds Conversion Table',
    paragraphs: [
      'Values below assume US liquid quarts and an approximate water density of 1 kg/L. They are not universal for every ingredient.',
    ],
    table: tableRows(),
    tableNote: 'Assumed density: 1 kg/L · Quart unit: US liquid quart',
  },
  {
    id: 'us-vs-imperial',
    title: 'US vs Imperial Quarts',
    paragraphs: [
      `US liquid quart = ${ML_PER_US_LIQUID_QUART} mL. Imperial liquid quart = ${ML_PER_IMPERIAL_QUART} mL. Using the wrong standard changes both the volume and the resulting mass.`,
    ],
  },
  {
    id: 'dry-ingredients',
    title: 'Dry Ingredients and Bulk Density',
    paragraphs: [
      'Flour, sugar, rice, and similar dry goods use bulk density, which depends on packing, particle size, and moisture. Enter a measured bulk density rather than assuming liquid density.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Cooking, baking, recipe scaling, food prep, purchasing estimates, household liquid measurements, and educational volume-to-mass conversions.',
    ],
  },
];

export const QUARTS_TO_POUNDS_FAQS: readonly FAQItem[] = [
  {
    question: 'How many pounds are in one quart?',
    answer:
      'There is no universal answer. The mass depends on ingredient density and the quart standard.',
  },
  {
    question: 'How many pounds is one US quart of water?',
    answer: `Using an assumed density of 1 kg/L, one US liquid quart weighs approximately ${formatMeasure(oneQtWaterLb)} pounds.`,
  },
  {
    question: 'How do I convert quarts to pounds?',
    answer:
      'Convert quarts into liters, multiply by density in kg/L, then divide the mass in kilograms by 0.45359237.',
  },
  {
    question: 'How do I convert pounds to quarts?',
    answer:
      'Convert pounds into kilograms, divide by ingredient density, then convert liters into the selected quart unit.',
  },
  {
    question: 'Are quarts and pounds the same measurement?',
    answer: 'No. Quarts measure volume and pounds measure mass.',
  },
  {
    question: 'How many pounds are in four quarts of water?',
    answer: `Using US liquid quarts and an assumed density of 1 kg/L, four quarts weigh approximately ${formatMeasure(fourQtWaterLb)} lb.`,
  },
  {
    question: 'How many pounds is one quart of milk?',
    answer:
      'The answer depends on the milk’s density and the selected quart standard. Enter a measured density.',
  },
  {
    question: 'How many pounds is one quart of oil?',
    answer:
      'The result depends on the oil’s density, type, temperature, and quart standard.',
  },
  {
    question: 'How many quarts are in one pound of sugar?',
    answer:
      'It depends on the sugar type, packing, and bulk density. Enter a measured bulk density.',
  },
  {
    question: 'Is a US quart the same as an Imperial quart?',
    answer: `No. US liquid quart = ${ML_PER_US_LIQUID_QUART} mL. Imperial liquid quart = ${ML_PER_IMPERIAL_QUART} mL.`,
  },
  {
    question: 'How many quarts are in one US gallon?',
    answer: 'Exactly four US liquid quarts.',
  },
  {
    question: 'Can I convert dry quarts to pounds?',
    answer:
      'Yes, when the US dry quart definition and an appropriate bulk density are used.',
  },
  {
    question: 'Can I enter a custom ingredient density?',
    answer:
      'Yes. Enable Show Ingredient Density or choose Custom ingredient, then enter a positive density.',
  },
  {
    question: 'Does temperature affect quart-to-pound conversions?',
    answer:
      'Temperature may affect ingredient density and therefore the mass associated with a given volume.',
  },
];
