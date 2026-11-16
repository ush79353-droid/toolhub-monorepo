import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { cupsToQuarts, formatVolume, quartsToCups } from './calculation';
import { LITERS_PER_QUART } from './types';

export const CUPS_TO_QUARTS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'cups-and-quarts', label: 'Cups and Quarts' },
  { id: 'how-to-use', label: 'Cups to Quarts Converter' },
  { id: 'how-to-convert', label: 'How to Convert Cups to Quarts' },
  { id: 'conversion-chart', label: 'Cups to Quarts Conversion Chart' },
  { id: 'related-volume-tools', label: 'Other Volume Conversion Tools' },
  { id: 'cups-to-quarts-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_CUPS = [0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32] as const;

export const CUPS_TO_QUARTS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'cups-and-quarts',
    title: 'Cups and Quarts',
    paragraphs: [
      'Cups and quarts are volume units used in cooking, baking, recipes, liquid measurements, kitchen conversions, and scaling ingredients across measurement systems.',
      'In matching US customary liquid units: 4 cups = 1 quart, 2 pints = 1 quart, and 4 quarts = 1 gallon. Matching UK imperial cups and imperial quarts also use 4 cups per quart.',
      'US liquid, US dry, and imperial quarts are different volumes. Always select the system that matches your recipe or equipment.',
    ],
    formula: 'US: 4 cups = 1 quart = 2 pints · 4 quarts = 1 gallon',
  },
  {
    id: 'how-to-use',
    title: 'Cups to Quarts Converter',
    paragraphs: [
      'This converter turns cup volumes into quarts and the reverse, with US customary, US legal, metric, and UK cups plus US liquid, US dry, and imperial quarts.',
      '1. Enter cups. 2. Choose the cup type. 3. Read the quart result. 4. Change the quart unit if needed. 5. Enter quarts to convert back to cups. Updates are realtime in both directions.',
      `Example: 8 US customary cups ÷ 4 = ${formatVolume(cupsToQuarts(8))} US liquid quarts.`,
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Cups to Quarts',
    paragraphs: [
      'For matching US customary cups and US liquid quarts: Quarts = Cups ÷ 4, or Quarts = Cups × 0.25.',
      `Example: 8 ÷ 4 = ${formatVolume(cupsToQuarts(8))}. Therefore 8 US customary cups equal 2 US liquid quarts.`,
      'Reverse: Cups = Quarts × 4.',
      `Example: 3 × 4 = ${formatVolume(quartsToCups(3))}. Therefore 3 US liquid quarts equal 12 US customary cups.`,
      'When systems differ, convert through liters: quarts = cups × (liters per cup) ÷ (liters per quart). Do not use ÷ 4 across mismatched units.',
    ],
    formula: 'US qt = US cups ÷ 4  ·  qt = cups × (L/cup) ÷ (L/qt)',
  },
  {
    id: 'conversion-chart',
    title: 'Cups to Quarts Conversion Chart',
    paragraphs: [
      'The table below uses US customary cups and US liquid quarts (exactly 4 cups per quart).',
    ],
    tableHeaders: ['US customary cups', 'US liquid quarts'],
    table: CHART_CUPS.map((cups) => [formatVolume(cups), formatVolume(cupsToQuarts(cups))]),
  },
  {
    id: 'related-volume-tools',
    title: 'Other Volume Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Cups to Pints Converter, Cups to Oz Converter, Cups to Gallons Converter, Volume Converter, and other kitchen volume tools. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CUPS_TO_QUARTS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 8 Cups to Quarts?',
    answer: `There are 4 US customary cups in 1 US liquid quart. 8 ÷ 4 = ${formatVolume(cupsToQuarts(8))}. Therefore 8 US customary cups equal 2 US liquid quarts.`,
  },
  {
    question: 'How Many Cups Are in 3 Quarts?',
    answer: `Each US liquid quart contains 4 US customary cups. 3 × 4 = ${formatVolume(quartsToCups(3))}. Therefore 3 US liquid quarts equal 12 US customary cups.`,
  },
  {
    question: 'Is a Cup Equal to a Quart?',
    answer:
      'No. A US customary cup is one-quarter of a US liquid quart. 1 cup = 0.25 quart in matching US customary liquid units.',
  },
  {
    question: 'How Many Cups Are in 1 Quart?',
    answer: `There are 4 US customary cups in 1 US liquid quart (${formatVolume(quartsToCups(1))} cups).`,
  },
  {
    question: 'How Many Quarts Are in 12 Cups?',
    answer: `12 ÷ 4 = ${formatVolume(cupsToQuarts(12))}. Therefore 12 US customary cups equal 3 US liquid quarts.`,
  },
  {
    question: 'Are US Quarts and Imperial Quarts the Same?',
    answer: `No. 1 US liquid quart = ${LITERS_PER_QUART.usLiquid} liters. 1 imperial quart = ${LITERS_PER_QUART.imperial} liters. The imperial quart is larger.`,
  },
];
