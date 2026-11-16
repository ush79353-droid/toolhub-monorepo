import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { cupsToPints, formatVolume, pintsToCups } from './calculation';
import { LITERS_PER_CUP, LITERS_PER_PINT } from './types';

export const CUPS_TO_PINTS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'cups-and-pints', label: 'Cups and Pints' },
  { id: 'how-to-use', label: 'Cups to Pints Converter' },
  { id: 'how-to-convert', label: 'How to Convert Cups to Pints' },
  { id: 'conversion-chart', label: 'Cups to Pints Conversion Chart' },
  { id: 'related-volume-tools', label: 'Other Volume Conversion Tools' },
  { id: 'cups-to-pints-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_CUPS = [0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 9, 10, 12, 16] as const;

export const CUPS_TO_PINTS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'cups-and-pints',
    title: 'Cups and Pints',
    paragraphs: [
      'Cups and pints are volume units used in cooking, baking, recipes, liquid measurement, food preparation, and scaling ingredient quantities.',
      'In matching US customary liquid units: 1 cup = ½ pint, so 2 cups = 1 pint, 2 pints = 1 quart, and 4 quarts = 1 gallon. The same 2-cups-per-pint relationship holds for matching UK imperial cups and imperial pints.',
      'US liquid, US dry, and UK imperial pints are different volumes. Always select the measurement system that matches your recipe or equipment.',
    ],
    formula: 'US: 2 cups = 1 pint = ½ quart · 4 quarts = 1 gallon',
  },
  {
    id: 'how-to-use',
    title: 'Cups to Pints Converter',
    paragraphs: [
      'This converter turns cup volumes into pints and the reverse, with US customary, US legal, metric, and UK cups plus US liquid, US dry, and imperial pints.',
      '1. Enter cups. 2. Choose the cup type. 3. Read the pint result. 4. Change the pint unit if needed. 5. Enter pints to convert back to cups. Updates are realtime in both directions.',
      `Example: 3 US customary cups ÷ 2 = ${formatVolume(cupsToPints(3))} US liquid pints.`,
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Cups to Pints',
    paragraphs: [
      'For matching US customary cups and US liquid pints: Pints = Cups × 0.5, or Pints = Cups ÷ 2.',
      `Example: 3 × 0.5 = ${formatVolume(cupsToPints(3))}. Therefore 3 US customary cups equal 1.5 US liquid pints.`,
      'Reverse: Cups = Pints × 2.',
      `Example: 4 × 2 = ${formatVolume(pintsToCups(4))}. Therefore 4 US liquid pints equal 8 US customary cups.`,
      'When systems differ, convert through liters: pints = cups × (liters per cup) ÷ (liters per pint). Do not use ÷ 2 across mismatched units.',
    ],
    formula: 'US pt = US cups ÷ 2  ·  pt = cups × (L/cup) ÷ (L/pt)',
  },
  {
    id: 'conversion-chart',
    title: 'Cups to Pints Conversion Chart',
    paragraphs: [
      'The table below uses US customary cups and US liquid pints (exactly 2 cups per pint).',
    ],
    tableHeaders: ['US customary cups', 'US liquid pints'],
    table: CHART_CUPS.map((cups) => [formatVolume(cups), formatVolume(cupsToPints(cups))]),
  },
  {
    id: 'related-volume-tools',
    title: 'Other Volume Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Cups to Oz Converter, Cups to Gallons Converter, Volume Converter, and other kitchen volume tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CUPS_TO_PINTS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Cups Are in a Pint?',
    answer:
      'There are 2 US customary cups in 1 US liquid pint. 1 pint = 2 cups in matching US customary liquid units.',
  },
  {
    question: 'Are Cups and Pints the Same Quantity?',
    answer:
      'No. Cups and pints both measure volume, but they differ in size. In US customary liquid measurements, 2 cups = 1 pint, so one US customary cup is half a US liquid pint.',
  },
  {
    question: 'How Many Pints Are 9 Cups?',
    answer: `Using US customary measurements: 9 ÷ 2 = ${formatVolume(cupsToPints(9))}. Therefore 9 cups equal 4.5 pints.`,
  },
  {
    question: 'How Many Cups Are in 4 Pints?',
    answer: `4 × 2 = ${formatVolume(pintsToCups(4))}. Therefore 4 US liquid pints equal 8 US customary cups.`,
  },
  {
    question: 'How Many Pints Are in 6 Cups?',
    answer: `6 ÷ 2 = ${formatVolume(cupsToPints(6))}. Therefore 6 US customary cups equal 3 US liquid pints.`,
  },
  {
    question: 'Is a UK Pint the Same as a US Pint?',
    answer: `No. A UK imperial pint contains approximately 568.261 mL (${LITERS_PER_PINT.imperial} L). A US liquid pint contains approximately 473.176 mL (${LITERS_PER_PINT.usLiquid} L). Select the correct system; a US customary cup is ${LITERS_PER_CUP.usCustomary} L.`,
  },
];
