import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { cupsToPints, formatVolume, pintsToCups } from './calculation';
import {
  CUPS_PER_US_PINT,
  LITERS_PER_CUP,
  LITERS_PER_PINT,
  ML_PER_IMP_CUP,
  ML_PER_IMP_PINT,
  ML_PER_US_CUP,
  ML_PER_US_PINT,
} from './types';

export const PINTS_TO_CUPS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Pints to Cups Converter' },
  { id: 'what-are', label: 'What Are Pints and Cups?' },
  { id: 'how-to-convert', label: 'How to Convert Pints to Cups' },
  { id: 'conversion-table', label: 'Pints to Cups Conversion Table' },
  { id: 'how-to-use', label: 'How to Use the Pints to Cups Converter' },
  { id: 'related-volume-tools', label: 'Other Volume Conversion Tools' },
  { id: 'pints-to-cups-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_PINTS = [0.125, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 8, 10] as const;

export const PINTS_TO_CUPS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Pints to Cups Converter',
    paragraphs: [
      'Convert liquid volume between pints and cups instantly. Useful for cooking, baking, food preparation, recipe scaling, beverage measurement, and kitchen conversions.',
      'The default calculator uses US customary liquid measurements: 1 US liquid pint = 2 US customary cups. Select UK imperial or other cup definitions when a recipe specifies them.',
    ],
  },
  {
    id: 'what-are',
    title: 'What Are Pints and Cups?',
    paragraphs: [
      `A US liquid pint equals exactly ${ML_PER_US_PINT} mL, which is also ${CUPS_PER_US_PINT} US customary cups.`,
      `A US customary cup equals exactly ${ML_PER_US_CUP} mL — half a US liquid pint.`,
      `An Imperial (UK) pint is about ${ML_PER_IMP_PINT} mL, and an Imperial cup is about ${ML_PER_IMP_CUP} mL. Matching UK cups with imperial pints also gives 2 cups per pint, but those volumes are larger than US liquid units.`,
      'US liquid, US dry, and UK imperial pints are different volumes. Always choose the measurement system that matches your recipe or equipment.',
    ],
    formula: `1 US pt = ${ML_PER_US_PINT} mL = ${CUPS_PER_US_PINT} US cups\n1 US cup = ${ML_PER_US_CUP} mL`,
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Pints to Cups',
    paragraphs: [
      `For matching US customary cups and US liquid pints: cups = pints × ${CUPS_PER_US_PINT}.`,
      `Example 1 — convert 3 pints: 3 × ${CUPS_PER_US_PINT} = ${formatVolume(pintsToCups(3))} cups.`,
      `Example 2 — convert 1.5 pints: 1.5 × ${CUPS_PER_US_PINT} = ${formatVolume(pintsToCups(1.5))} cups.`,
      `Reverse: pints = cups ÷ ${CUPS_PER_US_PINT}. Example: 5 ÷ ${CUPS_PER_US_PINT} = ${formatVolume(cupsToPints(5))} pints.`,
      'When systems differ, convert through liters: cups = pints × (liters per pint) ÷ (liters per cup). Do not use ×2 across mismatched units.',
    ],
    formula: `US cups = US pt × ${CUPS_PER_US_PINT}  ·  cups = pt × (L/pt) ÷ (L/cup)`,
  },
  {
    id: 'conversion-table',
    title: 'Pints to Cups Conversion Table',
    paragraphs: [
      'The table below uses US liquid pints and US customary cups (exactly 2 cups per pint).',
    ],
    tableHeaders: ['US Pints', 'US Cups'],
    table: CHART_PINTS.map((pints) => [formatVolume(pints), formatVolume(pintsToCups(pints))]),
  },
  {
    id: 'how-to-use',
    title: 'How to Use the Pints to Cups Converter',
    paragraphs: [
      '1. Enter the number of pints.',
      '2. Read the calculated equivalent in cups.',
      '3. Alternatively, enter the number of cups.',
      '4. Read the equivalent number of pints.',
      '5. Use the unit selectors when US customary is not the correct system.',
      '6. Use Share, Reload, or Clear as needed.',
      'Both conversion directions update automatically — no separate Calculate button is required.',
    ],
  },
  {
    id: 'related-volume-tools',
    title: 'Other Volume Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Converter, Cups to Pints Converter, Gallons to Pints Converter, Gallons to Cups Converter, Cups to Quarts Converter, Cups to Liters Converter, and Milliliters to Cups Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const PINTS_TO_CUPS_FAQS: readonly FAQItem[] = [
  {
    question: 'How Many Cups Is 1 Pint?',
    answer: `One US liquid pint equals ${CUPS_PER_US_PINT} US customary cups.`,
  },
  {
    question: 'How Do I Convert Half a Pint to Cups?',
    answer: `Multiply 0.5 by ${CUPS_PER_US_PINT}: 0.5 × ${CUPS_PER_US_PINT} = ${formatVolume(pintsToCups(0.5))}. Half a US pint equals one US cup.`,
  },
  {
    question: 'How Many Cups Are in a Pint?',
    answer:
      'There are two US customary cups in one US liquid pint.',
  },
  {
    question: 'How Many Cups Are in 3 Pints?',
    answer: `Three US pints equal ${formatVolume(pintsToCups(3))} US cups (3 × ${CUPS_PER_US_PINT} = ${formatVolume(pintsToCups(3))}).`,
  },
  {
    question: 'How Many Pints Are in 8 Cups?',
    answer: `Eight US customary cups equal ${formatVolume(cupsToPints(8))} US liquid pints (8 ÷ ${CUPS_PER_US_PINT} = ${formatVolume(cupsToPints(8))}).`,
  },
  {
    question: 'Are US Pints and Imperial Pints the Same?',
    answer: `No. A US liquid pint is approximately ${ML_PER_US_PINT} mL (${LITERS_PER_PINT.usLiquid} L), while an Imperial pint is approximately ${ML_PER_IMP_PINT} mL (${LITERS_PER_PINT.imperial} L). A US customary cup is ${LITERS_PER_CUP.usCustomary} L. Select the correct system in the calculator.`,
  },
  {
    question: 'Can I Use This Converter for Cooking Recipes?',
    answer:
      'Yes, provided the recipe’s pint and cup definitions match the selected measurement system.',
  },
];
