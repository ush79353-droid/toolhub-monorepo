import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { convertMass, formatMass, fromKilograms } from './calculation';
import {
  KG_PER_OUNCE,
  KG_PER_POUND,
  KG_PER_STONE,
  KG_PER_TROY_OUNCE,
} from './types';

export const WEIGHT_CONVERTER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'what-is-weight', label: 'What Is Weight?' },
  { id: 'mass-versus-weight', label: 'Mass Versus Weight' },
  { id: 'units-of-mass', label: 'Units of Weight and Mass' },
  { id: 'kg-to-lb', label: 'Kilograms to Pounds' },
  { id: 'lb-to-kg', label: 'Pounds to Kilograms' },
  { id: 'g-to-oz', label: 'Grams to Ounces' },
  { id: 'oz-to-g', label: 'Ounces to Grams' },
  { id: 'conversion-chart', label: 'Weight Conversion Chart' },
  { id: 'metric-vs-imperial', label: 'Metric vs Imperial' },
  { id: 'troy-ounce', label: 'What Is a Troy Ounce?' },
  { id: 'historical', label: 'Historical Systems' },
  { id: 'why-different-units', label: 'Why Different Units?' },
  { id: 'how-to-use', label: 'How to Use' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'weight-converter-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  kg: string;
  g: string;
  lb: string;
  oz: string;
  st: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly ConversionTableRow[];
  tableNote?: string;
}

const CHART_KG = [0.1, 0.5, 1, 2, 5, 10, 20, 50, 100] as const;

export const WEIGHT_CONVERTER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The Weight Converter expresses the same physical mass in metric, US customary, Imperial, troy, and selected scientific units. Enter a value in any field; every other displayed unit updates from one canonical kilogram value.',
      'Despite the everyday name “weight,” the calculator converts mass units. It does not convert force units such as newtons or pound-force.',
    ],
  },
  {
    id: 'what-is-weight',
    title: 'What Is Weight?',
    paragraphs: [
      'In everyday language, weight often means how heavy something feels on a scale labeled in kilograms or pounds. In physics, weight is the gravitational force on a mass: Weight = Mass × gravitational acceleration. Force is measured in newtons, while mass is measured in kilograms.',
    ],
  },
  {
    id: 'mass-versus-weight',
    title: 'Mass Versus Weight',
    paragraphs: [
      'Mass is the quantity of matter and does not change with location. Weight as force depends on local gravity—the same mass weighs slightly differently on Earth than on the Moon. Kitchen and bathroom scales display mass units even when people call the reading “weight.”',
    ],
  },
  {
    id: 'units-of-mass',
    title: 'Units of Weight and Mass',
    paragraphs: [
      'Metric units include micrograms, milligrams, grams, kilograms, and metric tonnes. US customary and Imperial systems use grains, avoirdupois ounces, pounds, stones, hundredweights, short tons, and long tons. Troy ounces and troy pounds serve precious-metal trade. Scientific work may use picograms, nanograms, or atomic mass units (daltons).',
    ],
  },
  {
    id: 'kg-to-lb',
    title: 'How to Convert Kilograms to Pounds',
    paragraphs: [
      `Divide kilograms by the exact pound definition ${KG_PER_POUND} kg. Example: 5 kg ÷ ${KG_PER_POUND} ≈ ${formatMass(convertMass(5, 'kg', 'lb'))} lb.`,
    ],
    formula: `Pounds = Kilograms / ${KG_PER_POUND}`,
  },
  {
    id: 'lb-to-kg',
    title: 'How to Convert Pounds to Kilograms',
    paragraphs: [
      `Multiply pounds by ${KG_PER_POUND}. Example: 10 lb × ${KG_PER_POUND} = ${formatMass(convertMass(10, 'lb', 'kg'))} kg.`,
    ],
    formula: `Kilograms = Pounds × ${KG_PER_POUND}`,
  },
  {
    id: 'g-to-oz',
    title: 'How to Convert Grams to Ounces',
    paragraphs: [
      `Divide grams by ${formatMass(convertMass(1, 'oz', 'g'))} (exact grams per avoirdupois ounce). Example: 100 g ≈ ${formatMass(convertMass(100, 'g', 'oz'))} oz.`,
    ],
    formula: `Ounces = Grams / ${formatMass(convertMass(1, 'oz', 'g'))}`,
  },
  {
    id: 'oz-to-g',
    title: 'How to Convert Ounces to Grams',
    paragraphs: [
      `Multiply avoirdupois ounces by ${formatMass(convertMass(1, 'oz', 'g'))}. Example: 8 oz = ${formatMass(convertMass(8, 'oz', 'g'))} g.`,
    ],
    formula: `Grams = Ounces × ${formatMass(convertMass(1, 'oz', 'g'))}`,
  },
  {
    id: 'conversion-chart',
    title: 'Weight Conversion Chart',
    paragraphs: [
      'Selected kilogram values converted through the shared mass registry. Displayed figures are formatted for reading; internal math uses exact factors.',
    ],
    table: CHART_KG.map((kg) => ({
      kg: formatMass(kg),
      g: formatMass(fromKilograms(kg, 'g')),
      lb: formatMass(fromKilograms(kg, 'lb')),
      oz: formatMass(fromKilograms(kg, 'oz')),
      st: formatMass(fromKilograms(kg, 'st')),
    })),
    tableNote: `Exact: 1 lb = ${KG_PER_POUND} kg; 1 oz = ${KG_PER_OUNCE} kg; 1 st = ${KG_PER_STONE} kg.`,
  },
  {
    id: 'metric-vs-imperial',
    title: 'Metric vs Imperial Weight Units',
    paragraphs: [
      'Metric mass is decimal: 1,000 g = 1 kg and 1,000 kg = 1 metric tonne. Avoirdupois relationships are fixed but not decimal: 16 oz = 1 lb, 14 lb = 1 stone, 2,000 lb = 1 US short ton, and 2,240 lb = 1 Imperial long ton. Never treat “ton” as ambiguous—metric tonne, short ton, and long ton differ.',
    ],
  },
  {
    id: 'troy-ounce',
    title: 'What Is a Troy Ounce?',
    paragraphs: [
      `Troy ounces are used for gold, silver, and other precious metals. Exactly 1 troy ounce = ${formatMass(convertMass(1, 'ozt', 'g'))} g, while 1 avoirdupois ounce = ${formatMass(convertMass(1, 'oz', 'g'))} g. One troy pound equals 12 troy ounces, not 16. This converter lists troy ounces separately from ordinary ounces.`,
    ],
  },
  {
    id: 'historical',
    title: 'Historical Weight Measurement Systems',
    paragraphs: [
      'Trade historically used local pounds, stones, and grains. The international avoirdupois pound was later fixed exactly as 0.45359237 kg, which also fixes the ounce, stone, and related units. Metric units grew from the gram and kilogram as SI mass standards.',
    ],
  },
  {
    id: 'why-different-units',
    title: 'Why Do We Use Different Weight Units?',
    paragraphs: [
      'Regions keep customary units for cooking, body weight, and commerce. Science and engineering prefer SI kilograms. Jewelry and bullion use troy. Shipping may quote short tons, long tons, or metric tonnes depending on the market.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Weight Converter',
    paragraphs: [
      'Open a unit group, enter a mass in any field, and optionally change that field’s unit—the physical mass stays the same when you switch units. Expand More conversion options for grains, carats, tons, and atomic mass units. Copy or reset when finished.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Cooking and grocery packaging, shipping labels, manufacturing tolerances, laboratory samples, precious-metal quotes, engineering bills of materials, education, and fitness body-mass readings all need reliable unit conversion.',
    ],
  },
];

export const WEIGHT_CONVERTER_FAQS: readonly FAQItem[] = [
  {
    question: 'How do I convert kilograms to pounds?',
    answer: `Divide kilograms by ${KG_PER_POUND}.`,
  },
  {
    question: 'How do I convert pounds to kilograms?',
    answer: `Multiply pounds by ${KG_PER_POUND}.`,
  },
  {
    question: 'How many grams are in one kilogram?',
    answer: 'Exactly 1000 grams.',
  },
  {
    question: 'How many ounces are in one pound?',
    answer: 'Exactly 16 avoirdupois ounces.',
  },
  {
    question: 'How many grams are in one ounce?',
    answer: `Exactly ${formatMass(convertMass(1, 'oz', 'g'))} grams.`,
  },
  {
    question: 'How many pounds are in one kilogram?',
    answer: `Approximately ${formatMass(1 / KG_PER_POUND)} pounds.`,
  },
  {
    question: 'How many pounds are in one stone?',
    answer: 'Exactly 14 pounds.',
  },
  {
    question: 'How many kilograms are in one stone?',
    answer: `Exactly ${KG_PER_STONE} kilograms.`,
  },
  {
    question: 'How many pounds are in one metric tonne?',
    answer: `Approximately ${formatMass(1000 / KG_PER_POUND)} pounds.`,
  },
  {
    question: 'How many pounds are in one US short ton?',
    answer: 'Exactly 2000 pounds.',
  },
  {
    question: 'How many pounds are in one Imperial long ton?',
    answer: 'Exactly 2240 pounds.',
  },
  {
    question: 'What is the difference between mass and weight?',
    answer:
      'Mass measures the amount of matter. Weight is the gravitational force acting on that mass (Weight = Mass × gravitational acceleration).',
  },
  {
    question: 'Is a troy ounce the same as a regular ounce?',
    answer: `No. 1 avoirdupois ounce = ${formatMass(convertMass(1, 'oz', 'g'))} g. 1 troy ounce = ${formatMass(convertMass(1, 'ozt', 'g'))} g.`,
  },
  {
    question: 'Can I convert grams to fluid ounces?',
    answer:
      'Not directly. Grams measure mass and fluid ounces measure volume. You need the substance’s density.',
  },
  {
    question: 'Can I enter decimal values?',
    answer: 'Yes. The converter supports zero and positive decimal measurements.',
  },
  {
    question: 'Can I convert scientific mass units?',
    answer:
      'Yes for units in the verified registry, including picograms, nanograms, and atomic mass units (CODATA approximation). Force units such as newtons are not included.',
  },
];
