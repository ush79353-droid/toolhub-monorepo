import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { cupsToGallons, formatVolume, gallonsToCups } from './calculation';
import { LITERS_PER_CUP, LITERS_PER_GALLON, LITERS_PER_US_GALLON } from './types';

export const CUPS_TO_GAL_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'convert-cups-to-gallons', label: 'How to Convert Cups to Gallons' },
  { id: 'convert-gallons-to-cups', label: 'How to Convert Gallons to Cups' },
  { id: 'cup-systems', label: 'US Cups vs Metric and Imperial Cups' },
  { id: 'conversion-chart', label: 'Cups to Gallons Conversion Chart' },
  { id: 'related-volume-tools', label: 'Other Related Volume Converters' },
  { id: 'cups-to-gal-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_CUPS = [1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 64] as const;

export const CUPS_TO_GAL_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'convert-cups-to-gallons',
    title: 'How to Convert Cups to Gallons',
    paragraphs: [
      'This converter turns cup volumes into gallons (and the reverse) while letting you choose US customary, US legal, metric, or UK imperial cups, plus US liquid or UK imperial gallons.',
      'Practical uses include cooking, baking, recipe scaling, beverage preparation, kitchen measurements, household liquids, and food-service catering.',
      'For matching US customary cups and US liquid gallons: 1 US gallon = 16 US customary cups, so Gallons = Cups ÷ 16.',
      `Example: 20 US customary cups ÷ 16 = ${formatVolume(cupsToGallons(20))} US liquid gallons.`,
      'When cup and gallon systems differ, convert through liters: Gallons = Cups × (liters per cup) ÷ (liters per gallon).',
    ],
    formula: 'US gal = US cups ÷ 16  ·  gal = cups × (L/cup) ÷ (L/gal)',
  },
  {
    id: 'convert-gallons-to-cups',
    title: 'How to Convert Gallons to Cups',
    paragraphs: [
      'For US customary cups and US liquid gallons: Cups = Gallons × 16.',
      `Example: 2.5 US liquid gallons × 16 = ${formatVolume(gallonsToCups(2.5))} US customary cups.`,
      `Half a US gallon: 0.5 × 16 = ${formatVolume(gallonsToCups(0.5))} US customary cups.`,
      'Enter gallons directly in the calculator; cups and optional volume units update instantly.',
    ],
    formula: 'US cups = US gal × 16  ·  cups = gal × (L/gal) ÷ (L/cup)',
  },
  {
    id: 'cup-systems',
    title: 'US Cups vs Metric and Imperial Cups',
    paragraphs: [
      'Cup definitions differ by region and standard. Always confirm which cup and gallon your recipe or specification uses.',
      'US customary cup ≈ 236.588 mL (8 US fl oz). US legal cup = 240 mL. Metric cup = 250 mL. UK imperial cup = 284.130625 mL (10 imperial fl oz).',
      `US liquid gallon = ${LITERS_PER_US_GALLON} L. UK imperial gallon = ${LITERS_PER_GALLON.ukImperial} L. The UK gallon is larger.`,
      `Cross-system example: 16 US customary cups ≈ ${formatVolume(cupsToGallons(16, 'usCustomary', 'ukImperial'))} UK imperial gallons.`,
    ],
    formula: `US cup ${LITERS_PER_CUP.usCustomary} L · legal ${LITERS_PER_CUP.usLegal} L · metric ${LITERS_PER_CUP.metric} L · UK ${LITERS_PER_CUP.imperial} L`,
    tableHeaders: ['Cup type', 'Liters'],
    table: [
      ['US customary cup', formatVolume(LITERS_PER_CUP.usCustomary)],
      ['US legal cup', formatVolume(LITERS_PER_CUP.usLegal)],
      ['Metric cup', formatVolume(LITERS_PER_CUP.metric)],
      ['UK imperial cup', formatVolume(LITERS_PER_CUP.imperial)],
    ],
  },
  {
    id: 'conversion-chart',
    title: 'Cups to Gallons Conversion Chart',
    paragraphs: [
      'The table below uses US customary cups and US liquid gallons (exactly 16 cups per gallon).',
    ],
    tableHeaders: ['US cups', 'US gallons'],
    table: CHART_CUPS.map((cups) => [
      formatVolume(cups),
      formatVolume(cupsToGallons(cups)),
    ]),
  },
  {
    id: 'related-volume-tools',
    title: 'Other Related Volume Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Converter, Liters to Gallons Converter, Cubic Inches to Gallons Converter, Cups to Pints tools, and other kitchen or volume converters. Only active catalog tools appear as live links in the related-tools rail.',
    ],
  },
];

export const CUPS_TO_GAL_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Cups Are in One Gallon?',
    answer:
      'There are 16 US customary cups in one US liquid gallon. Other cup and gallon systems use different relationships.',
  },
  {
    question: 'How Many Gallons Are in 12 Cups?',
    answer: `Using US customary cups and US liquid gallons: 12 ÷ 16 = ${formatVolume(cupsToGallons(12))}. Therefore 12 cups equal 0.75 gallons.`,
  },
  {
    question: 'How Many Cups Are in Half a Gallon?',
    answer: `Using US customary measurements: 0.5 × 16 = ${formatVolume(gallonsToCups(0.5))}. Half a US liquid gallon equals 8 US customary cups.`,
  },
  {
    question: 'How Do I Convert 16 Cups to Gallons?',
    answer: `Divide US customary cups by 16: 16 ÷ 16 = ${formatVolume(cupsToGallons(16))}. Therefore 16 US customary cups equal 1 US liquid gallon.`,
  },
  {
    question: 'Is a Metric Cup the Same as a US Cup?',
    answer: `No. A metric cup equals 250 mL (${LITERS_PER_CUP.metric} L), while a US customary cup equals approximately 236.588 mL (${LITERS_PER_CUP.usCustomary} L).`,
  },
  {
    question: 'Are US and UK Gallons the Same?',
    answer: `No. A US liquid gallon equals ${LITERS_PER_US_GALLON} liters, while a UK imperial gallon equals ${LITERS_PER_GALLON.ukImperial} liters. The UK gallon is larger.`,
  },
];
