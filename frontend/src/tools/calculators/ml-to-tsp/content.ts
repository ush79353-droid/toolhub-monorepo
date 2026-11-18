import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatVolume,
  mlToMetricTeaspoons,
  mlToUsTeaspoons,
  metricTeaspoonsToMl,
  usTeaspoonsToMl,
  ML_PER_IMPERIAL_TSP,
  ML_PER_METRIC_TSP,
  ML_PER_US_TSP,
} from './calculation';

export const MLTSP_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'mL to tsp Converter' },
  { id: 'how-to-use', label: 'How to Use the mL to tsp Converter' },
  { id: 'how-to-convert', label: 'How Do I Convert mL to tsp?' },
  { id: 'conversion-table', label: 'mL to tsp Conversion Table' },
  { id: 'us-vs-metric', label: 'US Teaspoons vs Metric Teaspoons' },
  { id: 'related-tools', label: 'Other Volume Conversion Tools' },
  { id: 'mltsp-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const CHART_ML = [0.625, 1, 1.25, 2.5, 3.75, 5, 10, 15, 20, 25, 30, 40] as const;

export const MLTSP_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'mL to tsp Converter',
    paragraphs: [
      'Convert milliliters into teaspoons and teaspoons back into milliliters. US customary teaspoons are not exactly 5 mL — that exact relationship belongs to the metric teaspoon. This tool defaults to the US customary teaspoon and also supports metric and traditional Imperial teaspoons.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mL to tsp Converter',
    paragraphs: [
      '1. Enter a value in the milliliters field.',
      '2. Read the equivalent teaspoons instantly.',
      '3. Switch between US, metric, or traditional Imperial teaspoons if needed.',
      '4. Edit the teaspoons field to convert in reverse.',
      '5. Use Clear or Reload to restore the empty default state.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert mL to tsp?',
    paragraphs: [
      `For US customary teaspoons: tsp = mL ÷ ${ML_PER_US_TSP}.`,
      `Example: 10 mL → ${formatVolume(mlToUsTeaspoons(10))} US tsp.`,
      `For metric teaspoons: metric tsp = mL ÷ ${ML_PER_METRIC_TSP}. So 5 mL is exactly 1 metric teaspoon, while the same 5 mL is about ${formatVolume(mlToUsTeaspoons(5))} US teaspoons.`,
    ],
    formula: `US tsp = mL / ${ML_PER_US_TSP}\n10 mL ≈ ${formatVolume(mlToUsTeaspoons(10))} US tsp\nmetric tsp = mL / ${ML_PER_METRIC_TSP}`,
  },
  {
    id: 'conversion-table',
    title: 'mL to tsp Conversion Table',
    paragraphs: [
      'Values below use the US customary teaspoon definition from the same conversion engine as the calculator. For the exact 5 mL-per-teaspoon relationship, use the metric teaspoon standard.',
    ],
    tableHeaders: ['Milliliters (mL)', 'US Teaspoons (tsp)'],
    table: CHART_ML.map((ml) => [formatVolume(ml), formatVolume(mlToUsTeaspoons(ml))]),
  },
  {
    id: 'us-vs-metric',
    title: 'US Teaspoons vs Metric Teaspoons',
    paragraphs: [
      `A US customary teaspoon is exactly ${ML_PER_US_TSP} mL (US liquid gallon ÷ 768). A metric teaspoon is exactly ${ML_PER_METRIC_TSP} mL. A traditional Imperial teaspoon is approximately ${ML_PER_IMPERIAL_TSP} mL (imperial gallon ÷ 768).`,
      'In cooking, packages and recipes sometimes round a teaspoon to 5 mL. That shortcut matches the metric teaspoon, not the precise US customary definition used here by default.',
    ],
    tableHeaders: ['Teaspoon type', 'Milliliters'],
    table: [
      ['US customary', formatVolume(ML_PER_US_TSP)],
      ['Metric', formatVolume(ML_PER_METRIC_TSP)],
      ['Traditional Imperial', formatVolume(ML_PER_IMPERIAL_TSP)],
    ],
  },
  {
    id: 'related-tools',
    title: 'Other Volume Conversion Tools',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Conversion, mL to tbsp Converter, mL to oz Converter, mL to cc Converter, mL to Cups Converter, Liters to Gallons Converter, and Cubic Inches to Gallons Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const MLTSP_FAQS: readonly FAQItem[] = [
  {
    question: 'How Much Is 40 mL in Teaspoons?',
    answer: `40 mL equals approximately ${formatVolume(mlToUsTeaspoons(40))} US customary teaspoons. In metric teaspoons, 40 mL equals exactly ${formatVolume(mlToMetricTeaspoons(40))} teaspoons.`,
  },
  {
    question: 'How Do I Convert 10 mL to tsp?',
    answer: `Divide milliliters by ${ML_PER_US_TSP} for US teaspoons: 10 ÷ ${ML_PER_US_TSP} ≈ ${formatVolume(mlToUsTeaspoons(10))}. So 10 mL is approximately ${formatVolume(mlToUsTeaspoons(10))} US teaspoons.`,
  },
  {
    question: 'How Many mL Are Equal to 1/4 tsp?',
    answer: `One-quarter of a US customary teaspoon equals approximately ${formatVolume(usTeaspoonsToMl(0.25))} mL. One-quarter of a metric teaspoon equals exactly ${formatVolume(metricTeaspoonsToMl(0.25))} mL.`,
  },
  {
    question: 'How Many Teaspoons Are in 5 mL?',
    answer: `5 mL is exactly 1 metric teaspoon. It is approximately ${formatVolume(mlToUsTeaspoons(5))} US customary teaspoons.`,
  },
  {
    question: 'Is 1 Teaspoon Exactly 5 mL?',
    answer: `A metric teaspoon is exactly ${ML_PER_METRIC_TSP} mL. A US customary teaspoon is slightly smaller at ${ML_PER_US_TSP} mL.`,
  },
  {
    question: 'How Many Teaspoons Are in 15 mL?',
    answer: `15 mL equals ${formatVolume(mlToMetricTeaspoons(15))} metric teaspoons, or approximately ${formatVolume(mlToUsTeaspoons(15))} US teaspoons.`,
  },
  {
    question: 'What Is the Formula for Teaspoons to Milliliters?',
    answer: `For US customary teaspoons: mL = tsp × ${ML_PER_US_TSP}. For metric teaspoons: mL = tsp × ${ML_PER_METRIC_TSP}.`,
  },
];
