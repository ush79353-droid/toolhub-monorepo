import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMeasure, gramsToMilliliters, millilitersToGrams } from './calculation';

export const GR_TO_ML_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'what-are-grams', label: 'What Are Grams?' },
  { id: 'conversion-grams-ml', label: 'Conversion Between Grams and Milliliters' },
  { id: 'how-to-convert', label: 'How to Convert gr to mL' },
  { id: 'example-conversion', label: 'Example of Conversion From gr to mL' },
  { id: 'conversion-table', label: 'Grams to Milliliters Conversion Table' },
  { id: 'related-tools', label: 'Other Density Converters' },
  { id: 'gr-to-ml-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { grams: string; ml: string }[];
}

const milk100 = gramsToMilliliters(100, 1.03);
const honey100 = gramsToMilliliters(100, 1.42);
const honey150 = gramsToMilliliters(150, 1.42);
const sugar15 = gramsToMilliliters(15, 0.85);

export const WATER_G_TO_ML_TABLE: readonly { grams: string; ml: string }[] = [
  { grams: '1', ml: '1' },
  { grams: '5', ml: '5' },
  { grams: '10', ml: '10' },
  { grams: '25', ml: '25' },
  { grams: '50', ml: '50' },
  { grams: '100', ml: '100' },
  { grams: '150', ml: '150' },
  { grams: '250', ml: '250' },
  { grams: '500', ml: '500' },
  { grams: '750', ml: '750' },
  { grams: '1000', ml: '1000' },
];

export const GR_TO_ML_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'what-are-grams',
    title: 'What Are Grams?',
    paragraphs: [
      'A gram is a metric unit of mass. Its SI symbol is g; “gr” is an informal abbreviation sometimes used in everyday writing for the same unit.',
      'One kilogram equals 1000 grams. Grams are commonly used in cooking, food labels, science classes, and laboratory work.',
      'Milliliters measure volume, not mass. Converting between grams and milliliters therefore requires the substance density.',
    ],
  },
  {
    id: 'conversion-grams-ml',
    title: 'Conversion Between Grams and Milliliters',
    paragraphs: [
      'Density links mass and volume. When density is in g/mL, density equals mass in grams divided by volume in milliliters.',
      `For water at ≈ 1 g/mL, 100 g occupies 100 mL. For whole milk at ≈ 1.03 g/mL, 100 g occupies about ${formatMeasure(Number(milk100.toFixed(4)))} mL.`,
      `Honey is denser. At ≈ 1.42 g/mL, 100 g occupies about ${formatMeasure(Number(honey100.toFixed(4)))} mL.`,
    ],
    formula: 'Density (g/mL) = Mass (g) ÷ Volume (mL)\nVolume (mL) = Mass (g) ÷ Density (g/mL)\nMass (g) = Volume (mL) × Density (g/mL)',
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert gr to mL',
    paragraphs: [
      '1. Identify the substance.',
      '2. Find or select its density in g/mL (or convert from another density unit).',
      '3. Enter the mass in grams.',
      '4. Divide mass by density to get milliliters.',
      '5. Or enter milliliters to calculate grams instead.',
    ],
    formula: 'mL = g ÷ (g/mL)',
  },
  {
    id: 'example-conversion',
    title: 'Example of Conversion From gr to mL',
    paragraphs: [
      'Convert 150 grams of honey using an approximate density of 1.42 g/mL.',
      `Volume = 150 ÷ 1.42 ≈ ${formatMeasure(Number(honey150.toFixed(4)))} mL.`,
      `Therefore, 150 grams of honey ≈ ${formatMeasure(Number(honey150.toFixed(2)))} milliliters under that density assumption.`,
    ],
    formula: '150 g ÷ 1.42 g/mL ≈ 105.6338 mL',
  },
  {
    id: 'conversion-table',
    title: 'Grams to Milliliters Conversion Table',
    paragraphs: [
      'The table below assumes water at a reference density of 1 g/mL. Other ingredients require their own densities and will not match these values.',
    ],
    table: WATER_G_TO_ML_TABLE,
  },
  {
    id: 'related-tools',
    title: 'Other Density Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Gram to Liter Conversion, Grams in mL Converter, Grams to fl oz Converter, Gal to kg Converter, Gallons to Grams Conversion, Fluid Ounces to Pounds Conversion, and other density-based mass–volume tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const GR_TO_ML_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert gr to mL?',
    answer:
      'To convert grams to milliliters, divide the mass in grams by the substance’s density in g/mL. For water at a density of 1 g/mL, 100 grams equals 100 milliliters.',
  },
  {
    question: 'How Many Milliliters Is 15 Grams of Sugar?',
    answer: `The answer depends on sugar density and packing. Using an approximate bulk density of 0.85 g/mL: 15 ÷ 0.85 ≈ ${formatMeasure(Number(sugar15.toFixed(2)))} mL. Therefore, 15 grams of granulated sugar occupies approximately ${formatMeasure(Number(sugar15.toFixed(2)))} mL under that bulk-density assumption.`,
  },
  {
    question: 'How Do I Convert Grams to Milliliters for Water?',
    answer:
      'For water at the reference density of 1 g/mL, volume in milliliters equals mass in grams. For example, 250 grams of water corresponds to approximately 250 milliliters.',
  },
  {
    question: 'Are 100 Grams and 100 Milliliters the Same?',
    answer:
      'Not generally. Grams measure mass, while milliliters measure volume. For water at approximately 1 g/mL, 100 grams corresponds to 100 milliliters. For materials with a different density, the resulting volume differs.',
  },
  {
    question: 'How Many Grams Are in 1 mL of Honey?',
    answer: `Using an approximate density of 1.42 g/mL, 1 milliliter of honey has a mass of approximately ${formatMeasure(millilitersToGrams(1, 1.42))} grams.`,
  },
];
