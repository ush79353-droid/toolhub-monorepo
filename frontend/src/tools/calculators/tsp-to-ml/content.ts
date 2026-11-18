import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  formatVolume,
  mlToTeaspoons,
  teaspoonsToMl,
  ML_PER_METRIC_TSP,
  ML_PER_METRIC_TBSP,
  ML_PER_US_TSP,
} from './calculation';

export const TSPML_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'tsp to mL Converter' },
  { id: 'how-to-use', label: 'How to Use the tsp to mL Converter' },
  { id: 'how-to-convert', label: 'How Do I Convert tsp to mL?' },
  { id: 'conversion-chart', label: 'tsp to mL Conversion Chart' },
  { id: 'same-units', label: 'Are Teaspoons and Milliliters the Same?' },
  { id: 'related-tools', label: 'More Volume Converters' },
  { id: 'tspml-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

/** Metric teaspoon chart values from the reference screenshot. */
const METRIC_TSP_CHART = [
  1 / 8,
  1 / 5,
  1 / 4,
  1 / 2,
  3 / 4,
  1,
  2,
  3,
  4,
  5,
  6,
  8,
] as const;

const CHART_LABELS: Record<number, string> = {
  [1 / 8]: '⅛',
  [1 / 5]: '⅕',
  [1 / 4]: '¼',
  [1 / 2]: '½',
  [3 / 4]: '¾',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  8: '8',
};

export const TSPML_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'tsp to mL Converter',
    paragraphs: [
      'Convert teaspoons to milliliters and milliliters to teaspoons for cooking, baking, beverage prep, and recipe scaling. Both units measure volume, so this conversion does not depend on ingredient density. The calculator defaults to the metric teaspoon (5 mL) used by many cooking charts, and also supports the slightly smaller US customary teaspoon.',
    ],
  },
  {
    id: 'how-to-use',
    title: 'How to Use the tsp to mL Converter',
    paragraphs: [
      '1. Enter a teaspoon value (or leave teaspoons empty and type milliliters instead).',
      '2. Read the converted milliliters instantly.',
      '3. Switch between metric and US customary teaspoons if your recipe uses a different standard.',
      '4. Use Other related units to view the same volume in cubic centimeters (cc), liters, fluid ounces, cups, or tablespoons.',
      '5. Share, reload, or clear the calculator as needed.',
    ],
  },
  {
    id: 'how-to-convert',
    title: 'How Do I Convert tsp to mL?',
    paragraphs: [
      `Under the metric teaspoon convention: 1 tsp = ${ML_PER_METRIC_TSP} mL, so mL = tsp × ${ML_PER_METRIC_TSP}.`,
      `Examples: 1 tsp = ${formatVolume(teaspoonsToMl(1))} mL · 2 tsp = ${formatVolume(teaspoonsToMl(2))} mL · 3 tsp = ${formatVolume(teaspoonsToMl(3))} mL · 4 tsp = ${formatVolume(teaspoonsToMl(4))} mL.`,
      `A US customary teaspoon is ${ML_PER_US_TSP} mL, so 1 US tsp ≈ ${formatVolume(teaspoonsToMl(1, 'us_customary'))} mL. The US nutrition-label teaspoon is defined as ${ML_PER_METRIC_TSP} mL (same as metric).`,
    ],
    formula: `Metric: mL = tsp × ${ML_PER_METRIC_TSP}\nUS customary: mL = tsp × ${ML_PER_US_TSP}\n2 metric tsp = ${formatVolume(teaspoonsToMl(2))} mL`,
  },
  {
    id: 'conversion-chart',
    title: 'tsp to mL Conversion Chart',
    paragraphs: [
      'This table uses the metric teaspoon, where 1 tsp equals 5 mL. US customary teaspoon values differ slightly.',
      'These measures appear in cooking, baking, beverage preparation, recipe scaling, and household liquid measurements. A household spoon is not always an accurate measuring teaspoon.',
    ],
    tableHeaders: ['Teaspoons (tsp)', 'Milliliters (mL)'],
    table: METRIC_TSP_CHART.map((tsp) => [
      CHART_LABELS[tsp] ?? formatVolume(tsp),
      formatVolume(teaspoonsToMl(tsp, 'metric')),
    ]),
  },
  {
    id: 'same-units',
    title: 'Are Teaspoons and Milliliters the Same?',
    paragraphs: [
      'No. Both measure volume, but they use different unit sizes. A milliliter is a metric SI-derived volume; a teaspoon is a cooking measure whose exact milliliter size depends on the standard.',
      `Metric teaspoon and US nutrition-label teaspoon: ${ML_PER_METRIC_TSP} mL. US customary teaspoon: ${ML_PER_US_TSP} mL.`,
      `Under the common metric cooking convention, 1 tbsp = ${ML_PER_METRIC_TBSP} mL = 3 tsp. Some regional tablespoon definitions differ.`,
    ],
  },
  {
    id: 'related-tools',
    title: 'More Volume Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Conversion, Tbsp to mL Converter, mL to tsp Converter, mL to oz Converter, mL to Cups Converter, Liters to Centiliters Converter, Cups to Gallons Converter, Gallons to Cups Converter, and Grams in mL Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const TSPML_FAQS: readonly FAQItem[] = [
  {
    question: 'How Much Are 2 Teaspoons in mL?',
    answer: `Using metric teaspoons: 2 × ${ML_PER_METRIC_TSP} = ${formatVolume(teaspoonsToMl(2))} mL. Therefore 2 metric teaspoons = ${formatVolume(teaspoonsToMl(2))} mL.`,
  },
  {
    question: 'How Much Is 1 tsp in mL?',
    answer: `One metric teaspoon is ${ML_PER_METRIC_TSP} mL. One US customary teaspoon is approximately ${formatVolume(teaspoonsToMl(1, 'us_customary'))} mL.`,
  },
  {
    question: 'Is ½ tsp Equal to 2.5 mL?',
    answer: `Yes, under the metric teaspoon convention: 0.5 × ${ML_PER_METRIC_TSP} = ${formatVolume(teaspoonsToMl(0.5))} mL.`,
  },
  {
    question: 'How Many Teaspoons Are in 15 mL?',
    answer: `Using metric teaspoons: 15 ÷ ${ML_PER_METRIC_TSP} = ${formatVolume(mlToTeaspoons(15))}. Therefore 15 mL = ${formatVolume(mlToTeaspoons(15))} metric teaspoons.`,
  },
  {
    question: 'Is a Teaspoon Always 5 mL?',
    answer: `No. A metric teaspoon (and the US nutrition-label teaspoon) is ${ML_PER_METRIC_TSP} mL, while a US customary teaspoon is approximately ${formatVolume(ML_PER_US_TSP)} mL.`,
  },
  {
    question: 'What Is the Difference Between tsp and tbsp?',
    answer: `A teaspoon is smaller than a tablespoon. Under the common metric cooking convention, 1 tsp = ${ML_PER_METRIC_TSP} mL, 1 tbsp = ${ML_PER_METRIC_TBSP} mL, and 1 tbsp = 3 tsp. Some regional tablespoon definitions differ.`,
  },
];
