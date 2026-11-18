import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import {
  australianTablespoonsToMl,
  formatVolume,
  metricTablespoonsToMl,
  mlToUsTablespoons,
  tablespoonsToMl,
  usTablespoonsToMl,
  ML_PER_AU_TBSP,
  ML_PER_METRIC_TBSP,
  ML_PER_US_TBSP,
  ML_PER_US_TSP,
} from './calculation';

export const TBSPML_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'intro', label: 'Tbsp to mL Converter' },
  { id: 'what-is-tablespoon', label: 'What Is a Tablespoon?' },
  { id: 'why-tablespoons', label: 'Why Tablespoons?' },
  { id: 'what-is-milliliter', label: 'What Is a Milliliter?' },
  { id: 'conversion', label: 'What Is the Conversion Between Tablespoons and Milliliters?' },
  { id: 'how-to-convert', label: 'How to Convert Tablespoons to Milliliters' },
  { id: 'reference-table', label: 'Quick Reference — US tbsp to mL' },
  { id: 'teaspoons', label: 'What About Teaspoons?' },
  { id: 'related-tools', label: 'Other Useful Volume Converters' },
  { id: 'tbspml-faq', label: 'Frequently Asked Questions' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  tableHeaders?: readonly string[];
  table?: readonly string[][];
}

const US_TBSP_CHART = [0.5, 1, 2, 3, 4, 5, 10, 15, 20] as const;

export const TBSPML_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'intro',
    title: 'Tbsp to mL Converter',
    paragraphs: [
      'Convert tablespoons to milliliters for cooking, baking, recipe scaling, and everyday liquid measures. Tablespoons measure volume, but the exact milliliter size depends on whether a recipe uses US customary, metric, or Australian tablespoons. This converter supports all three standards and works in both directions.',
    ],
  },
  {
    id: 'what-is-tablespoon',
    title: 'What Is a Tablespoon?',
    paragraphs: [
      'A tablespoon is a volume unit widely used in cooking and recipes. The common abbreviation is tbsp.',
      `A US customary tablespoon is exactly ${ML_PER_US_TBSP} mL (about ${formatVolume(Number(ML_PER_US_TBSP.toFixed(2)))} mL when rounded for kitchen use).`,
      `A metric tablespoon is ${ML_PER_METRIC_TBSP} mL. An Australian tablespoon is ${ML_PER_AU_TBSP} mL.`,
      'Because these standards differ, recipes from different regions can disagree if the tablespoon system is not identified.',
    ],
  },
  {
    id: 'why-tablespoons',
    title: 'Why Tablespoons?',
    paragraphs: [
      'Tablespoons are convenient for measuring oils, syrups, sauces, medicines labeled by spoon volume, and many kitchen liquids.',
      'They also appear in recipe scaling and international recipe adaptations. When precision matters, match the tablespoon standard the author intended rather than treating every tablespoon as 15 mL.',
    ],
  },
  {
    id: 'what-is-milliliter',
    title: 'What Is a Milliliter?',
    paragraphs: [
      'A milliliter (mL) is a metric volume unit equal to one-thousandth of a liter. One liter equals 1000 mL.',
      'Milliliters give a standardized scale that is easy to compare across cooking, nutrition, and laboratory-style household measuring.',
    ],
  },
  {
    id: 'conversion',
    title: 'What Is the Conversion Between Tablespoons and Milliliters?',
    paragraphs: [
      `US customary: mL = tbsp × ${ML_PER_US_TBSP}.`,
      `Metric: mL = tbsp × ${ML_PER_METRIC_TBSP}.`,
      `Australian: mL = tbsp × ${ML_PER_AU_TBSP}.`,
      `Example — 3 US tablespoons: 3 × ${ML_PER_US_TBSP} ≈ ${formatVolume(usTablespoonsToMl(3))} mL.`,
      `The reverse formula is tbsp = mL ÷ (mL per tablespoon). For example, 100 mL ≈ ${formatVolume(mlToUsTablespoons(100))} US tablespoons.`,
    ],
    formula: `US: mL = tbsp × ${ML_PER_US_TBSP}\nMetric: mL = tbsp × ${ML_PER_METRIC_TBSP}\nAustralian: mL = tbsp × ${ML_PER_AU_TBSP}\n3 US tbsp ≈ ${formatVolume(usTablespoonsToMl(3))} mL`,
  },
  {
    id: 'how-to-convert',
    title: 'How to Convert Tablespoons to Milliliters',
    paragraphs: [
      '1. Select the tablespoon standard that matches your recipe (US, metric, or Australian).',
      '2. Enter the number of tablespoons.',
      '3. Read the equivalent milliliters instantly.',
      '4. To reverse the calculation, enter milliliters instead.',
      '5. Expand More relevant units to view teaspoons, fluid ounces, cups, pints, or liters for the same volume.',
    ],
  },
  {
    id: 'reference-table',
    title: 'Quick Reference — US tbsp to mL',
    paragraphs: [
      'This table uses the exact US customary tablespoon factor from the conversion engine. Rounded display values are for reading convenience only.',
    ],
    tableHeaders: ['US Tablespoons', 'Milliliters (approx.)'],
    table: US_TBSP_CHART.map((tbsp) => [
      formatVolume(tbsp),
      formatVolume(Number(usTablespoonsToMl(tbsp).toFixed(2))),
    ]),
  },
  {
    id: 'teaspoons',
    title: 'What About Teaspoons?',
    paragraphs: [
      `In US customary cooking measures, 1 tablespoon equals 3 teaspoons, and 1 US teaspoon is ${ML_PER_US_TSP} mL.`,
      'Metric teaspoons are typically 5 mL. Do not assume every international tablespoon contains exactly three teaspoons of the local teaspoon definition.',
    ],
    formula: `1 US tbsp = 3 US tsp\n1 US tsp = ${ML_PER_US_TSP} mL\n1 metric tsp = 5 mL`,
  },
  {
    id: 'related-tools',
    title: 'Other Useful Volume Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Volume Conversion, mL to tbsp Converter, mL to Cups Converter, mL to tsp Converter, mL to oz Converter, Liters to Centiliters Converter, Cups to Gallons Converter, Gallons to Cups Converter, and Grams in mL Converter. Only active catalog tools appear as live links on the tool page.',
    ],
  },
];

export const TBSPML_FAQS: readonly FAQItem[] = [
  {
    question: 'What Are tbsp and tsp?',
    answer:
      'tbsp means tablespoon and tsp means teaspoon. Both are common cooking volume units. In US customary measures, one tablespoon contains three teaspoons.',
  },
  {
    question: 'Is a Tablespoon Always the Same?',
    answer: `No. A US customary tablespoon is ${ML_PER_US_TBSP} mL, a metric tablespoon is ${ML_PER_METRIC_TBSP} mL, and an Australian tablespoon is ${ML_PER_AU_TBSP} mL. Check which standard a recipe uses.`,
  },
  {
    question: 'How Do I Convert Tablespoons to Milliliters?',
    answer: `Multiply tablespoons by the factor for the selected standard. For US tablespoons: mL = tbsp × ${ML_PER_US_TBSP}. Example: 2 US tbsp ≈ ${formatVolume(usTablespoonsToMl(2))} mL.`,
  },
  {
    question: 'How Many Milliliters Are in 2 Tablespoons?',
    answer: `It depends on the standard: 2 US tbsp ≈ ${formatVolume(usTablespoonsToMl(2))} mL; 2 metric tbsp = ${formatVolume(metricTablespoonsToMl(2))} mL; 2 Australian tbsp = ${formatVolume(australianTablespoonsToMl(2))} mL.`,
  },
  {
    question: 'How Many Tablespoons Are in 100 mL?',
    answer: `Using US customary tablespoons: 100 ÷ ${ML_PER_US_TBSP} ≈ ${formatVolume(mlToUsTablespoons(100))}. Therefore 100 mL ≈ ${formatVolume(mlToUsTablespoons(100))} US tablespoons.`,
  },
  {
    question: 'Is 1 Tablespoon Equal to 15 mL?',
    answer: `One metric tablespoon equals exactly 15 mL. One US customary tablespoon is ${ML_PER_US_TBSP} mL, so 15 mL is a convenient approximation for a US tablespoon but not its exact defined value.`,
  },
  {
    question: 'How Many Milliliters Are in 0.5 Tablespoon?',
    answer: `Half a US tablespoon is ${formatVolume(tablespoonsToMl(0.5, 'us'))} mL. Half a metric tablespoon is ${formatVolume(tablespoonsToMl(0.5, 'metric'))} mL.`,
  },
];
