import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { calculateOzToCups, formatVolume } from './calculation';
import {
  DEFAULT_OZ_TO_CUPS_INPUT,
  ML_PER_CUP,
  ML_PER_IMPERIAL_FL_OZ,
  ML_PER_US_FL_OZ,
} from './types';

export const OZ_TO_CUPS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'oz-in-one-cup', label: 'How Many fl oz in One Cup?' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'fl-oz-to-cups', label: 'Convert Fluid Ounces to Cups' },
  { id: 'cups-to-fl-oz', label: 'Convert Cups to Fluid Ounces' },
  { id: 'example', label: 'Cooking Example' },
  { id: 'conversion-table', label: 'Conversion Chart' },
  { id: 'cup-standards', label: 'Cup Standards Differ' },
  { id: 'fl-oz-vs-oz', label: 'Fluid Ounces vs Weight Ounces' },
  { id: 'fractions', label: 'Fractional Cup Measurements' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'oz-to-cups-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  flOz: string;
  cups: string;
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

const TABLE_FLOZ = [0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 16, 20, 24, 32, 40, 64] as const;

function tableRows(): readonly ConversionTableRow[] {
  return TABLE_FLOZ.map((flOz) => {
    const r = calculateOzToCups({
      ...DEFAULT_OZ_TO_CUPS_INPUT,
      flOz,
    });
    return { flOz: formatVolume(flOz), cups: formatVolume(r.cups) };
  });
}

export const OZ_TO_CUPS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'The oz to Cups Converter changes liquid volume between fluid ounces (fl oz) and cups. It supports US and Imperial fluid ounces and US customary, US legal, metric, and Imperial cup standards.',
      'All conversions run through milliliters as a canonical volume so mixed standards stay consistent.',
    ],
  },
  {
    id: 'oz-in-one-cup',
    title: 'How Many Fluid Ounces Are in One Cup?',
    paragraphs: [
      'One US customary cup contains exactly eight US fluid ounces. One Imperial cup contains exactly ten Imperial fluid ounces.',
      'Those relationships do not mix across systems: eight Imperial fluid ounces are not one US customary cup.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the oz to Cups Converter',
    paragraphs: [
      'Enter fluid ounces or cups, choose the fluid-ounce and cup standards that match your recipe, and read the paired result. Fraction buttons fill common cooking amounts such as 1/4 or 1 1/2 cups. Expand More Conversion Options for milliliters and related kitchen volumes.',
    ],
  },
  {
    id: 'fl-oz-to-cups',
    title: 'How to Convert Fluid Ounces to Cups',
    paragraphs: [
      'For US customary units: Cups = Fluid ounces ÷ 8. Example: 24 US fl oz ÷ 8 = 3 US cups.',
      'For other standards, convert to milliliters first, then divide by milliliters per cup.',
    ],
    formula: 'Cups = (fl oz × mL per fl oz) ÷ mL per cup',
  },
  {
    id: 'cups-to-fl-oz',
    title: 'How to Convert Cups to Fluid Ounces',
    paragraphs: [
      'For US customary units: Fluid ounces = Cups × 8. Example: 2.5 US cups × 8 = 20 US fl oz.',
    ],
    formula: 'fl oz = (cups × mL per cup) ÷ mL per fl oz',
  },
  {
    id: 'example',
    title: 'An Example: Converting Liquid Ounces to Cups',
    paragraphs: [
      'A recipe needs 12 US fluid ounces of stock. Using US customary cups: 12 ÷ 8 = 1.5 cups.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Fluid Ounces to Cups Conversion Chart',
    paragraphs: [
      'The table below uses US fluid ounces and US customary cups only. Recalculate for Imperial or metric standards.',
    ],
    table: tableRows(),
    tableNote: 'US Fluid Ounces to US Customary Cups (exact: 8 US fl oz = 1 cup).',
  },
  {
    id: 'cup-standards',
    title: 'A Cup Volume Doesn’t Equal Cup Volume Everywhere',
    paragraphs: [
      `US customary cup: ${ML_PER_CUP.usCustomary} mL. US legal cup: ${ML_PER_CUP.usLegal} mL. Metric cup: ${ML_PER_CUP.metric} mL. Imperial cup: ${ML_PER_CUP.imperial} mL.`,
      `US fl oz = ${ML_PER_US_FL_OZ} mL. Imperial fl oz = ${ML_PER_IMPERIAL_FL_OZ} mL.`,
    ],
  },
  {
    id: 'fl-oz-vs-oz',
    title: 'Difference Between Fluid Ounces and Weight Ounces',
    paragraphs: [
      'Fluid ounces measure volume. Avoirdupois ounces measure mass. Converting between volume and mass requires density. Dry ingredients often weigh differently for the same cup volume, so this converter stays liquid-volume only.',
    ],
  },
  {
    id: 'fractions',
    title: 'Common Fractional Cup Measurements',
    paragraphs: [
      'Under the US customary standard: 1/8 cup = 1 US fl oz, 1/4 cup = 2 US fl oz, 1/2 cup = 4 US fl oz, 3/4 cup = 6 US fl oz, and 1 1/2 cups = 12 US fl oz.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Use the converter for cooking and baking liquids, beverages, recipe scaling, international recipe adjustments, and classroom volume practice.',
    ],
  },
];

export const OZ_TO_CUPS_FAQS: readonly FAQItem[] = [
  {
    question: 'How many fluid ounces are in one cup?',
    answer:
      'One US customary cup contains exactly eight US fluid ounces. One Imperial cup contains ten Imperial fluid ounces.',
  },
  {
    question: 'How do I convert fluid ounces to cups?',
    answer:
      'For US customary units, divide US fluid ounces by eight. For other standards, convert through milliliters.',
  },
  {
    question: 'How do I convert cups to fluid ounces?',
    answer: 'For US customary units, multiply cups by eight.',
  },
  {
    question: 'How many cups are in 1 oz?',
    answer: '1 US fl oz ÷ 8 = 0.125 US cup.',
  },
  {
    question: 'How many cups are in 2 oz?',
    answer: '2 ÷ 8 = 0.25 US cup.',
  },
  {
    question: 'How many cups are in 4 oz?',
    answer: '4 ÷ 8 = 0.5 US cup.',
  },
  {
    question: 'How many cups are in 8 oz?',
    answer: '8 ÷ 8 = 1 US cup.',
  },
  {
    question: 'How many cups are in 12 oz?',
    answer: '12 ÷ 8 = 1.5 US cups.',
  },
  {
    question: 'How many cups are in 16 oz?',
    answer: '16 ÷ 8 = 2 US cups.',
  },
  {
    question: 'How many cups are in 20 oz?',
    answer: '20 ÷ 8 = 2.5 US cups.',
  },
  {
    question: 'How many cups are in 24 oz?',
    answer: '24 ÷ 8 = 3 US cups.',
  },
  {
    question: 'How many cups are in 32 oz?',
    answer: '32 ÷ 8 = 4 US cups.',
  },
  {
    question: 'How many fluid ounces are in half a cup?',
    answer: '0.5 × 8 = 4 US fl oz (US customary).',
  },
  {
    question: 'How many fluid ounces are in 3 cups?',
    answer: '3 × 8 = 24 US fl oz (US customary).',
  },
  {
    question: 'Is 8 fluid ounces always one cup?',
    answer:
      'No. That relationship applies to US customary cups and US fluid ounces.',
  },
  {
    question: 'Is one Imperial cup equal to eight fluid ounces?',
    answer: 'No. One Imperial cup contains ten Imperial fluid ounces.',
  },
  {
    question: 'Are ounces and fluid ounces the same?',
    answer:
      'No. Ordinary ounces measure mass, while fluid ounces measure volume.',
  },
  {
    question: 'Can I convert dry ingredient ounces to cups?',
    answer:
      'Only when an appropriate ingredient-specific density or mass-to-volume measurement is known. This converter is for liquid volume.',
  },
  {
    question: 'Can I enter decimal or fractional cups?',
    answer:
      'Yes. Enter decimals or fractions such as 1/2, or use the fraction presets.',
  },
];
