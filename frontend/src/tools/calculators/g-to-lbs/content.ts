import type { FAQItem } from '@/components/shared/FAQAccordion';
import type { TableOfContentsItem } from '@/tools/calculators/auto-loan/TableOfContents';
import { formatMass, gramsToPounds, poundsToGrams, GRAMS_PER_POUND } from './calculation';

export const G_TO_LBS_TOC_ITEMS: readonly TableOfContentsItem[] = [
  { id: 'how-to-convert', label: 'How to Convert g to lbs' },
  { id: 'how-to-use', label: 'How to Use the g to lbs Converter' },
  { id: 'conversion-table', label: 'Grams to Pounds Conversion Table' },
  { id: 'related-tools', label: 'Other Weight Converters' },
  { id: 'g-to-lbs-faq', label: 'FAQs' },
];

export interface GuideSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  formula?: string;
  table?: readonly { grams: string; pounds: string }[];
}

const TABLE_GRAMS = [1, 10, 50, 100, 124, 200, 250, 500, 1000, 2000, 5000] as const;

export const G_TO_LBS_TABLE: readonly { grams: string; pounds: string }[] = TABLE_GRAMS.map(
  (g) => ({
    grams: String(g),
    pounds: formatMass(Number(gramsToPounds(g).toFixed(8))),
  }),
);

const g500 = gramsToPounds(500);
const g200 = gramsToPounds(200);
const g124 = gramsToPounds(124);
const g1000 = gramsToPounds(1000);
const lb2 = poundsToGrams(2);

export const G_TO_LBS_GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: 'how-to-convert',
    title: 'How to Convert g to lbs',
    paragraphs: [
      `One international avoirdupois pound equals exactly ${GRAMS_PER_POUND} grams. Grams belong to the metric system; pounds are used in US customary and imperial mass measurements.`,
      'To convert grams to pounds, divide the mass in grams by 453.59237. To convert pounds to grams, multiply by 453.59237.',
      `Example: convert 500 grams to pounds. 500 ÷ ${GRAMS_PER_POUND} ≈ ${formatMass(Number(g500.toFixed(5)))} lb.`,
    ],
    formula: `lb = g ÷ ${GRAMS_PER_POUND}\ng = lb × ${GRAMS_PER_POUND}`,
  },
  {
    id: 'how-to-use',
    title: 'How to Use the g to lbs Converter',
    paragraphs: [
      '1. Enter a mass in grams.',
      '2. The equivalent mass in pounds appears immediately.',
      '3. Or enter a value in pounds. grams update automatically.',
      '4. Use Reload calculator or Clear all changes to reset both fields.',
      'Both fields measure mass. Density is not required for this conversion.',
    ],
  },
  {
    id: 'conversion-table',
    title: 'Grams to Pounds Conversion Table',
    paragraphs: [
      `Values below use the exact constant 1 lb = ${GRAMS_PER_POUND} g and are rounded for display.`,
    ],
    table: G_TO_LBS_TABLE,
  },
  {
    id: 'related-tools',
    title: 'Other Weight Converters',
    paragraphs: [
      'Related Omega Calculators pages may include Weight Converter, Lbs to Stone Converter, Fluid Ounces to Pounds Conversion, Cubic Feet to Pounds Calculator, and other mass or density tools. Only catalog tools that are active appear as live site links.',
    ],
  },
];

export const G_TO_LBS_FAQS: readonly FAQItem[] = [
  {
    question: 'What Is 200 g Converted to lbs?',
    answer: `200 grams is approximately ${formatMass(Number(g200.toFixed(6)))} pounds. Formula: 200 ÷ ${GRAMS_PER_POUND} ≈ ${formatMass(Number(g200.toFixed(6)))}.`,
  },
  {
    question: 'What Is 124 g Converted to lbs?',
    answer: `124 grams is approximately ${formatMass(Number(g124.toFixed(6)))} pounds. Formula: 124 ÷ ${GRAMS_PER_POUND} ≈ ${formatMass(Number(g124.toFixed(6)))}.`,
  },
  {
    question: 'How Many Grams Are in 1 Pound?',
    answer: `Exactly ${GRAMS_PER_POUND} grams.`,
  },
  {
    question: 'How Many Pounds Are in 1000 Grams?',
    answer: `1000 grams equals approximately ${formatMass(Number(g1000.toFixed(5)))} pounds.`,
  },
  {
    question: 'Is 500 Grams Equal to 1 Pound?',
    answer: `No. 500 grams equals approximately ${formatMass(Number(g500.toFixed(5)))} pounds. One pound equals ${GRAMS_PER_POUND} grams.`,
  },
  {
    question: 'How Do I Convert Pounds Back to Grams?',
    answer: `Multiply the weight in pounds by ${GRAMS_PER_POUND}. For example, 2 × ${GRAMS_PER_POUND} = ${formatMass(lb2)} g.`,
  },
];
