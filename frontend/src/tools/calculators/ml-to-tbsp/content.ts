import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatVolume,
  mlToMetricTablespoons,
  mlToUsTablespoons,
  metricTablespoonsToMl,
  usTablespoonsToMl,
  ML_PER_AU_TBSP,
  ML_PER_IMPERIAL_TBSP,
  ML_PER_METRIC_CUP,
  ML_PER_METRIC_TBSP,
  ML_PER_US_CUP,
  ML_PER_US_TBSP,
} from './calculation';

export const MLTBSP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'mL to tbsp Converter' },
  { id: 'how-to-use', label: 'How to Use the mL to tbsp Converter' },
  { id: 'how-to-convert', label: 'How Do I Convert mL to tbsp?' },
  { id: 'how-many-ml', label: 'How Many mL Are in a Tablespoon?' },
  { id: 'conversion-chart', label: 'mL to Tablespoons Conversion Chart' },
  { id: 'tbsp-to-ml', label: 'Tablespoons to Milliliters Formula' },
  { id: 'related-tools', label: 'Other Volume Conversion Calculators' },
  { id: 'mltbsp-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_ML = [1, 5, 10, 15, 20, 30, 50, 100, 250] as const;

export const MLTBSP_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'mL to tbsp Converter',
    paragraphs: [
      'Convert milliliters into tablespoons and cups in either direction. Recipe books may use US customary, metric, Australian, or traditional Imperial tablespoons — each size is different. This tool defaults to the US tablespoon and lets you switch standards explicitly.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mL to tbsp Converter',
    paragraphs: [
      '1. Enter the volume in milliliters (or another metric volume unit).',
      '2. Read the converted tablespoons instantly.',
      '3. Select a different tablespoon standard if your recipe uses metric, Australian, or Imperial tablespoons.',
      '4. Expand Equivalence in other relevant units to view cups and related cooking measures.',
      '5. Enter a value in tablespoons or cups to convert in reverse.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert mL to tbsp?',
    paragraphs: [
      `For US tablespoons: tbsp = mL ÷ ${ML_PER_US_TBSP}.`,
      `Example: 30 mL → ${formatVolume(mlToUsTablespoons(30))} US tbsp.`,
      `For metric tablespoons: metric tbsp = mL ÷ ${ML_PER_METRIC_TBSP}. So 15 mL is exactly 1 metric tablespoon, while the same 15 mL is about ${formatVolume(mlToUsTablespoons(15))} US tablespoons.`,
    ],
    formula: `US tbsp = mL / ${ML_PER_US_TBSP}\n30 mL ≈ ${formatVolume(mlToUsTablespoons(30))} US tbsp\nmetric tbsp = mL / ${ML_PER_METRIC_TBSP}`,
  },
  {
    id: 'how-many-ml',
    title: 'How Many mL Are in a Tablespoon?',
    paragraphs: [
      'Common tablespoon standards differ by country and recipe tradition. Modern UK recipes often lean on metric measures; the traditional Imperial tablespoon is listed separately so it is not confused with a metric tablespoon.',
    ],
    tableHeaders: ['Tablespoon type', 'Milliliters'],
    table: [
      ['US customary', formatVolume(ML_PER_US_TBSP)],
      ['Metric', formatVolume(ML_PER_METRIC_TBSP)],
      ['Australian', formatVolume(ML_PER_AU_TBSP)],
      ['Traditional UK Imperial', formatVolume(ML_PER_IMPERIAL_TBSP)],
    ],
  },
  {
    id: 'conversion-chart',
    title: 'mL to Tablespoons Conversion Chart',
    paragraphs: [
      'Chart values use the same conversion engine as the calculator (exact US and metric tablespoon definitions).',
    ],
    tableHeaders: ['Milliliters', 'US tbsp', 'Metric tbsp'],
    table: CHART_ML.map((ml) => [
      formatVolume(ml),
      formatVolume(mlToUsTablespoons(ml)),
      formatVolume(mlToMetricTablespoons(ml)),
    ]),
  },
  {
    id: 'tbsp-to-ml',
    title: 'Tablespoons to Milliliters Formula',
    paragraphs: [
      `For US tablespoons: mL = tbsp × ${ML_PER_US_TBSP}.`,
      `Example: 2 US tbsp → ${formatVolume(usTablespoonsToMl(2))} mL.`,
      `Two metric tablespoons → ${formatVolume(metricTablespoonsToMl(2))} mL exactly.`,
    ],
    formula: `mL = US tbsp × ${ML_PER_US_TBSP}\n2 US tbsp = ${formatVolume(usTablespoonsToMl(2))} mL`,
  },
  {
    id: 'related-tools',
    title: 'Other Volume Conversion Calculators',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Conversion, mL to oz Converter, mL to cc Converter, mg to Teaspoon Converter, mL to Cups Converter, Liters to Gallons Converter, and Cubic Inches to Gallons Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MLTBSP_FAQS: readonly FAQItem[] = [
  {
    question: 'How Do I Convert 1 mL to tbsp?',
    answer: `One milliliter equals approximately ${formatVolume(mlToUsTablespoons(1))} US tablespoons. For metric tablespoons, 1 mL equals approximately ${formatVolume(mlToMetricTablespoons(1))} tablespoons.`,
  },
  {
    question: 'How Many mL Are in 1 tbsp?',
    answer: `One US tablespoon contains ${ML_PER_US_TBSP} mL. One metric tablespoon contains exactly ${ML_PER_METRIC_TBSP} mL. An Australian tablespoon contains ${ML_PER_AU_TBSP} mL.`,
  },
  {
    question: 'Is 15 mL Equal to 1 Tablespoon?',
    answer: `Yes, when using a metric tablespoon. A US tablespoon is slightly smaller at ${ML_PER_US_TBSP} mL.`,
  },
  {
    question: 'How Many Tablespoons Are in 30 mL?',
    answer: `Thirty milliliters equal approximately ${formatVolume(mlToUsTablespoons(30))} US tablespoons or exactly ${formatVolume(mlToMetricTablespoons(30))} metric tablespoons.`,
  },
  {
    question: 'How Many Tablespoons Are in 100 mL?',
    answer: `One hundred milliliters equal approximately ${formatVolume(mlToUsTablespoons(100))} US tablespoons or ${formatVolume(mlToMetricTablespoons(100))} metric tablespoons.`,
  },
  {
    question: 'How Many mL Are in 2 Tablespoons?',
    answer: `Two US tablespoons equal ${formatVolume(usTablespoonsToMl(2))} mL. Two metric tablespoons equal exactly ${formatVolume(metricTablespoonsToMl(2))} mL.`,
  },
  {
    question: 'How Many Tablespoons Are in One Cup?',
    answer: `One US customary cup (${ML_PER_US_CUP} mL) contains 16 US customary tablespoons. A ${ML_PER_METRIC_CUP} mL metric cup contains ${formatVolume(ML_PER_METRIC_CUP / ML_PER_METRIC_TBSP)} metric tablespoons.`,
  },
  {
    question: 'Are All Tablespoons the Same Size?',
    answer:
      'No. Tablespoons can differ between US customary, metric, Australian, and traditional Imperial measurement systems. Always match the standard your recipe expects.',
  },
];
