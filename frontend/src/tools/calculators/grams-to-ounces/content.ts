import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMass, gramsToOunces, ouncesToGrams } from './calculation';
import {
  GRAMS_PER_AVOIRDUPOIS_OUNCE,
  GRAMS_PER_TROY_OUNCE,
} from './types';

export const GRAMS_TO_OUNCES_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'mass-versus-weight', label: 'Mass Versus Weight' },
  { id: 'how-to-measure', label: 'How to Measure Mass and Weight' },
  { id: 'units-of-mass', label: 'Units of Mass' },
  { id: 'g-to-oz', label: 'How to Convert Grams to Ounces' },
  { id: 'oz-to-g', label: 'How to Convert Ounces to Grams' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'example-100', label: 'Example: 100 Grams' },
  { id: 'example-500', label: 'Example: 500 Grams' },
  { id: 'g-to-oz-table', label: 'Grams to Ounces Chart' },
  { id: 'oz-to-g-table', label: 'Ounces to Grams Chart' },
  { id: 'avoirdupois-vs-troy', label: 'Avoirdupois vs Troy' },
  { id: 'grams-vs-fl-oz', label: 'Grams vs Fluid Ounces' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'grams-to-ounces-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  left: string;
  right: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly ConversionTableRow[];
  tableHeaders?: readonly [string, string];
  tableNote?: string;
}

const TABLE_G = [0, 1, 5, 10, 20, 25, 50, 100, 200, 250, 500, 750, 1000] as const;
const TABLE_OZ = [0, 0.25, 0.5, 1, 2, 4, 8, 12, 16, 32] as const;

export const GRAMS_TO_OUNCES_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      `This calculator converts mass between grams (g) and international avoirdupois ounces (oz) using the exact factor ${GRAMS_PER_AVOIRDUPOIS_OUNCE} g per ounce. It measures mass, not liquid volume.`,
    ],
  },
  {
    id: 'mass-versus-weight',
    title: 'Mass Versus Weight',
    paragraphs: [
      'Mass is the quantity of matter. Weight is the gravitational force on that mass. Everyday language often calls grams and ounces “weight,” but both are mass units. In physics, Weight = Mass × gravitational acceleration (F = m × a_g). Do not confuse the gram symbol g with gravitational acceleration.',
    ],
  },
  {
    id: 'how-to-measure',
    title: 'How to Measure Mass and Weight',
    paragraphs: [
      'Mass is commonly measured with balances or scales that display mass units. Weight as force depends on local gravity. Accuracy depends on the instrument, calibration, and conditions.',
    ],
  },
  {
    id: 'units-of-mass',
    title: 'Units of Mass',
    paragraphs: [
      'Metric units include micrograms, milligrams, grams, decagrams, kilograms, and metric tonnes. US customary / Imperial units include grains, avoirdupois ounces, pounds, stones, and short tons. Some specialized contexts use troy ounces, which differ from avoirdupois ounces.',
    ],
  },
  {
    id: 'g-to-oz',
    title: 'How to Convert Grams to Ounces',
    paragraphs: [
      `Divide grams by ${GRAMS_PER_AVOIRDUPOIS_OUNCE}. Example: 100 g ÷ ${GRAMS_PER_AVOIRDUPOIS_OUNCE} ≈ ${formatMass(gramsToOunces(100))} oz.`,
    ],
    formula: `Ounces = Grams / ${GRAMS_PER_AVOIRDUPOIS_OUNCE}`,
  },
  {
    id: 'oz-to-g',
    title: 'How to Convert Ounces to Grams',
    paragraphs: [
      `Multiply ounces by ${GRAMS_PER_AVOIRDUPOIS_OUNCE}. Example: 5 oz × ${GRAMS_PER_AVOIRDUPOIS_OUNCE} = ${formatMass(ouncesToGrams(5))} g.`,
    ],
    formula: `Grams = Ounces × ${GRAMS_PER_AVOIRDUPOIS_OUNCE}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Grams to Ounces Calculator',
    paragraphs: [
      'Enter grams to read ounces, or enter ounces to read grams. Open More conversion options for mg, dag, kg, lb, and related units. Copy or reset when finished.',
    ],
  },
  {
    id: 'example-100',
    title: 'Example: 100 Grams to Ounces',
    paragraphs: [`100 g ≈ ${formatMass(gramsToOunces(100))} oz.`],
  },
  {
    id: 'example-500',
    title: 'Example: 500 Grams to Ounces',
    paragraphs: [`500 g ≈ ${formatMass(gramsToOunces(500))} oz.`],
  },
  {
    id: 'g-to-oz-table',
    title: 'Grams to Ounces Conversion Chart',
    paragraphs: [
      'Values below use the shared conversion engine. Displayed ounces are approximate truncations of the exact division.',
    ],
    table: TABLE_G.map((g) => ({
      left: formatMass(g),
      right: formatMass(gramsToOunces(g)),
    })),
    tableHeaders: ['Grams (g)', 'Ounces (oz), approx.'],
    tableNote: `Exact: 1 oz = ${GRAMS_PER_AVOIRDUPOIS_OUNCE} g`,
  },
  {
    id: 'oz-to-g-table',
    title: 'Ounces to Grams Conversion Chart',
    paragraphs: ['Exact avoirdupois conversions generated from the calculator engine.'],
    table: TABLE_OZ.map((oz) => ({
      left: formatMass(oz),
      right: formatMass(ouncesToGrams(oz)),
    })),
    tableHeaders: ['Ounces (oz)', 'Grams (g)'],
  },
  {
    id: 'avoirdupois-vs-troy',
    title: 'Avoirdupois Ounces vs Troy Ounces',
    paragraphs: [
      `Exactly 1 avoirdupois oz = ${GRAMS_PER_AVOIRDUPOIS_OUNCE} g. Exactly 1 troy oz = ${GRAMS_PER_TROY_OUNCE} g. This calculator uses avoirdupois ounces.`,
    ],
  },
  {
    id: 'grams-vs-fl-oz',
    title: 'Grams vs Fluid Ounces',
    paragraphs: [
      'Grams measure mass. Fluid ounces measure volume. Converting mass to liquid volume requires density. This calculator does not convert grams into fluid ounces.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Cooking ingredient weights, food packaging, grocery measurements, shipping, product weights, fitness equipment, scientific and laboratory work, and educational unit conversion.',
    ],
  },
];

export const GRAMS_TO_OUNCES_FAQS: readonly FAQItem[] = [
  {
    question: 'How many grams are in one ounce?',
    answer: `One standard avoirdupois ounce equals exactly ${GRAMS_PER_AVOIRDUPOIS_OUNCE} grams.`,
  },
  {
    question: 'How do I convert grams to ounces?',
    answer: `Divide grams by ${GRAMS_PER_AVOIRDUPOIS_OUNCE}.`,
  },
  {
    question: 'How do I convert ounces to grams?',
    answer: `Multiply ounces by ${GRAMS_PER_AVOIRDUPOIS_OUNCE}.`,
  },
  {
    question: 'How many ounces are in 20 grams?',
    answer: `About ${formatMass(gramsToOunces(20))} oz.`,
  },
  {
    question: 'How many ounces are in 50 grams?',
    answer: `About ${formatMass(gramsToOunces(50))} oz.`,
  },
  {
    question: 'How many ounces are in 100 grams?',
    answer: `About ${formatMass(gramsToOunces(100))} oz.`,
  },
  {
    question: 'How many ounces are in 200 grams?',
    answer: `About ${formatMass(gramsToOunces(200))} oz.`,
  },
  {
    question: 'How many ounces are in 500 grams?',
    answer: `About ${formatMass(gramsToOunces(500))} oz.`,
  },
  {
    question: 'How many ounces are in one kilogram?',
    answer: `About ${formatMass(gramsToOunces(1000))} oz.`,
  },
  {
    question: 'How many grams are in half an ounce?',
    answer: `Exactly ${formatMass(ouncesToGrams(0.5))} g.`,
  },
  {
    question: 'How many grams are in four ounces?',
    answer: `Exactly ${formatMass(ouncesToGrams(4))} g.`,
  },
  {
    question: 'How many grams are in eight ounces?',
    answer: `Exactly ${formatMass(ouncesToGrams(8))} g.`,
  },
  {
    question: 'How many grams are in sixteen ounces?',
    answer: `Exactly ${formatMass(ouncesToGrams(16))} g.`,
  },
  {
    question: 'Are grams and ounces units of weight?',
    answer:
      'In everyday usage they are often called weight units, but technically both are units of mass.',
  },
  {
    question: 'Are fluid ounces the same as ounces?',
    answer:
      'No. Fluid ounces measure volume; avoirdupois ounces measure mass.',
  },
  {
    question: 'Are troy ounces the same as ordinary ounces?',
    answer: 'No. One troy ounce is heavier than one avoirdupois ounce.',
  },
  {
    question: 'Can I convert grams to fluid ounces?',
    answer:
      'Only when the substance’s density is known. This calculator does not perform mass-to-volume conversion.',
  },
  {
    question: 'Can I enter decimal gram measurements?',
    answer: 'Yes. The calculator supports integer and decimal inputs.',
  },
];
