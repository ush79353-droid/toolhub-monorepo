import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { cupsToFluidOunces, fluidOuncesToCups, formatVolume } from './calculation';
import { LITERS_PER_CUP, LITERS_PER_FLUID_OUNCE } from './types';

export const CUPS_TO_OZ_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-use', label: 'Cups to Oz Converter' },
  { id: 'how-to-convert', label: 'How to Convert Cups to Oz?' },
  { id: 'conversion-chart', label: 'Cups to Fluid Ounces Conversion Chart' },
  { id: 'fluid-vs-weight', label: 'Fluid Ounces vs Weight Ounces' },
  { id: 'related-volume-tools', label: 'Other Volume Converters' },
  { id: 'cups-to-oz-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_CUPS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 8, 10] as const;

export const CUPS_TO_OZ_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-use',
    title: 'Cups to Oz Converter',
    paragraphs: [
      'This converter turns cup volumes into fluid ounces (and the reverse). Cups measure volume; the “oz” results here are fluid ounces of volume; not ounces of weight.',
      'Choose US customary, US legal, metric, or UK imperial cups, and US or UK imperial fluid ounces. Practical uses include cooking, baking, food preparation, beverage measurement, and recipe scaling.',
      '1. Enter a volume in cups. 2. Choose the cup system. 3. Read the fluid-ounce result. 4. Switch fluid-ounce units if needed. 5. Enter fluid ounces to convert back to cups.',
      `Example: 3 US customary cups × 8 = ${formatVolume(cupsToFluidOunces(3))} US fluid ounces.`,
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Cups to Oz?',
    paragraphs: [
      'For matching US customary cups and US fluid ounces: Fluid Ounces = Cups × 8.',
      `Example: 3 × 8 = ${formatVolume(cupsToFluidOunces(3))}. Therefore 3 US cups equal 24 US fluid ounces.`,
      'Reverse: Cups = Fluid Ounces ÷ 8.',
      `Example: 32 ÷ 8 = ${formatVolume(fluidOuncesToCups(32))}. Therefore 32 US fluid ounces equal 4 US cups.`,
      'When systems differ, convert through liters: fl oz = cups × (liters per cup) ÷ (liters per fluid ounce).',
    ],
    formula: 'US fl oz = US cups × 8  ·  fl oz = cups × (L/cup) ÷ (L/fl oz)',
  },
  {
    id: 'conversion-chart',
    title: 'Cups to Fluid Ounces Conversion Chart',
    paragraphs: [
      'The table below uses US customary cups and US fluid ounces (exactly 8 fl oz per cup).',
    ],
    tableHeaders: ['US cups', 'US fluid ounces'],
    table: CHART_CUPS.map((cups) => [
      formatVolume(cups),
      formatVolume(cupsToFluidOunces(cups)),
    ]),
  },
  {
    id: 'fluid-vs-weight',
    title: 'Fluid Ounces vs Weight Ounces',
    paragraphs: [
      'Fluid ounces measure volume. Ounces of weight (avoirdupois ounces) measure mass. Cups are a volume unit, so this calculator returns fluid ounces.',
      'Converting cups to weight ounces requires the ingredient density. One cup of water and one cup of flour have the same volume but different masses.',
      'Do not assume that 1 fluid ounce always weighs 1 ounce. That approximation is only roughly true for water near room temperature and is not a general cooking rule.',
    ],
    formula: 'Volume (fl oz) ≠ Mass (oz) without density',
  },
  {
    id: 'related-volume-tools',
    title: 'Other Volume Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Cups to Gallons Converter, Volume Converter, cc to oz Converter, mL to Cups tools, and other kitchen volume converters. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CUPS_TO_OZ_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Cups Are There in 62 Oz?',
    answer: `Using US fluid ounces and US customary cups: 62 ÷ 8 = ${formatVolume(fluidOuncesToCups(62))}. Therefore 62 US fluid ounces equal 7.75 US cups.`,
  },
  {
    question: 'How Do I Convert 3 Cups to Ounces?',
    answer: `Using US customary measurements: 3 × 8 = ${formatVolume(cupsToFluidOunces(3))}. Therefore 3 US cups equal 24 US fluid ounces.`,
  },
  {
    question: 'Are There 16 Ounces in a Cup?',
    answer:
      'No. A US customary cup contains 8 US fluid ounces. 16 US fluid ounces equal 2 US customary cups.',
  },
  {
    question: 'How Many Fluid Ounces Are in Half a Cup?',
    answer: `0.5 × 8 = ${formatVolume(cupsToFluidOunces(0.5))}. Half a US customary cup contains 4 US fluid ounces.`,
  },
  {
    question: 'Is a US Cup the Same as a Metric Cup?',
    answer: `No. A US customary cup contains approximately 236.588 mL (${LITERS_PER_CUP.usCustomary} L), while a metric cup contains 250 mL (${LITERS_PER_CUP.metric} L).`,
  },
  {
    question: 'Are Fluid Ounces the Same as Weight Ounces?',
    answer: `No. Fluid ounces measure volume (${LITERS_PER_FLUID_OUNCE.usFlOz} L per US fl oz), whereas ounces of weight measure mass. Density is required to convert between volume and mass.`,
  },
];
