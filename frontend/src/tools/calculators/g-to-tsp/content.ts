import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatMeasure,
  gramsToTeaspoons,
  teaspoonsToGrams,
  US_TEASPOON_ML,
} from './calculation';

export const G_TO_TSP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'grams-and-grains', label: 'What Are Grams and Grains?' },
  { id: 'teaspoons-tablespoons', label: 'What Are Teaspoons and Tablespoons?' },
  { id: 'how-convert', label: 'How Do I Convert g to Teaspoon?' },
  { id: 'how-to-use', label: 'How to Use This g to tsp Converter?' },
  { id: 'conversion-table', label: 'Grams to Teaspoons Conversion Table' },
  { id: 'related-tools', label: 'Similar Conversion Tools' },
  { id: 'g-to-tsp-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { grams: string; tsp: string }[];
}

const salt10 = gramsToTeaspoons(10, 1.217);
const sugar10 = gramsToTeaspoons(10, 0.85);
const honey1tsp = teaspoonsToGrams(1, 1.42);
const salt1tsp = teaspoonsToGrams(1, 1.217);

function waterRow(grams: number): { grams: string; tsp: string } {
  return {
    grams: String(grams),
    tsp: formatMeasure(Number(gramsToTeaspoons(grams, 1).toFixed(4))),
  };
}

export const WATER_G_TO_TSP_TABLE: readonly { grams: string; tsp: string }[] = [
  waterRow(1),
  waterRow(5),
  waterRow(10),
  waterRow(15),
  waterRow(20),
  waterRow(25),
  waterRow(50),
  waterRow(100),
];

export const G_TO_TSP_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'grams-and-grains',
    title: 'What Are Grams and Grains?',
    paragraphs: [
      'A gram is a metric unit of mass. Its standard symbol is g. One kilogram contains 1000 grams.',
      'A grain is a separate mass unit, often written gr. One grain equals approximately 64.79891 milligrams. Grams and grains must not be confused.',
      'This calculator interprets g as grams, not grains.',
    ],
  },
  {
    id: 'teaspoons-tablespoons',
    title: 'What Are Teaspoons and Tablespoons?',
    paragraphs: [
      `A teaspoon is a unit of volume. A US customary teaspoon equals exactly ${US_TEASPOON_ML} mL (1/6 US fluid ounce). A metric teaspoon equals 5 mL — they are not the same.`,
      'A US tablespoon equals three US teaspoons. Teaspoons are common for cooking ingredients and small liquid amounts.',
      'A teaspoon of honey, flour, sugar, and salt does not have the same mass because those ingredients have different densities.',
    ],
  },
  {
    id: 'how-convert',
    title: 'How Do I Convert g to Teaspoon?',
    paragraphs: [
      '1. Identify the ingredient.',
      '2. Find the density in g/mL.',
      '3. Enter the mass in grams.',
      '4. Divide mass by density to obtain milliliters.',
      `5. Divide milliliters by ${US_TEASPOON_ML} to obtain US teaspoons.`,
      `Example: 10 g of table salt at 1.217 g/mL ≈ ${formatMeasure(Number(salt10.toFixed(4)))} US tsp.`,
    ],
    formula: `tsp = g ÷ (ρ × ${US_TEASPOON_ML})\nwhere ρ is density in g/mL`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use This g to tsp Converter?',
    paragraphs: [
      '1. Choose an ingredient from the dropdown (Salt is the default).',
      '2. Confirm or customize the density (default 1217 kg/m³ for salt).',
      '3. Enter the weight in grams.',
      '4. Read the calculated amount in US teaspoons (or switch volume units).',
      '5. Enter teaspoons to calculate grams in reverse.',
      '6. Switching ingredients updates density but keeps your mass/volume entries.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Grams to Teaspoons Conversion Table',
    paragraphs: [
      'The table below assumes water at a density of 1 g/mL and US customary teaspoons. Other ingredients require their own densities.',
    ],
    table: WATER_G_TO_TSP_TABLE,
  },
  {
    id: 'related-tools',
    title: 'Similar Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include gr to ml Converter, Grams in mL Converter, Grams to fl oz Converter, Gram to Liter Conversion, Gallons to Grams Conversion, Fluid Ounces to Pounds Conversion, and other cooking measurement tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const G_TO_TSP_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Grams Are in 1 Teaspoon of Honey?',
    answer: `Using an approximate density of 1.42 g/mL: Mass = ${US_TEASPOON_ML} × 1.42 ≈ ${formatMeasure(Number(honey1tsp.toFixed(2)))} g. One US teaspoon of honey weighs approximately ${formatMeasure(Number(honey1tsp.toFixed(2)))} grams.`,
  },
  {
    question: 'How Many Grams Are in One Teaspoon of Salt?',
    answer: `Using an approximate bulk density of 1.217 g/mL, one US teaspoon of salt weighs approximately ${formatMeasure(Number(salt1tsp.toFixed(2)))} grams (${formatMeasure(salt1tsp)} g at that density). The exact value can change with salt type, crystal size, and packing.`,
  },
  {
    question: 'How Many Teaspoons Is 10 Grams of Sugar?',
    answer: `Using an approximate granulated sugar bulk density of 0.85 g/mL: tsp = 10 ÷ (0.85 × ${US_TEASPOON_ML}) ≈ ${formatMeasure(Number(sugar10.toFixed(2)))} US teaspoons.`,
  },
  {
    question: 'Are 5 Grams Equal to 1 Teaspoon?',
    answer: `Not necessarily. Five grams of water is approximately ${formatMeasure(Number(gramsToTeaspoons(5, 1).toFixed(3)))} US teaspoons, but the corresponding volume for other ingredients depends on density.`,
  },
  {
    question: 'How Do I Convert Teaspoons to Grams?',
    answer: `Multiply the number of US teaspoons by ${US_TEASPOON_ML} to obtain milliliters, then multiply by the ingredient density in g/mL.`,
  },
];
