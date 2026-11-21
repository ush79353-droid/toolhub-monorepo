import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, gramsToLiters, litersToGrams } from './calculation';

export const GRAM_TO_LITER_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'gram-to-liter-conversion', label: 'Gram to Liter Conversion' },
  { id: 'liter-to-gram-water', label: 'Liter to Gram Conversion for Water' },
  { id: 'how-to-use', label: 'How to Use This g to L Converter' },
  { id: 'conversion-table', label: 'Gram to Liter Conversion Table' },
  { id: 'related-tools', label: 'Similar Conversion Tools' },
  { id: 'gram-to-liter-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  bullets?: readonly string[];
  table?: readonly { grams: string; liters: string; ml: string }[];
}

const milk200 = gramsToLiters(200, 1030);
const oil500 = gramsToLiters(500, 920);
const milk2L = litersToGrams(2, 1030);
const milk1L = litersToGrams(1, 1030);

function waterRow(grams: number): { grams: string; liters: string; ml: string } {
  const liters = gramsToLiters(grams, 1000);
  return {
    grams: String(grams),
    liters: formatMeasure(liters),
    ml: formatMeasure(liters * 1000),
  };
}

export const WATER_G_TO_L_TABLE: readonly { grams: string; liters: string; ml: string }[] = [
  waterRow(10),
  waterRow(50),
  waterRow(100),
  waterRow(200),
  waterRow(250),
  waterRow(500),
  waterRow(750),
  waterRow(1000),
  waterRow(1500),
  waterRow(2000),
];

export const GRAM_TO_LITER_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'gram-to-liter-conversion',
    title: 'Gram to Liter Conversion',
    paragraphs: [
      'Grams measure mass. Liters measure volume. You cannot convert one into the other without density; mass per unit volume of the substance you are measuring.',
      'When mass is in grams and density is in kg/m³ (which equals g/L numerically), volume in liters is mass divided by density.',
      'Example: convert 500 g of water at 1000 kg/m³. Volume = 500 ÷ 1000 = 0.5 L.',
      `Equal masses of different substances occupy different volumes. At ≈ 1030 kg/m³, 200 g of whole milk is about ${formatMeasure(Number(milk200.toFixed(4)))} L, not 0.2 L.`,
    ],
    formula: 'Volume (L) = Mass (g) ÷ Density (kg/m³)\nMass (g) = Volume (L) × Density (kg/m³)',
  },
  {
    id: 'liter-to-gram-water',
    title: 'Liter to Gram Conversion for Water',
    paragraphs: [
      'Water near 4 °C has a convenient approximate density of 1000 kg/m³. Under that assumption, 1 liter of water has a mass of about 1000 grams, and grams map to liters by dividing by 1000.',
      'These water-based values are approximate and are not universal for milk, oil, honey, or other materials.',
    ],
    bullets: [
      '100 g ≈ 0.1 L',
      '250 g ≈ 0.25 L',
      '500 g ≈ 0.5 L',
      '1000 g ≈ 1 L',
      '2000 g ≈ 2 L',
    ],
    formula: 'For water ≈ 1000 kg/m³: L ≈ g ÷ 1000',
  },
  {
    id: 'how-to-use',
    title: 'How to Use This g to L Converter',
    paragraphs: [
      '1. Select a substance from the dropdown (Water is the default).',
      '2. Confirm or customize the suggested density (default 1000 kg/m³ for water).',
      '3. Enter the mass in grams (or another mass unit).',
      '4. Read the resulting volume in liters (or switch volume units).',
      '5. Change density, mass, or volume units as needed. physical quantities are preserved.',
      '6. Enter volume instead to calculate mass.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Gram to Liter Conversion Table',
    paragraphs: [
      'The table below assumes water at a reference density of 1000 kg/m³. Results for other ingredients require their own densities.',
    ],
    table: WATER_G_TO_L_TABLE,
  },
  {
    id: 'related-tools',
    title: 'Similar Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Grams in mL Converter, Grams to fl oz Converter, Gal to kg Converter, Gallons to Grams Conversion, Fluid Ounces to Pounds Conversion, and other density-based mass–volume tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const GRAM_TO_LITER_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is 200 Grams of Milk Converted to Liters?',
    answer: `Using an approximate milk density of 1030 kg/m³: 200 ÷ 1030 ≈ ${formatMeasure(Number(milk200.toFixed(5)))} L. Therefore, 200 grams of milk is approximately ${formatMeasure(Number(milk200.toFixed(4)))} liters. The exact result depends on the milk’s density.`,
  },
  {
    question: 'How Do I Convert 500 g of Oil to Liters?',
    answer: `Using an approximate vegetable oil density of 920 kg/m³: 500 ÷ 920 ≈ ${formatMeasure(Number(oil500.toFixed(5)))} L. Therefore, 500 grams of vegetable oil is approximately ${formatMeasure(Number(oil500.toFixed(4)))} liters.`,
  },
  {
    question: 'Is 1000 Grams Equal to 1 Liter?',
    answer:
      'Only for a substance with a density of 1000 kg/m³. At the calculator’s reference density, 1000 g of water corresponds to 1 liter. Other substances require different conversion factors.',
  },
  {
    question: 'How Many Grams Are in 1 Liter of Milk?',
    answer: `Assuming milk density is 1030 kg/m³: 1 × 1030 = ${formatMeasure(milk1L)} g. Therefore, 1 liter of milk has an approximate mass of ${formatMeasure(milk1L)} grams. Similarly, 2 L ≈ ${formatMeasure(milk2L)} g.`,
  },
  {
    question: 'Can I Convert Grams to Liters Without Density?',
    answer:
      'No. Grams measure mass, whereas liters measure volume. The material’s density is required to determine how much volume a particular mass occupies.',
  },
];
