import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { cupsToMl, formatVolume, mlToCups } from './calculation';
import { ML_PER_CUP } from './types';

export const ML_TO_CUPS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'ml-in-one-cup', label: 'How Many mL in One Cup?' },
  { id: 'ml-to-cups', label: 'How to Convert mL to Cups' },
  { id: 'cups-to-ml', label: 'How to Convert Cups to mL' },
  { id: 'how-to-use', label: 'How to Use the Converter' },
  { id: 'conversion-table', label: 'mL to Cups Conversion Table' },
  { id: 'cooking-fractions', label: 'Common Cooking Fractions' },
  { id: 'us-vs-metric', label: 'US vs Metric Cups' },
  { id: 'why-standards', label: 'Why Cup Standards Matter' },
  { id: 'ml-vs-grams', label: 'Is mL the Same as Grams?' },
  { id: 'applications', label: 'Practical Applications' },
  { id: 'ml-to-cups-faq', label: 'Frequently Asked Questions' },
];

export interface ConversionTableRow {
  ml: string;
  cups: string;
}

export interface FractionRow {
  fraction: string;
  ml: string;
}

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  formulaNote?: string;
  table?: readonly ConversionTableRow[];
  fractionTable?: readonly FractionRow[];
  tableNote?: string;
}

const TABLE_ML = [0, 50, 100, 150, 200, 236.5882365, 250, 473.176473, 500, 750, 1000] as const;

const FRACTIONS: readonly { label: string; cups: number }[] = [
  { label: '1/4 cup', cups: 0.25 },
  { label: '1/3 cup', cups: 1 / 3 },
  { label: '1/2 cup', cups: 0.5 },
  { label: '2/3 cup', cups: 2 / 3 },
  { label: '3/4 cup', cups: 0.75 },
];

export const ML_TO_CUPS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'This converter turns liquid volume between milliliters (mL) and cups for cooking, baking, and general kitchen measurements. Cup size is not universal—US customary, US legal, metric, and imperial cups each use a different milliliter definition.',
      'Select the cup standard that matches your recipe or measuring tools, then enter milliliters or cups. The other field updates instantly.',
    ],
  },
  {
    id: 'ml-in-one-cup',
    title: 'How Many Milliliters Are in One Cup?',
    paragraphs: [
      `US customary cup: exactly ${ML_PER_CUP.usCustomary} mL (8 × 29.5735295625 US fluid ounces). US legal cup: exactly ${ML_PER_CUP.usLegal} mL (nutrition-label convention). Metric cup: exactly ${ML_PER_CUP.metric} mL. Imperial cup: exactly ${ML_PER_CUP.imperial} mL (½ imperial pint).`,
      'Rounded cooking references often say “about 237 mL” for a US cup. That is a useful approximation, but this converter uses the exact US customary factor for calculations—not 237.',
    ],
  },
  {
    id: 'ml-to-cups',
    title: 'How to Convert mL to Cups',
    paragraphs: [
      'Divide milliliters by the milliliters in one cup of the selected standard. Example (US customary): 473.176473 ÷ 236.5882365 = 2 cups.',
    ],
    formula: 'Cups = Milliliters / Milliliters per cup',
  },
  {
    id: 'cups-to-ml',
    title: 'How to Convert Cups to mL',
    paragraphs: [
      'Multiply cups by the milliliters per cup. Example (US customary): 2.5 × 236.5882365 = 591.47059125 mL.',
    ],
    formula: 'Milliliters = Cups × Milliliters per cup',
  },
  {
    id: 'how-to-use',
    title: 'How to Use the mL to Cups Converter',
    paragraphs: [
      'Enter milliliters or cups (decimals or fractions such as 1/2). Choose the cup standard. Read the converted result. Use the fraction shortcuts for common cooking amounts. Open More conversion options for liters, US fluid ounces, tablespoons, and related units. Copy or reset when finished.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'mL to Cups Conversion Table',
    paragraphs: [
      'Common milliliter values converted with the US customary cup (236.5882365 mL). Values come from the same engine as the calculator.',
    ],
    table: TABLE_ML.map((ml) => ({
      ml: formatVolume(ml),
      cups: formatVolume(mlToCups(ml, 'usCustomary')),
    })),
    tableNote: 'Cup standard: US customary (exact 236.5882365 mL). Not a metric-cup table.',
  },
  {
    id: 'cooking-fractions',
    title: 'Common Cooking Fractions',
    paragraphs: [
      'Recipes often list quarter, third, half, two-thirds, and three-quarter cups. Milliliter equivalents below use the US customary cup.',
    ],
    fractionTable: FRACTIONS.map((row) => ({
      fraction: row.label,
      ml: formatVolume(cupsToMl(row.cups, 'usCustomary')),
    })),
    tableNote: 'US customary cup. Metric cups use 250 mL per full cup instead.',
  },
  {
    id: 'us-vs-metric',
    title: 'Difference Between US and Metric Cups',
    paragraphs: [
      `One metric cup is exactly ${ML_PER_CUP.metric} mL. One US customary cup is ${ML_PER_CUP.usCustomary} mL—about 5.4% smaller. Using the wrong standard changes every ingredient volume in a recipe.`,
    ],
  },
  {
    id: 'why-standards',
    title: 'Why Cup Standards Matter',
    paragraphs: [
      'A recipe written for metric cups will under-measure liquids if you treat those cups as US customary. Baking ratios are especially sensitive. Always match the standard intended by the recipe author or the measuring cup markings you own.',
    ],
  },
  {
    id: 'ml-vs-grams',
    title: 'Is mL the Same as Grams?',
    paragraphs: [
      'No. Milliliters measure volume; grams measure mass. Equal milliliters of water and oil do not weigh the same. Converting mL to grams requires the ingredient’s density—this converter does not assume 1 mL = 1 g for every food.',
    ],
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    paragraphs: [
      'Use the converter for cooking and baking recipe conversion, beverage measures, kitchen tool comparisons, adapting international recipes, and learning volume units. It is a unit converter, not a nutrition or dosing tool.',
    ],
  },
];

export const ML_TO_CUPS_FAQS: readonly FAQItem[] = [
  {
    question: 'How many mL are in one cup?',
    answer:
      'One US customary cup is exactly 236.5882365 mL. US legal, metric, and imperial cups use different volumes.',
  },
  {
    question: 'How do I convert mL to cups?',
    answer:
      'Divide the milliliter value by the milliliters in the selected cup standard.',
  },
  {
    question: 'How do I convert cups to mL?',
    answer: 'Multiply the cup value by the selected cup’s milliliter equivalent.',
  },
  {
    question: 'Is one cup equal to 237 mL?',
    answer:
      'Approximately, for a US customary cup. The exact US customary definition is 236.5882365 mL.',
  },
  {
    question: 'How many cups is 200 mL?',
    answer: `Using US customary cups: 200 / 236.5882365 ≈ ${formatVolume(mlToCups(200, 'usCustomary'))} cups.`,
  },
  {
    question: 'How many cups is 250 mL?',
    answer:
      'US customary ≈ 1.05669 cups. Metric cups: 250 / 250 = 1 cup.',
  },
  {
    question: 'How many cups is 500 mL?',
    answer: `Using US customary cups: ≈ ${formatVolume(mlToCups(500, 'usCustomary'))} cups. Metric: exactly 2 cups.`,
  },
  {
    question: 'How many mL are in half a cup?',
    answer: `For US customary cups: 0.5 × 236.5882365 = ${formatVolume(cupsToMl(0.5, 'usCustomary'))} mL.`,
  },
  {
    question: 'How many mL are in 2/3 cup?',
    answer: `For US customary cups: (2/3) × 236.5882365 ≈ ${formatVolume(cupsToMl(2 / 3, 'usCustomary'))} mL.`,
  },
  {
    question: 'How many cups are in one liter?',
    answer: `Using US customary cups: 1000 / 236.5882365 ≈ ${formatVolume(mlToCups(1000, 'usCustomary'))} cups.`,
  },
  {
    question: 'Are US cups and metric cups the same?',
    answer: 'No. They have different defined volumes (≈236.588 mL vs 250 mL).',
  },
  {
    question: 'Which cup should I use for a recipe?',
    answer:
      'Use the standard intended by the recipe or by your measuring instructions.',
  },
  {
    question: 'Can I convert dry ingredients from mL to grams?',
    answer:
      'Only if the ingredient density (or an ingredient-specific mass-to-volume factor) is known.',
  },
  {
    question: 'Can I enter decimal or fractional cups?',
    answer:
      'Yes. Decimals and common fractions such as 1/2 or 1 1/2 are supported.',
  },
];
